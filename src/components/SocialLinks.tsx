import { ReactComponent as Storybook } from "Assets/svg/cv/storybook.svg";
import { ReactComponent as Github } from "Assets/svg/github.svg";
import { ReactComponent as Gitlab } from "Assets/svg/gitlab.svg";
import { ReactComponent as Linkedin } from "Assets/svg/linkedin.svg";
import { ReactComponent as Mail } from "Assets/svg/mail.svg";
import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5em;
  svg {
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

const SociaLinks = ({ className }: { className?: string }) => (
  <Wrap className={className}>
    <a href="https://gitlab.com/dovotori" title="gitlab" aria-label="GitLab">
      <Gitlab />
    </a>
    <a href="https://github.com/dovotori" title="github" aria-label="GitHub">
      <Github />
    </a>
    <a href="https://jp.linkedin.com/in/dorian-ratovo" title="linkedin" aria-label="LinkedIn">
      <Linkedin />
    </a>
    <a href="/storybook" title="storybook" aria-label="Storybook">
      <Storybook />
    </a>
    <a href={`mailto:${process.env.MAIL}`} title="contact" aria-label="Send email">
      <StyledMail />
    </a>
  </Wrap>
);

export default SociaLinks;
