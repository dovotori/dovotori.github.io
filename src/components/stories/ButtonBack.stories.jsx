import ButtonBack from "../ButtonBack";

export default {
  title: "Components/ButtonBack",
  component: ButtonBack,
};

const Template = (args) => <ButtonBack {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  label: "Back",
};
