import styled from 'styled-components';

import TypingMessage from './TypingMessage';

const TEXT_WIDTH = 400;

const WrapContent = styled.div`
  margin: 0 auto;
  max-width: 800px;
`;

const WrapTexte = styled.div``;

const Description = styled.div`
  text-align: left;
  color: ${(p) => p.theme.light};
  width: 100%;
  max-width: ${TEXT_WIDTH}px;

  ${(p) => p.theme.media.tablet`
    width: 100%;
  `};
`;

const Text = styled.p`
  background: ${(p) => `url(${p.theme.stripes}) repeat`};
  padding: 10px;
  width: 100%;
`;

const Date = styled.p.attrs({ className: 'numbers' })`
  text-align: left;
  display: inline-block;
  margin: 0;
  padding: 0.4em 10px;
  color: ${(p) => p.theme.getColor};
  ${(p) => p.theme.monospace}
`;

const StyledTitle = styled.h1`
  ${(p) => p.theme.title}
  margin: 1.5em 0 0;
  padding: 0 10px;
`;

const Bar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 1px;
  margin: 0;
  background: ${(p) => p.theme.getGradient};
`;

const ProjectHeader = ({ title, description, date, $colorType }) => (
  <WrapContent>
    <WrapTexte>
      {title && (
        <StyledTitle $colorType={$colorType}>
          <TypingMessage message={title} />
        </StyledTitle>
      )}
      {date && <Date $colorType={$colorType}>{date}</Date>}

      {description && (
        <>
          <Bar $colorType={$colorType} />
          <Description>
            {description.map((text) => (
              <Text key={text}>{text}</Text>
            ))}
          </Description>
        </>
      )}
    </WrapTexte>
  </WrapContent>
);

export default ProjectHeader;