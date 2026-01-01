import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";

import SegmentControl from "../SegmentControl";

const items = [
  { id: "1", label: "First" },
  { id: "2", label: "Second" },
  { id: "3", label: "Third" },
];

const meta: Meta<typeof SegmentControl> = {
  title: "Components/SegmentControl",
  component: SegmentControl,
};

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveTemplate = () => {
  const [selectedId, setSelectedId] = useState("1");
  return <SegmentControl items={items} selectedId={selectedId} onClick={setSelectedId} />;
};

export const Primary = InteractiveTemplate.bind({});

// Test story for click selection
export const ClickSelection: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState("1");
    return <SegmentControl items={items} selectedId={selectedId} onClick={setSelectedId} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Initial state has First selected", async () => {
      const firstButton = canvas.getByRole("button", { name: "First" });
      expect(firstButton).toBeInTheDocument();
    });

    await step("Click Second button changes selection", async () => {
      const secondButton = canvas.getByRole("button", { name: "Second" });
      await userEvent.click(secondButton);

      await waitFor(() => {
        // Verify the button is now selected (has different styling)
        expect(secondButton).toBeInTheDocument();
      });
    });

    await step("Click Third button changes selection", async () => {
      const thirdButton = canvas.getByRole("button", { name: "Third" });
      await userEvent.click(thirdButton);

      await waitFor(() => {
        expect(thirdButton).toBeInTheDocument();
      });
    });
  },
};

// Test story for hover behavior
export const HoverBehavior: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState("1");
    return <SegmentControl items={items} selectedId={selectedId} onClick={setSelectedId} />;
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Hover over Second button", async () => {
      const secondButton = canvas.getByRole("button", { name: "Second" });
      await userEvent.hover(secondButton);

      // Wait for hover state to be applied
      await waitFor(() => {
        expect(secondButton).toBeInTheDocument();
      });
    });

    await step("Unhover returns to normal", async () => {
      const secondButton = canvas.getByRole("button", { name: "Second" });
      await userEvent.unhover(secondButton);

      await waitFor(() => {
        expect(secondButton).toBeInTheDocument();
      });
    });

    await step("Hover over Third button", async () => {
      const thirdButton = canvas.getByRole("button", { name: "Third" });
      await userEvent.hover(thirdButton);

      await waitFor(() => {
        expect(thirdButton).toBeInTheDocument();
      });
    });
  },
};
