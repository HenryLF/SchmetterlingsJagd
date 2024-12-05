const playerAction = new Map();
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      playerAction.set("Up", true);
      break;
    case "ArrowDown":
      playerAction.set("Down", true);
      break;
    case "ArrowLeft":
      playerAction.set("Left", true);
      break;
    case "ArrowRight":
      playerAction.set("Right", true);
      break;
    case " ":
      Player.catch = true;
      break;
  }
});
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
      playerAction.set("Up", false);
      break;
    case "ArrowDown":
      playerAction.set("Down", false);
      break;
    case "ArrowLeft":
      playerAction.set("Left", false);
      break;
    case "ArrowRight":
      playerAction.set("Right", false);
      break;
  }
});

function clearCanvas() {
  bck_ctx.clearRect(0, 0, bck.width, bck.height);
  

  fadeCanvas(player,playerFade)
  fadeCanvas(btf,butterflyFade)
  fadeCanvas(anim,0.2);


  ui_ctx.clearRect(0,0,ui.width,ui.height)
  bck_ctx.beginPath();

  bck_ctx.fillStyle = "#071a34";
  bck_ctx.rect(0, 0, bck.width, bck.height);
  bck_ctx.fill();
  let offset = cleanModulus(offsetBackgound, bck.width);
  bck_ctx.drawImage(road, offset - bck.width, playerAreaPosition);
  bck_ctx.drawImage(road, offset, playerAreaPosition);

  starArray.forEach((e) => {
    e.draw();
  });
  treeArray.forEach((e) => {
    e.draw();
  });
}

function movePlayer() {
  playerAction.forEach((active, key) => {
    if (active) {
      switch (key) {
        case "Up":
          Player.y = Math.max(Player.y - playerSpeed, playerAreaTop);
          break;
        case "Down":
          Player.y = Math.min(Player.y + playerSpeed, playerAreaBottom);
          break;
        case "Right":
          Player.x = Math.min(Player.x + playerSpeed, playerAreaRight);
          break;
        case "Left":
          Player.x = Math.max(Player.x - playerSpeed, playerAreaLeft);
          break;
      }
    }
  });
  if (Array.from(playerAction.values()).some(Boolean)) {
    if (Player.x == playerAreaRight) {
      offsetBackgound -= playerSpeed;
    } else if (Player.x == playerAreaLeft) {
      offsetBackgound += playerSpeed;
    }
    Player.walk = true;
  }
}

function gameLoop() {
  movePlayer();
  clearCanvas();
  if (Math.random() > spawRate) {
    CreateButterfly();
  }
  Player.draw();


  butterflyMap.forEach((e) => {
    if (e.pos().x < 0) {
      butterflyMap.delete(e.id);
      return;
    } else if (Player.catch & e.detectColision()) {
      butterflyMap.delete(e.id);
      e.death();
      bonusCheck()
      return;
    }
    e.draw();
  });

  animationMap.forEach(e => {e.draw()} )
}
let raf = setInterval(gameLoop, 100);
