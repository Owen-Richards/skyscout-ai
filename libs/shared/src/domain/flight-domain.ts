/**
 * Domain-Driven Design Core Patterns
 * Enterprise-level domain modeling for SkyScout AI
 */

// Base Domain Entity
export abstract class Entity<TId> {
  protected constructor(protected readonly _id: TId) {}

  public getId(): TId {
    return this._id;
  }

  public equals(other: Entity<TId>): boolean {
    return this._id === other._id;
  }
}

// Value Object Base Class
export abstract class ValueObject {
  protected abstract getEqualityComponents(): Array<unknown>;

  public equals(other: ValueObject): boolean {
    if (this.constructor !== other.constructor) {
      return false;
    }

    const thisComponents = this.getEqualityComponents();
    const otherComponents = other.getEqualityComponents();

    if (thisComponents.length !== otherComponents.length) {
      return false;
    }

    return thisComponents.every(
      (component, index) => component === otherComponents[index]
    );
  }
}

// Domain Event Base
export abstract class DomainEvent {
  public readonly occurredOn: Date = new Date();
  public readonly eventId: string = crypto.randomUUID();

  constructor(public readonly aggregateId: string) {}
}

// Flight Domain - Value Objects
export class Price extends ValueObject {
  private constructor(
    private readonly amount: number,
    private readonly currency: Currency
  ) {
    super();
    if (amount < 0) {
      throw new Error('Price cannot be negative');
    }
  }

  public static from(amount: number, currency: Currency): Price {
    return new Price(amount, currency);
  }

  public getAmount(): number {
    return this.amount;
  }

  public getCurrency(): Currency {
    return this.currency;
  }

  public add(other: Price): Price {
    if (!this.currency.equals(other.currency)) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Price {
    return new Price(this.amount * factor, this.currency);
  }

  public toDisplayString(): string {
    return this.currency.format(this.amount);
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.amount, this.currency];
  }
}

export class Currency extends ValueObject {
  private constructor(
    private readonly code: string,
    private readonly symbol: string,
    private readonly decimals: number
  ) {
    super();
    if (code.length !== 3) {
      throw new Error('Currency code must be 3 characters');
    }
  }

  public static USD = new Currency('USD', '$', 2);
  public static EUR = new Currency('EUR', '€', 2);
  public static GBP = new Currency('GBP', '£', 2);

  public static from(code: string): Currency {
    const currencies: Record<string, Currency> = {
      USD: Currency.USD,
      EUR: Currency.EUR,
      GBP: Currency.GBP,
    };

    const currency = currencies[code.toUpperCase()];
    if (!currency) {
      throw new Error(`Unsupported currency: ${code}`);
    }

    return currency;
  }

  public format(amount: number): string {
    return `${this.symbol}${amount.toFixed(this.decimals)}`;
  }

  public getCode(): string {
    return this.code;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.code];
  }
}

export class Airport extends ValueObject {
  private constructor(
    private readonly code: string,
    private readonly name: string,
    private readonly city: string,
    private readonly country: string
  ) {
    super();
    if (code.length !== 3) {
      throw new Error('Airport code must be 3 characters');
    }
  }

  public static from(
    code: string,
    name: string,
    city: string,
    country: string
  ): Airport {
    return new Airport(code.toUpperCase(), name, city, country);
  }

  public getCode(): string {
    return this.code;
  }

  public getName(): string {
    return this.name;
  }

  public getDisplayName(): string {
    return `${this.city} (${this.code})`;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.code];
  }
}

export class FlightDuration extends ValueObject {
  private constructor(private readonly minutes: number) {
    super();
    if (minutes < 0) {
      throw new Error('Flight duration cannot be negative');
    }
  }

  public static fromMinutes(minutes: number): FlightDuration {
    return new FlightDuration(minutes);
  }

  public static fromHours(hours: number): FlightDuration {
    return new FlightDuration(hours * 60);
  }

  public toMinutes(): number {
    return this.minutes;
  }

  public toHours(): number {
    return this.minutes / 60;
  }

  public toDisplayString(): string {
    const hours = Math.floor(this.minutes / 60);
    const mins = this.minutes % 60;
    return `${hours}h ${mins}m`;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.minutes];
  }
}

// Flight Domain - Entities
export class FlightId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
  }

  public static generate(): FlightId {
    return new FlightId(`flight_${crypto.randomUUID()}`);
  }

  public static from(value: string): FlightId {
    return new FlightId(value);
  }

  public getValue(): string {
    return this.value;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.value];
  }
}

export class Flight extends Entity<FlightId> {
  private constructor(
    id: FlightId,
    private readonly origin: Airport,
    private readonly destination: Airport,
    private readonly departureTime: Date,
    private readonly arrivalTime: Date,
    private readonly price: Price,
    private readonly airline: string,
    private readonly flightNumber: string,
    private availableSeats: number
  ) {
    super(id);
  }

  public static create(
    origin: Airport,
    destination: Airport,
    departureTime: Date,
    arrivalTime: Date,
    price: Price,
    airline: string,
    flightNumber: string,
    availableSeats: number
  ): Flight {
    if (departureTime >= arrivalTime) {
      throw new Error('Departure time must be before arrival time');
    }

    return new Flight(
      FlightId.generate(),
      origin,
      destination,
      departureTime,
      arrivalTime,
      price,
      airline,
      flightNumber,
      availableSeats
    );
  }

  public isAvailable(): boolean {
    return this.availableSeats > 0 && this.departureTime > new Date();
  }

  public getDuration(): FlightDuration {
    const durationMs =
      this.arrivalTime.getTime() - this.departureTime.getTime();
    return FlightDuration.fromMinutes(durationMs / (1000 * 60));
  }

  public reserveSeat(): void {
    if (!this.isAvailable()) {
      throw new Error('No seats available for this flight');
    }
    this.availableSeats--;
  }

  public getOrigin(): Airport {
    return this.origin;
  }

  public getDestination(): Airport {
    return this.destination;
  }

  public getPrice(): Price {
    return this.price;
  }

  public getDepartureTime(): Date {
    return this.departureTime;
  }

  public getArrivalTime(): Date {
    return this.arrivalTime;
  }

  public getAvailableSeats(): number {
    return this.availableSeats;
  }

  public getFlightNumber(): string {
    return this.flightNumber;
  }

  public getAirline(): string {
    return this.airline;
  }
}

// Search Domain - Aggregates
export class SearchCriteriaId extends ValueObject {
  private constructor(private readonly value: string) {
    super();
  }

  public static generate(): SearchCriteriaId {
    return new SearchCriteriaId(`search_${crypto.randomUUID()}`);
  }

  public getValue(): string {
    return this.value;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [this.value];
  }
}

export class SearchCriteria extends ValueObject {
  private constructor(
    private readonly origin: Airport,
    private readonly destination: Airport,
    private readonly departureDate: Date,
    private readonly returnDate: Date | null,
    private readonly passengers: number,
    private readonly flightClass: FlightClass
  ) {
    super();
    if (passengers < 1 || passengers > 9) {
      throw new Error('Passengers must be between 1 and 9');
    }
  }

  public static create(
    origin: Airport,
    destination: Airport,
    departureDate: Date,
    returnDate: Date | null = null,
    passengers: number = 1,
    flightClass: FlightClass = FlightClass.ECONOMY
  ): SearchCriteria {
    if (returnDate && returnDate <= departureDate) {
      throw new Error('Return date must be after departure date');
    }

    return new SearchCriteria(
      origin,
      destination,
      departureDate,
      returnDate,
      passengers,
      flightClass
    );
  }

  public isRoundTrip(): boolean {
    return this.returnDate !== null;
  }

  public getOrigin(): Airport {
    return this.origin;
  }

  public getDestination(): Airport {
    return this.destination;
  }

  public getDepartureDate(): Date {
    return this.departureDate;
  }

  public getReturnDate(): Date | null {
    return this.returnDate;
  }

  public getPassengers(): number {
    return this.passengers;
  }

  public getFlightClass(): FlightClass {
    return this.flightClass;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [
      this.origin,
      this.destination,
      this.departureDate,
      this.returnDate,
      this.passengers,
      this.flightClass,
    ];
  }
}

export enum FlightClass {
  ECONOMY = 'economy',
  PREMIUM_ECONOMY = 'premium_economy',
  BUSINESS = 'business',
  FIRST = 'first',
}

export class FlightSearchAggregate extends Entity<SearchCriteriaId> {
  private results: Flight[] = [];
  private filters: FlightFilters = FlightFilters.none();
  private searchPerformed: boolean = false;

  private constructor(
    id: SearchCriteriaId,
    private readonly criteria: SearchCriteria
  ) {
    super(id);
  }

  public static create(criteria: SearchCriteria): FlightSearchAggregate {
    return new FlightSearchAggregate(SearchCriteriaId.generate(), criteria);
  }

  public addResults(flights: Flight[]): void {
    this.results = flights;
    this.searchPerformed = true;
  }

  public applyFilters(filters: FlightFilters): FlightSearchAggregate {
    const newAggregate = new FlightSearchAggregate(this._id, this.criteria);
    newAggregate.results = this.results.filter(flight =>
      filters.matches(flight)
    );
    newAggregate.filters = filters;
    newAggregate.searchPerformed = this.searchPerformed;
    return newAggregate;
  }

  public getFilteredResults(): Flight[] {
    return this.results;
  }

  public getCriteria(): SearchCriteria {
    return this.criteria;
  }

  public getFilters(): FlightFilters {
    return this.filters;
  }

  public hasResults(): boolean {
    return this.searchPerformed && this.results.length > 0;
  }
}

// Flight Filters
export class FlightFilters extends ValueObject {
  private constructor(
    private readonly maxPrice: Price | null = null,
    private readonly minPrice: Price | null = null,
    private readonly maxDuration: FlightDuration | null = null,
    private readonly preferredAirlines: string[] = [],
    private readonly maxStops: number = 10
  ) {
    super();
  }

  public static none(): FlightFilters {
    return new FlightFilters();
  }

  public static create(options: {
    maxPrice?: Price;
    minPrice?: Price;
    maxDuration?: FlightDuration;
    preferredAirlines?: string[];
    maxStops?: number;
  }): FlightFilters {
    return new FlightFilters(
      options.maxPrice,
      options.minPrice,
      options.maxDuration,
      options.preferredAirlines || [],
      options.maxStops || 10
    );
  }

  public matches(flight: Flight): boolean {
    // Price filtering
    if (
      this.maxPrice &&
      flight.getPrice().getAmount() > this.maxPrice.getAmount()
    ) {
      return false;
    }

    if (
      this.minPrice &&
      flight.getPrice().getAmount() < this.minPrice.getAmount()
    ) {
      return false;
    }

    // Duration filtering
    if (
      this.maxDuration &&
      flight.getDuration().toMinutes() > this.maxDuration.toMinutes()
    ) {
      return false;
    }

    // Airline filtering
    if (
      this.preferredAirlines.length > 0 &&
      !this.preferredAirlines.includes(flight.getAirline())
    ) {
      return false;
    }

    return true;
  }

  protected getEqualityComponents(): Array<unknown> {
    return [
      this.maxPrice,
      this.minPrice,
      this.maxDuration,
      this.preferredAirlines,
      this.maxStops,
    ];
  }
}

// Domain Events
export class FlightSearchedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly criteria: SearchCriteria,
    public readonly resultCount: number,
    public readonly searchDurationMs: number
  ) {
    super(aggregateId);
  }
}

export class FlightFiltersAppliedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly filters: FlightFilters,
    public readonly filteredResultCount: number
  ) {
    super(aggregateId);
  }
}

export class FlightSelectedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly flightId: FlightId,
    public readonly selectionTime: Date = new Date()
  ) {
    super(aggregateId);
  }
}
