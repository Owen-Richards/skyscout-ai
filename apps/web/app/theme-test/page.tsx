/**
 * Theme Test Page
 * Simple page to test light and dark mode visibility
 */

'use client';

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  ThemeToggle,
} from '@skyscout/ui';
import {
  AlertTriangle,
  CheckCircle,
  Eye,
  Info,
  Palette,
  Star,
  Sun,
} from 'lucide-react';
import { Navigation } from '../components/layout/navigation';

export default function ThemeTestPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-16 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Theme Testing Page
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test light and dark mode visibility with proper contrast ratios
          </p>
          <div className="flex justify-center">
            <ThemeToggle showLabels size="default" />
          </div>
        </div>

        {/* Color Contrast Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Contrast Tests
            </CardTitle>
            <CardDescription>
              Testing visibility of different UI elements in both themes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Contrast */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Text Hierarchy
              </h3>
              <div className="space-y-2">
                <p className="text-foreground font-bold">
                  Primary Text (foreground)
                </p>
                <p className="text-muted-foreground">
                  Secondary Text (muted-foreground)
                </p>
                <p className="text-primary">Primary Color Text</p>
                <p className="text-destructive">Destructive/Error Text</p>
              </div>
            </div>

            {/* Background Tests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Background Variants
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background border border-border rounded-lg">
                  <p className="text-foreground">Background + Border</p>
                </div>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-card-foreground">Card Background</p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-secondary-foreground">
                    Secondary Background
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Button Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Button Visibility Tests
            </CardTitle>
            <CardDescription>
              All button variants should be clearly visible and have proper
              contrast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="default">Default Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Destructive Button</Button>
              <Button variant="success">Success Button</Button>
              <Button variant="warning">Warning Button</Button>
              <Button variant="sky-primary">Sky Primary</Button>
              <Button variant="flight-action">Flight Action</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Form Elements</CardTitle>
            <CardDescription>
              Form inputs should have clear borders and proper contrast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Test input field" />
            <Input type="email" placeholder="Email input" />
            <Input type="password" placeholder="Password input" />
            <div className="flex gap-2">
              <Input placeholder="From" className="flex-1" />
              <Input placeholder="To" className="flex-1" />
            </div>
          </CardContent>
        </Card>

        {/* Status Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Feedback Elements</CardTitle>
            <CardDescription>
              Status indicators should be clearly distinguishable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default Badge</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Outline</Badge>

              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Success Status</span>
              </div>

              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Warning Status</span>
              </div>

              <div className="flex items-center gap-2 text-blue-600">
                <Info className="h-4 w-4" />
                <span>Info Status</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>Test hover and focus states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card variant="interactive" className="p-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Interactive Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Hover to see effect
                    </p>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" className="p-4">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Elevated Card</h4>
                    <p className="text-sm text-muted-foreground">
                      Has shadow elevation
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Theme Status */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-6 w-6" />
                  <span className="font-semibold">Theme System Active</span>
                </div>
              </div>
              <p className="text-muted-foreground">
                Use the theme toggle above to switch between light and dark
                modes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
