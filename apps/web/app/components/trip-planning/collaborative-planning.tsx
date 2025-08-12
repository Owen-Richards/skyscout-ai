/**
 * Collaborative Trip Planning Component
 * Temporarily simplified for build testing
 */

'use client';

interface CollaborativePlanningProps {
  tripId?: string;
}

export default function CollaborativePlanning({
  tripId,
}: CollaborativePlanningProps) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Collaborative Planning</h2>
      <p className="text-muted-foreground">
        Trip ID: {tripId || 'Not specified'}
      </p>
      <p className="text-muted-foreground">Feature coming soon...</p>
    </div>
  );
}
