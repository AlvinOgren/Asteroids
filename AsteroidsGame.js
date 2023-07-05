import { Indicator } from "./Indicator.js";
import { NumberIndicator } from "./NumberIndicator.js";
import { Message } from "./Message.js";
import { Asteroid } from "./Asteroid.js";
import { collision } from "./utilityFunctions.js";
import { Ship } from "./Ship.js";
import { drawGrid, drawLine } from "./drawing.js";

export class AsteroidsGame {
  constructor(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.canvas.focus();
    this.guide = false;
    this.shipMass = 10;
    this.shipRadius = 15;
    this.asteroidMass = 10000; // Mass of asteroids
    this.asteroidPush = 5000000; // max force to apply in one frame
    this.massDestroyed = 500;
    this.healthIndicator = new Indicator("health", 5, 5, 100, 10);
    this.scoreIndicator = new NumberIndicator(
      "score",
      this.canvas.width - 10,
      5
    );
    this.levelIndicator = new NumberIndicator(
      "level",
      this.canvas.width / 2,
      5,
      {
        align: "center",
      }
    );
    this.fpsIndicator = new NumberIndicator(
      "fps",
      this.canvas.width - 10,
      this.canvas.height - 15,
      {
        digits: 2,
      }
    );
    this.message = new Message(this.canvas.width / 2, this.canvas.height * 0.4);
    this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
    this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
    window.requestAnimationFrame(this.frame.bind(this));
    this.resetGame();
  }

  resetGame() {
    this.gameOver = false;
    this.score = 0;
    this.level = 0;
    this.ship = new Ship(
      this.shipMass,
      this.shipRadius,
      this.canvas.width / 2,
      this.canvas.height / 2,
      1000,
      200
    );
    this.projectiles = [];
    this.asteroids = [];
    this.levelUp();
  }

  levelUp() {
    this.level += 1;
    for (var i = 0; i < this.level; i++) {
      this.asteroids.push(this.movingAsteroid());
    }
  }

  movingAsteroid(elapsed) {
    var asteroid = this.newAsteroid();
    this.pushAsteroid(asteroid, elapsed);
    return asteroid;
  }

  newAsteroid() {
    return new Asteroid(
      this.asteroidMass,
      this.canvas.width * Math.random(),
      this.canvas.height * Math.random()
    );
  }

  pushAsteroid(asteroid, elapsed) {
    elapsed = elapsed || 0.015;
    asteroid.push(Math.PI * 2 * Math.random(), this.asteroidPush, elapsed);
    asteroid.twist(
      (Math.random() - 0.5) * Math.PI * this.asteroidPush * 0.02,
      elapsed
    );
  }

  splitAsteroid(asteroid, elapsed) {
    asteroid.mass -= this.massDestroyed;
    this.score += this.massDestroyed;
    var split = 0.25 + 0.5 * Math.random(); // split unevenly
    var ch1 = asteroid.child(asteroid.mass * split);
    var ch2 = asteroid.child(asteroid.mass * (1 - split));
    [ch1, ch2].forEach((child) => {
      if (child.mass < this.massDestroyed) {
        this.score += child.mass;
      } else {
        this.pushAsteroid(child, elapsed);
        this.asteroids.push(child);
      }
    }, this);
  }

  keyDown(event) {
    this.keyHandler(event, true);
  }
  keyUp(event) {
    this.keyHandler(event, false);
  }

  keyHandler(event, value) {
    let nothingHandled = false;
    switch (event.key || event.keyCode) {
      case "ArrowLeft":
      case 37: // left arrow
        this.ship.leftThruster = value;
        break;
      case "ArrowUp":
      case 38: // up arrow
        this.ship.thrusterOn = value;
        break;
      case "ArrowRight":
      case 39: // right arrow
        this.ship.rightThruster = value;
        break;
      case "ArrowDown":
      case 40:
        this.ship.retroOn = value;
        break;
      case " ":
      case 32: //spacebar
        if (this.gameOver) {
          this.resetGame();
        } else {
          this.ship.trigger = value;
        }
        break;
      case "g":
      case 71: // g for guide
        if (value) this.guide = !this.guide;
        break;
      default:
        nothingHandled = true;
    }
    if (!nothingHandled) event.preventDefault();
  }

  frame(timestamp) {
    if (!this.previous) this.previous = timestamp;
    var elapsed = timestamp - this.previous;
    this.update(elapsed / 1000);
    this.draw(1000 / elapsed);
    this.previous = timestamp;
    window.requestAnimationFrame(this.frame.bind(this));
  }

  update(elapsed) {
    if (this.asteroids.length == 0) {
      this.levelUp();
    }
    this.ship.compromised = false;
    this.asteroids.forEach(function (asteroid) {
      asteroid.update(elapsed, this.context);
      if (collision(asteroid, this.ship)) {
        this.ship.compromised = true;
      }
    }, this);
    this.ship.update(elapsed, this.context);
    if (this.ship.health <= 0) {
      this.gameOver = true;
      return;
    }
    this.projectiles.forEach(function (p, i, projectiles) {
      p.update(elapsed, this.context);
      if (p.life <= 0) {
        projectiles.splice(i, 1);
      } else {
        this.asteroids.forEach(function (asteroid, j) {
          if (collision(asteroid, p)) {
            projectiles.splice(i, 1);
            this.asteroids.splice(j, 1);
            this.splitAsteroid(asteroid, elapsed);
          }
        }, this);
      }
    }, this);
    if (this.ship.trigger && this.ship.loaded) {
      this.projectiles.push(this.ship.projectile(elapsed));
    }
  }

  draw(fps) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.guide) {
      draw_grid(this.context);
      this.asteroids.forEach(function (asteroid) {
        if (!this.gameOver) draw_line(this.context, asteroid, this.ship);
        this.projectiles.forEach(function (p) {
          draw_line(this.context, asteroid, p);
        }, this);
      }, this);
      this.fpsIndicator.draw(this.context, fps);
    }
    this.asteroids.forEach(function (asteroid) {
      asteroid.draw(this.context, this.guide);
    }, this);
    if (this.gameOver) {
      this.message.draw(this.context, "GAME OVER", "Press space to play again");
      return;
    }
    this.ship.draw(this.context, this.guide);
    this.projectiles.forEach(function (p) {
      p.draw(this.context);
    }, this);
    this.healthIndicator.draw(
      this.context,
      this.ship.health,
      this.ship.maxHealth
    );
    this.scoreIndicator.draw(this.context, this.score);
    this.levelIndicator.draw(this.context, this.level);
  }
}
