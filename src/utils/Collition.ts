import { Point } from "./CustomTypes";

export interface BoundingBox {
    id: number
    coordinate: Point,
    width: number,
    height: number
}

export interface CollitionLine {
    p1: Point,
    p2: Point,
    normal: Point
}

export class Collisions {
    private collisionsObj: BoundingBox[] = [] //
    private collisionsLines: CollitionLine[] = [] //

    /**
     * Добавляем объект коллизии
     * @param item эллемент реализующий CollisionsItem
     */
    addCollition(item: BoundingBox): void {
        //item.width *= window.devicePixelRatio
        //item.height *= window.devicePixelRatio
        this.collisionsObj.push(item)
    }

    /**
     * Удаляем объект коллизии
     * @param targetId идентификатор объекта
     */
    deleteCollition(targetId: number): void {
        const index = this.collisionsObj.findIndex(item => item.id === targetId);
        if (index !== -1) {
            this.collisionsObj.splice(index, 1);
        }
    }

    /**
     * Возвращаем все объекты коллизии
     * @returns 
     */
    getCollitionsItems() {
        return this.collisionsLines
    }

   
    /**
     * Разбираем Bounding Boxes на отдельыные линии и назначаем им нормали
     */
    initCollitions() {
        this.collisionsObj.forEach(element => {
            // Определяем направляющие векторы для сторон прямоугольника
            const directions = [
                { x: element.width, y: 0 }, // Вправо
                { x: 0, y: element.height }, // Вниз
                { x: -element.width, y: 0 }, // Влево
                { x: 0, y: -element.height } // Вверх
            ];
    
            // Начальная точка
            let currentPoint = { ...element.coordinate };
    
            // Строим линии и их нормали
            directions.forEach((dir, i) => {
                const nextPoint: Point = {
                    x: currentPoint.x + dir.x,
                    y: currentPoint.y + dir.y
                };
                const line: CollitionLine = {
                    p1: currentPoint,
                    p2: nextPoint,
                    normal: this.calculateNormal(currentPoint, nextPoint)
                };
                this.collisionsLines.push(line);
                currentPoint = nextPoint; // Следующая стартовая точка для линии
            });
        });
    }
    

    /**
     * Рассчитываем нормаль но двум точкам
     * @param p1 
     * @param p2 
     * @returns вектор нормали
     */
    private calculateNormal(p1: Point, p2: Point): Point {
        // Вектор направления линии
        const direction = { x: p2.x - p1.x, y: p2.y - p1.y };
        // Нормаль к линии
        const normal = { x: -direction.y, y: direction.x };
        // Нормализация нормали (необязательно, если вам нужна только направление)
        const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
        const normalizedNormal = { x: normal.x / length, y: normal.y / length };
      
        return normalizedNormal;
      }
}

