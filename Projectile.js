import { Mass } from "./Mass.js";
import { drawProjectile } from "./drawing.js";

export class Projectile extends Mass {
  constructor(mass, lifetime, x, y, xSpeed, ySpeed, rotationSpeed) {
    let density = 0.001; // low density means we can see very light projectiles
    let radius = Math.sqrt(mass / density / Math.PI);
    super(mass, radius, x, y, 0, xSpeed, ySpeed, rotationSpeed);
    this.lifetime = lifetime;
    this.life = 1.0;
  }

  update(elapsed, context) {
    this.life -= elapsed / this.lifetime;
    Mass.prototype.update.apply(this, arguments);
  }

  draw(context, guide) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    drawProjectile(context, this.radius, this.life, guide);
    context.restore();
  }
}
