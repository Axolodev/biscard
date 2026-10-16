import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { CardForm } from './CardForm';
import { initialCardFormState } from './cardFormTypes';

const meta = {
  title: 'Components/CardForm',
  component: CardForm,
  tags: ['autodocs'],
  args: {
    state: initialCardFormState,
    onChange: () => {},
  },
  render: function Render(args) {
    const [state, setState] = useState(args.state);
    return (
      <div className="max-w-3xl">
        <CardForm
          {...args}
          state={state}
          onChange={(next) => {
            setState(next);
            args.onChange(next);
          }}
        />
      </div>
    );
  },
} satisfies Meta<typeof CardForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
