export class Message {
  constructor(x, y, options) {
    options = options || {};
    this.x = x;
    this.y = y;
    this.main_pt = options.main_pt || 28;
    this.sub_pt = options.sub_pt || 18;
    this.fill = options.fill || "white";
    this.textAlign = options.align || "center";
  }

  draw(context, main, sub) {
    context.save();
    context.fillStyle = this.fill;
    context.textAlign = this.textAlign;
    context.font = this.main_pt + "pt Arial";
    context.fillText(main, this.x, this.y);
    context.font = this.sub_pt + "pt Arial";
    context.fillText(sub, this.x, this.y + this.main_pt);
    context.restore();
  }
}
