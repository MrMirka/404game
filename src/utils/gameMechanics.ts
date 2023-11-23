import { CollitionLine } from "./Collition";
import { Point } from "./CustomTypes";

/**
 * Определяет, есть ли на пути персонажа препятствие
 * @param startPosition начальная позиция персонажа
 * @param endPosition координаты назначания
 * @param obstacles координаты пикселей которые являются препятствием
 * @param threshold чувствительность
 * @returns 
 */
export function isPathClear(
  startPosition: Point,
  endPosition: Point,
  obstacles: Point[],
  threshold: number = 1
): boolean {
  
  for (const obstacle of obstacles) {
    if (Math.min(startPosition.x, endPosition.x) - threshold <= obstacle.x && obstacle.x <= Math.max(startPosition.x, endPosition.x) + threshold &&
      Math.min(startPosition.y, endPosition.y) - threshold <= obstacle.y && obstacle.y <= Math.max(startPosition.y, endPosition.y) + threshold) {
      return false;
    }
  }
  return true; 
}

/**
 * Возвращяет находящиеся на расстоянии buffer от препятствия
 * и если препятятвия нет то возврашает координаты без модификации
 * @param startPosition исходное положение персонажа
 * @param endPosition точка назначения
 * @param obstacles массив координат препятствий
 * @param buffer размер дистанции на которой персонаж останавливается перед препятствием
 * @returns 
 */
export function getSafeDestination(
  startPosition: Point,
  endPosition: Point,
  obstacles: Point[],
  buffer: number = 1
): Point {

  // Направление движения
  const dir = {
    x: endPosition.x - startPosition.x,
    y: endPosition.y - startPosition.y
  };

  // Нормализация направления
  const mag = Math.sqrt(dir.x ** 2 + dir.y ** 2);
  const normDir = {
    x: dir.x / mag,
    y: dir.y / mag
  };

  // Проверяем каждое препятствие
  let minDist = mag; // Минимальное расстояние до препятствия
  let intersectionPoint = null; // Точка пересечения

  obstacles.forEach(obstacle => {
    // Вектор от начальной точки до препятствия
    const toObstacle = {
      x: obstacle.x - startPosition.x,
      y: obstacle.y - startPosition.y
    };

    // Проекция вектора на направление движения
    const scalarProjection = (toObstacle.x * normDir.x + toObstacle.y * normDir.y);

    // Точка на линии движения, ближайшая к препятствию
    const closestPoint = {
      x: startPosition.x + scalarProjection * normDir.x,
      y: startPosition.y + scalarProjection * normDir.y
    };

    // Проверяем, лежит ли ближайшая точка на отрезке движения и в радиусе buffer от препятствия
    if (scalarProjection > 0 && scalarProjection < minDist &&
      Math.sqrt((closestPoint.x - obstacle.x) ** 2 + (closestPoint.y - obstacle.y) ** 2) < buffer) {
      minDist = scalarProjection - buffer; // Уменьшаем расстояние, чтобы создать буфер
      intersectionPoint = closestPoint; // Обновляем точку пересечения
    }
  });

  if (intersectionPoint) {
    // Возвращаем точку перед препятствием, отступив на buffer
    return {
      x: Math.floor(startPosition.x + normDir.x * minDist),
      y: Math.floor(startPosition.y + normDir.y * minDist)
    };
  }

  // Если нет пересечения, возвращаем исходную конечную точку
  return endPosition;
}

/**
 * Вычисляет, был ли сделан клик по заданной области
 * @param positionObject координаты объекта
 * @param positionClick  координаты клика
 * @param radius радиус в пикселях от кординат объекта
 * @returns 
 */
export function isClickToObject(positionObject: Point, positionClick: Point, radius: number): boolean {
  const distance = Math.sqrt(
    Math.pow(positionClick.x - positionObject.x, 2) +
    Math.pow(positionClick.y - positionObject.y, 2)
  );

  return distance <= radius;
}


/**
 * Возврашяет координаты на которые должен быть перемещен мяч после удара
 * @param playerPosition позиция игрока до удара
 * @param ballPosition позиция мяча до удара
 * @param hitPower сила удара
 * @returns 
 */
export function findTargetPoint(playerPosition: Point, ballPosition: Point, hitPower: number): Point {
    // Вектор от игрока к мячу (заметьте, что теперь мы вычитаем позицию игрока из позиции мяча)
    const directionVector = {
        x: ballPosition.x - playerPosition.x,
        y: ballPosition.y - playerPosition.y,
    };

    // Если игрок и мяч находятся в одной точке, вектор направления не может быть вычислен
    if (directionVector.x === 0 && directionVector.y === 0) {
        throw new Error("Player and ball are in the same position");
    }

    // Длина вектора
    const length = Math.sqrt(directionVector.x ** 2 + directionVector.y ** 2);

    // Нормализация вектора
    const normalizedVector = {
        x: directionVector.x / length,
        y: directionVector.y / length,
    };

    // Вектор перемещения
    const movementVector = {
        x: normalizedVector.x * hitPower,
        y: normalizedVector.y * hitPower,
    };

    // Новая позиция мяча
    const newBallPosition = {
        x: ballPosition.x + movementVector.x,
        y: ballPosition.y + movementVector.y,
    };

    // Проверка, чтобы мяч не вышел за пределы поля
    // Убедитесь, что вы заменили /* максимальный x */ и /* максимальный y */
    // на реальные ограничения вашего игрового поля
    const checkedBallPosition = {
        x: Math.max(0, Math.min(newBallPosition.x, /* максимальный x */)),
        y: Math.max(0, Math.min(newBallPosition.y, /* максимальный y */)),
    };

    return checkedBallPosition;
}


function getIntersection(line1: CollitionLine, line2: CollitionLine): Point | null {
  // Алгоритм нахождения точки пересечения двух линий
  // Используем формулу нахождения пересечения из алгебраической геометрии
  let denominator = (line1.p1.x - line1.p2.x) * (line2.p1.y - line2.p2.y) - (line1.p1.y - line1.p2.y) * (line2.p1.x - line2.p2.x);
  if (denominator === 0) {
    return null; // Линии параллельны или совпадают
  }

  let a = line1.p1.y - line2.p1.y;
  let b = line1.p1.x - line2.p1.x;
  let numerator1 = (line2.p2.x - line2.p1.x) * a - (line2.p2.y - line2.p1.y) * b;
  let numerator2 = (line1.p2.x - line1.p1.x) * a - (line1.p2.y - line1.p1.y) * b;

  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // Проверяем, лежит ли точка пересечения на обеих линиях-отрезках
  if (a >= 0 && a <= 1 && b >= 0 && b <= 1) {
    return {
      x: line1.p1.x + a * (line1.p2.x - line1.p1.x),
      y: line1.p1.y + a * (line1.p2.y - line1.p1.y)
    };
  }

  return null;
}

export function getSafeDestination2(
  startPosition: Point,
  endPosition: Point,
  obstacles: CollitionLine[],
  buffer: number = 1
): Point {
  // Рассчитываем направление и длину вектора движения
  const dir = { x: endPosition.x - startPosition.x, y: endPosition.y - startPosition.y };
  const mag = Math.sqrt(dir.x ** 2 + dir.y ** 2);
  const normDir = { x: dir.x / mag, y: dir.y / mag }; // Нормализованный вектор направления

  // Переменные для хранения ближайшего пересечения и его расстояния
  let closestIntersection: Point | null = null;
  let closestDistance = mag;

  // Пересечение движения с каждым препятствием
  obstacles.forEach(obstacle => {
    const intersection = getIntersection({ p1: startPosition, p2: endPosition, normal: normDir }, obstacle);
    if (intersection) {
      const distToIntersection = Math.hypot(intersection.x - startPosition.x, intersection.y - startPosition.y);
      if (distToIntersection < closestDistance) {
        closestDistance = distToIntersection - buffer + 2; // Учитываем буфер
        closestIntersection = intersection;
      }
    }
  });

  // Возвращаем ближайшую точку до пересечения с учетом буфера
  if (closestIntersection && closestDistance > 0) {
    return {
      x: Math.floor(startPosition.x + closestDistance * normDir.x),
      y: Math.floor(startPosition.y + closestDistance * normDir.y)
    };
  }

  // Возвращаем конечную точку, если пересечений нет
  return endPosition;
}
