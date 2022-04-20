let start = document.getElementById('start');
let shareDiv = document.getElementById('share')

let currentDegree = 0;

start.addEventListener('click',spinWheel)
let prizeAnnounce = document.getElementById('prize-announce');



let audio = document.querySelector('audio');

let audioDiv = document.getElementById('audio-div');


document.addEventListener("DOMContentLoaded", function() {
    prizeAnnounce.innerHTML = `You have <span id="amount">${1}</span> chance`
    /**
     * 
     * Chrome's autoplay policies are simple:

Muted autoplay is always allowed.
Autoplay with sound is allowed if:
The user has interacted with the domain (click, tap, etc.).
    */
    

//audio.play();
  });


let prize1 = document.querySelector('#spoke1 >div>div:nth-child(2)>span').textContent
let prize2 = document.querySelector('#spoke2 >div>div:nth-child(2)>span').textContent
let prize3 = document.querySelector('#spoke3 >div>div:nth-child(2)>span').textContent
let prize4 = document.querySelector('#spoke4 >div>div:nth-child(2)>span').textContent
let prize5 = document.querySelector('#spoke5 >div>div:nth-child(2)>span').textContent
let prize6 = document.querySelector('#spoke6 >div>div:nth-child(2)>span').textContent
let prize7 = document.querySelector('#spoke7 >div>div:nth-child(2)>span').textContent
let prize8 = document.querySelector('#spoke8 >div>div:nth-child(2)>span').textContent



//ranges to check which prize was won, each prize spoke has .125 arc space
let rangeObject = {
    firstPrize: {
        min: .9376,
        max: -.0625,
        prize: prize1
    },
    secondPrize: {
        min: .8126,
        max: .9375,
        prize: prize2
    },
    thirdPrize:{
        min: .6876,
        max: .8125,
        prize: prize3
    },
    fourthPrize: {
        min: .5626,
        max: .6875,
        prize: prize4
    },
    fifthPrize: {
        min: .4376,
        max: .5625,
        prize: prize5
    },
    sixthPrize: {
        min: .3126,
        max: .4375,
        prize: prize6
    },
    seventhPrize: {
        min: .1876,
        max: .3125,
        prize: prize7
    },
    eightPrize: {
        min: .0626,
        max: .1875,
        prize: prize8
    }


}




function spinWheel() {
    let x = 1024;
    let y  = 9999;
    let degree = currentDegree + Math.floor(Math.random() * (y - x + 1))+y;
    console.log(degree)
    currentDegree = degree;
    start.removeEventListener('click', spinWheel)
    /* Add event listener afterwards if the user gets spin chance after share on socials
    start.addEventListener('click',spinWheel)
    
    setTimeout(() => {
    }, 7000);
    */
    
    document.querySelector('.wheel').style.transform = "rotate("+degree+"deg)"
    let count = 0;
    let t = setInterval(() => {
        count++;
        let orange = document.querySelectorAll('.o >span:nth-child(odd) .b ')
        let white =  document.querySelectorAll('.o >span:nth-child(even) .b ')
        if(count%2 == 1){
          orange.forEach( node => node.style.backgroundColor = '#fff')
          white.forEach(node => node.style.backgroundColor = "#ff8830")
        }else{
          orange.forEach(node => node.style.backgroundColor = '#ff8830')
          white.forEach(node => node.style.backgroundColor = "#fff")
        }
       
        if(count === 14) {
            clearInterval(t)
        }
    }, 500);
}


//pop up prize window after spin

document.querySelector('.wheel').addEventListener('transitionend', function() {
    
 
    
   
    let decimalPart = getDecimalPart(currentDegree/360);
 
    for (let key in rangeObject){


        if(between(decimalPart, rangeObject[key].min,  rangeObject[key].max)){
            console.log(rangeObject[key].prize)
            document.getElementById('prize').textContent= rangeObject[key].prize
            setTimeout(() => {
               
                document.getElementById('show-prize').classList.add('overlay-pop-up')
                prizeAnnounce.innerHTML =`You have won <span id="amount">${rangeObject[key].prize}</span>`


            }, 700);
            break
        }
    }


    
})


const rulesBtn = document.getElementById('rules-btn');
const rulesPage = document.getElementById('rules-page')
rulesBtn.addEventListener('click', function() {
    rulesPage.style.transform = "translateX(0)"
    //history.pushState({'page_id': 1}, '', 'index.html')
})

const rulesBack = document.getElementById('rules-back-btn');
rulesBack.addEventListener('click', function() {

    rulesPage.style.transform = "translateX(100%)"

})


function getDecimalPart(num) {
    if (Number.isInteger(num)) {
      return 0;
    }
  
    const decimalStr = "." + num.toString().split('.')[1];
    return Number(decimalStr);
}

function between(x, min, max) {


    if(x>=.9376 || x<=.0625) {
        return true;
    }
    return x >= min && x <= max;
}

function closeNav() {

    start.innerText = `SHARE to check what is in your DESTINY again`
    start.addEventListener('click', function() {
        //share logic here

    })
    /*
    if(e.target.parentElement.classList.contains('close-btn')){

        document.getElementById('show-prize').classList.remove('overlay-pop-up')
        return
    }*/
    document.getElementById('show-prize').classList.remove('overlay-pop-up')

}




//AUudio


audioDiv.addEventListener('click', function() {

    if(audio.paused) {
        audio.play()
        audioDiv.classList.remove('audio-paused')
        return
    }

    audio.pause();
    audioDiv.classList.add('audio-paused')

})

const backBtnHome = document.getElementById('back-btn');
const leaveDiv = document.getElementById('leave-div')

const claimNowBtn = document.getElementById('claim-now')

claimNowBtn.addEventListener('click', closeNav2)

function closeNav2() {
    

    leaveDiv.classList.remove('overlay-pop-up')

}


//function to GO BACK when the user wants to leave the entire page
function goBack() {
    //write logic here
}


backBtnHome.addEventListener('click', function() {
    
    leaveDiv.classList.add('overlay-pop-up')

})

