/**
 * CQRS (Command Query Responsibility Segregation) Patterns
 * Enterprise-level command and query handling for SkyScout AI
 */

import { Result } from './result-pattern';

// Base Command and Query Types
export abstract class Command {
  public readonly commandId: string = crypto.randomUUID();
  public readonly timestamp: Date = new Date();
  public readonly userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
  }
}

export abstract class Query<TResult> {
  public readonly queryId: string = crypto.randomUUID();
  public readonly timestamp: Date = new Date();
  public readonly userId?: string;

  constructor(userId?: string) {
    this.userId = userId;
  }
}

// Command Handler Interfaces
export interface ICommandHandler<TCommand extends Command> {
  handle(command: TCommand): Promise<Result<void, Error>>;
}

export interface IQueryHandler<TQuery extends Query<TResult>, TResult> {
  handle(query: TQuery): Promise<Result<TResult, Error>>;
}

// Flight Search Commands
export class SearchFlightsCommand extends Command {
  constructor(
    public readonly origin: string,
    public readonly destination: string,
    public readonly departureDate: Date,
    public readonly returnDate: Date | null = null,
    public readonly passengers: number = 1,
    public readonly flightClass: string = 'economy',
    userId?: string
  ) {
    super(userId);
  }
}

export class BookFlightCommand extends Command {
  constructor(
    public readonly flightId: string,
    public readonly passengerDetails: PassengerDetails[],
    public readonly paymentMethod: PaymentMethod,
    public readonly contactInfo: ContactInfo,
    userId?: string
  ) {
    super(userId);
  }
}

export class CancelBookingCommand extends Command {
  constructor(
    public readonly bookingId: string,
    public readonly reason: string,
    userId?: string
  ) {
    super(userId);
  }
}

export class CreatePriceAlertCommand extends Command {
  constructor(
    public readonly origin: string,
    public readonly destination: string,
    public readonly maxPrice: number,
    public readonly currency: string,
    public readonly departureDate: Date,
    userId?: string
  ) {
    super(userId);
  }
}

// Flight Search Queries
export class GetFlightResultsQuery extends Query<FlightSearchResult> {
  constructor(
    public readonly searchId: string,
    public readonly filters?: FlightFiltersDto,
    public readonly sortBy?: FlightSortOption,
    public readonly page: number = 1,
    public readonly limit: number = 20,
    userId?: string
  ) {
    super(userId);
  }
}

export class GetFlightDetailsQuery extends Query<FlightDetails> {
  constructor(
    public readonly flightId: string,
    userId?: string
  ) {
    super(userId);
  }
}

export class GetUserBookingsQuery extends Query<UserBooking[]> {
  constructor(
    public readonly status?: BookingStatus,
    public readonly fromDate?: Date,
    public readonly toDate?: Date,
    userId?: string
  ) {
    super(userId);
  }
}

export class GetFlightDealsQuery extends Query<FlightDeal[]> {
  constructor(
    public readonly destination?: string,
    public readonly maxPrice?: number,
    public readonly departureDate?: Date,
    public readonly limit: number = 10,
    userId?: string
  ) {
    super(userId);
  }
}

export class GetPriceHistoryQuery extends Query<PriceHistoryData> {
  constructor(
    public readonly origin: string,
    public readonly destination: string,
    public readonly period: HistoryPeriod = 'last_30_days',
    userId?: string
  ) {
    super(userId);
  }
}

// Command Bus Interface
export interface ICommandBus {
  send<TCommand extends Command>(
    command: TCommand
  ): Promise<Result<void, Error>>;
  register<TCommand extends Command>(
    commandType: new (...args: unknown[]) => TCommand,
    handler: ICommandHandler<TCommand>
  ): void;
}

// Query Bus Interface
export interface IQueryBus {
  send<TQuery extends Query<TResult>, TResult>(
    query: TQuery
  ): Promise<Result<TResult, Error>>;
  register<TQuery extends Query<TResult>, TResult>(
    queryType: new (...args: unknown[]) => TQuery,
    handler: IQueryHandler<TQuery, TResult>
  ): void;
}

// Command Bus Implementation
export class CommandBus implements ICommandBus {
  private handlers = new Map<string, ICommandHandler<Command>>();

  public register<TCommand extends Command>(
    commandType: new (...args: unknown[]) => TCommand,
    handler: ICommandHandler<TCommand>
  ): void {
    this.handlers.set(commandType.name, handler as ICommandHandler<Command>);
  }

  public async send<TCommand extends Command>(
    command: TCommand
  ): Promise<Result<void, Error>> {
    const handler = this.handlers.get(command.constructor.name);
    if (!handler) {
      const error = new Error(
        `No handler registered for command: ${command.constructor.name}`
      );
      return Result.failure(error);
    }

    try {
      return await handler.handle(command);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

// Query Bus Implementation
export class QueryBus implements IQueryBus {
  private handlers = new Map<string, IQueryHandler<Query<unknown>, unknown>>();

  public register<TQuery extends Query<TResult>, TResult>(
    queryType: new (...args: unknown[]) => TQuery,
    handler: IQueryHandler<TQuery, TResult>
  ): void {
    this.handlers.set(
      queryType.name,
      handler as IQueryHandler<Query<unknown>, unknown>
    );
  }

  public async send<TQuery extends Query<TResult>, TResult>(
    query: TQuery
  ): Promise<Result<TResult, Error>> {
    const handler = this.handlers.get(query.constructor.name);
    if (!handler) {
      const error = new Error(
        `No handler registered for query: ${query.constructor.name}`
      );
      return Result.failure(error);
    }

    try {
      const result = await handler.handle(query as Query<unknown>);
      return result as Result<TResult, Error>;
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

// Command Handler Implementations
export class SearchFlightsCommandHandler
  implements ICommandHandler<SearchFlightsCommand>
{
  constructor(
    private readonly flightSearchService: IFlightSearchService,
    private readonly eventBus: IEventBus
  ) {}

  async handle(command: SearchFlightsCommand): Promise<Result<void, Error>> {
    try {
      // Create search criteria from command
      const criteria = {
        origin: command.origin,
        destination: command.destination,
        departureDate: command.departureDate,
        returnDate: command.returnDate,
        passengers: command.passengers,
        flightClass: command.flightClass,
      };

      // Perform search
      const searchResult =
        await this.flightSearchService.searchFlights(criteria);

      if (searchResult.isError()) {
        return Result.failure(searchResult.getError());
      }

      // Publish domain event
      const event = new FlightSearchInitiatedEvent(
        command.commandId,
        criteria,
        searchResult.getValue().searchId,
        command.userId
      );

      await this.eventBus.publish(event);

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

export class BookFlightCommandHandler
  implements ICommandHandler<BookFlightCommand>
{
  constructor(
    private readonly bookingService: IBookingService,
    private readonly paymentService: IPaymentService,
    private readonly eventBus: IEventBus
  ) {}

  async handle(command: BookFlightCommand): Promise<Result<void, Error>> {
    try {
      // Validate flight availability
      const availability = await this.bookingService.checkAvailability(
        command.flightId
      );
      if (availability.isError() || !availability.getValue().isAvailable) {
        return Result.failure(new Error('Flight is not available for booking'));
      }

      // Process payment
      const paymentResult = await this.paymentService.processPayment(
        command.paymentMethod,
        availability.getValue().price
      );

      if (paymentResult.isError()) {
        return Result.failure(paymentResult.getError());
      }

      // Create booking
      const bookingResult = await this.bookingService.createBooking({
        flightId: command.flightId,
        passengers: command.passengerDetails,
        contactInfo: command.contactInfo,
        userId: command.userId,
        paymentId: paymentResult.getValue().paymentId,
      });

      if (bookingResult.isError()) {
        // Refund payment if booking fails
        await this.paymentService.refundPayment(
          paymentResult.getValue().paymentId
        );
        return Result.failure(bookingResult.getError());
      }

      // Publish success event
      const event = new FlightBookedEvent(
        command.commandId,
        command.flightId,
        bookingResult.getValue().bookingId,
        command.userId,
        paymentResult.getValue().amount
      );

      await this.eventBus.publish(event);

      return Result.success(undefined);
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

// Query Handler Implementations
export class GetFlightResultsQueryHandler
  implements IQueryHandler<GetFlightResultsQuery, FlightSearchResult>
{
  constructor(private readonly flightSearchService: IFlightSearchService) {}

  async handle(
    query: GetFlightResultsQuery
  ): Promise<Result<FlightSearchResult, Error>> {
    try {
      const result = await this.flightSearchService.getSearchResults(
        query.searchId,
        {
          filters: query.filters,
          sortBy: query.sortBy,
          page: query.page,
          limit: query.limit,
        }
      );

      return result;
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

export class GetUserBookingsQueryHandler
  implements IQueryHandler<GetUserBookingsQuery, UserBooking[]>
{
  constructor(private readonly bookingService: IBookingService) {}

  async handle(
    query: GetUserBookingsQuery
  ): Promise<Result<UserBooking[], Error>> {
    try {
      if (!query.userId) {
        return Result.failure(
          new Error('User ID is required for fetching bookings')
        );
      }

      const result = await this.bookingService.getUserBookings(query.userId, {
        status: query.status,
        fromDate: query.fromDate,
        toDate: query.toDate,
      });

      return result;
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}

// Supporting Types
export interface PassengerDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  passportNumber?: string;
  nationality: string;
}

export interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  token: string;
  billingAddress: Address;
}

export interface ContactInfo {
  email: string;
  phone: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface FlightSearchResult {
  searchId: string;
  flights: FlightDetails[];
  totalCount: number;
  page: number;
  hasMore: boolean;
  searchDurationMs: number;
}

export interface FlightDetails {
  id: string;
  flightNumber: string;
  airline: string;
  origin: AirportInfo;
  destination: AirportInfo;
  departureTime: Date;
  arrivalTime: Date;
  duration: string;
  price: PriceInfo;
  availableSeats: number;
  aircraft: string;
  stops: StopInfo[];
}

export interface AirportInfo {
  code: string;
  name: string;
  city: string;
  country: string;
  terminal?: string;
}

export interface PriceInfo {
  amount: number;
  currency: string;
  breakdown: PriceBreakdown;
}

export interface PriceBreakdown {
  baseFare: number;
  taxes: number;
  fees: number;
  total: number;
}

export interface StopInfo {
  airport: AirportInfo;
  duration: string;
}

export interface UserBooking {
  id: string;
  flightId: string;
  status: BookingStatus;
  passengers: PassengerDetails[];
  totalPrice: PriceInfo;
  bookingDate: Date;
  confirmationCode: string;
}

export interface FlightDeal {
  id: string;
  destination: string;
  price: PriceInfo;
  discount: number;
  validUntil: Date;
  description: string;
}

export interface PriceHistoryData {
  route: string;
  data: PriceDataPoint[];
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
}

export interface PriceDataPoint {
  date: Date;
  price: number;
}

export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';
export type FlightSortOption =
  | 'price'
  | 'duration'
  | 'departure_time'
  | 'arrival_time';
export type HistoryPeriod =
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_year';

export interface FlightFiltersDto {
  maxPrice?: number;
  minPrice?: number;
  maxDuration?: number;
  preferredAirlines?: string[];
  maxStops?: number;
  departureTimeRange?: TimeRange;
  arrivalTimeRange?: TimeRange;
}

export interface TimeRange {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

// Event Types for CQRS
export class FlightSearchInitiatedEvent {
  constructor(
    public readonly commandId: string,
    public readonly criteria: Record<string, unknown>,
    public readonly searchId: string,
    public readonly userId?: string
  ) {}
}

export class FlightBookedEvent {
  constructor(
    public readonly commandId: string,
    public readonly flightId: string,
    public readonly bookingId: string,
    public readonly userId?: string,
    public readonly amount?: number
  ) {}
}

// Service Interfaces
export interface IFlightSearchService {
  searchFlights(
    criteria: Record<string, unknown>
  ): Promise<Result<{ searchId: string }, Error>>;
  getSearchResults(
    searchId: string,
    options: Record<string, unknown>
  ): Promise<Result<FlightSearchResult, Error>>;
}

export interface IBookingService {
  checkAvailability(
    flightId: string
  ): Promise<Result<{ isAvailable: boolean; price: number }, Error>>;
  createBooking(
    bookingData: Record<string, unknown>
  ): Promise<Result<{ bookingId: string }, Error>>;
  getUserBookings(
    userId: string,
    options: Record<string, unknown>
  ): Promise<Result<UserBooking[], Error>>;
}

export interface IPaymentService {
  processPayment(
    paymentMethod: PaymentMethod,
    amount: number
  ): Promise<Result<{ paymentId: string; amount: number }, Error>>;
  refundPayment(paymentId: string): Promise<Result<void, Error>>;
}

export interface IEventBus {
  publish(event: unknown): Promise<void>;
}
