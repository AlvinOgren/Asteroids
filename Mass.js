export class Mass {
  constructor(mass, radius, x, y, angle, xSpeed, ySpeed, rotationSpeed) {
    this.mass = mass || 1;
    this.radius = radius;
    this.x = x || 0;
    this.y = y || 0;
    this.angle = angle || 0;
    this.xSpeed = xSpeed || 0;
    this.ySpeed = ySpeed || 0;
    this.rotationSpeed = rotationSpeed || 0;
  }

  update(elapsed, context) {
    this.x += this.xSpeed * elapsed;
    this.y += this.ySpeed * elapsed;
    this.angle += this.rotationSpeed * elapsed;
    this.angle %= 2 * Math.PI;
    if (this.x - this.radius > context.canvas.width) {
      this.x = -this.radius;
    }
    if (this.x + this.radius < 0) {
      this.x = context.canvas.width + this.radius;
    }
    if (this.y - this.radius > context.canvas.height) {
      this.y = -this.radius;
    }
    if (this.y + this.radius < 0) {
      this.y = context.canvas.height + this.radius;
    }
  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.angle);
    context.beginPath();
    context.arc(0, 0, this.radius, 0, 2 * Math.PI);
    context.lineTo(0, 0);
    context.strokeStyle = "#FFFFFF";
    context.stroke();
    context.restore();
  }

  push(angle, force, elapsed) {
    this.xSpeed += (elapsed * (Math.cos(angle) * force)) / this.mass;
    this.ySpeed += (elapsed * (Math.sin(angle) * force)) / this.mass;
  }

  twist(force, elapsed) {
    this.rotationSpeed += (elapsed * force) / this.mass;
  }

  speed() {
    return Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2));
  }

  movement_angle() {
    return Math.atan2(this.ySpeed, this.xSpeed);
  }
}
