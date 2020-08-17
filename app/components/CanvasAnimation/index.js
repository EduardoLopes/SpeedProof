import React, { useEffect, useRef } from 'react';
import styles from './CanvasAnimation.module.scss';
import Argila, {
  InputSystem,
  SpringSystem,
  HashtableSystem,
  DrawSystem,
  Vector2,
  Input
} from 'argila';

import Ball from "./Ball";

let demo = null;

export default function CanvasAnimation(props) {
  const { state, onPlayClick } = props;

  const canvasElement = useRef(null);

  useEffect(() => {
    demo = new Argila({
      element: canvasElement.current,
      autoWidth: true,
      autoHeight: true,
      debug: false,
      systems: [InputSystem, SpringSystem, HashtableSystem, DrawSystem],
      systemOptions: {
        hashtable: {
          debug: false,
          tile: new Vector2(48, 48),
        },
        'hashtable-debug': {
          showCells: true,
          showCellsEntityIsIn: true,
          showQueryBox: true,
          showQueryBoxSearch: true,
        },
      },
    });

    const quant = 60;

    for (let i = 0; i < quant; i++) {

      const p = i / quant;
      const entity = new Ball({
        pos: new Vector2(demo.canvas.width / 2, demo.canvas.height / 2),
        radius: 2,
        angle: 3 + (20 * p),
        rotateSpeed: 3, //3 + (3 * p),
        orbit: 3 + (10 * p),
        speed: 0.0001 + (0.001 * (p % 2))
      });

      demo.add(entity);
    }

    const margin = 45;

    demo.events.on('before-tick', () => {


      demo.entities.forEach((entity) =>{
        entity.update(demo.canvas.width / 2, demo.canvas.height / 2);
      })

      demo.canvas.ctx.fillStyle = 'rgba(248, 67, 111, 1)';
      demo.canvas.ctx.fillRect(
        margin,
        demo.canvas.height - margin,
        demo.canvas.width - margin * 2,
        2,
      );

      demo.canvas.ctx.beginPath();
      demo.canvas.ctx.arc(
        margin,
        demo.canvas.height - margin,
        5,
        0,
        Math.PI * 2,
        false,
      );
      demo.canvas.ctx.closePath();
      demo.canvas.ctx.fill();

      demo.canvas.ctx.beginPath();
      demo.canvas.ctx.arc(
        demo.canvas.width - margin,
        demo.canvas.height - margin,
        5,
        0,
        Math.PI * 2,
        false,
      );
      demo.canvas.ctx.closePath();
      demo.canvas.ctx.fill();
    });

    return () => {
      if (demo) {
        demo.destroy(() => {});
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <canvas className={styles.canvas} ref={canvasElement} />
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
