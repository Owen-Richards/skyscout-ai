# API Gateway with GraphQL Federation

## Why GraphQL Federation?

Your current tRPC setup is excellent, but GraphQL Federation can provide additional benefits:

1. **Single API Endpoint**: Frontend only needs to know one URL
2. **Flexible Queries**: Clients request exactly what they need
3. **Real-time Subscriptions**: Built-in WebSocket support
4. **Schema Stitching**: Combine multiple services into one graph
5. **Better Caching**: Query-level caching with Redis

## Architecture

```
Frontend
    ↓
API Gateway (GraphQL)
    ↓
┌─────────────────┬─────────────────┬─────────────────┐
│  Flight Service │   User Service  │  Booking Service│
│     (tRPC)      │     (tRPC)      │     (tRPC)      │
└─────────────────┴─────────────────┴─────────────────┘
```

## Implementation

```typescript
// apps/api-gateway/src/schema.ts
import { buildFederatedSchema } from '@apollo/federation';

const typeDefs = gql`
  extend type Query {
    searchFlights(input: FlightSearchInput!): FlightSearchResult!
    getUser(id: ID!): User
  }

  extend type Mutation {
    bookFlight(input: BookFlightInput!): BookingResult!
  }

  extend type Subscription {
    priceAlerts(userId: ID!): PriceAlert!
  }

  type Flight @key(fields: "id") {
    id: ID!
    origin: Airport!
    destination: Airport!
    price: Money!
    # ... other fields
  }
`;

const resolvers = {
  Query: {
    searchFlights: async (_, { input }, { dataSources }) => {
      return dataSources.flightService.search(input);
    },
    getUser: async (_, { id }, { dataSources }) => {
      return dataSources.userService.getById(id);
    },
  },

  Mutation: {
    bookFlight: async (_, { input }, { dataSources, user }) => {
      // This can coordinate multiple services
      const flight = await dataSources.flightService.getById(input.flightId);
      const booking = await dataSources.bookingService.create({
        userId: user.id,
        flightId: input.flightId,
        passengers: input.passengers,
      });

      // Send confirmation email (event-driven)
      await dataSources.notificationService.sendBookingConfirmation(booking);

      return { booking, flight };
    },
  },

  Subscription: {
    priceAlerts: {
      subscribe: (_, { userId }, { pubsub }) => {
        return pubsub.asyncIterator(`PRICE_ALERT_${userId}`);
      },
    },
  },
};

export const schema = buildFederatedSchema([{ typeDefs, resolvers }]);
```

## Benefits Over Pure tRPC

1. **Query Optimization**: GraphQL automatically optimizes queries
2. **Real-time Updates**: Built-in subscription support
3. **API Exploration**: GraphQL Playground for development
4. **Caching**: Automatic query result caching
5. **Field-level Permissions**: Granular access control

## Hybrid Approach (Recommended)

Keep tRPC for:

- Internal service-to-service communication
- Type-safe APIs where GraphQL isn't needed
- Simple CRUD operations

Use GraphQL for:

- Complex frontend queries
- Real-time features
- Mobile apps
- Third-party API access

```typescript
// Hybrid resolver that uses tRPC internally
const resolvers = {
  Query: {
    searchFlights: async (_, { input }, { trpcClient }) => {
      // Use tRPC client internally for type safety
      return trpcClient.flights.search.query(input);
    },
  },
};
```
