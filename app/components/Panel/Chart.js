import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveStream } from '@nivo/stream';
import { linearGradientDef } from '@nivo/core'
import styles from './Panel.module.scss';


export default function Chart(props) {
  const {
    data,
    color,
    dataKey,
    progress
  } = props;

  let keys = ['data'];

  if(data.length > 0){
    keys = Object.keys(data[0]);
  }

  return (
    <div className={styles["chart-container"]} style={{width: `${progress}%`}}>
      <ResponsiveStream
          data={data}
          keys={keys}
          margin={{ bottom: 2, top: 100 }}
          // borderWidth={1}
          // borderColor={color}
          axisTop={null}
          yScale={{ type: 'point', min: 'auto', max: 1163, stacked: true, reverse: false }}
          axisBottom={null}
          axisLeft={null}
          axisRight={null}
          tooltipFormat={(value) => value.value.toFixed(2)}
          enableGridX={false}
          enableGridY={false}
          isInteractive={false}
          enableStackTooltip={false}
          offsetType="diverging"
          fillOpacity={1}
          defs={[
            linearGradientDef(`${dataKey}-gradient`, [
                { offset: 0, color: color, opacity: 0.6 },
                { offset: 100, color: color, opacity: 1 },
            ]),
            linearGradientDef(`${dataKey}-gradient2`, [
              { offset: 0, color: color, opacity: 0.2 },
              { offset: 100, color: color, opacity: 0.8 },
            ]),
          ]}
          fill={[
            { match: { id: 'data' }, id: `${dataKey}-gradient` },
            { match: { id: 'data2' }, id: `${dataKey}-gradient2` },
          ]}
          animate={true}
          motionStiffness={300}
          motionDamping={21}
      />
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKey: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  progress: PropTypes.number.isRequired
};
