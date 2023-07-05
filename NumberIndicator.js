export class NumberIndicator {
  constructor(label, x, y, options) {
    options = options || {};
    this.label = label + ": ";
    this.x = x;
    this.y = y;
    this.digits = options.digits || 0;
    this.pt = options.pt || 10;
    this.align = options.align || "end";
  }

  draw(context, value) {
    context.save();
    context.fillStyle = "white";
    context.font = this.pt + "pt Arial";
    context.textAlign = this.align;
    context.fillText(
      this.label + value.toFixed(this.digits),
      this.x,
      this.y + this.pt - 1
    );
    context.restore();
  }
}
