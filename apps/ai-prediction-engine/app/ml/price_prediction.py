import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os
from loguru import logger

class PricePredictionModel:
    """
    Flight price prediction model using ensemble methods
    """
    
    def __init__(self, model_cache_dir: str = "./models"):
        self.model_cache_dir = model_cache_dir
        self.models = {}
        self.scalers = {}
        self.encoders = {}
        self.feature_columns = []
        
        # Ensure model directory exists
        os.makedirs(model_cache_dir, exist_ok=True)
    
    def prepare_features(self, data: pd.DataFrame) -> pd.DataFrame:
        """Prepare features for training/prediction"""
        df = data.copy()
        
        # Time-based features
        df['departure_hour'] = pd.to_datetime(df['departure_date']).dt.hour
        df['departure_day_of_week'] = pd.to_datetime(df['departure_date']).dt.dayofweek
        df['departure_month'] = pd.to_datetime(df['departure_date']).dt.month
        df['days_until_departure'] = (
            pd.to_datetime(df['departure_date']) - datetime.now()
        ).dt.days
        
        # Route features
        df['route'] = df['origin'] + '_' + df['destination']
        
        # Seasonal features
        df['is_weekend'] = df['departure_day_of_week'].isin([5, 6]).astype(int)
        df['is_holiday_season'] = df['departure_month'].isin([6, 7, 12]).astype(int)
        
        # Advanced booking features
        df['booking_window'] = np.clip(df['days_until_departure'], 0, 365)
        df['is_last_minute'] = (df['booking_window'] <= 7).astype(int)
        df['is_early_booking'] = (df['booking_window'] >= 60).astype(int)
        
        return df
    
    def encode_categorical_features(self, df: pd.DataFrame, fit: bool = False) -> pd.DataFrame:
        """Encode categorical features"""
        categorical_cols = ['airline', 'origin', 'destination', 'cabin', 'route']
        
        for col in categorical_cols:
            if col in df.columns:
                if fit:
                    if col not in self.encoders:
                        self.encoders[col] = LabelEncoder()
                    df[f'{col}_encoded'] = self.encoders[col].fit_transform(df[col].astype(str))
                else:
                    if col in self.encoders:
                        # Handle unseen categories
                        df[f'{col}_encoded'] = df[col].astype(str).map(
                            dict(zip(self.encoders[col].classes_, self.encoders[col].transform(self.encoders[col].classes_)))
                        ).fillna(-1)
        
        return df
    
    def train(self, training_data: pd.DataFrame, target_column: str = 'price') -> Dict:
        """Train the price prediction model"""
        logger.info("Starting price prediction model training")
        
        # Prepare features
        df = self.prepare_features(training_data)
        df = self.encode_categorical_features(df, fit=True)
        
        # Select features
        feature_cols = [
            'duration', 'stops', 'days_until_departure', 'departure_hour',
            'departure_day_of_week', 'departure_month', 'booking_window',
            'is_weekend', 'is_holiday_season', 'is_last_minute', 'is_early_booking'
        ]
        
        # Add encoded categorical features
        encoded_cols = [col for col in df.columns if col.endswith('_encoded')]
        feature_cols.extend(encoded_cols)
        
        # Filter available columns
        feature_cols = [col for col in feature_cols if col in df.columns]
        self.feature_columns = feature_cols
        
        X = df[feature_cols]
        y = df[target_column]
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        self.scalers['price'] = StandardScaler()
        X_train_scaled = self.scalers['price'].fit_transform(X_train)
        X_test_scaled = self.scalers['price'].transform(X_test)
        
        # Train ensemble models
        models = {
            'random_forest': RandomForestRegressor(
                n_estimators=100, max_depth=10, random_state=42, n_jobs=-1
            ),
            'gradient_boosting': GradientBoostingRegressor(
                n_estimators=100, max_depth=6, random_state=42
            )
        }
        
        results = {}
        
        for name, model in models.items():
            logger.info(f"Training {name} model")
            model.fit(X_train_scaled, y_train)
            
            # Evaluate
            y_pred = model.predict(X_test_scaled)
            
            metrics = {
                'mae': mean_absolute_error(y_test, y_pred),
                'mse': mean_squared_error(y_test, y_pred),
                'rmse': np.sqrt(mean_squared_error(y_test, y_pred)),
                'r2': r2_score(y_test, y_pred)
            }
            
            results[name] = metrics
            self.models[name] = model
            
            logger.info(f"{name} - MAE: {metrics['mae']:.2f}, RMSE: {metrics['rmse']:.2f}, R²: {metrics['r2']:.3f}")
        
        # Save models
        self.save_models()
        
        return results
    
    def predict(self, flight_data: Dict) -> Dict:
        """Predict flight price"""
        if not self.models:
            raise ValueError("Models not trained or loaded")
        
        # Convert to DataFrame
        df = pd.DataFrame([flight_data])
        
        # Prepare features
        df = self.prepare_features(df)
        df = self.encode_categorical_features(df, fit=False)
        
        # Select features
        X = df[self.feature_columns]
        
        # Scale features
        X_scaled = self.scalers['price'].transform(X)
        
        # Get predictions from all models
        predictions = {}
        for name, model in self.models.items():
            pred = model.predict(X_scaled)[0]
            predictions[name] = max(0, pred)  # Ensure non-negative prices
        
        # Ensemble prediction (average)
        ensemble_pred = np.mean(list(predictions.values()))
        
        return {
            'predicted_price': ensemble_pred,
            'model_predictions': predictions,
            'confidence_interval': self._calculate_confidence_interval(predictions)
        }
    
    def _calculate_confidence_interval(self, predictions: Dict, confidence: float = 0.95) -> Dict:
        """Calculate confidence interval for predictions"""
        pred_values = list(predictions.values())
        mean_pred = np.mean(pred_values)
        std_pred = np.std(pred_values)
        
        z_score = 1.96  # 95% confidence
        margin = z_score * std_pred
        
        return {
            'lower': max(0, mean_pred - margin),
            'upper': mean_pred + margin,
            'confidence': confidence
        }
    
    def save_models(self):
        """Save trained models to disk"""
        model_path = os.path.join(self.model_cache_dir, 'price_prediction')
        os.makedirs(model_path, exist_ok=True)
        
        # Save models
        for name, model in self.models.items():
            joblib.dump(model, os.path.join(model_path, f'{name}.pkl'))
        
        # Save scalers and encoders
        joblib.dump(self.scalers, os.path.join(model_path, 'scalers.pkl'))
        joblib.dump(self.encoders, os.path.join(model_path, 'encoders.pkl'))
        joblib.dump(self.feature_columns, os.path.join(model_path, 'features.pkl'))
        
        logger.info(f"Models saved to {model_path}")
    
    def load_models(self):
        """Load trained models from disk"""
        model_path = os.path.join(self.model_cache_dir, 'price_prediction')
        
        if not os.path.exists(model_path):
            logger.warning("No saved models found")
            return False
        
        try:
            # Load models
            for model_file in os.listdir(model_path):
                if model_file.endswith('.pkl') and model_file != 'scalers.pkl' and model_file != 'encoders.pkl' and model_file != 'features.pkl':
                    name = model_file.replace('.pkl', '')
                    self.models[name] = joblib.load(os.path.join(model_path, model_file))
            
            # Load scalers and encoders
            self.scalers = joblib.load(os.path.join(model_path, 'scalers.pkl'))
            self.encoders = joblib.load(os.path.join(model_path, 'encoders.pkl'))
            self.feature_columns = joblib.load(os.path.join(model_path, 'features.pkl'))
            
            logger.info(f"Models loaded from {model_path}")
            return True
            
        except Exception as e:
            logger.error(f"Error loading models: {e}")
            return False
