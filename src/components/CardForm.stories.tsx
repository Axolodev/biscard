import { useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CardForm } from "./CardForm";
import { initialCardFormState } from "./cardFormTypes";
import useModelStore from "@/store/modelStore";

const meta = {
  title: "Components/CardForm",
  component: CardForm,
  tags: ["autodocs"],
  render: function Render(args) {
    useEffect(() => {
      useModelStore.setState({ form: initialCardFormState });
    }, []);
    return (
      <div className="max-w-3xl">
        <CardForm {...args} />
      </div>
    );
  },
} satisfies Meta<typeof CardForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
