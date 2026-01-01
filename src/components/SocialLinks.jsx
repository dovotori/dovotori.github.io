import { ReactComponent as Storybook } from "Assets/svg/cv/storybook.svg";
import { ReactComponent as Github } from "Assets/svg/github.svg";
import { ReactComponent as Gitlab } from "Assets/svg/gitlab.svg";
import { ReactComponent as Linkedin } from "Assets/svg/linkedin.svg";
import { ReactComponent as Mail } from "Assets/svg/mail.svg";
import styled from "styled-components";

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
    transition:
      transform 300ms ease-out,
      color 300ms ease-out;
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
    <a href="https://gitlab.com/dovotori" title="gitlab">
      <Gitlab />
    </a>
    <a href="https://github.com/dovotori" title="github">
      <StyledGithub />
    </a>
    <a href="https://jp.linkedin.com/in/dorian-ratovo" title="linkedin">
      <Linkedin />
    </a>
    <a href="/storybook" title="storybook">
      <Storybook />
    </a>
    <a href={`mailto:${process.env.MAIL}`} title="contact">
      <StyledMail />
    </a>
  </Wrap>
);

export default SociaLinks;
