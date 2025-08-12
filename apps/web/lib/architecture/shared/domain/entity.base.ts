/**
 * Base Entity Class
 * Foundation for all domain entities following DDD patterns
 */

export abstract class Entity<T extends Record<string, unknown>> {
  protected readonly _props: T;

  constructor(props: T) {
    this._props = Object.freeze(props);
  }

  protected get props(): T {
    return this._props;
  }

  public equals(entity: Entity<T>): boolean {
    if (!entity || !(entity instanceof Entity)) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    // Compare by ID if both entities have one
    if (this._props.id && entity._props.id) {
      return this._props.id === entity._props.id;
    }

    return false;
  }
}

/**
 * Base Value Object Class
 * Foundation for all value objects
 */
export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = Object.freeze(value);
  }

  protected get value(): T {
    return this._value;
  }

  public equals(valueObject: ValueObject<T>): boolean {
    if (!valueObject || !(valueObject instanceof ValueObject)) {
      return false;
    }

    return JSON.stringify(this._value) === JSON.stringify(valueObject._value);
  }
}
