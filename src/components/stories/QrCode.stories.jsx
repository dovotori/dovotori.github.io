import QrCode from "../QrCode";

export default {
  title: "Components/QrCode",
  component: QrCode,
};

const Template = (args) => <QrCode {...args} />;
export const Primary = Template.bind({});
Primary.args = {};
