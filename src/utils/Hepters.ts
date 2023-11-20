import { Point } from "./CustomTypes";

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