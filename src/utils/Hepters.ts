import { BoundingBox, CollitionLine } from "./Collition";
import { Point, Speed } from "./CustomTypes";

/**
 * Возвращает расстоние между двумя точками в пространстве
 * @param firstPoint 
 * @param secondPoint 
 * @returns 
 */
export function getDistance(firstPoint: Point, secondPoint: Point): number {
  const distance = Math.sqrt(
    Math.pow(secondPoint.x - firstPoint.x, 2) +
    Math.pow(secondPoint.y - firstPoint.y, 2)
  );

  return distance;
}

/**
 * Возвращает значение приращения в такущий позиции
 * @param from Начальная позиция объкета
 * @param to Конечная позиция объекта
 * @param speed скорось с которой объект движется
 * @returns значение которое будет прибавляться к координате каждой в тиках анимации
 */
export function getSpeed(from: Point, to: Point, speed: number): Speed {
  const result: Speed = { speedX: 0, speedY: 0, duration: 0 }
  result.duration = getDuration(from, to ,speed)
  result.speedX = (to.x - from.x) / result.duration;
  result.speedY = (to.y - from.y) / result.duration;
  return result
}

/**
 * Рассчитывает продлолжительность анимации
 * @param from 
 * @param to 
 * @param speed 
 * @returns 
 */
export function getDuration(from: Point, to: Point, speed: number): number {
  let timeX = Math.abs(to.x - from.x) / speed;
  let timeY = Math.abs(to.y - from.y) / speed;
  let duration = Math.max(timeX, timeY) * 1000;
  return duration
}

/**
 * Делает упрощенную версию объекта коллизии без номралей и с удалкнием дублируюзих точек.
 * Используется для определения находится ди опрееленная точка в границах объекта коллизии
 * @param obj 
 * @returns 
 */
export function simplyfyCollitionObj(obj: CollitionLine[]): Point[] {
  const cleanArray = obj.flatMap(item=>[item.p1, item.p2])
  const uniquePointsSet = new Set(cleanArray.map(point => JSON.stringify(point)));
  const uniquePointsArray = [...uniquePointsSet].map(str => JSON.parse(str));
  return uniquePointsArray
}

