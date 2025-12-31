import { ReactComponent as Skills } from "Assets/svg/chimie2.svg";
import * as icons from "Assets/svg/cv";
import { ReactComponent as Diploma } from "Assets/svg/diploma3.svg";
import { ReactComponent as Manette } from "Assets/svg/manette.svg";
import { ReactComponent as Tie } from "Assets/svg/tie3.svg";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import AnimBar from "./AnimBar";
import Chart from "./Chart";

const StyledChart = styled(Chart)`
  position: relative;
  z-index: 2;
`;

const styledIcons = Object.keys(icons).reduce((acc, key) => {
  acc[key] = styled(icons[key])`
    display: block;
    width: auto;
    height: 2em;
    max-width: 40px;
    filter: grayscale(100%);
    transition: filter 300ms ease-out;
    margin-right: 0.4em;

    &:hover {
      filter: none;
    }
  `;
  return acc;
}, {});

const Bloc = styled.div`
  margin-top: 3em;
`;

const commonIcon = css`
  display: block;
  margin: 0 auto;
  padding: 0 2em;
  height: 4em;
  background: ${(p) => p.theme.background};
  position: relative;
  z-index: 1;
`;

const ManetteIcon = styled(Manette)`
  ${commonIcon}
`;

const SkillsIcon = styled(Skills)`
  ${commonIcon}
`;

const TieIcon = styled(Tie)`
  ${commonIcon}
`;

const DiplomaIcon = styled(Diploma)`
  ${commonIcon}
`;

const StyledLink = styled(Link)`
  span {
    color: ${(p) => p.theme.text};
    &:hover {
      color: ${(p) => p.theme.primary};
    }
  }
`;

const DateComp = styled.span.attrs({ className: "numbers" })`
  color: ${(p) => p.theme.primary};
  ${(p) => p.theme.monospace}
  overflow-wrap: break-word;
  ${(p) => !p.$isTouch && "text-align: right; width: 100%; "};
  font-size: 0.8em;
  line-height: 2;
  z-index: 0;
`;

const StyledAnimBar = styled(AnimBar)`
  display: block;
  background: ${(p) => p.theme.primary};
  position: absolute;
  top: calc(50% - 1px);
  left: 0;
  z-index: 1;
`;

const Category = styled.h3`
  margin: 4em 0 2em;
  text-transform: lowercase;
  font-weight: normal;
  color: ${(p) => p.theme.light};
  white-space: nowrap;
  text-align: center;
  position: relative;
`;

const CategoryText = styled.span`
  background: ${(p) => p.theme.background};
  letter-spacing: 0.2em;
  position: absolute;
  top: 50%;
  left: 0;
  display: block;
  z-index: 2;
  padding: 0.2em 1em 0.2em 0;
`;

const Line = styled.div`
  margin: ${(p) => `${p.$noMarginTop ? 0 : "0.5em"} 0 ${p.$noMarginBottom ? 0 : "0.5em"}`};
`;

const BlocJob = styled.div`
  margin: 0 0 2em 0;
`;

const WrapSvg = styled.div`
  display: flex;
  align-items: center;
`;

const ColSvg = styled.span`
  ${(p) =>
    p.$isTouch &&
    `
      display: inline-block;
      width: 50px;
  `};
`;

const Text = styled.span`
  font-weight: bold;
  color: ${(p) => p.theme.light};
`;

const SubText = styled.span`
  color: ${(p) => p.theme.light};
  font-style: italic;
`;

const Level = styled.span`
  color: ${(p) => p.theme.light};
  margin: 0 1em;
`;

const Clear = styled.div`
  ${(p) => !p.$isTouch && "position: relative; overflow: hidden; display: flex;"};
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.$isTouch && "0 0 0 20%"};
`;

const FloatLeft = styled.div`
  ${(p) =>
    !p.$isTouch
      ? "width: 18%; margin: 0 2% 0 0; text-align: right; display: flex;"
      : "margin: 0 0 2% 0;"};
`;

const FloatRight = styled.div`
  ${(p) => !p.$isTouch && "width: 80%;"};
`;

const FloatRightTwoCol = styled.div`
  ${(p) =>
    p.$isTouch &&
    `
    @media (min-width: 400px) {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 0% 2%;
      margin-bottom: 4%;
    }
  `};
`;

const TwoCol = styled.div`
  ${(p) => !p.$isTouch && "width: 50%;"};
`;

const TwoColFloat = styled(TwoCol)`
  margin: ${(p) => (p.$noMargin ? 0 : 0.5)}em 0;
`;

const Cv = ({ className, formation, isTouchDevice, jobs, skills, hobbies }) => {
  const renderDate = useCallback((start, end) => {
    if (start === 0) {
      return "now";
    }
    if (start !== end) {
      return `${end} ${start}`;
    }
    return start;
  }, []);

  const renderFormation = useCallback(
    () =>
      formation.items.length > 0 ? (
        <Bloc>
          <MarginLeft $isTouch={isTouchDevice}>
            <Category>
              <StyledAnimBar />
              <DiplomaIcon />
              <CategoryText>{formation.text}</CategoryText>
            </Category>
          </MarginLeft>
          {formation.items.map((item) => (
            <BlocJob key={item.text}>
              <Line>
                <Clear $isTouch={isTouchDevice}>
                  <FloatLeft $isTouch={isTouchDevice}>
                    <DateComp $isTouch={isTouchDevice}>{item.date}</DateComp>
                  </FloatLeft>
                  <FloatRight $isTouch={isTouchDevice}>
                    <Text>{item.text}</Text>
                  </FloatRight>
                </Clear>
              </Line>
            </BlocJob>
          ))}
        </Bloc>
      ) : null,
    [formation, isTouchDevice],
  );

  const renderJobs = useCallback(
    () =>
      jobs.items.length > 0 ? (
        <Bloc>
          <MarginLeft $isTouch={isTouchDevice}>
            <Category>
              <StyledAnimBar />
              <TieIcon />
              <CategoryText>{jobs.text}</CategoryText>
            </Category>
          </MarginLeft>
          {jobs.items.map((item) => {
            const { startDate, endDate, text, tasks } = item;
            return (
              <BlocJob key={item.text}>
                <Line $noMarginBottom>
                  <Clear $isTouch={isTouchDevice}>
                    <FloatLeft $isTouch={isTouchDevice}>
                      <DateComp $isTouch={isTouchDevice}>
                        {renderDate(startDate, endDate)}
                      </DateComp>
                    </FloatLeft>
                    <FloatRight $isTouch={isTouchDevice}>
                      <Text>{text}</Text>
                    </FloatRight>
                  </Clear>
                </Line>
                <MarginLeft $isTouch={isTouchDevice}>
                  {tasks.map((task) => (
                    <Line key={task}>
                      <SubText>{task}</SubText>
                    </Line>
                  ))}
                </MarginLeft>
              </BlocJob>
            );
          })}
        </Bloc>
      ) : null,
    [jobs, renderDate, isTouchDevice],
  );

  const renderSkills = useCallback(
    () =>
      skills.children.length > 0 ? (
        <Bloc>
          <MarginLeft $isTouch={isTouchDevice}>
            <Category>
              <StyledAnimBar />
              <SkillsIcon />
              <CategoryText>{skills.label}</CategoryText>
            </Category>
          </MarginLeft>
          {!isTouchDevice && <StyledChart data={skills} />}
          {isTouchDevice &&
            skills.children.map((item) => (
              <BlocJob key={item.text}>
                <Line>
                  <Clear $isTouch={isTouchDevice}>
                    <FloatLeft $isTouch={isTouchDevice}>
                      <DateComp $isTouch={isTouchDevice}>{item.label}</DateComp>
                    </FloatLeft>
                    <FloatRightTwoCol $isTouch={isTouchDevice}>
                      {renderItem(item, isTouchDevice)}
                    </FloatRightTwoCol>
                  </Clear>
                </Line>
              </BlocJob>
            ))}
        </Bloc>
      ) : null,
    [skills, isTouchDevice],
  );

  const renderHobbies = useCallback(
    () =>
      hobbies.items.length > 0 ? (
        <Bloc>
          <MarginLeft $isTouch={isTouchDevice}>
            <Category>
              <StyledAnimBar />
              <ManetteIcon />
              <CategoryText>{hobbies.text}</CategoryText>
            </Category>
            {hobbies.items.map((item) => {
              const { text, about } = item;
              return (
                <TwoCol $isTouch={isTouchDevice} key={item.text}>
                  <Line>
                    {about ? (
                      <StyledLink to={about}>
                        <Text>{text}</Text>
                      </StyledLink>
                    ) : (
                      <Text>{text}</Text>
                    )}
                  </Line>
                </TwoCol>
              );
            })}
          </MarginLeft>
        </Bloc>
      ) : null,
    [hobbies, isTouchDevice],
  );

  return (
    <div className={className}>
      {renderSkills()}
      {renderJobs()}
      {renderFormation()}
      {renderHobbies()}
    </div>
  );
};

export default Cv;

const SkillLine = ({ item, isTouchDevice }) => {
  const Svg = item.id ? styledIcons[item.id] : null;
  if (!Svg && item.children) return null;
  return (
    <TwoColFloat $noMargin={!Svg}>
      <Line noMarginTop>
        {Svg ? (
          <WrapSvg>
            <ColSvg $isTouch={isTouchDevice}>
              <Svg />
            </ColSvg>
            <Text>{item.label}</Text>
          </WrapSvg>
        ) : (
          <Text>{item.label}</Text>
        )}
        {item.level ? <Level>{item.level}</Level> : null}
      </Line>
    </TwoColFloat>
  );
};

const renderItem = (item, isTouchDevice) => {
  return (
    <>
      <SkillLine item={item} isTouchDevice={isTouchDevice} />
      {item.children.map((subitem) => renderItem(subitem, isTouchDevice))}
    </>
  );
};
