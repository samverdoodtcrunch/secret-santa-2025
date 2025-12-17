let bird;
let pipes = [];
let score = 0;
let gameOver = false;

const NAME = "AMORSEREN";
const SCORE_STEP = 5;
const PIPE_SPACING = 180;

function setup() {
  const canvas = createCanvas(360, 640);
  canvas.parent(document.body);

  bird = new Bird();
  pipes = [new Pipe(width)];
  textFont("sans-serif");
}

function draw() {
  background(112, 197, 206);

  if (!gameOver) {
    bird.update();
    bird.show();

    // --- DISTANCE-BASED PIPE SPAWN ---
    const lastPipe = pipes[pipes.length - 1];
    if (lastPipe.x <= width - PIPE_SPACING) {
      pipes.push(new Pipe(width));
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      const pipe = pipes[i];

      pipe.update();
      pipe.show();

      if (pipe.hits(bird)) {
        gameOver = true;
      }

      if (!pipe.passed && pipe.x + pipe.w < bird.x) {
        pipe.passed = true;
        score++;
      }

      if (pipe.offscreen()) {
        pipes.splice(i, 1);
      }
    }
  } else {
    showGameOver();
  }

  showScore();
  showNameProgress();
}

function inputJump() {
  if (gameOver) {
    resetGame();
  } else {
    bird.jump();
  }
}

function mousePressed() {
  inputJump();
}

function touchStarted() {
  inputJump();
  return false;
}

function keyPressed() {
  if (key === " ") {
    inputJump();
  }
}

function showScore() {
  fill(255);
  textSize(32);
  textAlign(CENTER);
  text(score, width / 2, 50);
}

function showNameProgress() {
  const revealed = Math.min(
    Math.floor(score / SCORE_STEP),
    NAME.length
  );

  fill(255);
  textSize(24);
  textAlign(CENTER);
  text(NAME.slice(0, revealed), width / 2, 90);
}

function showGameOver() {
  fill(0, 150);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER);
  textSize(36);
  text("Game Over", width / 2, height / 2 - 20);

  textSize(18);
  text("Tap / click to retry", width / 2, height / 2 + 20);
}

function resetGame() {
  score = 0;
  pipes = [new Pipe(width)];
  bird = new Bird();
  gameOver = false;
}

class Bird {
  constructor() {
    this.x = 80;
    this.y = height / 2;
    this.r = 12;
    this.gravity = 0.6;
    this.lift = -10;
    this.velocity = 0;
  }

  jump() {
    this.velocity = this.lift;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.y = constrain(this.y, this.r, height - this.r);
  }

  show() {
    fill(255, 204, 0);
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Pipe {
  constructor(startX) {
    this.w = 50;
    this.x = startX;
    this.speed = 2;
    this.gap = 140;

    this.top = random(50, height - this.gap - 100);
    this.bottom = this.top + this.gap;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x < -this.w;
  }

  hits(bird) {
    const withinX =
      bird.x + bird.r > this.x &&
      bird.x - bird.r < this.x + this.w;

    const hitsPipe =
      bird.y - bird.r < this.top ||
      bird.y + bird.r > this.bottom;

    return withinX && hitsPipe;
  }

  show() {
    fill(0, 200, 0);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }
}
