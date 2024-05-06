import TypingMessage from '../TypingMessage';

export default {
  title: 'Components/TypingMessage',
  component: TypingMessage,
  decorators: [
    (Story) => (
      <div style={{ fontSize: '10em' }}>
        <Story />
        <p>Text under</p>
      </div>
    ),
  ],
};

const Template = (args) => <TypingMessage {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  message: 'Helloooooooooo',
  firstMessage: 'Depuis',
  isLoop: true,
  isVertical: false,
  isCenter: false,
  delayLoop: 5000,
  delayLetter: 100,
};
