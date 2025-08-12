/**
 * Domains Index
 *
 * Central export point for all domain modules following Domain-Driven Design principles.
 * Each domain encapsulates its own business logic and provides clean interfaces.
 */

// Flight Domain - Complete flight search, booking, and management
export * from './flight';

// Future domains will be added here as they're developed:
// export * from './accommodation';  // Hotel and accommodation booking
// export * from './trip';           // Trip planning and management
// export * from './user';           // User management and preferences
// export * from './payment';        // Payment processing and billing
// export * from './notification';   // Communication and alerts

// Domain Event Types (cross-cutting)
export interface DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  aggregateId: string;
  version: number;
  data: Record<string, unknown>;
}

// Common Domain Patterns
export abstract class Entity {
  constructor(public readonly id: string) {}

  equals(other: Entity): boolean {
    return this.id === other.id;
  }
}

export abstract class ValueObject {
  abstract equals(other: ValueObject): boolean;
}

export abstract class AggregateRoot extends Entity {
  private _events: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this._events.push(event);
  }

  public getEvents(): readonly DomainEvent[] {
    return this._events;
  }

  public clearEvents(): void {
    this._events = [];
  }
}
