import * as PIXI from 'pixi.js';
import { BoundingBox } from './Collition';
import { Point } from './CustomTypes';

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


export function drawLine(points:Point[]): PIXI.Graphics {
    // Создаем новый экземпляр PIXI.Graphics
    let line = new PIXI.Graphics();
  
    // Начинаем рисовать линию
    line.lineStyle(2, 0xFFFFFF, 1); // Задаем стиль линии (толщина, цвет, прозрачность)
  
    // Перемещаем "перо" в начальную точку
    line.moveTo(points[0].x, points[0].y);
  
    // Рисуем линии к каждой точке в массиве
    points.forEach(point => {
        line.lineTo(point.x, point.y);
    });
  
    // Добавляем нарисованную линию в приложение PIXI
    return line
  }
  