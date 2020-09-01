import React from 'react';
import PropTypes from 'prop-types';
import { ResponsiveStream } from '@nivo/stream';
import { linearGradientDef } from '@nivo/core'
import styles from './Panel.module.scss';


export default function Chart(props) {
  const {
    data,
    color,
    dataKey
  } = props;

  return (
    <div className={styles["chart-container"]}>
      <ResponsiveStream
          data={data}
          keys={[ 'data' ]}
          margin={{ bottom: 4, top: 4 }}
          // borderWidth={1}
          // borderColor={color}
          enableGridX={false}
          enableGridY={false}
          isInteractive={false}
          enableStackTooltip={false}
          offsetType="diverging"
          fillOpacity={1}
          defs={[
            linearGradientDef(`${dataKey}-gradient`, [
                { offset: 0, color: color, opacity: 0.6 },
                { offset: 100, color: color, opacity: 0.2 },
            ]),
          ]}
          fill={[
            { match: { id: 'data' }, id: `${dataKey}-gradient` },
          ]}
          animate={true}
          motionStiffness={90}
          motionDamping={15}
      />
    </div>
  );
}

// Chart.propTypes = {
//   data: PropTypes.arrayOf(PropTypes.object).isRequired,
//   dataKey: PropTypes.string.isRequired,
//   color: PropTypes.string.isRequired,
//   color2: PropTypes.string,
//   domain: PropTypes.arrayOf(PropTypes.number),
//   dataKey2: PropTypes.string,
// };

// Chart.defaultProps = {
//   color2: '#000000',
//   domain: [0, 10],
//   dataKey2: '',
// };
