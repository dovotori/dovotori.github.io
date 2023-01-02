import Bol from '../Bol';

export default {
  title: 'Components/Bol',
  component: Bol,
};

const Template = (args) => <Bol {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  isSwitched: false
};