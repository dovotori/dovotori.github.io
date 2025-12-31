import styled from "styled-components";
import QrCode from "../QrCode";

export default {
  title: "Components/QrCode",
  component: QrCode,
};

const StyledQrCode = styled(QrCode)`
  width: 10em;
  height: 10em;
`;

const Template = (args) => <StyledQrCode {...args} />;
export const Primary = Template.bind({});
Primary.args = {};
