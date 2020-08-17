import { Circle } from "argila";
import random from "./random";

export default class Ball extends Circle {
  constructor(options) {
    super(options);

    super.add("draw", {
      fillStyle: "rgba(248, 67, 111, 1)",
    });

		super.add("hashtable", { queryScale: options.queryScale });

		this.angle = options.angle; // random(0, Math.PI);
		this.rotateSpeed = options.rotateSpeed; // random(6, 10);
		this.orbit = options.orbit; //random(3, 6);
		this.speed = options.speed;

	}

	update(middleX, middleY){
		// console.log(this.pos)

		this.pos.x += Math.sin(this.angle * this.rotateSpeed) * this.orbit;
		this.pos.y += Math.cos(this.angle * this.rotateSpeed) * this.orbit;

		this.pos.x += ((middleX) - this.pos.x) * 0.05;
		this.pos.y += ((middleY) - this.pos.y) * 0.05;

		this.angle += this.speed;

	}
}
