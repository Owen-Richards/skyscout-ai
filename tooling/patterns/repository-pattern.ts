/**
 * Repository Pattern Implementation
 * Provides data access abstraction and testability
 */

// Base repository interface
export interface IRepository<T, TKey = string> {
  findById(id: TKey): Promise<T | null>;
  findAll(filters?: Record<string, unknown>): Promise<T[]>;
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: TKey, entity: Partial<T>): Promise<T | null>;
  delete(id: TKey): Promise<boolean>;
}

// Specification pattern for complex queries
export interface ISpecification<T> {
  isSatisfiedBy(entity: T): boolean;
  and(spec: ISpecification<T>): ISpecification<T>;
  or(spec: ISpecification<T>): ISpecification<T>;
  not(): ISpecification<T>;
}

export abstract class Specification<T> implements ISpecification<T> {
  abstract isSatisfiedBy(entity: T): boolean;

  and(spec: ISpecification<T>): ISpecification<T> {
    return new AndSpecification(this, spec);
  }

  or(spec: ISpecification<T>): ISpecification<T> {
    return new OrSpecification(this, spec);
  }

  not(): ISpecification<T> {
    return new NotSpecification(this);
  }
}

class AndSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) && this.right.isSatisfiedBy(entity);
  }
}

class OrSpecification<T> extends Specification<T> {
  constructor(
    private left: ISpecification<T>,
    private right: ISpecification<T>
  ) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return this.left.isSatisfiedBy(entity) || this.right.isSatisfiedBy(entity);
  }
}

class NotSpecification<T> extends Specification<T> {
  constructor(private spec: ISpecification<T>) {
    super();
  }

  isSatisfiedBy(entity: T): boolean {
    return !this.spec.isSatisfiedBy(entity);
  }
}

// Flight domain entities
export interface Flight {
  id: string;
  airline: string;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  price: number;
  currency: string;
  stops: number;
  duration: number; // in minutes
  availableSeats: number;
  class: 'economy' | 'premium_economy' | 'business' | 'first';
  createdAt: Date;
  updatedAt: Date;
}

export interface FlightSearchCriteria {
  origin?: string;
  destination?: string;
  departureDate?: Date;
  returnDate?: Date;
  minPrice?: number;
  maxPrice?: number;
  airlines?: string[];
  maxStops?: number;
  class?: Flight['class'];
}

// Flight specifications
export class FlightPriceRangeSpec extends Specification<Flight> {
  constructor(
    private minPrice?: number,
    private maxPrice?: number
  ) {
    super();
  }

  isSatisfiedBy(flight: Flight): boolean {
    if (this.minPrice && flight.price < this.minPrice) return false;
    if (this.maxPrice && flight.price > this.maxPrice) return false;
    return true;
  }
}

export class FlightAirlineSpec extends Specification<Flight> {
  constructor(private airlines: string[]) {
    super();
  }

  isSatisfiedBy(flight: Flight): boolean {
    return this.airlines.includes(flight.airline);
  }
}

export class FlightRouteSpec extends Specification<Flight> {
  constructor(
    private origin: string,
    private destination: string
  ) {
    super();
  }

  isSatisfiedBy(flight: Flight): boolean {
    return (
      flight.origin === this.origin && flight.destination === this.destination
    );
  }
}

export class FlightStopsSpec extends Specification<Flight> {
  constructor(private maxStops: number) {
    super();
  }

  isSatisfiedBy(flight: Flight): boolean {
    return flight.stops <= this.maxStops;
  }
}

// Repository implementations
export interface IFlightRepository extends IRepository<Flight> {
  findByRoute(origin: string, destination: string): Promise<Flight[]>;
  findByPriceRange(min: number, max: number): Promise<Flight[]>;
  findBySpecification(spec: ISpecification<Flight>): Promise<Flight[]>;
  searchFlights(criteria: FlightSearchCriteria): Promise<Flight[]>;
}

// In-memory implementation for development/testing
export class InMemoryFlightRepository implements IFlightRepository {
  private flights: Flight[] = [];
  private nextId = 1;

  async findById(id: string): Promise<Flight | null> {
    return this.flights.find(f => f.id === id) || null;
  }

  async findAll(): Promise<Flight[]> {
    return [...this.flights];
  }

  async create(flightData: Omit<Flight, 'id'>): Promise<Flight> {
    const flight: Flight = {
      ...flightData,
      id: (this.nextId++).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.flights.push(flight);
    return flight;
  }

  async update(
    id: string,
    flightData: Partial<Flight>
  ): Promise<Flight | null> {
    const index = this.flights.findIndex(f => f.id === id);
    if (index === -1) return null;

    this.flights[index] = {
      ...this.flights[index],
      ...flightData,
      updatedAt: new Date(),
    };
    return this.flights[index];
  }

  async delete(id: string): Promise<boolean> {
    const index = this.flights.findIndex(f => f.id === id);
    if (index === -1) return false;

    this.flights.splice(index, 1);
    return true;
  }

  async findByRoute(origin: string, destination: string): Promise<Flight[]> {
    const spec = new FlightRouteSpec(origin, destination);
    return this.findBySpecification(spec);
  }

  async findByPriceRange(min: number, max: number): Promise<Flight[]> {
    const spec = new FlightPriceRangeSpec(min, max);
    return this.findBySpecification(spec);
  }

  async findBySpecification(spec: ISpecification<Flight>): Promise<Flight[]> {
    return this.flights.filter(flight => spec.isSatisfiedBy(flight));
  }

  async searchFlights(criteria: FlightSearchCriteria): Promise<Flight[]> {
    let spec: ISpecification<Flight> | null = null;

    // Build specification from criteria
    if (criteria.origin && criteria.destination) {
      spec = new FlightRouteSpec(criteria.origin, criteria.destination);
    }

    if (criteria.minPrice || criteria.maxPrice) {
      const priceSpec = new FlightPriceRangeSpec(
        criteria.minPrice,
        criteria.maxPrice
      );
      spec = spec ? spec.and(priceSpec) : priceSpec;
    }

    if (criteria.airlines && criteria.airlines.length > 0) {
      const airlineSpec = new FlightAirlineSpec(criteria.airlines);
      spec = spec ? spec.and(airlineSpec) : airlineSpec;
    }

    if (criteria.maxStops !== undefined) {
      const stopsSpec = new FlightStopsSpec(criteria.maxStops);
      spec = spec ? spec.and(stopsSpec) : stopsSpec;
    }

    return spec ? this.findBySpecification(spec) : this.findAll();
  }
}

// Database client interface
export interface IDatabaseClient {
  flight: {
    findUnique(params: { where: { id: string } }): Promise<Flight | null>;
    findMany(params?: { where?: Record<string, unknown> }): Promise<Flight[]>;
    create(params: { data: Omit<Flight, 'id'> }): Promise<Flight>;
    update(params: {
      where: { id: string };
      data: Partial<Flight>;
    }): Promise<Flight>;
    delete(params: { where: { id: string } }): Promise<Flight>;
  };
}

// Database implementation (example with Prisma)
export class DatabaseFlightRepository implements IFlightRepository {
  constructor(private db: IDatabaseClient) {}

  async findById(id: string): Promise<Flight | null> {
    return await this.db.flight.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Flight[]> {
    return await this.db.flight.findMany();
  }

  async create(flightData: Omit<Flight, 'id'>): Promise<Flight> {
    return await this.db.flight.create({
      data: flightData,
    });
  }

  async update(
    id: string,
    flightData: Partial<Flight>
  ): Promise<Flight | null> {
    try {
      return await this.db.flight.update({
        where: { id },
        data: { ...flightData, updatedAt: new Date() },
      });
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.db.flight.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  async findByRoute(origin: string, destination: string): Promise<Flight[]> {
    return await this.db.flight.findMany({
      where: {
        origin,
        destination,
      },
    });
  }

  async findByPriceRange(min: number, max: number): Promise<Flight[]> {
    return await this.db.flight.findMany({
      where: {
        price: {
          gte: min,
          lte: max,
        },
      },
    });
  }

  async findBySpecification(spec: ISpecification<Flight>): Promise<Flight[]> {
    // For database implementation, we'd need to convert specifications to SQL
    // This is a simplified example - in practice, you'd implement a query builder
    const allFlights = await this.findAll();
    return allFlights.filter(flight => spec.isSatisfiedBy(flight));
  }

  async searchFlights(criteria: FlightSearchCriteria): Promise<Flight[]> {
    const where: Record<string, unknown> = {};

    if (criteria.origin) where.origin = criteria.origin;
    if (criteria.destination) where.destination = criteria.destination;
    if (criteria.minPrice || criteria.maxPrice) {
      where.price = {};
      if (criteria.minPrice)
        (where.price as Record<string, unknown>).gte = criteria.minPrice;
      if (criteria.maxPrice)
        (where.price as Record<string, unknown>).lte = criteria.maxPrice;
    }
    if (criteria.airlines?.length) {
      where.airline = { in: criteria.airlines };
    }
    if (criteria.maxStops !== undefined) {
      where.stops = { lte: criteria.maxStops };
    }
    if (criteria.class) {
      where.class = criteria.class;
    }

    return await this.db.flight.findMany({ where });
  }
}

// Usage example
export class FlightSearchService {
  constructor(private flightRepository: IFlightRepository) {}

  async searchFlights(criteria: FlightSearchCriteria): Promise<Flight[]> {
    return await this.flightRepository.searchFlights(criteria);
  }

  async findCheapFlights(
    route: { origin: string; destination: string },
    maxPrice: number
  ): Promise<Flight[]> {
    const routeSpec = new FlightRouteSpec(route.origin, route.destination);
    const priceSpec = new FlightPriceRangeSpec(undefined, maxPrice);
    const combinedSpec = routeSpec.and(priceSpec);

    return await this.flightRepository.findBySpecification(combinedSpec);
  }

  async findDirectFlights(
    origin: string,
    destination: string
  ): Promise<Flight[]> {
    const routeSpec = new FlightRouteSpec(origin, destination);
    const directSpec = new FlightStopsSpec(0);
    const combinedSpec = routeSpec.and(directSpec);

    return await this.flightRepository.findBySpecification(combinedSpec);
  }
}
