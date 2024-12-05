const bck = document.getElementById("background");
const bck_ctx = bck.getContext("2d");

const player = document.getElementById("player");
const player_ctx = player.getContext("2d");

const btf = document.getElementById("butterfly");
const btf_ctx = btf.getContext("2d");

const ui = document.getElementById("ui");
const ui_ctx = ui.getContext("2d");

const anim = document.getElementById("anim");
const anim_ctx = anim.getContext("2d");

const fieldPerspective = Math.atan(150 / 250);
const Yfactor = Math.sin(fieldPerspective);

//Player consts
let playerSpeed = 10;
const playerSize = 100;

const playerAreaPosition = 200;
const playerAreaTop = -playerSize + 10;
const playerAreaBottom = 250 - playerSize;
const playerAreaLeft = 50;
const playerAreaRight = 420 - playerSize;

let scoreMultiplier = 1;

let playerFade = 1;

const playerAnimation = new Array();

for (let i = 0; i < 8; i++) {
  let img = new Image();
  img.src = `./assets/player/${i + 1}.png`;
  playerAnimation.push(img);
}
//Butterfly
const butterflyMap = new Map();
let butterflySize = 50;
let butterflySpeed = 5;
let spawRate = 0.9;
const butterflyAnimation = new Array();

let butterflyFade = 1;

for (let i = 1; i < 16; i++) {
  let img = new Image();
  img.src = `./assets/butterfly/${i}.png`;
  butterflyAnimation.push(img);
}

const butterflyColor = [
  "#00FF00",
  "#00FFFF",
  "#FF9955",
  "#FF2A2A",
  "#FF00FF",
]

//Background const

const starArray = new Array();
const starNumber = 50;

let offsetBackgound = 0;

const road = new Image();
road.src = "./assets/dirt_road_rscl.png";

const treeNumber = 50;

//General utility
function randomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
function randomHexColor() {
  let r = randomInt(0, 255).toString(16);
  let g = randomInt(0, 255).toString(16);
  let b = randomInt(0, 255).toString(16);
  return `#${r}${g}${b}`;
}
function cleanModulus(num, mod) {
  return (mod + (num % mod)) % mod;
}

function fadeCanvas(cvs, fade) {
  let ctx = cvs.getContext("2d");
  ctx.save();
  ctx.globalAlpha = fade;
  ctx.globalCompositeOperation='destination-out';
  ctx.fillStyle= '#FFF';
  ctx.fillRect(0,0,cvs.width, cvs.height);    
  ctx.restore();  
  // ctx.globalCompositeOperation = "destination-in";
  // ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  // ctx.beginPath();
  // ctx.fillRect(0, 0, cvs.width, cvs.height);

  // ctx.globalCompositeOperation = "source_over";
}
