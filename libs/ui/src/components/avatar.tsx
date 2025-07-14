'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden transition-all duration-200',
  {
    variants: {
      size: {
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16',
        '2xl': 'h-20 w-20',
      },
      shape: {
        circle: 'rounded-full',
        square: 'rounded-lg',
      },
      border: {
        none: '',
        thin: 'ring-2 ring-background shadow-sm',
        thick: 'ring-4 ring-background shadow-md',
      },
    },
    defaultVariants: {
      size: 'default',
      shape: 'circle',
      border: 'none',
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * Source URL for the avatar image
   */
  src?: string;
  /**
   * Alt text for the avatar image
   */
  alt?: string;
  /**
   * Fallback initials or content when image fails to load
   */
  fallback?: string;
  /**
   * Status indicator
   */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /**
   * Whether the avatar is interactive
   */
  interactive?: boolean;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      size,
      shape,
      border,
      src,
      alt,
      fallback,
      status,
      interactive,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = React.useState(false);
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleImageError = () => {
      setImageError(true);
    };

    const handleImageLoad = () => {
      setImageLoaded(true);
      setImageError(false);
    };

    const showFallback = !src || imageError || !imageLoaded;

    return (
      <div
        ref={ref}
        className={cn(
          avatarVariants({ size, shape, border }),
          interactive && 'cursor-pointer hover:opacity-80 hover:scale-105',
          className
        )}
        {...props}
      >
        {src && !imageError && (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className={cn(
              'aspect-square h-full w-full object-cover transition-opacity duration-200',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}

        {showFallback && (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center bg-muted text-muted-foreground font-medium',
              size === 'sm' && 'text-xs',
              size === 'default' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg',
              size === '2xl' && 'text-xl'
            )}
          >
            {fallback || '?'}
          </div>
        )}

        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-background',
              size === 'sm' && 'h-2 w-2',
              size === 'default' && 'h-3 w-3',
              size === 'lg' && 'h-3 w-3',
              size === 'xl' && 'h-4 w-4',
              size === '2xl' && 'h-5 w-5',
              status === 'online' && 'bg-green-500',
              status === 'offline' && 'bg-gray-400',
              status === 'away' && 'bg-yellow-500',
              status === 'busy' && 'bg-red-500'
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar, avatarVariants };
