import Loader from "../Loader";

export default {
  title: "Components/Loader",
  component: Loader,
};

const Template = (args) => <Loader {...args} />;
export const Primary = Template.bind({});
Primary.args = {};
