import React from 'react';
import styles from './CanvasAnimation.scss';

export default function CanvasAnimation() {
  return (
    <div className={styles.container}>
      <div className={styles.play}>
        <i className="material-icons">play_arrow</i>
      </div>
    </div>
  );
}
