const rulesBtn = document.getElementById("rules-opener");
rulesBtn.addEventListener("click", function () {
  window.location.assign("rules.html");
});

const pianoSong = document.getElementById("piano-song");
pianoSong.onLoad = pianoSong.play()
pianoSong.loop = true;

const audioBtn = document.getElementById("music-btn");
audioBtn.addEventListener("click", function () {
  if (pianoSong.paused) {
    pianoSong.play();
    audioBtn.classList.remove("audio-paused");
    return;
  }

  pianoSong.pause();
  audioBtn.classList.add("audio-paused");
});

let wheel_prize_list = [
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

let wheel_lottery_list = [
  
    {
        "id": 1,
        "create_time": 1650525000301,
        "user_info": {
            "id": 4,
            "nickname": "dong"
        },
        "prize_info": {
            "id": 1,
            "title": "Failed to win the prize"
        }
    },
    {
        "id": 2,
        "create_time": 1650525012569,
        "user_info": {
            "id": 4,
            "nickname": "dong"
        },
        "prize_info": {
            "id": 2,
            "title": "&#8377;5"
        }
    },
    {
        "id": 3,
        "create_time": 1650525015789,
        "user_info": {
            "id": 3,
            "nickname": "kapil_v"
        },
        "prize_info": {
            "id": 2,
            "title": "&#8377;5"
        }
    }
]

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
;
let sectorLength = 0;

let i = 0;
let currentTurns = 0;
const audio = document.getElementById("audio");

let sweep = 0;
let cx = cw / 2;
let cy = ch / 2;
let radius = cw / 2;

let white = "white";
let purple = "#7021e8";
let w = true;
 
const imgArr = [];

document.addEventListener('DOMContentLoaded', init);

async function init() {

  //cant fetch data from api because blocked by cors policy , access control allow origin
/*
  const res = await fetch('https://api.guruji.app/Solar/Wheel/wheel_prize_list?user_id=1&rand_num=8');
  const resJson = await res.json();

   wheel_prize_list = resJson.data.wheel_prize_list;
   wheel_lottery_list = resJson.data.wheel_lottery_list;
  */
  sectorLength = wheel_prize_list.length;
  sweep = PI2 / sectorLength;
  // console.log('sectorLength')

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
  loadWheelLotteryList(wheel_lottery_list)
  

}

const winner1 = document.getElementById('winner1')
const winner2 = document.getElementById('winner2')
const winner3 = document.getElementById('winner3')


function loadWheelLotteryList(wheel_lottery_list) {
 
  const { length, [length - 3]:tl,[length - 2]: sl,[length - 1]: last} = wheel_lottery_list;
 
  winner1.textContent = `${last.user_info.nickname} just got ${last.prize_info.title} ${Math.round((Date.now() - last.create_time)/60000)} mins ago`
  winner2.textContent = `${sl.user_info.nickname} just got ${sl.prize_info.title} ${Math.round((Date.now() - sl.create_time)/60000)} mins ago`
  winner3.textContent = `${tl.user_info.nickname} just got ${tl.prize_info.title} ${Math.round((Date.now() - tl.create_time)/60000)} mins ago`
} 


function start() {
  for (let i = 0; i < sectorLength; i++) {
    let text = wheel_prize_list[i].title;
   
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

  ctx.save();

  // rotate the canvas to this blade's angle
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  // draw the blade wedge
  ctx.lineWidth = 0;
  ctx.beginPath();
  ctx.moveTo(0, 0);
 
  ctx.arc(0, 0, radius, 0, arcsweep);
  ctx.closePath();


  ctx.fillStyle = `${index === sectorLength - 1 ? bgColor : bgColor}`;
 
  ctx.fill();

  // draw the text
  ctx.rotate(PI / 2 + sweep / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.fillStyle = fontColor;
 
  ctx.font = ctx.font.replace(
    /\d+px/,
    `${window.innerHeight > 800 ? "26px" : "22px"}`
  );
 
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
 
  // draw the img
 
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

const startBtn = document.getElementById("start");
startBtn.addEventListener("click", spin);

let prizeObj = {};
async function spin() {
  //add it later if user has more spins left or got more after sharing

  startBtn.removeEventListener("click", spin);
  /*
    api doesnt work due to cors policy for local server, Access control allow origin

        const res = await fetch('https://api.guruji.app/Solar/Wheel/wheel_lottery_start');
        const resJson = await res.json();

        let spinResult = resJson.data.wheel_prize_info;


*/

  /*
        
            {
    "data": {
        "code": 0,
        "msg": "ok!",
        "wheel_prize_info": {
            "id": 2,
            "type": 1,
            "icon": "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
            "title": "&#8377;5"
        }
    }
}
        
        */
       let spinResult = {
           id: 2,
           type: 1,
           icon: "https://www.guruji.app/public/static/h5/wheel/ruppe.png",
           title: "&#8377;5",
        };
        prizeObj = spinResult;

  let num = spinResult.id;
  currentTurns += 9000;
  const pie = 360 / wheel_prize_list.length;
  const rotation = (num - 0.5) * pie;
  ctx.canvas.style.transform = `rotate(${-rotation - 90 + currentTurns}deg)`;
}

canvas.addEventListener('transitionend', showPrize);

function showPrize() {

    document.getElementById('prize').textContent= prizeObj.title

    setTimeout(() => {
               
        document.getElementById('show-prize').classList.add('overlay-pop-up')
        


    }, 700);

}

const leaveDiv = document.getElementById("leave-div");

document.getElementById("back-btn").addEventListener("click", function () {
  leaveDiv.classList.add("overlay-pop-up");
});

const claimNowBtn = document.getElementById("claim-now");

claimNowBtn.addEventListener("click", closeNav2);

const closePrizeBtn = document.getElementById('prize-close');
closePrizeBtn.addEventListener('click', closePrize);


function closePrize(e) {

  // if more spins available add event listener
  // ***************************
  startBtn.addEventListener('click', spin)

  // ***************************
  if(e.target.parentElement.classList.contains('close-btn')){

      document.getElementById('show-prize').classList.remove('overlay-pop-up')
      return
  }
  document.getElementById('show-prize').classList.remove('overlay-pop-up')

}


function closeNav2() {
  leaveDiv.classList.remove("overlay-pop-up");
}
