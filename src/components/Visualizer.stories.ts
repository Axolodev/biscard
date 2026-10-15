import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { Visualizer } from './Visualizer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Visualizer',
  component: Visualizer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  // Use `fn` to spy on onResetView/onDownloadStl, which will appear in the actions panel once invoked.
  args: { onResetView: fn(), onDownloadStl: fn() },
} satisfies Meta<typeof Visualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderContent: Story = {
  args: {
    children: '3d scene placeholder',
  },
};
