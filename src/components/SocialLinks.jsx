import styled from 'styled-components';

import { ReactComponent as Linkedin } from 'Assets/svg/cv/linkedin.svg';
import { ReactComponent as Gitlab } from 'Assets/svg/cv/gitlab.svg';
import { ReactComponent as Github } from 'Assets/svg/cv/github.svg';
import { ReactComponent as Mail } from 'Assets/svg/mail.svg';

const Wrap = styled.div`
text-align: center;
svg {
  min-width: 40px;
  width: 2em;
  margin: 0 2em;
  filter: grayscale(100%);
  transition: filter 300ms ease-out;

  &:hover {
    filter: none;
  }
}
`;

const StyledMail = styled(Mail)`
  color: ${(p) => p.theme.light};
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

const StyledGithub = styled(Github)`
  color: ${(p) => p.theme.light};
`;

const SociaLinks = ({ className }) => (
  <Wrap className={className}>
    <a href="https://gitlab.com/dovotori">
      <Gitlab />
    </a>
    <a href="https://github.com/dovotori">
      <StyledGithub />
    </a>
    <a href="https://fr.linkedin.com/in/dorian-ratovo-636a9a95">
      <Linkedin />
    </a>
    <a href={`mailto:${process.env.MAIL}`} title="contact">
      <StyledMail />
    </a>
  </Wrap>);

export default SociaLinks;