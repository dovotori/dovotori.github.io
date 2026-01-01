import Tag from "../Tag";

const Categories = {
  CAT: 0,
  TEST: 1,
  TV: 2,
};

export default {
  title: "Components/Tag",
  component: Tag,
  argTypes: {
    category: {
      type: "select",
      options: Object.keys(Categories),
    },
  },
};

const Template = ({ category, ...args }) => <Tag {...args} category={Categories[category]} />;
export const Primary = Template.bind({});
Primary.args = {
  label: "Hello",
};
