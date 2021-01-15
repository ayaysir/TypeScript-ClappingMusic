import clapLeft from "./assets/clap-left.mp3"
import clapRight from "./assets/clap-right.mp3"

const NOTE = {
    width: 120,
    height: 20
}
const COORDS = {
    startPosOfLeft: 480,
    startOfJudgeLineY: 636,
    marginXOfNotes: 30
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function makeBackgroundGradationOfNoteSide(context: CanvasRenderingContext2D, isLeft: boolean) {
    
    const gradient = context.createLinearGradient(0, 300, 0, 0);
    gradient.addColorStop(0, "rgba(255, 0, 0, 0.56)");
    gradient.addColorStop(0.5, "rgba(255, 137, 137, 0)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.fillStyle = gradient;
    const startX = isLeft ? COORDS.startPosOfLeft : COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes
    context.fillRect(startX, 0, NOTE.width, COORDS.startOfJudgeLineY + NOTE.height);

}

function resetBackgroundGradationOfNoteSide(context: CanvasRenderingContext2D, isLeft: boolean) {
    
    context.fillStyle = "black"
    const startX = isLeft ? COORDS.startPosOfLeft : COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes
    context.fillRect(startX, 0, NOTE.width, COORDS.startOfJudgeLineY + NOTE.height);

}

function renderNoteSide(canvas: HTMLCanvasElement) {
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!
    ctx.strokeStyle = "white"

    // left side
    ctx.strokeRect(COORDS.startPosOfLeft, 0, NOTE.width, canvas.height)
    ctx.strokeRect(COORDS.startPosOfLeft, COORDS.startOfJudgeLineY, NOTE.width, NOTE.height)

    const rightSideStartX = COORDS.startPosOfLeft + NOTE.width + COORDS.marginXOfNotes

    // right side
    ctx.strokeRect(rightSideStartX, 0, NOTE.width, canvas.height)
    ctx.strokeRect(rightSideStartX, COORDS.startOfJudgeLineY, NOTE.width, NOTE.height)
}

export default function App() {
    const canvas: HTMLCanvasElement = document.createElement("canvas")
    canvas.width = 1280
    canvas.height = 720

    // draw canvas
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '62px Times new roman'
    ctx.fillStyle = "white"
    ctx.fillText("Clapping", 30, 80)
    ctx.fillText("Music", 150, 150)

    renderNoteSide(canvas)

    document.addEventListener("keypress", e => {
        const keyMapping = {
            "f": clapLeft,
            "j": clapRight,
        }
        if(e.key === "f" || e.key === "j") {
            const audio: HTMLAudioElement = new Audio(keyMapping[e.key])
            audio.play()
            makeBackgroundGradationOfNoteSide(ctx, e.key === "f")
        }
    })
    document.addEventListener("keyup", e => {
        
        if(e.key === "f" || e.key === "j") {
            resetBackgroundGradationOfNoteSide(ctx, e.key === "f")
            renderNoteSide(canvas)
        }
    })


    document.addEventListener("mousemove", e => {
        console.log(getMousePos(canvas, e))
    })

    // const img = document.createElement("img")
    // img.src = clapHighLeft.default
    // return img

    return canvas
}