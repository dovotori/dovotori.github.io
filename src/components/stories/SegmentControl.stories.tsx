import SegmentControl from "../SegmentControl";

export default {
  title: "Components/SegmentControl",
  component: SegmentControl,
};

const Template = (args) => <SegmentControl {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  items: [
    { id: 1, label: "First" },
    { id: 2, label: "Second" },
    { id: 3, label: "Third" },
  ],
  selectedId: 1,
  onSelect: (id) => {
    console.log("Selected ID:", id);
  },
};
