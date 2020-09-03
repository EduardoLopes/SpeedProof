import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { AreaStack } from '@vx/shape';
import { SeriesPoint } from '@vx/shape/lib/types';
import { LinearGradient } from '@vx/gradient';
import browserUsage, { BrowserUsage } from '@vx/mock-data/lib/mocks/browserUsage';
import { scaleTime, scaleLinear } from '@vx/scale';
import { timeParse } from 'd3-time-format';

import styles from './Panel.module.scss';

// const data = browserUsage;
// console.log(browserUsage);
// const keys = Object.keys(data[0]).filter(k => k !== 'date');
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

  const width = 300;
  const height = 28;
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const events = false;

  // bounds
  const yMax = height - margin.top - margin.bottom;
  const xMax = width - margin.left - margin.right;

  // scales
  const xScale = scaleTime({
    range: [0, xMax],
    domain: [Math.min(...data.map((d)=> d.date)), Math.max(...data.map((d)=> d.date))],
  });

  const yScale = scaleLinear({
    range: [yMax, 0],
    domain: [0, Math.max(...data.map((d)=> d.data))],
  });

  let keys = [];

  if(data.length > 0){
    keys = Object.keys(data[0]).filter(k => k !== 'date');
  }

  return (
    <div className={styles["chart-container"]} style={{width: `${progress}%`}}>
    {data && (<svg width={width} height={height}>
        <LinearGradient id={`gradient-${dataKey}`} from={color} to={color} toOpacity={0.5} />

        <AreaStack
          top={margin.top}
          left={margin.left}
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
                stroke="transparent"
                fill={`url(#gradient-${dataKey})`}
                onClick={() => {
                  if (events) alert(`${stack.key}`);
                }}
              />
            )})
          }
        </AreaStack>
      </svg>)}
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  color: PropTypes.string.isRequired,
  dataKey: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired
};
