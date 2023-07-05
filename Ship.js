import { Mass } from "./Mass.js";
import { Projectile } from "./Projectile.js";
import { drawShip } from "./drawing.js";

export class Ship extends Mass {
  constructor(mass, radius, x, y, power, weaponPower) {
    super(mass, radius, x, y, 1.5 * Math.PI);
    this.thrusterPower = power;
    this.steeringPower = this.thrusterPower / 20;
    this.rightThruster = false;
    this.leftThruster = false;
    this.thrusterOn = false;
    this.retroOn = false;
    this.weaponPower = weaponPower;
    this.loaded = false;
    this.weaponReloadTime = 0.25; // seconds
    this.timeUntilReloaded = this.weaponReloadTime;
    this.compromised = false;
    this.maxHealth = 2.0;
    this.health = this.maxHealth;
  }

  draw(context, guide) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    if (guide && this.compromised) {
      context.save();
      context.fillStyle = "red";
      context.beginPath();
      context.arc(0, 0, this.radius, 0, 2 * Math.PI);
      context.fill();
      context.restore();
    }
    drawShip(context, this.radius, {
      guide: guide,
      thruster: this.thrusterOn,
    });
    context.restore();
  }

  update(elapsed, context) {
    this.push(
      this.angle,
      (this.thrusterOn - this.retroOn) * this.thrusterPower,
      elapsed
    );
    this.twist(
      (this.rightThruster - this.leftThruster) * this.steeringPower,
      elapsed
    );
    // reload as necessary
    this.loaded = this.timeUntilReloaded === 0;
    if (!this.loaded) {
      this.timeUntilReloaded -= Math.min(elapsed, this.timeUntilReloaded);
    }
    if (this.compromised) {
      this.health -= Math.min(elapsed, this.health);
    }
    Mass.prototype.update.apply(this, arguments);
  }

  projectile() {
    let p = new Projectile(
      0.025,
      2,
      this.x + Math.cos(this.angle) * this.radius,
      this.y + Math.sin(this.angle) * this.radius,
      this.xSpeed,
      this.ySpeed,
      this.rotationSpeed
    );
    p.push(this.angle, this.weaponPower, 0.015);
    this.push(this.angle + Math.PI, this.weaponPower, 0.015);
    this.timeUntilReloaded = this.weaponReloadTime;
    return p;
  }
}
