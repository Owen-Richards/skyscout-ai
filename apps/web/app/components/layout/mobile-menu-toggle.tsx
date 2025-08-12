import { Menu, X } from 'lucide-react';

import { Button } from '@skyscout/ui';

interface MobileMenuToggleProps {
  readonly isOpen: boolean;
  readonly onToggle: () => void;
  readonly className?: string;
}

export function MobileMenuToggle({
  isOpen,
  onToggle,
  className,
}: MobileMenuToggleProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className={`lg:hidden ${className}`}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
    >
      {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </Button>
  );
}
