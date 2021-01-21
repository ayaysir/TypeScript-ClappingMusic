import clapLeft from "./assets/clap-left.mp3"
import clapRight from "./assets/clap-right.mp3"
import silence from "./assets/silence.mp3"

import score from "./assets/score.json"
import Score from "./App"

const NOTE = {
    width: 120,
    height: 20
}
const COORDS = {
    startPosOfLeft: 480,
    startOfJudgeLineY: 636,
    marginXOfNotes: 30
}

const canvas: HTMLCanvasElement = document.createElement("canvas")
canvas.width = 1280
canvas.height = 720

const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

// function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: evt.clientX - rect.left,
//       y: evt.clientY - rect.top
//     };
// }

const showPressEffect = {
    isPressLeft: false,
    isPressRight: false
}

const gameState: {isStart: boolean, startTimestamp: number, translatedScore: {left: number[], right: number[]}} = {
    isStart: false,
    startTimestamp: 0,
    translatedScore: {left: [], right: []}
}

function makeBackgroundGradationOfNoteSide({isLeft}: {isLeft: boolean}) {
    
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!
    const gradient = context.createLinearGradient(0, 300, 0, 0);
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.56)");
    gradient.addColorStop(0.5, "rgba(255, 137, 137, 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    const startX = isLeft ? COORDS.startPosOfLeft : COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes
    context.fillRect(startX, 0, NOTE.width, COORDS.startOfJudgeLineY + NOTE.height);

}



function resetBackgroundGradationOfNoteSide(isLeft: boolean) {
    
    const context: CanvasRenderingContext2D = canvas.getContext("2d")!
    context.fillStyle = "black"
    const startX = isLeft ? COORDS.startPosOfLeft : COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes
    context.fillRect(startX, 0, NOTE.width, COORDS.startOfJudgeLineY + NOTE.height);

}

function renderNoteSide() {
    
    ctx.strokeStyle = "white"

    // left side
    ctx.strokeRect(COORDS.startPosOfLeft, 0, NOTE.width, canvas.height)
    ctx.strokeRect(COORDS.startPosOfLeft, COORDS.startOfJudgeLineY, NOTE.width, NOTE.height)

    const rightSideStartX = COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes

    // right side
    ctx.strokeRect(rightSideStartX, 0, NOTE.width, canvas.height)
    ctx.strokeRect(rightSideStartX, COORDS.startOfJudgeLineY, NOTE.width, NOTE.height)
}

function drawBaseScreen() {

    // draw canvas
    

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '62px Times new roman'
    ctx.fillStyle = "white"
    ctx.fillText("Clapping", 30, 80)
    ctx.fillText("Music", 150, 150)

    renderNoteSide()

}


function drawNote({isLeft, y}: {isLeft: boolean, y: number}) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    const startOfX = isLeft ? COORDS.startPosOfLeft : COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes
    ctx.fillRect(startOfX, y, NOTE.width, NOTE.height)
}

function playSilence() {
    setInterval(() => {
        const audio = new Audio(silence)
        audio.play()
    }, 1000)
}


function setEvents() {
    document.addEventListener("keypress", e => {

        const audioLeft: HTMLAudioElement = new Audio(clapLeft)
        const audioRight: HTMLAudioElement = new Audio(clapRight)
        
        if(e.key === "f" || e.key === "j") {
            const audio = e.key === "f" ? audioLeft : audioRight
            audio.play()
            // makeBackgroundGradationOfNoteSide(e.key === "f")
            e.key === "f" && (showPressEffect.isPressLeft = true)
            e.key === "j" && (showPressEffect.isPressRight = true)
            
        } else if(e.key === " ") {
            // console.log("anti-lagging")
            playSilence()
            gameState.isStart = true
            gameState.startTimestamp = Date.now()
            // console.log(gameState.startTimestamp)
        }
    })
    document.addEventListener("keyup", e => {
        
        if(e.key === "f" || e.key === "j") {
            // resetBackgroundGradationOfNoteSide(ctx, e.key === "f")
            // renderNoteSide(canvas)
            e.key === "f" && (showPressEffect.isPressLeft = false)
            e.key === "j" && (showPressEffect.isPressRight = false)
        }
    })

    document.addEventListener("mousemove", e => {
        // console.log(getMousePos(canvas, e))
    })
}

// temporary variables
let ly = 0
let ry = 0
let my = 0
let currentMeasure = 1

// length of 1 beat
const lengthOfOneBeat = 60 / score.bpm

// draw measure line
function drawMeasureLine(score: Score, y: number) {
    const { bpm } = score
    // console.log(bpm)
    const endX = COORDS.startPosOfLeft + NOTE.width * 2 + COORDS.marginXOfNotes 
    ctx.strokeStyle = "white"
    ctx.beginPath()
    ctx.moveTo(COORDS.startPosOfLeft, y)
    ctx.lineTo(endX, y)
    ctx.stroke()
}

function placeNotes(score: Score) {
    const output: {left: number[], right: number[]} = {
        left: [],
        right: []
    }

    let i_left = 0
    for(let measure of score.clap_left) {
        for(let j = 0; j < 4; j++) {
            for(let c = 0; c < measure.length; c++) {
                if(measure[c] === "v") {
                    output.left.push( 652.98 * 0.6818 / 4 * i_left )
                } 
                i_left--
            }
        }
    }

    let i_right = 0
    for(let measure of score.clap_right) {
        for(let j = 0; j < 4; j++) {
            for(let c = 0; c < measure.length; c++) {
                if(measure[c] === "v") {
                    output.right.push( 652.98 * 0.6818 / 4 * i_right )
                } 
                i_right--
            }
        }
    }

    return output
}

function loop(timestamp: any) {
    window.requestAnimationFrame(loop)
    drawBaseScreen()

    if(showPressEffect.isPressLeft) {
        makeBackgroundGradationOfNoteSide({ isLeft: true })
    }

    if(showPressEffect.isPressRight) {
        makeBackgroundGradationOfNoteSide({ isLeft: false })
    }

    if(gameState.isStart) {
        
        // 일단 속도는 60fps 를 가정
        

        
        for(let i = -52; i <= 0; i++) {
            drawMeasureLine(score, my + 652.98 * 0.6818 * i + NOTE.height / 2)
        }

        
        // for(let i = -52 * 4; i <= 0; i++) {
        //     drawNote({isLeft: true, y: ly + 652.98 * 0.6818 / 4 * i})
        //     drawNote({isLeft: false, y: ly + 652.98 * 0.6818 / 4 * i})
        // }

        // 왼손
        for(let el of gameState.translatedScore.left) {
            drawNote({isLeft: true, y: ly + el})
        }

        // 오른손
        for(let el of gameState.translatedScore.right) {
            drawNote({isLeft: false, y: ry + el})
        }


        ly += 10.883
        ry += 10.883
        my += 10.883 // 1/60fps 당 몇 픽셀을 움직일 지 // 1초: 652.98 움직임
    }

}

export default function App() {
    
    gameState.translatedScore = placeNotes(score)
    loop(0)
    setEvents()
    console.log(placeNotes(score))

    return canvas
}