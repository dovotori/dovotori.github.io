import { useState } from "react";
import Toggle from "../Toggle";

export default {
  title: "Components/Toggle",
  component: Toggle,
};

const InteractiveTemplate = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Toggle
      checked={isChecked}
      onClick={() => setIsChecked(!isChecked)}
      label="Toggle Label"
      id="toggle"
    />
  );
};
export const Primary = InteractiveTemplate.bind({});
