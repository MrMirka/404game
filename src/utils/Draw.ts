import * as PIXI from 'pixi.js';
import { BoundingBox } from './Collition';

export function DrawBoundingBox(boundingBox: BoundingBox): PIXI.Graphics {
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xff0000);
    rectangle.drawRect(
        boundingBox.coordinate.x,
        boundingBox.coordinate.y,
        boundingBox.width,
        boundingBox.height);

    rectangle.endFill();
    return rectangle;
}