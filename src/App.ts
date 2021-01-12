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

    return canvas
}