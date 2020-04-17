import React, { useCallback } from 'react';
import styled from 'styled-components';

import * as icons from '../../public/svg/cv';
import Chart from './Chart';

const styledIcons = Object.keys(icons).reduce((acc, key) => ({
  ...acc, [key]: styled(icons[key])`
  width: 3em;
  height: auto;
  filter: grayscale(100%);
  transition: filter 300ms ease-out;

  &:hover {
    filter: none;
  }
`
}), {});

const Bloc = styled.div`
  margin-top: 3em;
`;

const Category = styled.h3`
  margin: 0.5em 0;
  text-transform: lowercase;
  font-weight: normal;
  font-size: 0.8em;
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
  margin: 0 0 1em 0;
`;

const Date = styled.div`
  margin: ${(p) => (!p.isTouch ? '0' : '1em 0 0.5em 0')};
  color: ${(p) => p.theme.primary};
  ${(p) => p.theme.monospace}
  overflow-wrap: break-word;
  ${(p) => !p.isTouch && 'text-align: right; width: 100%; margin-top: 0.3em;'};
  font-size: 12px;
`;

const Text = styled.span`
  color: ${(p) => p.theme.light};
`;

const SubText = styled.span`
  color: ${(p) => p.theme.midl};
  font-size: 0.9em;
  font-style: italic;
`;

const Level = styled.span`
  color: ${(p) => p.theme.midl};
  font-size: 0.9em;
  margin: 0 1em;
`;

const Clear = styled.div`
  ${(p) => !p.isTouch && 'position: relative; overflow: hidden; display: flex;'};
`;

const MarginLeft = styled.div`
  margin: ${(p) => !p.isTouch && '0 0 0 20%'};
`;

const FloatLeft = styled.div`
  ${(p) => !p.isTouch
    && 'width: 18%; margin: 0 2% 0 0; text-align: right; display: flex;'};
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

const Cv = ({
  formation, isTouchDevice, chart, jobs, skills, hobbies,
}) => {
  const renderDate = useCallback((start, end) => {
    if (start === 0) {
      return 'now';
    } if (start !== end) {
      return `${end} ${start}`;
    }
    return start;
  }, []);

  const renderFormation = useCallback(() => (formation.items.length > 0 ? (
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
  ) : null), []);

  const renderJobs = useCallback(() => (jobs.items.length > 0 ? (
    <Bloc>
      <MarginLeft isTouch={isTouchDevice}>
        <Category>{jobs.text}</Category>
      </MarginLeft>
      {jobs.items.map((item) => (
        <BlocJob key={item.text}>
          <Line noMarginBottom>
            <Clear isTouch={isTouchDevice}>
              <FloatLeft isTouch={isTouchDevice}>
                <Date isTouch={isTouchDevice}>
                  {renderDate(item.start_date, item.end_date)}
                </Date>
              </FloatLeft>
              <FloatRight isTouch={isTouchDevice}>
                <Text>{item.text}</Text>
              </FloatRight>
            </Clear>
          </Line>
          <MarginLeft isTouch={isTouchDevice}>
            {item.tasks.map((task) => (
              <Line key={task}>
                <SubText>{task}</SubText>
              </Line>
            ))}
          </MarginLeft>
        </BlocJob>
      ))}
    </Bloc>
  ) : null), []);

  const renderSkills = useCallback(() => (skills.items.length > 0 ? (
    <Bloc>
      <MarginLeft isTouch={isTouchDevice}>
        <Category>{skills.text}</Category>
      </MarginLeft>
      {skills.items.map((item) => (
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
                      {Svg && <Svg />}
                      <Text>{subitem.text}</Text>
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
  ) : null), []);

  const renderHobbies = useCallback(() => (hobbies.items.length > 0 ? (
    <Bloc>
      <MarginLeft isTouch={isTouchDevice}>
        <Category>{hobbies.text}</Category>
        {hobbies.items.map((item) => (
          <TwoCol noMarginTop isTouch={isTouchDevice} key={item.text}>
            <Line>
              <Text>{item.text}</Text>
            </Line>
          </TwoCol>
        ))}
      </MarginLeft>
    </Bloc>
  ) : null), []);

  return (
    <>
      {chart && <Chart data={chart} />}
      {renderJobs()}
      {renderFormation()}
      {renderSkills()}
      {renderHobbies()}
    </>
  );
};

export default Cv;
