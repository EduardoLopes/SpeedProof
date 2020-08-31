import { Circle, Common } from "argila";
import random from "./random";

export default class Ball extends Circle {
  constructor(options) {
		super(options);

		this.rgb = [248, 67, 111];

    super.add("draw", {
      fillStyle: `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`,
		});

		super.add("hashtable", { queryScale: options.queryScale });


		this.angle = options.angle; // random(0, Math.PI);
		this.rotateSpeed = options.rotateSpeed; // random(6, 10);
		this.orbit = options.orbit; //random(3, 6);
		this.speed = options.speed;
		this.state = "idle";

		this.previewsPos = {x: 0, y: 0};

		this.options = options;

	}

	setState(state){
		this.state = state;
	}

	idle(x, y){

		this.orbit = this.options.orbit;

		const draw = this.components.get("draw");

		this.rgb[0] += (48 - this.rgb[0]) * 0.05;
		this.rgb[1] += (48 - this.rgb[1]) * 0.05;
		this.rgb[2] += (48 - this.rgb[2]) * 0.05;

		draw.fillStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`;

		this.pos.x += Math.sin(this.angle * this.rotateSpeed) * this.orbit;
		this.pos.y += Math.cos(this.angle * this.rotateSpeed) * this.orbit;

		this.pos.x += ((x) - this.pos.x) * 0.05;
		this.pos.y += ((y) - this.pos.y) * 0.05;

		this.angle += this.speed;
	}

	waiting(x, y){

		this.rgb[0] += (248 - this.rgb[0]) * 0.05;
		this.rgb[1] += (67 - this.rgb[1]) * 0.05;
		this.rgb[2] += (111 - this.rgb[2]) * 0.05;

		this.orbit += (this.speed * 5);

		this.pos.x += Math.sin(this.angle * this.rotateSpeed) * this.orbit;
		this.pos.y += Math.cos(this.angle * this.rotateSpeed) * this.orbit;

		this.pos.x += ((x) - this.pos.x) * 0.05;
		this.pos.y += ((y) - this.pos.y) * 0.05;

		this.angle += (this.speed * 10);
	}

	download(x, y){

		this.rgb[0] += (39 - this.rgb[0]) * 0.05;
		this.rgb[1] += (174 - this.rgb[1]) * 0.05;
		this.rgb[2] += (96 - this.rgb[2]) * 0.05;

		this.pos.x += Math.sin(this.angle * this.rotateSpeed) * (this.orbit);
		this.pos.y += Math.cos(this.angle * this.rotateSpeed) * (this.orbit);

		this.orbit -= (this.speed * 60);

		this.orbit = Math.max(this.orbit, 0);

		this.pos.x += ((x) - this.pos.x) * 0.1;
		this.pos.y += ((y) - this.pos.y) * 0.1;

		this.angle += (this.speed * 10);

		const argila = this.components.get("draw").argila;

		if( Math.abs(this.pos.x - (argila.canvas.width / 2)) < 4 && Math.abs(this.pos.y - (argila.canvas.height / 2)) < 4){
			this.orbit = 40;
		}
	}

	upload(x, y){

		this.rgb[0] += (47 - this.rgb[0]) * 0.05;
		this.rgb[1] += (128 - this.rgb[1]) * 0.05;
		this.rgb[2] += (237 - this.rgb[2]) * 0.05;

		this.pos.x += Math.sin(this.angle * this.rotateSpeed) * (this.orbit);
		this.pos.y += Math.cos(this.angle * this.rotateSpeed) * (this.orbit);

		this.orbit += (this.speed * 120);

		this.pos.x += ((x) - this.pos.x) * 0.05;
		this.pos.y += ((y) - this.pos.y) * 0.05;

		this.angle += (this.speed * 1);

		const argila = this.components.get("draw").argila;

		if(this.pos.x > argila.canvas.width || this.pos.y > argila.canvas.height || this.pos.y < 0 || this.pos.x < 0){
			this.pos.y = argila.canvas.height / 2;
			this.orbit = 0;
			this.pos.x = argila.canvas.width / 2;
		}
	}

	update(middleX, middleY){

		// this.upload(middleX, middleY);

		const draw = this.components.get("draw");
		const ctx = draw.argila.canvas.ctx;
		draw.fillStyle = `rgba(${this.rgb[0]}, ${this.rgb[1]}, ${this.rgb[2]}, 1)`;

		switch (this.state) {
			case "idle":
				this.idle(middleX, middleY);
				break;

			case "result":
				this.idle(middleX, middleY);
				break;

			case "waiting":
				this.waiting(middleX, middleY);
				break;

			case "ping":
				this.waiting(middleX, middleY);
				break;

			case "download":
				this.download(middleX, middleY);
				break;

			case "upload":
				this.upload(middleX, middleY);
				break;

			default:
				break;
		}

		if(Common.distance(this.pos.x, this.pos.y, this.previewsPos.x, this.previewsPos.y) <= 100){
			ctx.beginPath();
			ctx.moveTo(this.pos.x, this.pos.y);
			ctx.lineTo(this.previewsPos.x, this.previewsPos.y);
			ctx.strokeStyle = draw.fillStyle;
			ctx.stroke();
			ctx.closePath();
		}

		this.previewsPos.x = this.pos.x;
		this.previewsPos.y = this.pos.y;

	}
}
