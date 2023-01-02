import Teaser from '../Teaser';

export default {
  title: 'Components/Teaser',
  component: Teaser
};

const Template = (args) => <Teaser {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  title: 'Teaser',
};