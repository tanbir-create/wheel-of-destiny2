 //start spin button
const startBtn = document.getElementById("start");
const spinBtn =  document.getElementById("spin");
// let params = {};
// location.search.substring(1).split("&").forEach(function(item) {params[item.split("=")[0]] = item.split("=")[1]})


let params = location.search.substring(1);
let WHEEL_PRIZE_LIST_API = `https://api.guruji.app/Solar/Wheel/wheel_prize_list?${params}`;
let WHEEL_LOTTERY_START_API = `https://api.guruji.app/Solar/Wheel/wheel_lottery_start?${params}`;

//rules button, on click open rules page
const rulesBtn = document.getElementById("rules-opener");
rulesBtn.addEventListener("click", function () {
  window.location.assign("rules.html");
});


//piano music and function to play/pause music
const pianoSong = document.getElementById("piano-song");



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


//initialize wheel prize list and use prize list to fetch later from api and use
let wheel_prize_list = [];

let wheel_lottery_list = [];
let user_prize_info = {};


let canvas = document.getElementById("canvas");
canvas.style.width = "100%";
canvas.style.height = "100%";

//for text clarity
window.innerHeight < 800
  ? (window.devicePixelRatio = 2.1)
  : (window.devicePixelRatio = 1.7);
const scale = window.devicePixelRatio;
canvas.width = Math.floor(canvas.offsetWidth * scale);
canvas.height = Math.floor(canvas.offsetHeight * scale);
let ctx = canvas.getContext("2d");
let cw = canvas.width;
let ch = canvas.height;

let PI = Math.PI;
let PI2 = PI * 2;

let sectorLength = 0;

let i = 0;
let currentTurns = 0;

//audio while wheel is spinning
const audio = document.getElementById("audio");

let sweep = 0;
let cx = cw / 2;
let cy = ch / 2;
let radius = cw / 2;

let white = "white";
let purple = "#7021e8";
let w = true;
let t;

const imgArr = [];
const chances = document.getElementById("chances");
const gems_won = document.getElementById("gems-won");
const coupons_won = document.getElementById("coupons-won");

const toast = $('#toast');

//entry point
document.addEventListener("DOMContentLoaded", init);


async function init() {
  
  const res = await fetch(WHEEL_PRIZE_LIST_API);
  const resJson = await res.json();

  if(resJson.data.code !== 0) {
    toast.text(resJson.data.msg);
    toast.addClass('show');
    setTimeout(function(){ toast.removeClass('show') }, 3000);
  }

  wheel_prize_list = resJson.data.wheel_prize_list;
  wheel_lottery_list = resJson.data.wheel_lottery_list;
  user_prize_info = resJson.data.user_prize_info;


 
  const { times, gem_total, coupon_num } = user_prize_info;


  //if the user has spins left then let them spin the wheel by adding event listener to button
  
  


  if (times > 0) {
    spinBtn.addEventListener("click", spin);
    startBtn.addEventListener("click", spin);
  } else {
    //add share logic here and add startBtn text 'Shared! know your destiny now ' after the user shared 

    startBtn.innerText = "Share to get another chance";
  }


  //change text for the avaiable prizes and times left
  chances.innerText = times + " spins";
  
  const haveWon = document.getElementById('have-won');
  if(gem_total >0 && coupon_num>0) {
    gems_won.innerText = gem_total + " Gems";
    coupons_won.innerText = coupon_num + " Coupons";
  }else{
    haveWon.innerText = 'Invite your friends and get more spins for both of you'
  }

  //set sector length according to the wheel prize list length to set how many blades to draw in canvas
  sectorLength = wheel_prize_list.length;
  sweep = PI2 / sectorLength;
 

  //IIFE to load images and start loading canvas
  (function () {
   

    //loop through all images and load them before painting them in canvas
    for (let i = 0; i < wheel_prize_list.length; i++) {
      const img = new Image();
      img.src = wheel_prize_list[i].icon;
      imgArr.push(img);
      
      
    }

    loadImages(imgArr)
    
    
  })(wheel_prize_list, start);

 
  loadWheelLotteryList(wheel_lottery_list);

}

function loadImages(imgArr) {
  let loaded = 0;
  
  for(let i= 0; i<imgArr.length; i++){
    imgArr[i].addEventListener('load', function() {
      loaded++;
      if(loaded === imgArr.length){ 
        start()
      }
    })
  }
  
}


let slideUpInPixels = 19.6;
let first = 2, second = 3, third = 4;


function loadWheelLotteryList(wheel_lottery_list) {

  //load 90 elements from prizelist inside prize winners div
  const length = wheel_lottery_list.length > 100 ? 100 : wheel_lottery_list.length;
  const prizeDiv = document.getElementById('prize-wrap');

  let fragment = document.createDocumentFragment();
  for(let i = 0; i<length; i++) {

    let ptag = document.createElement("p");
    ptag.textContent = winnersText(wheel_lottery_list[i]); 
    fragment.appendChild(ptag);

  }

  //add the 90elements in the prize div to use scroll animations
  prizeDiv.appendChild(fragment)

  // document.getElementById('prize-wrap').style.animationDuration = length * 2 + 's';

  $('#prize-winners').easyTicker({
    direction: 'up',
    easing: 'swing',
    speed: 'slow',
    interval: 4000,
    height: '60px',
    visible: 0,
    mousePause: false,
   
    callbacks: {
        before: false,
        after: false
    }
});
  


 
  
}


function winnersText(winner) {
  
  
  let text = `${(winner.user_info.nickname).substring(0, 5) + '****'} just got ${
   winner.prize_info.title
  } ${getTime(winner.create_time * 1000)} ago`;
  return text
}

function getTime(time) {

  let difference = Date.now() - time;

  const oneDay = 86400000 - 1;
  const oneHour = 3600000 - 1;
  const oneMinute = 60000 - 1;
  if(difference >= oneDay) {
    const calculatedTime = Math.round((difference) / oneDay );
    const days = calculatedTime === 1 ? calculatedTime + ' day' : calculatedTime + ' days'
    return days;
  }
  else if(difference > oneHour) {
    const calculatedTime = Math.round((difference) / oneHour );
    const hours = calculatedTime === 1 ? calculatedTime + ' hour' : calculatedTime + ' hours'
    return hours;
  }
  else if (difference >= oneMinute) {
    const calculatedTime = Math.round((difference) / oneMinute );
    const mins = calculatedTime === 1 ? calculatedTime + ' min' : calculatedTime + ' mins'
    return mins;
  }
  
  return '0 min'

}


//function to loop through all the prizes in list and draw the image and text accordingly
function start() {
  for (let i = 0; i < sectorLength; i++) {
    let text = wheel_prize_list[i].title;

    let currBg = "";
    let currFont = "";

    //set background and font color for current spoke of the wheel
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


//function to draw one spoke of the wheel using all params provided
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

  ctx.fillStyle = bgColor;

  ctx.fill();

  // draw the text
  ctx.rotate(PI / 2 + sweep / 2);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = fontColor;

  //if mobile screen smaller than 800px then change text font size
  ctx.font = `bold ${ctx.font.replace(
    /\d+px/,
    `${window.innerHeight > 800 ? "29px" : "26px"}`
  )}`;

  ctx.shadowColor = "black";
  ctx.strokeStyle = "rgba(0,0,0,1)";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  //if title of prize is longer than 3 words then make multi line text for the title for canvas using wraptext function
  const words = text.split(" ");
  words.length > 3
    ? wrapText(ctx, text, 0, -radius + 40, 60, 35)
    : ctx.fillText(text, 0, -radius + 40);

  //shadow for image
  ctx.shadowColor = "black";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  //draw the img

  //image height width set to 64/64px
  ctx.drawImage(img, -30, -radius + 65, 60, 60);

  //restore the context to its original state
  ctx.restore();
}


//function for multiline text title
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");

  let line = "";
  for (const [index, w] of words.entries()) {
    const testLine = line + w + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    //change line after first two words
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


//spin function after the start button is clicked
let prizeObj = {};
async function spin() {
  //remove event listener so that user doesnt spin the wheel while its spinning
  audio.play();
  spinBtn.removeEventListener("click", spin);

  startBtn.removeEventListener("click", spin);

  // fetch user's lottery result
  const res = await fetch(WHEEL_LOTTERY_START_API);
  const resJson = await res.json();
  if(resJson.data.code !== 0) {
    toast.text(resJson.data.msg);
    toast.addClass('show');
    setTimeout(function(){ toast.removeClass('show') }, 3000);
  }

  let spinResult = resJson.data.wheel_prize_info;


  prizeObj = spinResult;

  let num = spinResult.id;
  currentTurns += 9000;

  //spin the wheel upto the prize part after 25 rotations
  const pie = 360 / wheel_prize_list.length;
  const rotation = (num - 0.5) * pie;
  ctx.canvas.style.transform = `rotate(${-rotation - 90 + currentTurns}deg)`;
}


//after the wheel stops spinning call showprize function after .7seconds and show the prize container to the user
canvas.addEventListener("transitionend", showPrize);

function showPrize() {
  
  const {id, type, title} = prizeObj;

  let text = ''
  if(type === 0 ) {

    text = `Better luck next time ! Share it with your friend to Get another chance.`

  }
  else if(type === 1) {
    text = `You have ${title} GEMS in your DESTINY`
  }
  else if(type === 2) {
    text = `You have 1 coupon ${title} in your DESTINY`
  }

  document.getElementById("prize").textContent = text;

  setTimeout(() => {
    document.getElementById("show-prize").classList.add("overlay-pop-up");
  }, 700);
}


//if the user presses back button show the 'sure you want to leave div'
const leaveDiv = document.getElementById("leave-div");

document.getElementById("back-btn").addEventListener("click", function () {
  leaveDiv.classList.add("overlay-pop-up");
});

//if they press claim now remove the leave div and show the wheel page again
const claimNowBtn = document.getElementById("claim-now");

claimNowBtn.addEventListener("click", closeNav2);

const closePrizeBtn = document.getElementById("prize-close");
closePrizeBtn.addEventListener("click", closePrize);


//after the user sees prize and closes it, reload the page
function closePrize(e) {
  
  if (e.target.parentElement.classList.contains("close-btn")) {
    
    window.location.reload();
    return;
  }
  window.location.reload();
}


const showPrizeDiv = $('#show-prize')
$(showPrizeDiv).click(closePrizeWithClickAnywhere);
function closePrizeWithClickAnywhere(e) {
  
  if(e.target !== this) {
    return;
  }
  window.location.reload();
  
}

function closeNav2() {
  leaveDiv.classList.remove("overlay-pop-up");
}
