const Player = {
  x: 150,
  y: 125,
  walk: false,
  catch: false,
  lastButterfly: new Array(5),
  animCount: 0,
  score: 0,
  pos() {
    return {
      x: 150 + this.x - Yfactor * this.y,
      y: playerAreaPosition + this.y,
    };
  },
  draw() {
    let proj = this.pos();
    if (this.walk | this.catch) {
      this.animCount += 1;
      if (this.animCount > 3) {
        this.animCount = 0;
        this.walk = false;
        this.catch = false;
      }
    }
    player_ctx.drawImage(
      playerAnimation[this.catch ? this.animCount + 4 : this.animCount],
      proj.x,
      proj.y,
      playerSize,
      playerSize
    );

    ui_ctx.fillStyle = "#FFFFFF";
    ui_ctx.font = "bold 15px serif";
    ui_ctx.fillText(`Score :${this.score}`, 0, 15);
    ui_ctx.fill();
    this.lastButterfly.forEach((e, k) => {
      ui_ctx.drawImage(butterflyAnimation[3 * e + 2], (k + 2) * 50, 0);
    });
  },
};

let butterflyCount = 0;
class Butterfly {
  constructor() {
    this.id = butterflyCount;
    butterflyCount += 1;
    this.color = randomInt(0, 5);
    this.anim = butterflyAnimation.slice(this.color * 3, (this.color + 1) * 3);
    this.x = player.width - offsetBackgound;
    this.y = randomInt(playerAreaTop, 250 - butterflySize);
    this.toxic = Math.random() < 0.4;
  }
  animCount = 0;
  pos() {
    return {
      x: 150 + this.x - Yfactor * this.y + offsetBackgound,
      y: playerAreaPosition + this.y,
    };
  }
  draw() {
    let proj = this.pos();
    btf_ctx.drawImage(
      this.anim[this.animCount],
      proj.x,
      proj.y,
      butterflySize,
      butterflySize
    );
    this.x = this.x - butterflySpeed;
    this.animCount = cleanModulus(this.animCount + 1, 2);
  }
  detectColision() {
    let dist = Math.hypot(
      this.x + offsetBackgound + butterflySize / 2 - Player.x - playerSize / 2,
      this.y + butterflySize / 2 - Player.y - playerSize / 2
    );
    return dist < (playerSize + butterflySize) / 2;
  }
  death() {
    Player.lastButterfly = [this.color].concat(
      Player.lastButterfly.slice(0, -1)
    );
    let proj = this.pos();
    let m = new catchAnimation(proj.x, proj.y, this.color);
    animationMap.set(m.id, m);
    Player.score += scoreMultiplier;
    let l = new textAnimation(proj.x, proj.y, `+${scoreMultiplier}`);
    animationMap.set(l.id, l);
  }
}
const animationMap = new Map();
let animationCount = 0;
class catchAnimation {
  constructor(x, y, color) {
    this.id = animationCount;
    animationCount += 1;
    this.x = x;
    this.y = y;
    this.color = butterflyColor[color];
    this.state = 1;
  }
  draw() {
    if (this.state < 10) {
      anim_ctx.strokeStyle = this.color;
      anim_ctx.lineWidth = 8;
      anim_ctx.beginPath();
      anim_ctx.arc(this.x, this.y, 1.5 * this.state, 0, Math.PI * 2);
      anim_ctx.stroke();
      this.state += 1;
    } else {
      animationMap.delete(this.id);
    }
  }
}
class textAnimation {
  constructor(x, y, txt) {
    this.id = animationCount;
    animationCount += 1;
    this.x = x;
    this.y = y;
    this.txt = txt;
    this.state = 1;
  }
  draw() {
    if (this.state < 10) {
      anim_ctx.fillStyle = "#FFFFFF";
      anim_ctx.font = "bold 20px serif";
      anim_ctx.beginPath();
      anim_ctx.fillText(this.txt, this.x, this.y - 20);
      anim_ctx.fill();
      this.state += 1;
    } else {
      animationMap.delete(this.id);
    }
  }
}

function CreateButterfly() {
  let m = new Butterfly();
  butterflyMap.set(m.id, m);
}

function bonusCheck() {
  let map = Player.lastButterfly.reduce(
    (acc, e) => acc.set(e, (acc.get(e) || 0) + 1),
    new Map()
  );
  map.forEach((e, k) => {
    if (e == 3) {
      apply_bonus(k);
      let n = Player.lastButterfly.filter((e) => e != k);
      Player.lastButterfly = n.concat(Array(5 - n.length));
    }
  });
  if (map.size == 5) {
    m = new textAnimation(450, 100, "One of each !");
    animationMap.set(m.id, m);
    scoreMultiplier *= 2;
    Player.lastButterfly = new Array(5);
  }
}

function apply_bonus(n) {
  let m;
  switch (n) {
    case 0:
      butterflySize *= 2;
      m = new textAnimation(450, 50, "Big Butterfly !");
      animationMap.set(m.id, m);
      setTimeout(() => {
        butterflySize /= 2;
      }, 10000);
      break;

    case 1:
      playerSpeed *= 2;
      playerFade = 0.3;

      m = new textAnimation(510, 170, "You so fast !");
      animationMap.set(m.id, m);
      setTimeout(() => {
        playerSpeed /= 2;
        playerFade = 1;
      }, 10000);
      break;
    case 2:
      butterflySpeed *= 2;
      butterflyFade = 0.3;
      m = new textAnimation(420, 150, "They're comming !");
      animationMap.set(m.id, m);
      setTimeout(() => {
        butterflySpeed /= 2;
        butterflyFade = 1;
      }, 10000);
      break;
    case 3:
      Player.score += 5 * scoreMultiplier;
      m = new textAnimation(700, 100, `Money Time +${5 * scoreMultiplier}!`);
      animationMap.set(m.id, m);
      break;
    case 4:
      m = new textAnimation(600, 200, "So numerous !");
      animationMap.set(m.id, m);
      spawRate *= 0.8;
      setTimeout(() => {
        spawRate /= 0.8;
      }, 10000);
      break;
  }
}

//Background
class backgroundStar {
  constructor() {
    this.x = randomInt(0, bck.width);
    this.y = randomInt(0, playerAreaPosition);
    this.size = randomInt(1, 10);
    this.speed = randomInt(1, 5) / 50;
    this.color = randomHexColor();
  }
  draw() {
    bck_ctx.fillStyle = this.color;
    bck_ctx.beginPath();
    bck_ctx.arc(
      cleanModulus(this.x + this.speed * offsetBackgound, bck.width),
      this.y,
      this.size,
      0,
      2 * Math.PI
    );
    bck_ctx.fill();
  }
}

for (let i = 0; i < starNumber; i++) {
  let s = new backgroundStar();
  starArray.push(s);
}

class Tree {
  constructor() {
    this.x = randomInt(-100, 1000);
    this.img = new Image();
    this.img.src = `./assets/tree/tree_${randomInt(0, 5)}.png`;
    this.yoffset = randomInt(-0, 10);
  }
  draw() {
    bck_ctx.drawImage(
      this.img,
      cleanModulus(this.x + offsetBackgound, 1100) - 100,
      playerAreaPosition + this.yoffset - this.img.height
    );
  }
}

const treeArray = new Array();
for (let i = 0; i < treeNumber; i++) {
  let t = new Tree();
  treeArray.push(t);
}
