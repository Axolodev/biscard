import type { Preview } from "@storybook/nextjs-vite";
import React from "react";

import "../src/app/globals.css";
import { LocaleProvider } from "../src/i18n/LocaleProvider";
import { ThemeProvider } from "../src/theme/ThemeProvider";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },

  decorators: [
    (Story) =>
      React.createElement(
        "div",
        {
          "data-theme": "G3co",
          className: "bg-base-100 text-base-content min-h-screen",
        },
        React.createElement(
          ThemeProvider,
          { initialTheme: "g3co" },
          React.createElement(
            LocaleProvider,
            { initialLocale: "en" },
            React.createElement(Story),
          ),
        ),
      ),
  ],
};

export default preview;
