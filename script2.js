const rulesBtn = document.getElementById("rules-opener");
rulesBtn.addEventListener("click", function () {
  window.location.assign("rules.html");
});

const wheel_prize_list = [
  {
    id: 1,
    type: 0,
    icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
    title: "Try again",
  },
  {
    id: 2,
    type: 1,
    icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
    title: "₹5",
  },
  {
    id: 3,
    type: 2,
    icon: "https://www.guruji.app/public/static/h5/wheel/coupon.png",
    title: "200 get 250",
  },
  {
    id: 4,
    type: 1,
    icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
    title: "₹20",
  },
  {
    id: 5,
    type: 2,
    icon: "https://www.guruji.app/public/static/h5/wheel/coupon.png",
    title: "20% off",
  },
  {
    id: 6,
    type: 1,
    icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
    title: "₹80",
  },
  {
    id: 7,
    type: 2,
    icon: "https://www.guruji.app/public/static/h5/wheel/coupon.png",
    title: "50% off",
  },
  {
    id: 8,
    type: 1,
    icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
    title: "₹100",
  },
];

let canvas = document.getElementById("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";
window.innerHeight < 800
  ? (window.devicePixelRatio = 1.95)
  : (window.devicePixelRatio = 1.75);
const scale = window.devicePixelRatio;
canvas.width = Math.floor(canvas.offsetWidth * scale);
canvas.height = Math.floor(canvas.offsetHeight * scale);
let ctx = canvas.getContext("2d");
let cw = canvas.width;
let ch = canvas.height;

let PI = Math.PI;
let PI2 = PI * 2;
let bladeCount = 10;
const sectorLength = 8;

let i = 0;
let currentTurns = 0;
const audio = document.getElementById("audio");
document.getElementById("start").addEventListener("click", function () {
  // console.log("vs");
  // audio.play()
  let num = Math.floor(Math.random() * 8);
  currentTurns += 9000;
  const pie = 360 / sectorLength;
  console.log(num);
  const rotation1 = (num - 0.5) * pie;
  // i+= (25 * 360) - ;
  ctx.canvas.style.transform = `rotate(${-rotation1 - 90 + currentTurns}deg)`;
});

let sweep = PI2 / sectorLength;
let cx = cw / 2;
let cy = ch / 2;
let radius = cw / 2;

let white = "white";
let purple = "#7021e8";
let w = true;
let p = false;
const imgArr = [];

(function () {
  let loaded = 0;

  function onLoad() {
    loaded++;
    if (loaded == wheel_prize_list.length) {
      start();
    }
  }

  for (let i = 0; i < wheel_prize_list.length; i++) {
    let img = new Image();
    img.addEventListener("load", onLoad);
    img.src = wheel_prize_list[i].icon;
    img.onload = imgArr.push(img);
  }
})(wheel_prize_list, start);

// imgArr[wheel_prize_list.length - 1].onload = start;

function start() {
  for (let i = 0; i < sectorLength; i++) {
    let text = wheel_prize_list[i].title;
    console.log(text);
    let currBg = "";
    let currFont = "";

    if (w) {
      currBg = "#FFE7B8";
      currFont = "#7021E8";
      w = false;
    } else {
      currBg = "#7021E8";
      currFont = "white";
      w = true;
    }
    drawBlade(
      imgArr[i],
      text,
      cx,
      cy,
      radius,
      sweep * i,
      sweep,
      i,
      currBg,
      currFont
    );
  }
}

function drawBlade(
  img,
  text,
  cx,
  cy,
  radius,
  angle,
  arcsweep,
  index,
  bgColor,
  fontColor
) {
  // save the context state
  ctx.save();

  // rotate the canvas to this blade's angle
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  // draw the blade wedge
  ctx.lineWidth = 0;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  // ctx.shadowBlur = 10;
  // ctx.shadowColor = "black"
  ctx.arc(0, 0, radius, 0, arcsweep);
  ctx.closePath();
  // ctx.stroke();
  // fill the blade, but keep the color light
  // so the black text has good contrast
  // ctx.fillStyle='white';
  // ctx.fill();
  // ctx.fillStyle= `${ sectorLength%2 ===  1 && index === sectorLength-1 ? 'purple' : index%2 === 0 ? 'white' : '#7021e8'}`;
  // currColor = "#7021e8";

  ctx.fillStyle = `${index === sectorLength - 1 ? bgColor : bgColor}`;
  // ctx.globalAlpha=0.30;
  ctx.fill();

  // ctx.globalAlpha=1.00;
  // draw the text
  ctx.rotate(PI / 2 + sweep / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  console.log(fontColor);
  ctx.fillStyle = fontColor;
  // ctx.font = "bold 21px";
  ctx.font = ctx.font.replace(
    /\d+px/,
    `${window.innerHeight > 800 ? "26px" : "22px"}`
  );
  // ctx.font = ctx.font.replace(/\d+px/, (parseInt(ctx.font.match(/\d+px/)) + 2) + "px");

  // ctx.fillText(text, 0, -radius + 120);
  ctx.shadowColor = "black";
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  const words = text.split(" ");
  words.length > 2
    ? wrapText(ctx, text, 0, -radius + 100, 60, 35)
    : ctx.fillText(text, 0, -radius + 110);
  ctx.shadowColor = "black";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  // wrapText(ctx, text,  0, -radius + 120, 25, 35 )
  // draw the img
  // (resize to 32x32 so be sure orig img is square)
  ctx.drawImage(img, -30, -radius + 21, 64, 64);

  // restore the context to its original state
  ctx.restore();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");

  let line = "";
  for (const [index, w] of words.entries()) {
    const testLine = line + w + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && index > 1) {
      ctx.fillText(line, x, y);

      line = w + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }

  ctx.fillText(line, x, y);
}

const leaveDiv = document.getElementById("leave-div");

document.getElementById("back-btn").addEventListener("click", function () {
  leaveDiv.classList.add("overlay-pop-up");
});

const claimNowBtn = document.getElementById("claim-now");

claimNowBtn.addEventListener("click", closeNav2);

function closeNav2() {
  leaveDiv.classList.remove("overlay-pop-up");
}
