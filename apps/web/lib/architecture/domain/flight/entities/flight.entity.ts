/**
 * Flight Domain Entity
 * Core business entity following DDD principles
 */

import { Entity } from '../../../shared/domain/entity.base';
import { Airport, FlightId, Price } from '../value-objects';

export interface FlightProps extends Record<string, unknown> {
  readonly id: FlightId;
  readonly origin: Airport;
  readonly destination: Airport;
  readonly departureTime: Date;
  readonly arrivalTime: Date;
  readonly price: Price;
  readonly airline: string;
  readonly flightNumber: string;
  readonly aircraft?: string;
  readonly stops: number;
  readonly duration: number; // minutes
}

export class Flight extends Entity<FlightProps> {
  private constructor(props: FlightProps) {
    super(props);
  }

  public static create(props: Omit<FlightProps, 'id'>): Flight {
    const flightId = FlightId.generate();
    return new Flight({ ...props, id: flightId } as FlightProps);
  }

  public static reconstitute(props: FlightProps): Flight {
    return new Flight(props);
  }

  // Business logic methods
  public getDuration(): number {
    return this._props.duration;
  }

  public getRoute(): string {
    return `${this._props.origin.getCode()}-${this._props.destination.getCode()}`;
  }

  public isDirectFlight(): boolean {
    return this._props.stops === 0;
  }

  public isPriceCompetitive(averagePrice: Price): boolean {
    return this._props.price.isLessThan(averagePrice);
  }

  public calculatePricePerHour(): Price {
    const durationHours = this._props.duration / 60;
    return this._props.price.divide(durationHours);
  }

  // Getters
  public get id(): FlightId {
    return this._props.id;
  }
  public get origin(): Airport {
    return this._props.origin;
  }
  public get destination(): Airport {
    return this._props.destination;
  }
  public get price(): Price {
    return this._props.price;
  }
  public get departureTime(): Date {
    return this._props.departureTime;
  }
  public get arrivalTime(): Date {
    return this._props.arrivalTime;
  }
  public get airline(): string {
    return this._props.airline;
  }
  public get flightNumber(): string {
    return this._props.flightNumber;
  }
  public get stops(): number {
    return this._props.stops;
  }
}
