/**
 * Infrastructure Service Interfaces
 * Clean architecture separation of concerns
 */

// HTTP Client Interface
export interface ApiClient {
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<ApiResponse<T>>;
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  params?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Cache Service Interface
export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  exists(key: string): Promise<boolean>;
}

// Analytics Service Interface
export interface AnalyticsService {
  track(event: string, properties?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  page(name: string, properties?: Record<string, unknown>): void;
  alias(userId: string, previousId?: string): void;
  flush(): Promise<void>;
}

// Logging Service Interface
export interface LoggingService {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, meta?: Record<string, unknown>): void;
}

// Configuration Service Interface
export interface ConfigService {
  get<T>(key: string): T;
  getOrThrow<T>(key: string): T;
  set(key: string, value: unknown): void;
  has(key: string): boolean;
}

// Event Bus Interface
export interface EventBus {
  publish<T>(event: T): Promise<void>;
  subscribe<T>(eventType: string, handler: (event: T) => Promise<void>): void;
  unsubscribe<T>(eventType: string, handler: (event: T) => Promise<void>): void;
}

// Notification Service Interface
export interface NotificationService {
  sendEmail(
    to: string,
    subject: string,
    template: string,
    data?: Record<string, unknown>
  ): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
  sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: Record<string, unknown>
  ): Promise<void>;
}

// File Storage Service Interface
export interface StorageService {
  upload(key: string, file: File | Buffer): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getSignedUrl(key: string, expiresIn?: number): Promise<string>;
  exists(key: string): Promise<boolean>;
}

// Service Health Check
export interface HealthCheck {
  name: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastChecked: Date;
  details?: Record<string, unknown>;
}

export interface HealthService {
  checkHealth(): Promise<HealthCheck[]>;
  getServiceHealth(serviceName: string): Promise<HealthCheck>;
  registerHealthCheck(name: string, check: () => Promise<HealthCheck>): void;
}
