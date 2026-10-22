import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { Visualizer } from './Visualizer';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Components/Visualizer',
  component: Visualizer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Visualizer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithPlaceholderContent: Story = {
  args: {
    children: '3d scene placeholder',
  },
};
