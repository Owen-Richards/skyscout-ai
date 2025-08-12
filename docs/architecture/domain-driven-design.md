# Domain-Driven Design Architecture

## Current vs Recommended Backend Structure

### Current Structure

```
apps/api/src/
├── routers/
├── services/
├── db/
└── utils/
```

### Recommended DDD Structure

```
apps/api/src/
├── domains/
│   ├── flight-search/
│   │   ├── entities/
│   │   │   ├── flight.entity.ts
│   │   │   ├── airline.entity.ts
│   │   │   └── airport.entity.ts
│   │   ├── repositories/
│   │   │   ├── flight.repository.ts
│   │   │   └── interfaces/
│   │   ├── services/
│   │   │   ├── flight-search.service.ts
│   │   │   └── price-predictor.service.ts
│   │   ├── controllers/
│   │   │   └── flight-search.controller.ts
│   │   ├── dtos/
│   │   │   ├── search-query.dto.ts
│   │   │   └── flight-result.dto.ts
│   │   └── events/
│   │       └── flight-searched.event.ts
│   ├── user-management/
│   ├── trip-planning/
│   └── notifications/
├── shared/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── cache/
│   │   ├── events/
│   │   └── external-apis/
│   ├── patterns/
│   │   ├── repository.pattern.ts
│   │   ├── service.pattern.ts
│   │   └── event-handler.pattern.ts
│   └── types/
└── main.ts
```

## Benefits

1. **Clear Boundaries**: Each domain is self-contained
2. **Business Logic Focus**: Domain services contain business rules
3. **Testability**: Easy to unit test domain logic
4. **Team Organization**: Teams can own entire domains
5. **Scalability**: Domains can be extracted to microservices

## Implementation Example

```typescript
// domains/flight-search/entities/flight.entity.ts
export class Flight {
  constructor(
    public readonly id: string,
    public readonly origin: Airport,
    public readonly destination: Airport,
    public readonly departureTime: Date,
    public readonly arrivalTime: Date,
    public readonly airline: Airline,
    public readonly price: Money,
    public readonly availableSeats: number
  ) {}

  getDuration(): Duration {
    return this.arrivalTime.getTime() - this.departureTime.getTime();
  }

  isBookable(): boolean {
    return this.availableSeats > 0 && this.departureTime > new Date();
  }

  calculatePriceWithTaxes(taxRate: number): Money {
    return this.price.multiply(1 + taxRate);
  }
}

// domains/flight-search/services/flight-search.service.ts
export class FlightSearchService {
  constructor(
    private flightRepository: IFlightRepository,
    private pricePredictor: IPricePredictorService,
    private eventBus: IEventBus
  ) {}

  async searchFlights(query: FlightSearchQuery): Promise<FlightSearchResult> {
    // Business logic here
    const flights = await this.flightRepository.findByQuery(query);

    // Apply business rules
    const filteredFlights = flights.filter(flight => flight.isBookable());

    // Enhance with price predictions
    const enhancedFlights = await Promise.all(
      filteredFlights.map(async flight => ({
        ...flight,
        pricePredict: await this.pricePredictor.predictPrice(flight),
      }))
    );

    // Emit domain event
    await this.eventBus.publish(
      new FlightSearchedEvent(query, enhancedFlights)
    );

    return new FlightSearchResult(enhancedFlights, query);
  }
}
```
