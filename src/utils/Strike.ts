import { Point } from "../utils/CustomTypes";
import * as PIXI from 'pixi.js';

export class Strike {
    private startPoint: Point
    private endPoint: Point
    constructor(startPoint: Point) {
        this.startPoint = startPoint
    }

    init(power: (position: { x: number, y: number })=>void){
        let c = this
        document.addEventListener('mousemove', function(event) {
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            c.setEndPoint({x:mouseX, y:mouseY})
            power({x:mouseX, y:mouseY})
        });
    }

    setEndPoint(position: { x: number, y: number }) {
        this.endPoint = {x:position.x, y:position.y}
    }

    getEndPoint() {
        return this.endPoint
    }
    

}