export class AnimatedObject {
    position: {x:number, y: number}
    constructor(position:{x:number, y: number}) {
        this.position = position
    }

    getPosition() {
        return { x: Math.floor(this.position.x), y: Math.floor(this.position.y) }
    }
}