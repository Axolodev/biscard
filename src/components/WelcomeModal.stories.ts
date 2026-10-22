import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { WelcomeModal } from "./WelcomeModal";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/WelcomeModal",
  component: WelcomeModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  // Use `fn` to spy on the callbacks, which will appear in the actions panel once invoked.
  args: { onClose: fn() },
} satisfies Meta<typeof WelcomeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
