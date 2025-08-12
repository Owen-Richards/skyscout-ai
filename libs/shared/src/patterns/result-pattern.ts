/**
 * Result Pattern Implementation
 * Provides a consistent way to handle operations that might fail
 */

export class Result<T, E = Error> {
  private constructor(
    private readonly value?: T,
    private readonly error?: E,
    private readonly isSuccess: boolean = false
  ) {}

  static success<T>(value: T): Result<T> {
    return new Result(value, undefined, true);
  }

  static failure<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(undefined, error, false);
  }

  isOk(): boolean {
    return this.isSuccess;
  }

  isError(): boolean {
    return !this.isSuccess;
  }

  getValue(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this.value!;
  }

  getError(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this.error!;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isSuccess) {
      return Result.success(fn(this.value!)) as Result<U, E>;
    }
    return Result.failure(this.error!);
  }

  flatMap<U>(fn: (value: T) => Result<U, E>): Result<U, E> {
    if (this.isSuccess) {
      return fn(this.value!);
    }
    return Result.failure(this.error!);
  }
}
