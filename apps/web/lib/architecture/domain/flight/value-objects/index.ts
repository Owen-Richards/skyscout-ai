/**
 * Flight Value Objects
 * Immutable value objects for the flight domain
 */

import { ValueObject } from '../../../shared/domain/entity.base';

/**
 * Flight ID Value Object
 */
export class FlightId extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): FlightId {
    if (!value || value.trim().length === 0) {
      throw new Error('Flight ID cannot be empty');
    }
    return new FlightId(value);
  }

  public static generate(): FlightId {
    return new FlightId(
      `flight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    );
  }

  public getValue(): string {
    return this._value;
  }
}

/**
 * Price Value Object
 */
export class Price extends ValueObject<{ amount: number; currency: string }> {
  private constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a 3-letter code');
    }
    super({ amount, currency: currency.toUpperCase() });
  }

  public static create(amount: number, currency: string): Price {
    return new Price(amount, currency);
  }

  public getAmount(): number {
    return this._value.amount;
  }

  public getCurrency(): string {
    return this._value.currency;
  }

  public isLessThan(other: Price): boolean {
    if (this._value.currency !== other._value.currency) {
      throw new Error('Cannot compare prices with different currencies');
    }
    return this._value.amount < other._value.amount;
  }

  public divide(divisor: number): Price {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Price(this._value.amount / divisor, this._value.currency);
  }

  public formatCurrency(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this._value.currency,
    }).format(this._value.amount);
  }
}

/**
 * Airport Value Object
 */
export class Airport extends ValueObject<{
  code: string;
  name: string;
  city: string;
  country: string;
}> {
  private constructor(
    code: string,
    name: string,
    city: string,
    country: string
  ) {
    if (!code || code.length !== 3) {
      throw new Error('Airport code must be exactly 3 characters');
    }
    super({
      code: code.toUpperCase(),
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
    });
  }

  public static create(
    code: string,
    name: string,
    city: string,
    country: string
  ): Airport {
    return new Airport(code, name, city, country);
  }

  public getCode(): string {
    return this._value.code;
  }

  public getName(): string {
    return this._value.name;
  }

  public getCity(): string {
    return this._value.city;
  }

  public getCountry(): string {
    return this._value.country;
  }

  public getDisplayName(): string {
    return `${this._value.name} (${this._value.code})`;
  }
}
