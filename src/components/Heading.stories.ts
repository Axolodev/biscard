import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Heading } from './Heading';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Heading',
  component: Heading,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  // Use `fn` to spy on onSettingsClick, which will appear in the actions panel once invoked.
  args: { onSettingsClick: fn() },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'CardGen',
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'My Deck',
  },
};
