import { Segment, Placeholder, Transition } from 'semantic-ui-react';
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import React from 'react';
import PropTypes from 'prop-types';

export default function Charts(props) {
  const {
    mode,
    data,
  } = props;

  return (
    <Segment color={mode === 'search' ? 'blue' : null}>
      <Transition.Group animation="fade down" duration={400}>
        {data.length > 0 && (
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient
                    id="colorDownload"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#6435c9" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#6435c9" stopOpacity={1} />
                  </linearGradient>
                  <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00b5ad" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#00b5ad" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Legend />
                <Area
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="download"
                  stroke="#6435c9"
                  fillOpacity={1}
                  fill="url(#colorDownload)"
                />
                <Area
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="upload"
                  stroke="#00b5ad"
                  fillOpacity={1}
                  fill="url(#colorUpload)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2185d0" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#2185d0" stopOpacity={1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <Tooltip />
                <Legend />
                <Area
                  animationEasing="ease-out"
                  type="monotone"
                  dataKey="ping"
                  stroke="#2185d0"
                  fillOpacity={1}
                  fill="url(#colorPing)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </Transition.Group>

      {data.length === 0 && (
        <Placeholder
          style={{ width: '100%', height: 300, overflow: 'hidden' }}
          fluid
        >
          <Placeholder.Image rectangular />
        </Placeholder>
      )}
    </Segment>
  );
}

Charts.propTypes = {
  mode: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Charts.defaultProps = {
  mode: 'normal',
};
