import React from 'react';
import PropTypes from 'prop-types';

import { AreaStack } from '@vx/shape';
import { LinearGradient } from '@vx/gradient';
import { scaleTime, scaleLinear } from '@vx/scale';
import { timeParse } from 'd3-time-format';
import { ScaleSVG } from '@vx/responsive';

import styles from './Panel.module.scss';

const parseDate = timeParse('%Y %b %d');
export const background = '#f38181';

const getDate = (d) => (parseDate(d.date)).valueOf();
const getY0 = (d) => d[0];
const getY1 = (d) => d[1];

export default function Chart(props) {
  const {
    color,
    data,
    dataKey,
    progress
  } = props;

  const width = 500;
  const height = 28;

  // scales
  const xScale = scaleTime({
    range: [0, width],
    domain: [Math.min(...data.map((d)=> d.date)), Math.max(...data.map((d)=> d.date))],
  });

  const yScale = scaleLinear({
    range: [height, 0],
    domain: [0, Math.max(...data.map((d)=> d.data))],
  });

  let keys = [];

  if(data.length > 0){
    keys = Object.keys(data[0]).filter(k => k !== 'date');
  }

  return (
    <div className={styles["chart-container"]} style={{width: `${progress}%`}}>
    {data && (<ScaleSVG width={width} height={height} preserveAspectRatio="none">
        <LinearGradient id={`gradient-${dataKey}`} from={color} to={color} fromOpacity={0.5} />

        <AreaStack
          top={0}
          left={0}
          keys={keys}
          data={data}
          x={d => {
            return xScale(d.data.date)
          }}
          y0={d => yScale(getY0(d))}
          y1={d => yScale(getY1(d))}
        >
          {({ stacks, path }) =>
            stacks.map(stack => {
              return(
              <path
                key={`stack-${stack.key}`}
                d={path(stack) || ''}
                stroke={color}
                fill={`url(#gradient-${dataKey})`}
              />
            )})
          }
        </AreaStack>
      </ScaleSVG>)}
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  color: PropTypes.string.isRequired,
  dataKey: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired
};
