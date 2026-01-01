import { useState } from "react";
import { expect, waitFor, within } from "storybook/test";

import TypingMessage from "../TypingMessage";

export default {
  title: "Components/TypingMessage",
  component: TypingMessage,
  decorators: [
    (Story) => (
      <div style={{ fontSize: "10em" }}>
        <Story />
        <p>Text under</p>
      </div>
    ),
  ],
};

const Template = (args) => <TypingMessage {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  message: "Helloooooooooo",
  firstMessage: "Depuis",
  isLoop: true,
  isVertical: false,
  isCenter: false,
  delayLoop: 5000,
  delayLetter: 100,
};

// Interactive story with trigger test
const TriggerTemplate = (args) => {
  const [trigger, setTrigger] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setTrigger((t) => t + 1)} data-testid="trigger-button">
        Trigger Animation
      </button>
      <TypingMessage {...args} trigger={trigger} />
    </div>
  );
};

export const TriggerTest = TriggerTemplate.bind({});
TriggerTest.args = {
  message: "Hello World",
  firstMessage: "Hello World",
  delayLetter: 30,
  triggerDebounce: 500,
};
TriggerTest.play = async ({ canvasElement, step }) => {
  const canvas = within(canvasElement);

  await step("Initial state shows the message", async () => {
    await waitFor(() => {
      expect(canvas.getByText(/H/)).toBeInTheDocument();
    });
  });

  await step("Click trigger button starts animation", async () => {
    const button = canvas.getByTestId("trigger-button");
    button.click();

    // Wait for animation to start (text should change/scramble)
    await waitFor(
      () => {
        // During animation, the text content changes
        const spans = canvasElement.querySelectorAll("p span");
        expect(spans.length).toBeGreaterThan(0);
      },
      { timeout: 1000 },
    );
  });

  await step("Animation completes and shows full message", async () => {
    // Wait for animation to complete
    await waitFor(
      () => {
        const text = canvasElement.textContent;
        expect(text).toContain("Hello");
        expect(text).toContain("World");
      },
      { timeout: 3000 },
    );
  });
};
