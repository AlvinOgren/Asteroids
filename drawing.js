export function drawGrid(context, minor, major, stroke, fill) {
  minor = minor || 10;
  major = major || minor * 5;
  stroke = stroke || "#00FF00";
  fill = fill || "#009900";
  context.save();
  context.fillStyle = "black";
  context.strokeStyle = stroke;
  context.fillStyle = fill;

  for (let x = 0; x < context.canvas.width; x += minor) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, context.canvas.height);
    context.lineWidth = x % major == 0 ? 0.5 : 0.25;
    context.stroke();
    if (x % major == 0) {
      context.fillText(x, x, 10);
    }
  }
  for (let y = 0; y < context.canvas.height; y += minor) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(context.canvas.width, y);
    context.lineWidth = y % major == 0 ? 0.5 : 0.25;
    context.stroke();
    if (y % major == 0) {
      context.fillText(y, 0, y + 10);
    }
  }
  context.restore();
}

export function drawShip(context, radius, options) {
  options = options || {};
  context.save();
  context.lineWidth = options.lineWidth || 1;
  context.strokeStyle = options.stroke || "white";
  context.fillStyle = options.fill || "black";
  let angle = (options.angle || 0.5 * Math.PI) / 2;
  let curve1 = options.curve1 || 0.25;
  let curve2 = options.curve2 || 0.75;

  if (options.thruster) {
    context.save();
    context.strokeStyle = "yellow";
    context.fillStyle = "red";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(
      (Math.cos(Math.PI + angle * 0.8) * radius) / 2,
      (Math.sin(Math.PI + angle * 0.8) * radius) / 2
    );
    context.quadraticCurveTo(
      -radius * 2,
      0,
      (Math.cos(Math.PI - angle * 0.8) * radius) / 2,
      (Math.sin(Math.PI - angle * 0.8) * radius) / 2
    );
    context.fill();
    context.stroke();
    context.restore();
  }

  context.beginPath();
  context.moveTo(radius, 0);
  context.quadraticCurveTo(
    Math.cos(angle) * radius * curve2,
    Math.sin(angle) * radius * curve2,
    Math.cos(Math.PI - angle) * radius,
    Math.sin(Math.PI - angle) * radius
  );
  context.quadraticCurveTo(
    -radius * curve1,
    0,
    Math.cos(Math.PI + angle) * radius,
    Math.sin(Math.PI + angle) * radius
  );
  context.quadraticCurveTo(
    Math.cos(-angle) * radius * curve2,
    Math.sin(-angle) * radius * curve2,
    radius,
    0
  );

  context.fill();
  context.stroke();
  if (options.guide) {
    context.fillStyle = "white";
    context.lineWidth = 0.5;
    context.beginPath();
    context.moveTo(Math.cos(-angle) * radius, Math.sin(-angle) * radius);
    context.lineTo(0, 0);
    context.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    context.moveTo(-radius, 0);
    context.lineTo(0, 0);
    context.stroke();
    context.beginPath();
    context.arc(
      Math.cos(angle) * radius * curve2,
      Math.sin(angle) * radius * curve2,
      radius / 40,
      0,
      2 * Math.PI
    );
    context.fill();
    context.beginPath();
    context.arc(
      Math.cos(-angle) * radius * curve2,
      Math.sin(-angle) * radius * curve2,
      radius / 40,
      0,
      2 * Math.PI
    );
    context.fill();
    context.beginPath();
    context.arc(-radius * curve1, 0, radius / 40, 0, 2 * Math.PI);
    context.fill();
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.stroke();
  }
  context.restore();
}

export function drawAsteroid(context, radius, shape, options) {
  options = options || {};
  context.strokeStyle = options.stroke || "white";
  context.fillStyle = options.fill || "black";
  context.lineWidth = options.lineWidth || 1;
  if (options.noise === undefined) {
    options.noise = 0.4;
  }
  context.save();
  context.beginPath();
  for (let i = 0; i < shape.length; i++) {
    context.rotate((2 * Math.PI) / shape.length);
    context.lineTo(radius + radius * options.noise * shape[i], 0);
  }
  context.closePath();
  context.fill();
  context.stroke();
  if (options.guide) {
    context.lineWidth = 0.5;
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.stroke();
    context.lineWidth = 0.25;
    context.beginPath();
    context.arc(0, 0, radius * (1 + options.noise / 2), 0, 2 * Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(0, 0, radius * (1 - options.noise / 2), 0, 2 * Math.PI);
    context.stroke();
  }
  context.restore();
}

export function drawProjectile(context, radius, lifetime) {
  context.save();
  context.fillStyle = "rgb(100%, 100%, " + 100 * lifetime + "%)";
  context.beginPath();
  context.arc(0, 0, radius * lifetime, 0, 2 * Math.PI);
  context.fill();
  context.restore();
}

export function drawLine(context, object1, object2) {
  context.save();
  context.strokeStyle = "white";
  context.lineWidth = 0.5;
  context.beginPath();
  context.moveTo(object1.x, object1.y);
  context.lineTo(objct2.x, object2.y);
  context.stroke();
  context.restore();
}
