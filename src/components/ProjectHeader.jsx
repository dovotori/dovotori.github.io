import { ReactComponent as LinkSvg } from "Assets/svg/externalLink.svg";
import styled from "styled-components";
import TagsList from "./TagsList";
import TypingMessage from "./TypingMessage";

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;

const WrapTexte = styled.div`
  margin-top: 6em;
`;

const Description = styled.div`
  color: ${(p) => p.theme.light};
  width: 100%;
  padding: 10px;

  ${(p) => p.theme.media.tablet`
    width: 100%;
  `};
`;

const Text = styled.p`
  margin: 10px 0;
  width: 100%;
`;

const DateComp = styled.p.attrs({ className: "numbers" })`
  text-align: left;
  margin: 0;
  padding: 0.4em 10px 0;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.monospace}
`;

const StyledTitle = styled.h1`
  ${(p) => p.theme.title}
  position: relative;
  margin: 0;
  padding: 0 10px;

  & > span > span > span {
    ${(p) => p.theme.primaryGradientText}
  }
`;

const StyledTypingMessage = styled(TypingMessage)``;

const Bar = styled.div`
  width: 100%;
  height: 1px;
  margin: 0;
  background: ${(p) => p.theme.getGradient};
`;

const StyledTagsList = styled(TagsList)`
  margin: 1.4em 0;
`;

const A = styled.a`
  color: ${(p) => p.theme.getColor};
`;

const LinkIcon = styled(LinkSvg)`
  stroke: ${(p) => p.theme.getColor};
  fill: none;
  width: 1em;
  height: 1em;
  margin-left: 0.5em;
  transform: translateY(1px);
`;

const ProjectHeader = ({ title, descriptions, tags, date, links, $colorType }) => (
  <WrapContent>
    <WrapTexte>
      {date && <DateComp $colorType={$colorType}>{date}</DateComp>}
      {title && (
        <StyledTitle $colorType={$colorType}>
          <StyledTypingMessage message={title} />
        </StyledTitle>
      )}
      {descriptions || tags || link ? (
        <>
          <Bar $colorType={$colorType} />
          <Description>
            {descriptions?.map((text) => (
              <Text key={text}>{text}</Text>
            ))}
            {tags?.length ? <StyledTagsList tags={tags} /> : null}
            {links
              ? links.map((link) => (
                  <A
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    $colorType={$colorType}
                  >
                    {link.label}
                    <LinkIcon $colorType={$colorType} />
                  </A>
                ))
              : null}
          </Description>
        </>
      ) : null}
    </WrapTexte>
  </WrapContent>
);

export default ProjectHeader;
