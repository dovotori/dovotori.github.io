import styled from 'styled-components';

import TypingMessage from './TypingMessage';

const TEXT_WIDTH = 400;

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;

const WrapTexte = styled.div`
  margin-top: 6em;
`;

const Description = styled.div`
  background: ${(p) => p.theme.backgroundHighlight};
  color: ${(p) => p.theme.light};
  width: 100%;
  max-width: ${TEXT_WIDTH}px;
  padding: 10px;

  ${(p) => p.theme.media.tablet`
    width: 100%;
  `};
`;

const Text = styled.p`
  margin: 0 0 10px 0;
  width: 100%;
`;

const Date = styled.p.attrs({ className: 'numbers' })`
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
`;

const StyledTypingMessage = styled(TypingMessage)`
`;

const Bar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 1px;
  margin: 0;
  background: ${(p) => p.theme.getGradient};
`;

const InvTitle = styled.span`
  position: absolute;
  top: -.2em;
  left: -.2em;
  font-size: 4em;
  font-weight: 800;
  z-index: -1;
  background: ${(p) => p.theme.softGradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: none;
`;

const ProjectHeader = ({ title, inverseTitle, descriptions, date, $colorType }) => (
  <WrapContent>
    <WrapTexte>
      {date && <Date $colorType={$colorType}>{date}</Date>}
      {title && (
        <StyledTitle $colorType={$colorType}>
          <InvTitle>{inverseTitle}</InvTitle>
          <StyledTypingMessage message={title} />
        </StyledTitle>
      )}
      {descriptions && (
        <>
          <Bar $colorType={$colorType} />
          <Description>
            {descriptions.map((text) => (
              <Text key={text}>{text}</Text>
            ))}
          </Description>
        </>
      )}
    </WrapTexte>
  </WrapContent >
);

export default ProjectHeader;
