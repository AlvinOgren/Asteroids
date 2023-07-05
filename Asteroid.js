import { Mass } from "./Mass.js";
import { drawAsteroid } from "./drawing.js";

export class Asteroid extends Mass {
  constructor(mass, x, y, xSpeed, ySpeed, rotationSpeed) {
    let density = 1; // kg per square pixel
    let radius = Math.sqrt(mass / density / Math.PI);
    super(mass, radius, x, y, 0, xSpeed, ySpeed, rotationSpeed);
    this.circumference = 2 * Math.PI * this.radius;
    this.segments = Math.ceil(this.circumference / 15);
    this.segments = Math.min(25, Math.max(5, this.segments));
    this.noise = 0.2;
    this.shape = [];

    for (let i = 0; i < this.segments; i++) {
      this.shape.push(2 * (Math.random() - 0.5));
    }
  }

  draw(context, guide) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    drawAsteroid(context, this.radius, this.shape, {
      noise: this.noise,
      guide: guide,
    });

    context.restore();
  }

  child(mass) {
    return new Asteroid(
      mass,
      this.x,
      this.y,
      this.xSpeed,
      this.ySpeed,
      this.rotationSpeed
    );
  }
}
