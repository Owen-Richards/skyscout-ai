import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'default', 'lg', 'xl', '2xl'],
    },
    shape: {
      control: { type: 'select' },
      options: ['circle', 'square'],
    },
    border: {
      control: { type: 'select' },
      options: ['none', 'thin', 'thick'],
    },
    status: {
      control: { type: 'select' },
      options: ['online', 'offline', 'away', 'busy'],
    },
    interactive: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: 'https://github.com/shadcn.png',
    alt: 'Avatar',
    fallback: 'CN',
    size: 'default',
    shape: 'circle',
    border: 'none',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Small avatar"
        fallback="SM"
        size="sm"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Default avatar"
        fallback="DF"
        size="default"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Large avatar"
        fallback="LG"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Extra large avatar"
        fallback="XL"
        size="xl"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="2XL avatar"
        fallback="2XL"
        size="2xl"
      />
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Circle avatar"
        fallback="CI"
        shape="circle"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Square avatar"
        fallback="SQ"
        shape="square"
        size="lg"
      />
    </div>
  ),
};

export const Borders: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="No border"
        fallback="NB"
        border="none"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Thin border"
        fallback="TB"
        border="thin"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Thick border"
        fallback="TK"
        border="thick"
        size="lg"
      />
    </div>
  ),
};

export const StatusIndicators: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Online user"
        fallback="ON"
        status="online"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Away user"
        fallback="AW"
        status="away"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Busy user"
        fallback="BS"
        status="busy"
        size="lg"
      />
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Offline user"
        fallback="OF"
        status="offline"
        size="lg"
      />
    </div>
  ),
};

export const Fallbacks: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar alt="User 1" fallback="JD" size="lg" />
      <Avatar alt="User 2" fallback="AB" size="lg" />
      <Avatar alt="User 3" fallback="XY" size="lg" />
      <Avatar alt="User 4" fallback="👤" size="lg" />
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar
        src="https://github.com/shadcn.png"
        alt="Interactive avatar"
        fallback="IN"
        interactive
        size="lg"
        onClick={() => alert('Avatar clicked!')}
      />
      <Avatar
        alt="Interactive fallback"
        fallback="IF"
        interactive
        size="lg"
        status="online"
        onClick={() => alert('Fallback avatar clicked!')}
      />
    </div>
  ),
};

export const UserList: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <h3 className="text-lg font-semibold">Team Members</h3>
      <div className="space-y-3">
        {[
          { name: 'John Doe', status: 'online' as const, initials: 'JD' },
          { name: 'Jane Smith', status: 'away' as const, initials: 'JS' },
          { name: 'Bob Johnson', status: 'busy' as const, initials: 'BJ' },
          { name: 'Alice Brown', status: 'offline' as const, initials: 'AB' },
        ].map((user, index) => (
          <div key={index} className="flex items-center space-x-3">
            <Avatar
              fallback={user.initials}
              status={user.status}
              size="default"
              interactive
            />
            <div className="flex-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {user.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};
