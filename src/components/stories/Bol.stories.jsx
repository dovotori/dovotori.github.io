import styled from "styled-components";
import Bol from "../Bol";

export default {
  title: "Components/Bol",
  component: Bol,
  parameters: {
    layout: "centered",
  },
};

const StyledBol = styled(Bol)`
  width: 10em;
  height: 10em;
`;

const Template = (args) => <StyledBol {...args} />;
export const Primary = Template.bind({});
Primary.args = {
  isSwitched: false,
};
