/**
 * Event-Driven Architecture Implementation
 * Improves scalability and decoupling between services
 */

// shared/infrastructure/events/event-bus.ts
export interface DomainEvent {
  readonly id: string;
  readonly occurredOn: Date;
  readonly type: string;
  readonly aggregateId: string;
  readonly version: number;
  readonly data: Record<string, unknown>;
}

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void>
  ): void;
}

export class EventBus implements IEventBus {
  private handlers = new Map<
    string,
    Array<(event: DomainEvent) => Promise<void>>
  >();

  async publish(event: DomainEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.type) || [];

    // Execute handlers in parallel
    await Promise.all(
      eventHandlers.map(handler =>
        handler(event).catch(error =>
          console.error(`Error handling event ${event.type}:`, error)
        )
      )
    );

    // Also publish to external message queue (Redis/Kafka)
    await this.publishToMessageQueue(event);
  }

  subscribe<T extends DomainEvent>(
    eventType: string,
    handler: (event: T) => Promise<void>
  ): void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)!.push(handler as any);
  }

  private async publishToMessageQueue(event: DomainEvent): Promise<void> {
    // Implementation for Redis Pub/Sub or Kafka
    // This enables cross-service communication
  }
}

// domains/flight-search/events/flight-searched.event.ts
export class FlightSearchedEvent implements DomainEvent {
  readonly id = crypto.randomUUID();
  readonly occurredOn = new Date();
  readonly type = 'FlightSearched';
  readonly version = 1;

  constructor(
    readonly aggregateId: string, // user ID or session ID
    readonly data: {
      query: FlightSearchQuery;
      results: FlightResult[];
      searchDuration: number;
    }
  ) {}
}

// Event handlers for different domains
export class FlightSearchEventHandlers {
  constructor(
    private analyticsService: AnalyticsService,
    private recommendationService: RecommendationService,
    private notificationService: NotificationService
  ) {}

  @EventHandler('FlightSearched')
  async handleFlightSearched(event: FlightSearchedEvent): Promise<void> {
    // Track analytics
    await this.analyticsService.track('flight_search', {
      userId: event.aggregateId,
      query: event.data.query,
      resultCount: event.data.results.length,
      searchDuration: event.data.searchDuration,
    });

    // Update user preferences for recommendations
    await this.recommendationService.updatePreferences(
      event.aggregateId,
      event.data.query
    );

    // Send notifications if prices dropped
    const goodDeals = event.data.results.filter(r => r.isPriceAlert);
    if (goodDeals.length > 0) {
      await this.notificationService.sendPriceAlert(
        event.aggregateId,
        goodDeals
      );
    }
  }
}

// Usage in service
export class FlightSearchService {
  constructor(
    private flightRepository: IFlightRepository,
    private eventBus: IEventBus
  ) {}

  async searchFlights(
    query: FlightSearchQuery,
    userId: string
  ): Promise<FlightResult[]> {
    const startTime = Date.now();

    const results = await this.flightRepository.findByQuery(query);

    const searchDuration = Date.now() - startTime;

    // Publish event - this triggers all the side effects
    await this.eventBus.publish(
      new FlightSearchedEvent(userId, {
        query,
        results,
        searchDuration,
      })
    );

    return results;
  }
}

// Event Store for Event Sourcing (optional but powerful)
export interface IEventStore {
  append(aggregateId: string, events: DomainEvent[]): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
}

export class EventStore implements IEventStore {
  constructor(private db: Database) {}

  async append(aggregateId: string, events: DomainEvent[]): Promise<void> {
    await this.db.transaction(async trx => {
      for (const event of events) {
        await trx('events').insert({
          id: event.id,
          aggregate_id: aggregateId,
          type: event.type,
          version: event.version,
          data: JSON.stringify(event.data),
          occurred_on: event.occurredOn,
        });
      }
    });
  }

  async getEvents(
    aggregateId: string,
    fromVersion = 0
  ): Promise<DomainEvent[]> {
    const rows = await this.db('events')
      .where('aggregate_id', aggregateId)
      .where('version', '>=', fromVersion)
      .orderBy('version');

    return rows.map(row => ({
      id: row.id,
      type: row.type,
      aggregateId: row.aggregate_id,
      version: row.version,
      data: JSON.parse(row.data),
      occurredOn: new Date(row.occurred_on),
    }));
  }
}
