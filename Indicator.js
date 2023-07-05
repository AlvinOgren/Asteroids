export class Indicator {
  constructor(label, x, y, width, height) {
    this.label = label + ": ";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(context, max, level) {
    context.save();
    context.strokeStyle = "white";
    context.fillStyle = "white";
    context.font = this.height + "pt Arial";
    let offset = context.measureText(this.label).width;
    context.fillText(this.label, this.x, this.y + this.height - 1);
    context.beginPath();
    context.rect(offset + this.x, this.y, this.width, this.height);
    context.stroke();
    context.beginPath();
    context.rect(
      offset + this.x,
      this.y,
      this.width * (max / level),
      this.height
    );
    context.fill();
    context.restore();
  }
}
