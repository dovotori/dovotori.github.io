import styled from 'styled-components';

import license from 'Assets/img/cclicense80x15.png';
import { ReactComponent as Mail } from 'Assets/svg/mail.svg';
import ToggleMode from './ToggleMode';
import availablesLang from '../constants/locales';

const Wrap = styled.div`
  padding: 2em 4%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  font-size: 0.9em;
  color: ${(p) => p.theme.text};
  ${(p) => p.theme.media.mobile`flex-direction: column;`}
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1em;
  min-width: 15%;

  a {
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 300ms ease-out;
  }
  a:hover {
    opacity: 1;
  }

  ${(p) => p.theme.media.mobile`flex-direction: column;`}
`;

const Start = styled(Div)`
  justify-content: flex-start;
`;

const StyledMail = styled(Mail)`
  color: ${(p) => p.theme.light};
  height: 20px;
  .toOpen {
    transition: transform 300ms ease-out, color 300ms ease-out;
  }
  &:hover .toOpen {
    transform: rotate3d(1, 0, 0, 170deg);
  }
  &:hover {
    color: ${(p) => p.theme.primary};
  }
`;

const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
  margin: 0 0.4em;
`;

const Button = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.4em;
  margin: 0 0.4em;
  text-transform: uppercase;
  min-width: 120px;
  ${(p) => p.theme.monospace}
  ${(p) => p.theme.active}
  font-weight: normal;
  color: ${(p) => p.theme.light};
  &:hover {
    color: ${(p) => p.theme.text};
    .line {
      transform: none;
    }
  }
`;

const Line = styled.span`
  display: inline-block;
  width: 100%;
  height: 1px;
  background: ${(p) => p.theme.text};
  z-index: 0;
  transition: transform 300ms ease-out;
  transform: ${(p) => (p.isHighlight ? 'none' : 'scale(0)')};
`;

const LineLeft = styled(Line)`
  transform-origin: right center;
`;

const LineRight = styled(Line)`
  transform-origin: left center;
`;

const SimpleSpan = styled.span`
  transition: background-color 0.2s ease-out;
  padding: 0 0 0;
  width: 100%;
  flex-grow: 2;
  white-space: nowrap;
`;

const Footer = ({ toggleTheme, isDarkMode, setLang, texts, lang }) => (
  <Wrap className="footer">
    <Div>
      <a href={`mailto:${process.env.MAIL}`} title="contact">
        <StyledMail />
      </a>
    </Div>
    <Div>
      {availablesLang.map((availableLang) => (
        <Button key={availableLang.id} onClick={() => setLang(availableLang.id)}>
          <LineLeft isHighlight={availableLang.id === lang} className="line" />
          <SimpleSpan>&#8202;{availableLang.short}</SimpleSpan>
          <LineRight isHighlight={availableLang.id === lang} className="line" />
        </Button>
      ))}
    </Div>
    <Div>
      <a href="https://creativecommons.org/licenses/by/4.0/" title="license">
        <Img alt="license creative common" src={license} />
      </a>
    </Div>
    <Start>
      <ToggleMode isDarkMode={isDarkMode} texts={texts} toggleTheme={toggleTheme} />
    </Start>
  </Wrap>
);

export default Footer;
