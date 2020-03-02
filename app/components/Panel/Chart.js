import React from 'react';
import PropTypes from 'prop-types';
import {
  AreaChart,
  Area,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function Chart(props) {
  const {
    data,
    color,
    color2,
    dataKey,
    dataKey2,
    domain,
  } = props;

  return (

    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`id-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.6} />
            <stop offset="95%" stopColor={color} stopOpacity={1} />
          </linearGradient>
          {color2 && (
            <linearGradient
              id={`id-${color2}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color2} stopOpacity={0.6} />
              <stop offset="95%" stopColor={color2} stopOpacity={1} />
            </linearGradient>
          )}
        </defs>
        {domain && <YAxis domain={domain} hide />}
        <Tooltip />
        <Area
          isAnimationActive={false}
          baseLine={80}
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          fillOpacity={1}
          fill={`url(#id-${color})`}
        />
        {color2 && (
          <Area
            isAnimationActive={false}
            baseLine={80}
            type="monotone"
            dataKey={dataKey2}
            stroke={color2}
            fillOpacity={1}
            fill={`url(#id-${color2})`}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  color2: PropTypes.string,
  domain: PropTypes.arrayOf(PropTypes.number),
  dataKey2: PropTypes.string,
};

Chart.defaultProps = {
  color2: '#000000',
  domain: [0, 10],
  dataKey2: '',
};
