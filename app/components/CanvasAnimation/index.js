import React from 'react';
import styles from './CanvasAnimation.module.scss';

export default function CanvasAnimation(props) {
  const { state, onPlayClick } = props;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.play} ${state === 'idle' ? styles.idle : ''}`}
        onClick={() => {
          if (state === 'idle') {
            onPlayClick();
          }
        }}
      >
        <i className={`material-icons ${styles.play_icon} ${styles[state]}`}>
          play_arrow
        </i>
      </div>
    </div>
  );
}
