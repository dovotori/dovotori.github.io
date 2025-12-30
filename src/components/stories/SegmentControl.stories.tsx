import { useState } from "react";
import SegmentControl from "../SegmentControl";

export default {
  title: "Components/SegmentControl",
  component: SegmentControl,
};

const items = [
  { id: "1", label: "First" },
  { id: "2", label: "Second" },
  { id: "3", label: "Third" },
];

const InteractiveTemplate = () => {
  const [selectedId, setSelectedId] = useState("1");
  return <SegmentControl items={items} selectedId={selectedId} onClick={setSelectedId} />;
};

export const Primary = InteractiveTemplate.bind({});
