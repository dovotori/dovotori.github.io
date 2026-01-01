import license from "Assets/img/cclicense80x15.png";
import styled from "styled-components";
import availablesLang from "../constants/locales";
import SegmentControl from "./SegmentControl";
import SocialLinks from "./SocialLinks";
import ToggleMode from "./ToggleMode";

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
  min-height: 3em;

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
  min-width: 200px;
`;

const Img = styled.img`
  display: block;
  width: 80px;
  height: 14px;
  margin: 0 0.4em;
`;

const StyledSocialLinks = styled(SocialLinks)`
  svg {
    height: 20px;
    margin: 0 0.5em;
  }
`;

const Footer = ({
  toggleTheme,
  isDarkMode,
  setLang,
  texts,
  lang,
}: {
  toggleTheme: () => void;
  isDarkMode: boolean;
  setLang: (langId: string) => void;
  texts: { toggleLightMode: string; toggleDarkMode: string };
  lang: string;
}) => (
  <Wrap className="footer">
    <Div>
      <StyledSocialLinks />
    </Div>
    <Div>
      <a href="https://creativecommons.org/licenses/by/4.0/" title="license">
        <Img alt="license creative common" src={license} />
      </a>
    </Div>
    <Div>
      <SegmentControl
        items={availablesLang.map((availableLang) => ({
          label: availableLang.short,
          id: availableLang.id,
        }))}
        selectedId={lang}
        onClick={setLang}
      />
    </Div>
    <Start>
      <ToggleMode isDarkMode={isDarkMode} texts={texts} toggleTheme={toggleTheme} />
    </Start>
  </Wrap>
);

export default Footer;
