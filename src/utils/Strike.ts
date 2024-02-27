import { Point } from "../utils/CustomTypes";
import * as PIXI from 'pixi.js';

export class Strike {
    private startPoint: Point

    constructor(startPoint: Point) {
        this.startPoint = startPoint
    }

    init(power: (position: { x: number, y: number })=>void){
        document.addEventListener('mousemove', function(event) {
            let mouseX = event.clientX;
            let mouseY = event.clientY;
            power({x:mouseX, y:mouseY})
        });
    }

}