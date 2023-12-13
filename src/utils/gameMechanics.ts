import { CollitionLine } from "./Collition";
import { Point } from "./CustomTypes";
import { getDistance } from "./Hepters";

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

export function getSafeDestination(
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



/**
 * Находит вектор отражения от прамого угла
 * @param startPoint начальная позиция
 * @param collisionPoint точка перечечения с препятствием
 * @param targetPoint когечная точка
 * @param normal нормаль {x:1, y:0} или {x:0, y:1}
 * @returns 
 */
export function reflectVector(startPoint:Point , collisionPoint:Point, targetPoint:Point, normal:Point) {
  // Вектор движения от начальной точки до точки столкновения
  let directionVector = { x: targetPoint.x - collisionPoint.x, y: targetPoint.y - collisionPoint.y };


  // Отражение по оси X
  if (Math.abs(normal.x) === 1 && Math.abs(normal.y) === 0) {
      return {
          x: collisionPoint.x - directionVector.x,
          y: targetPoint.y
      };
  }
  // Отражение по оси Y
  else if (Math.abs(normal.x) === 0 && Math.abs(normal.y) === 1) {
      return {
          x: targetPoint.x,
          y: collisionPoint.y - directionVector.y
      };
  }
}


export function getPath(
  startPosition: Point,
  endPosition: Point,
  obstacles: CollitionLine[],
  buffer: number = 1
): Point[] {
  let path: Point[] = []; // Инициализация пути

  // Рассчитываем направление и длину вектора движения
  const dir = { x: endPosition.x - startPosition.x, y: endPosition.y - startPosition.y };
  const mag = Math.sqrt(dir.x ** 2 + dir.y ** 2);
  const normDir = { x: dir.x / mag, y: dir.y / mag }; // Нормализованный вектор направления

  // Переменные для хранения ближайшего пересечения и его расстояния
  let closestIntersection: Point | null = null;
  let closestDistance = mag;

  // Пересечение движения с каждым препятствием
  let xLine: CollitionLine = null; // Сохраняем ближайшую линию с которой произошло пересечение
  obstacles.forEach(obstacle => {
    const intersection = getIntersection({ p1: startPosition, p2: endPosition, normal: normDir }, obstacle);
    if (intersection) {
      const distToIntersection = Math.hypot(intersection.x - startPosition.x, intersection.y - startPosition.y);
      if (distToIntersection < closestDistance) {
        closestDistance = distToIntersection - buffer + 2; // Учитываем буфер
        closestIntersection = intersection;
        xLine = obstacle;
      }
    }
  });

  // Возвращаем ближайшую точку до пересечения с учетом буфера
  if (closestIntersection && closestDistance > 0) {
    const closestPoint = {
      x: Math.floor(startPosition.x + closestDistance * normDir.x),
      y: Math.floor(startPosition.y + closestDistance * normDir.y)
    };
    let newDispansePoint: Point = reflectVector(startPosition, closestPoint, endPosition, xLine.normal);
    // Объединяем текущий путь с результатом рекурсивного вызова
    path.push(closestPoint);
    path = path.concat(getPath(closestPoint, newDispansePoint, obstacles, buffer));
  } else {
    path.push(endPosition);
  }

  return path;
}
