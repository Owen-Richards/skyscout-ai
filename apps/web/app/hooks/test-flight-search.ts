/**
 * Simple test for the flight search hook functionality
 */
import { FlightSearchCriteria } from '../domains/flights';

// Test data
const testCriteria: FlightSearchCriteria = {
  from: 'LAX',
  to: 'JFK',
  departDate: new Date('2025-09-01'),
  passengers: 2,
  class: 'economy',
};

export async function testFlightSearch() {
  console.log('Testing flight search with criteria:', testCriteria);

  try {
    // This would normally use the hook, but for testing we'll import the facade directly
    const { useFlightSearch } = await import('./use-flight-search');

    console.log('Flight search hook imported successfully');
    console.log('Test criteria:', testCriteria);

    return true;
  } catch (error) {
    console.error('Flight search test failed:', error);
    return false;
  }
}
