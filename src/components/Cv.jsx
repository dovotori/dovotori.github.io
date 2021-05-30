import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import * as icons from 'Assets/svg/cv';
import Chart from './Chart';

const styledIcons = Object.keys(icons).reduce((acc, key) => {
  acc[key] = styled(icons[key])`
    width: auto;
    height: 2em;
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

const StyledLink = styled(Link)`
  span {
    color: ${(p) => p.theme.text};
    &:hover {
      color: ${(p) => p.theme.primary};
    }
  }
`;

const Category = styled.h3`
  margin: 0.5em 0;
  text-transform: lowercase;
  font-weight: normal;
  color: ${(p) => p.theme.light};
  white-space: nowrap;
  display: inline-block;
  background: ${(p) => `url(${p.theme.stripes}) repeat`};
  padding: 0.1em 0.5em;
  letter-spacing: 0.2em;
`;

const Line = styled.div`
  margin: ${(p) => `${p.noMarginTop ? 0 : '0.5em'} 0 ${p.noMarginBottom ? 0 : '0.5em'}`};
`;

const BlocJob = styled.div`
  margin: 0 0 2em 0;
`;

const Date = styled.span`
  margin: 0;
  color: ${(p) => p.theme.primary};
  ${(p) => p.theme.monospace}
  overflow-wrap: break-word;
  ${(p) => !p.isTouch && 'text-align: right; width: 100%; '};
`;

const WrapSvg = styled.div`
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  font-weight: bold;
  font-size: 1.2;
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
  ${(p) => !p.isTouch && 'position: relative; overflow: hidden; display: flex;'};
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.isTouch && '0 0 0 20%'};
`;

const FloatLeft = styled.div`
  ${(p) => !p.isTouch && 'width: 18%; margin: 0 2% 0 0; text-align: right; display: flex;'};
`;

const FloatRight = styled.div`
  ${(p) => !p.isTouch && 'width: 80%;'};
`;

const TwoCol = styled.div`
  ${(p) => !p.isTouch && 'width: 50%;'};
`;

const TwoColFloat = styled(TwoCol)`
  ${(p) => !p.isTouch && 'float: left;'};
`;

const Cv = ({ className, formation, isTouchDevice, chart, jobs, skills, hobbies }) => {
  const renderDate = useCallback((start, end) => {
    if (start === 0) {
      return 'now';
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
          <MarginLeft isTouch={isTouchDevice}>
            <Category>{formation.text}</Category>
          </MarginLeft>
          {formation.items.map((item) => (
            <Line key={item.text}>
              <Clear isTouch={isTouchDevice}>
                <FloatLeft isTouch={isTouchDevice}>
                  <Date isTouch={isTouchDevice}>{item.date}</Date>
                </FloatLeft>
                <FloatRight isTouch={isTouchDevice}>
                  <Text>{item.text}</Text>
                </FloatRight>
              </Clear>
            </Line>
          ))}
        </Bloc>
      ) : null,
    [formation, isTouchDevice]
  );

  const renderJobs = useCallback(
    () =>
      jobs.items.length > 0 ? (
        <Bloc>
          <MarginLeft isTouch={isTouchDevice}>
            <Category>{jobs.text}</Category>
          </MarginLeft>
          {jobs.items.map((item) => {
            const { startDate, endDate, text, tasks } = item;
            return (
              <BlocJob key={item.text}>
                <Line noMarginBottom>
                  <Clear isTouch={isTouchDevice}>
                    <FloatLeft isTouch={isTouchDevice}>
                      <Date isTouch={isTouchDevice}>{renderDate(startDate, endDate)}</Date>
                    </FloatLeft>
                    <FloatRight isTouch={isTouchDevice}>
                      <Text>{text}</Text>
                    </FloatRight>
                  </Clear>
                </Line>
                <MarginLeft isTouch={isTouchDevice}>
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
    [jobs, renderDate, isTouchDevice]
  );

  const renderSkills = useCallback(
    () =>
      skills.items.length > 0 ? (
        <Bloc>
          <MarginLeft isTouch={isTouchDevice}>
            <Category>{skills.text}</Category>
          </MarginLeft>
          {chart && !isTouchDevice && <Chart data={chart} />}
          {(isTouchDevice || !chart) &&
            skills.items.map((item) => (
              <Line key={item.text}>
                <Clear isTouch={isTouchDevice}>
                  <FloatLeft isTouch={isTouchDevice}>
                    <Date isTouch={isTouchDevice}>{item.text}</Date>
                  </FloatLeft>
                  <FloatRight isTouch={isTouchDevice}>
                    {item.items.map((subitem) => {
                      const Svg = subitem.picto ? styledIcons[subitem.picto] : null;
                      return (
                        <TwoColFloat isTouch={isTouchDevice} key={subitem.text}>
                          <Line noMarginTop>
                            {Svg ? (
                              <WrapSvg>
                                <Svg />
                                <Text>{subitem.text}</Text>
                              </WrapSvg>
                            ) : (
                              <Text>{subitem.text}</Text>
                            )}

                            <Level>{subitem.level}</Level>
                          </Line>
                        </TwoColFloat>
                      );
                    })}
                  </FloatRight>
                </Clear>
              </Line>
            ))}
        </Bloc>
      ) : null,
    [skills, isTouchDevice]
  );

  const renderHobbies = useCallback(
    () =>
      hobbies.items.length > 0 ? (
        <Bloc>
          <MarginLeft isTouch={isTouchDevice}>
            <Category>{hobbies.text}</Category>
            {hobbies.items.map((item) => {
              const { text, about } = item;
              return (
                <TwoCol noMarginTop isTouch={isTouchDevice} key={item.text}>
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
    [hobbies, isTouchDevice]
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
