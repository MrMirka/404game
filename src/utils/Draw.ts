import * as PIXI from 'pixi.js';
import { BoundingBox } from './Collition';
import { Point } from './CustomTypes';

export function DrawBoundingBox(boundingBox: BoundingBox): PIXI.Graphics {
    const rectangle = new PIXI.Graphics();
    rectangle.beginFill(0xff8800);
    rectangle.drawRect(
        boundingBox.coordinate.x,
        boundingBox.coordinate.y,
        boundingBox.width,
        boundingBox.height);

    rectangle.endFill();
    return rectangle;
}


export function drawLine(points: Point[]): PIXI.Graphics {
    let line = new PIXI.Graphics();
    line.lineStyle(2, 0xFFFFFF, 1); // Задаем стиль линии (толщина, цвет, прозрачность)
    line.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
        line.lineTo(point.x, point.y);
    });
    return line
}
