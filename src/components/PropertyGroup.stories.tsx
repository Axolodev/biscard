import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { fn } from 'storybook/test';

import { PropertyGroup } from './PropertyGroup';

const meta = {
  title: 'Components/PropertyGroup',
  component: PropertyGroup,
  tags: ['autodocs'],
  args: {
    label: 'Include text block?',
    onToggleChange: fn(),
  },
} satisfies Meta<typeof PropertyGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const fields = (
  <div className="grid grid-cols-3 gap-2">
    <label className="fieldset">
      <span className="label">Width</span>
      <input type="number" className="input" defaultValue={43} />
    </label>
    <label className="fieldset">
      <span className="label">Height</span>
      <input type="number" className="input" defaultValue={43} />
    </label>
    <label className="fieldset">
      <span className="label">Thickness</span>
      <input type="number" className="input" defaultValue={2} />
    </label>
    <label className="fieldset col-span-3">
      <span className="label">Text content</span>
      <textarea className="textarea w-full" />
    </label>
  </div>
);

export const On: Story = {
  args: { defaultChecked: true, children: fields },
};

export const Off: Story = {
  args: { defaultChecked: false, children: fields },
};
