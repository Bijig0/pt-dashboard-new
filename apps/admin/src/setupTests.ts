import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

import { setProjectAnnotations } from "@storybook/react";
import { render as testingLibraryRender } from "@testing-library/react";
import { beforeAll } from "vitest";
// 👇 Import the exported annotations, if any, from the addons you're using; otherwise remove this

const annotations = setProjectAnnotations([
  // You MUST provide this option to use portable stories with vitest
  { testingLibraryRender },
]);

// Supports beforeAll hook from Storybook

expect.extend(matchers);
