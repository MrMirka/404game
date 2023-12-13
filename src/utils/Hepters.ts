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

export function getDuration(from: Point, to: Point, speed: number): number {
  let timeX = Math.abs(to.x - from.x) / speed;
  let timeY = Math.abs(to.y - from.y) / speed;
  let duration = Math.max(timeX, timeY) * 1000;
  return duration
}