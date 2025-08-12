#!/bin/bash

# SkyScout AI - Domain-Driven Architecture Migration Script
# This script creates the new domain-driven folder structure

echo "🏗️ Creating domain-driven architecture structure..."

# Create main domains directory
mkdir -p apps/web/app/domains

# Flight domain
mkdir -p apps/web/app/domains/flights/{components,hooks,services,types}
mkdir -p apps/web/app/domains/flights/components/{filters,search,results,deals}

# Hotels domain  
mkdir -p apps/web/app/domains/hotels/{components,hooks,services,types}
mkdir -p apps/web/app/domains/hotels/components/{search,deals,filters}

# Trips domain
mkdir -p apps/web/app/domains/trips/{components,hooks,services,types}
mkdir -p apps/web/app/domains/trips/components/{planning,budget,itinerary}

# Shared domain
mkdir -p apps/web/app/domains/shared/{components,hooks,services,types}

# Core application layer
mkdir -p apps/web/app/core/{providers,middleware,constants,config}

# Infrastructure layer
mkdir -p apps/web/app/infrastructure/{api,storage,monitoring,i18n}

# Enhanced libs structure
mkdir -p libs/domain/{flights,hotels,trips,shared}
mkdir -p libs/application/{flights,hotels,trips}
mkdir -p libs/infrastructure/{api,storage,monitoring}

echo "✅ Domain structure created successfully!"
echo "📁 Next steps:"
echo "  1. Move existing components to appropriate domains"
echo "  2. Extract business logic into domain services"
echo "  3. Create domain-specific types and hooks"
echo "  4. Implement clean architecture layers"
