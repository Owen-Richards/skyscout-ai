import type { Preview } from '@storybook/react-vite';
import React from 'react';
import '../src/globals.css'; // Import your global styles with Tailwind

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'dark',
          value: '#0f172a',
        },
        {
          name: 'gradient',
          value: 'linear-gradient(45deg, #f0f9ff, #e0f2fe)',
        },
      ],
    },
    layout: 'centered',
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'light';

      return React.createElement(
        'div',
        {
          className: `${theme} min-h-screen bg-background text-foreground p-8`,
          style: {
            minHeight: '100vh',
            padding: '2rem',
          },
        },
        React.createElement(Story)
      );
    },
  ],
};

export default preview;
