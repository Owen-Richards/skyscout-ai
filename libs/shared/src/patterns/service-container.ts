/**
 * Service Container Pattern with Dependency Injection
 * Provides clean separation between business logic and infrastructure
 */

// Service Container Implementation
type ServiceFactory<T> = () => T;
type ServiceInstance<T> = T;

export class ServiceContainer {
  private services = new Map<string, ServiceFactory<unknown>>();
  private singletons = new Map<string, ServiceInstance<unknown>>();

  register<T>(
    name: string,
    factory: ServiceFactory<T>,
    singleton = true
  ): void {
    this.services.set(name, factory);
    if (!singleton) {
      this.singletons.delete(name);
    }
  }

  get<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) {
      throw new Error(`Service ${name} not registered`);
    }

    // Return singleton if exists
    if (this.singletons.has(name)) {
      return this.singletons.get(name) as T;
    }

    // Create new instance
    const instance = factory() as T;
    this.singletons.set(name, instance);
    return instance;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }

  remove(name: string): void {
    this.services.delete(name);
    this.singletons.delete(name);
  }

  clear(): void {
    this.services.clear();
    this.singletons.clear();
  }

  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }
}

// Global container instance
export const container = new ServiceContainer();
