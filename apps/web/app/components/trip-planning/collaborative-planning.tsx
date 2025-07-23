/**
 * Collaborative Planning Component
 * Real-time group trip planning with sharing and decision-making features
 * Live collaboration with voting, comments, and role management
 */

'use client';

import { Badge, Button, Card, cn } from '@skyscout/ui';
import {
  Activity,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  Eye,
  MessageCircle,
  Plus,
  Share2,
  Sparkles,
  Target,
  ThumbsDown,
  ThumbsUp,
  UserPlus,
  Users,
  UserX,
  Vote,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import type {
  TripActivity,
  TripCollaborator,
  TripComment,
  TripDecision,
} from '../../types/trip';

interface CollaborativePlanningProps {
  tripId: string;
  collaborators: TripCollaborator[];
  decisions: TripDecision[];
  activities: TripActivity[];
  comments: TripComment[];
  currentUserId: string;
  onInviteCollaborator: (
    email: string,
    role: 'owner' | 'editor' | 'viewer'
  ) => void;
  onUpdateCollaboratorRole: (
    collaboratorId: string,
    role: 'owner' | 'editor' | 'viewer'
  ) => void;
  onRemoveCollaborator: (collaboratorId: string) => void;
  onCreateDecision: (decision: Omit<TripDecision, 'id' | 'createdAt'>) => void;
  onVoteOnDecision: (decisionId: string, vote: 'yes' | 'no' | 'maybe') => void;
  onAddComment: (comment: Omit<TripComment, 'id' | 'createdAt'>) => void;
  className?: string;
}

export function CollaborativePlanning({
  _tripId,
  collaborators,
  decisions,
  activities,
  comments,
  currentUserId,
  _onInviteCollaborator,
  _onUpdateCollaboratorRole,
  _onRemoveCollaborator,
  _onCreateDecision,
  onVoteOnDecision,
  _onAddComment,
  className,
}: CollaborativePlanningProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'collaborators' | 'decisions' | 'activity'
  >('overview');

  const currentUser = collaborators.find(c => c.id === currentUserId);
  const isOwner = currentUser?.role === 'owner';
  const canEdit =
    currentUser?.role === 'owner' || currentUser?.role === 'editor';

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return Crown;
      case 'editor':
        return Edit;
      case 'viewer':
        return Eye;
      default:
        return Users;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400';
      case 'editor':
        return 'bg-blue-500/20 text-blue-600 dark:text-blue-400';
      case 'viewer':
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-600 dark:text-gray-400';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invitation':
        return UserPlus;
      case 'decision':
        return Vote;
      case 'comment':
        return MessageCircle;
      case 'edit':
        return Edit;
      case 'booking':
        return CheckCircle;
      default:
        return Activity;
    }
  };

  const pendingDecisions = decisions.filter(d => d.status === 'pending');
  const recentActivity = activities.slice(-10);
  const activeCollaborators = collaborators.filter(c => c.status === 'active');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            👥 Collaborative Planning
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time collaboration with group decision-making and live updates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
            <Sparkles className="w-3 h-3 mr-1" />
            Live Collaboration
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowShareModal(true)}
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share Trip
          </Button>

          {canEdit && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite
            </Button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Collaborators
              </p>
              <p className="text-2xl font-bold text-foreground">
                {activeCollaborators.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {
                  collaborators.filter(
                    c =>
                      c.lastActive &&
                      new Date(c.lastActive) >
                        new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length
                }{' '}
                active today
              </p>
            </div>
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending Decisions
              </p>
              <p className="text-2xl font-bold text-foreground">
                {pendingDecisions.length}
              </p>
              <p className="text-xs text-muted-foreground">
                Awaiting group vote
              </p>
            </div>
            <div className="bg-orange-500/20 p-2 rounded-lg">
              <Vote className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Comments
              </p>
              <p className="text-2xl font-bold text-foreground">
                {comments.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {
                  comments.filter(
                    c =>
                      new Date(c.createdAt) >
                      new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length
                }{' '}
                today
              </p>
            </div>
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Consensus
              </p>
              <p className="text-2xl font-bold text-foreground">
                {decisions.length > 0
                  ? Math.round(
                      (decisions.filter(d => d.status === 'approved').length /
                        decisions.length) *
                        100
                    )
                  : 0}
                %
              </p>
              <p className="text-xs text-muted-foreground">Agreement rate</p>
            </div>
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Decisions Alert */}
      {pendingDecisions.length > 0 && (
        <Card className="border-orange-500/20 bg-orange-500/5">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <Vote className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">
                  Pending Group Decisions
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {pendingDecisions.length} decision
                  {pendingDecisions.length > 1 ? 's' : ''} require
                  {pendingDecisions.length === 1 ? 's' : ''} your vote to
                  proceed with planning.
                </p>
                <div className="space-y-2">
                  {pendingDecisions.slice(0, 3).map(decision => (
                    <div
                      key={decision.id}
                      className="flex items-center justify-between bg-background/50 p-2 rounded"
                    >
                      <span className="text-sm text-foreground">
                        {decision.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          Yes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs"
                        >
                          <ThumbsDown className="w-3 h-3 mr-1" />
                          No
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingDecisions.length > 3 && (
                  <Button variant="ghost" size="sm" className="mt-2">
                    View {pendingDecisions.length - 3} more decisions
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'collaborators', label: 'Collaborators', icon: Users },
          { id: 'decisions', label: 'Decisions', icon: Vote },
          { id: 'activity', label: 'Activity', icon: Clock },
        ].map(tab => {
          const TabIcon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | 'overview'
                    | 'collaborators'
                    | 'decisions'
                    | 'activity'
                )
              }
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <TabIcon className="w-4 h-4" />
              {tab.label}
              {tab.id === 'decisions' && pendingDecisions.length > 0 && (
                <Badge variant="destructive" className="text-xs h-4 px-1">
                  {pendingDecisions.length}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map(activity => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const user = collaborators.find(
                    c => c.id === activity.userId
                  );

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <ActivityIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">
                            {user?.firstName || 'Someone'}
                          </span>{' '}
                          {activity.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4">
                  <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No recent activity
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Active Collaborators */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">
                Active Collaborators
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('collaborators')}
              >
                <Users className="w-4 h-4 mr-1" />
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {activeCollaborators.slice(0, 5).map(collaborator => {
                const RoleIcon = getRoleIcon(collaborator.role);
                const isOnline =
                  collaborator.lastActive &&
                  new Date(collaborator.lastActive) >
                    new Date(Date.now() - 5 * 60 * 1000);

                return (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {collaborator.firstName[0]}
                        {collaborator.lastName[0]}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {collaborator.firstName} {collaborator.lastName}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            'text-xs',
                            getRoleBadgeColor(collaborator.role)
                          )}
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {collaborator.role}
                        </Badge>
                        {isOnline && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600 dark:text-green-400"
                          >
                            Online
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'collaborators' && (
        <div className="space-y-4">
          {/* Collaborators List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collaborators.map(collaborator => {
              const RoleIcon = getRoleIcon(collaborator.role);
              const isOnline =
                collaborator.lastActive &&
                new Date(collaborator.lastActive) >
                  new Date(Date.now() - 5 * 60 * 1000);
              const canManage = isOwner && collaborator.id !== currentUserId;

              return (
                <Card key={collaborator.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-medium">
                        {collaborator.firstName[0]}
                        {collaborator.lastName[0]}
                      </div>
                      {isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">
                        {collaborator.firstName} {collaborator.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {collaborator.email}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          className={cn(
                            'text-xs',
                            getRoleBadgeColor(collaborator.role)
                          )}
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {collaborator.role}
                        </Badge>

                        {collaborator.status === 'pending' && (
                          <Badge
                            variant="outline"
                            className="text-xs text-orange-600 dark:text-orange-400"
                          >
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </Badge>
                        )}

                        {isOnline && (
                          <Badge
                            variant="outline"
                            className="text-xs text-green-600 dark:text-green-400"
                          >
                            Online
                          </Badge>
                        )}
                      </div>

                      {collaborator.lastActive && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Last active:{' '}
                          {new Date(
                            collaborator.lastActive
                          ).toLocaleDateString()}
                        </p>
                      )}

                      {canManage && (
                        <div className="flex items-center gap-1 mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Change Role
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                          >
                            <UserX className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'decisions' && (
        <div className="space-y-4">
          {decisions.length > 0 ? (
            decisions
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map(decision => {
                const creator = collaborators.find(
                  c => c.id === decision.createdBy
                );
                const totalVotes = decision.votes.length;
                const yesVotes = decision.votes.filter(
                  v => v.vote === 'yes'
                ).length;
                const noVotes = decision.votes.filter(
                  v => v.vote === 'no'
                ).length;
                const maybeVotes = decision.votes.filter(
                  v => v.vote === 'maybe'
                ).length;
                const userVote = decision.votes.find(
                  v => v.userId === currentUserId
                );

                return (
                  <Card
                    key={decision.id}
                    className={cn(
                      'p-4',
                      decision.status === 'pending' &&
                        'border-orange-500/20 bg-orange-500/5'
                    )}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-foreground">
                              {decision.title}
                            </h4>
                            <Badge
                              className={cn(
                                'text-xs',
                                decision.status === 'pending' &&
                                  'bg-orange-500/20 text-orange-600 dark:text-orange-400',
                                decision.status === 'approved' &&
                                  'bg-green-500/20 text-green-600 dark:text-green-400',
                                decision.status === 'rejected' &&
                                  'bg-red-500/20 text-red-600 dark:text-red-400'
                              )}
                            >
                              {decision.status}
                            </Badge>
                          </div>

                          {decision.description && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {decision.description}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>By {creator?.firstName || 'Unknown'}</span>
                            <span>
                              {new Date(
                                decision.createdAt
                              ).toLocaleDateString()}
                            </span>
                            <span>
                              {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>

                        {decision.status === 'pending' &&
                          !userVote &&
                          canEdit && (
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onVoteOnDecision(decision.id, 'yes')
                                }
                                className="h-8 px-3 text-green-600 hover:text-green-700"
                              >
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Yes
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  onVoteOnDecision(decision.id, 'no')
                                }
                                className="h-8 px-3 text-red-600 hover:text-red-700"
                              >
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                No
                              </Button>
                            </div>
                          )}
                      </div>

                      {/* Voting Results */}
                      {totalVotes > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              Voting Results
                            </span>
                            <span className="text-foreground">
                              {totalVotes} total votes
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full" />
                              <span>Yes: {yesVotes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-red-500 rounded-full" />
                              <span>No: {noVotes}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                              <span>Maybe: {maybeVotes}</span>
                            </div>
                          </div>

                          <div className="w-full bg-border rounded-full h-2">
                            <div className="flex h-2 rounded-full overflow-hidden">
                              <div
                                className="bg-green-500"
                                style={{
                                  width: `${(yesVotes / totalVotes) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-red-500"
                                style={{
                                  width: `${(noVotes / totalVotes) * 100}%`,
                                }}
                              />
                              <div
                                className="bg-yellow-500"
                                style={{
                                  width: `${(maybeVotes / totalVotes) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {userVote && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Your vote:
                          </span>
                          <Badge
                            className={cn(
                              'text-xs',
                              userVote.vote === 'yes' &&
                                'bg-green-500/20 text-green-600 dark:text-green-400',
                              userVote.vote === 'no' &&
                                'bg-red-500/20 text-red-600 dark:text-red-400',
                              userVote.vote === 'maybe' &&
                                'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                            )}
                          >
                            {userVote.vote}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })
          ) : (
            <div className="text-center py-12">
              <Vote className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">
                No decisions yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start making group decisions for your trip planning
              </p>
              {canEdit && (
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Decision
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Real-time Collaboration Features */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                ⚡ Real-time Collaboration Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <strong className="text-foreground">Live Updates:</strong> See
                  changes instantly as your travel companions edit the
                  itinerary, add expenses, or make decisions.
                </div>
                <div>
                  <strong className="text-foreground">Group Voting:</strong>{' '}
                  Make democratic decisions on activities, accommodations, and
                  budget allocations with built-in voting system.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
