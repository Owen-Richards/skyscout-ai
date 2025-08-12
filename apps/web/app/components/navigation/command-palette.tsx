/**
 * Command Palette Component
 * Advanced search and navigation interface for power users
 * Provides quick access to all platform features without UI clutter
 * Strategic competitive advantage through superior UX efficiency
 */

'use client';

import { Badge, cn } from '@skyscout/ui';
import {
  ArrowRight,
  Clock,
  MapPin,
  Plane,
  Search,
  Star,
  TrendingUp,
} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { NAV } from '../../constants/navigation';

interface CommandPaletteProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface SearchResult {
  readonly id: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly href: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly category: string;
  readonly keywords: readonly string[];
  readonly priority: number;
  readonly badge?: string;
}

// Comprehensive search index for all platform features
const SEARCH_INDEX: readonly SearchResult[] = [
  // Navigation shortcuts
  ...NAV.flatMap(group =>
    group.children
      ? group.children.map(child => ({
          id: `nav-${child.key}`,
          title: child.label,
          subtitle: child.description,
          href: child.href,
          icon: child.icon || Search,
          category: group.label,
          keywords: [
            child.label.toLowerCase(),
            group.label.toLowerCase(),
            child.key,
          ],
          priority: group.priority,
          badge: child.badge,
        }))
      : [
          {
            id: `nav-${group.key}`,
            title: group.label,
            subtitle: group.description,
            href: group.href || `/${group.key}`,
            icon: group.icon || Search,
            category: 'Navigation',
            keywords: [group.label.toLowerCase(), group.key],
            priority: group.priority,
            badge: group.badge,
          },
        ]
  ),

  // Quick actions and shortcuts
  {
    id: 'quick-flight-search',
    title: 'Quick Flight Search',
    subtitle: 'Find flights with AI assistance',
    href: '/flights',
    icon: Plane,
    category: 'Quick Actions',
    keywords: ['flight', 'search', 'quick', 'ai'],
    priority: 0,
  },
  {
    id: 'price-alerts',
    title: 'Set Price Alert',
    subtitle: 'Get notified when prices drop',
    href: '/alerts/create',
    icon: TrendingUp,
    category: 'Quick Actions',
    keywords: ['alert', 'price', 'notification', 'deals'],
    priority: 1,
  },
  {
    id: 'trip-planner',
    title: 'AI Trip Planner',
    subtitle: 'Let AI plan your perfect trip',
    href: '/trips/create',
    icon: MapPin,
    category: 'Quick Actions',
    keywords: ['trip', 'planner', 'ai', 'itinerary'],
    priority: 1,
  },

  // Popular destinations
  {
    id: 'dest-paris',
    title: 'Paris, France',
    subtitle: 'City of Light • 25% off hotels',
    href: '/search?destination=paris',
    icon: Star,
    category: 'Destinations',
    keywords: ['paris', 'france', 'europe', 'city'],
    priority: 2,
    badge: 'Hot',
  },
  {
    id: 'dest-tokyo',
    title: 'Tokyo, Japan',
    subtitle: 'Modern metropolis • Cherry blossom season',
    href: '/search?destination=tokyo',
    icon: Star,
    category: 'Destinations',
    keywords: ['tokyo', 'japan', 'asia', 'city'],
    priority: 2,
  },
];

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter and rank results based on query
  const filteredResults = useCallback(() => {
    if (!query.trim()) {
      // Show recent searches and popular items when no query
      return SEARCH_INDEX.filter(item => item.priority <= 2)
        .slice(0, 8)
        .sort((a, b) => a.priority - b.priority);
    }

    const searchTerms = query.toLowerCase().split(' ');

    return SEARCH_INDEX.map(item => {
      let score = 0;

      // Exact title match gets highest score
      if (item.title.toLowerCase().includes(query.toLowerCase())) {
        score += 100;
      }

      // Keyword matches
      searchTerms.forEach(term => {
        if (item.keywords.some(keyword => keyword.includes(term))) {
          score += 50;
        }
        if (item.title.toLowerCase().includes(term)) {
          score += 30;
        }
        if (item.subtitle?.toLowerCase().includes(term)) {
          score += 20;
        }
        if (item.category.toLowerCase().includes(term)) {
          score += 10;
        }
      });

      // Priority boost for important features
      score += (5 - item.priority) * 5;

      return { ...item, score };
    })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [query]);

  const results = filteredResults();

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(
            prev => (prev - 1 + results.length) % results.length
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const selectedElement = resultsRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [
          result.title,
          ...prev.filter(s => s !== result.title),
        ].slice(0, 5);
        return updated;
      });

      // Navigate to result
      window.location.href = result.href;
      onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl mx-auto px-4">
        <div className="bg-background border border-border rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center px-4 py-3 border-b border-border">
            <Search className="h-5 w-5 text-muted-foreground mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search flights, hotels, destinations, or type a command..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">↑↓</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">↵</kbd>
              <kbd className="px-2 py-1 bg-muted rounded text-xs">esc</kbd>
            </div>
          </div>

          {/* Results */}
          <div ref={resultsRef} className="max-h-96 overflow-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-1">
                  Try searching for flights, hotels, or destinations
                </p>
              </div>
            ) : (
              <div className="py-2">
                {query && (
                  <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
                    {results.length} result{results.length !== 1 ? 's' : ''}
                  </div>
                )}

                {results.map((result, index) => {
                  const Icon = result.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                        'hover:bg-accent focus:bg-accent',
                        isSelected && 'bg-accent'
                      )}
                    >
                      <div
                        className={cn(
                          'p-2 rounded-lg flex-shrink-0',
                          'bg-primary/10 text-primary',
                          isSelected && 'bg-primary text-primary-foreground'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-foreground">
                            {result.title}
                          </div>
                          {result.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {result.badge}
                            </Badge>
                          )}
                        </div>

                        {result.subtitle && (
                          <div className="text-sm text-muted-foreground truncate">
                            {result.subtitle}
                          </div>
                        )}

                        <div className="text-xs text-muted-foreground mt-1">
                          {result.category}
                        </div>
                      </div>

                      <ArrowRight
                        className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform flex-shrink-0',
                          isSelected && 'translate-x-1'
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer with tips */}
          <div className="px-4 py-3 border-t border-border bg-muted/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>
                  💡 Tip: Use keywords like "cheap flights" or "hotels paris"
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>⌘K to open anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
