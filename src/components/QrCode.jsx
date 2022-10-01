import { ReactComponent as QrCode } from 'Assets/svg/labqrcode.svg';
import styled from 'styled-components';

const StyledQrCode = styled(QrCode)`
  display: block;
  color: ${(p) => p.theme.light};
  height: auto;
  width: 80%;
  max-width: 512px;
  padding: 10%;
  margin: 0 auto;

  .logo {
    color: ${(p) => p.theme.primary};
  }
`;

export default () => <StyledQrCode />;