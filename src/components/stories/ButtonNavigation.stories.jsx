import ButtonNavigation from "../ButtonNavigation";

export default {
  title: "Components/ButtonNavigation",
  component: ButtonNavigation,
};

const Template = (args) => <ButtonNavigation {...args}>Custom</ButtonNavigation>;
export const Primary = Template.bind({});
Primary.args = {
  label: "Back",
};
