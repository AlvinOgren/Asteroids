export function collision(object1, object2) {
  return distanceBetween(object1, object2) < object1.radius + object2.radius;
}

function distanceBetween(object1, object2) {
  return Math.sqrt(Math.pow(object1.x - object2.x, 2) + Math.pow(object1.y - object2.y, 2));
}
