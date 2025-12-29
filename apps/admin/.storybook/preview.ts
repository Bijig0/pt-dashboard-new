import type { Preview } from "@storybook/react";
import "../src/index.css"; // replace with the name of your tailwind css file

// @ts-ignore
window.isStorybook = true;

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
