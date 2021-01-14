import clapHighLeft from "./assets/clap-high-left.mp3"
import clapLowLeft from "./assets/clap-low-left.mp3"
import clapLowRight from "./assets/clap-low-right.mp3"
import clapHighRight from "./assets/clap-high-right.mp3"

export default function App() {
    const canvas: HTMLCanvasElement = document.createElement("canvas")
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight - 5

    // draw canvas
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!

    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.font = '62px Times new roman'
    ctx.fillStyle = "white"
    ctx.fillText("Clapping", 30, 80)
    ctx.fillText("Music", 150, 150)

    document.addEventListener("keypress", e => {
        const keyMapping = {
            "d": clapHighLeft,
            "f": clapLowLeft,
            "j": clapLowRight,
            "k": clapHighRight
        }
        if(e.key === "d" || e.key === "f" || e.key === "j" || e.key === "k") {
            const audio: HTMLAudioElement = new Audio(keyMapping[e.key])
            audio.play()
        }
    })

    // const img = document.createElement("img")
    // img.src = clapHighLeft.default
    // return img

    return canvas
}