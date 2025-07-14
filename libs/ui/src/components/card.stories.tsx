import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Avatar } from './avatar';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'elevated', 'interactive', 'flat'],
    },
    padding: {
      control: { type: 'select' },
      options: ['none', 'sm', 'default', 'lg'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'default',
  },
  render: args => (
    <div className="w-96">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            Card description goes here. This is a subtitle or supporting text.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This is the main content of the card. You can put any content here.
          </p>
        </CardContent>
        <CardFooter>
          <Button>Action</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'default',
  },
  render: args => (
    <div className="w-96">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>
            This card has an elevated shadow for more prominent display.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Content with elevated styling for better visual hierarchy.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    variant: 'interactive',
    padding: 'default',
  },
  render: args => (
    <div className="w-96">
      <Card {...args}>
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>
            This card responds to hover with scaling and shadow effects.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hover over this card to see the interactive effects.</p>
        </CardContent>
      </Card>
    </div>
  ),
};

export const UserProfile: Story = {
  render: () => (
    <div className="w-96">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar
              src="https://github.com/shadcn.png"
              alt="User avatar"
              fallback="CN"
              status="online"
            />
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>Software Engineer</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
            <Badge variant="secondary">Next.js</Badge>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline">View Profile</Button>
          <Button>Connect</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const FlightDeal: Story = {
  render: () => (
    <div className="w-96">
      <Card variant="interactive">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>New York → Paris</CardTitle>
              <CardDescription>Round trip • 7 days</CardDescription>
            </div>
            <Badge variant="success">Best Deal</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Departure</span>
              <span className="text-sm font-medium">Dec 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Return</span>
              <span className="text-sm font-medium">Dec 22, 2024</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-2xl font-bold text-primary">$599</span>
              <Badge variant="warning" dot>
                Price Alert
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Book Now</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};
