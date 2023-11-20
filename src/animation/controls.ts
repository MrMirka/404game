import { Sprite, Ticker } from "pixi.js"

export class AnimationPosition {
    private from: { x: number, y: number }
    private to: { x: number, y: number }
    private speed: number
    private ticker: Ticker
    private isAnimation: Boolean = false
    private animationHandler?: (deltaTime: number) => void;

    constructor(speed: number, ticker: Ticker) {
        this.speed = speed
        this.ticker = ticker
    }

    /**
     * Настраиваем параметры анимации
     * @param from начальные координаты
     * @param to конечные координаты
     */
    setAnimationCoordinate(from: { x: number, y: number }, to: { x: number, y: number }) {
        this.from = from
        this.to = to
    }

    /**
     * Запускаем анимацию
     * @param onUpdate каждый тик возвращает обновденные координаты X Y
     */
    start(callbacks: {
        onStart?: () => void,
        onUpdate: (position: { x: number, y: number }) => void,
        onStop?: () => void
    }) {
        if (this.animationHandler) {
            this.ticker.remove(this.animationHandler);
            this.animationHandler = undefined; 
        }

        let timeX = Math.abs(this.to.x - this.from.x) / this.speed;
        let timeY = Math.abs(this.to.y - this.from.y) / this.speed;

        let duration = Math.max(timeX, timeY) * 1000;

        let speedX = (this.to.x - this.from.x) / duration;
        let speedY = (this.to.y - this.from.y) / duration;

        let startTime: number = null;
        this.isAnimation = true
        
       callbacks.onStart()
        this.animationHandler = () => {
            if (this.isAnimation) {
                let currentTime = performance.now(); //Тукущее время
                if (!startTime) startTime = currentTime;
                let elapsedTime = currentTime - startTime; //Время с начала анимации

                if (elapsedTime < duration) {
                    let newX = this.from.x + speedX * elapsedTime;
                    let newY = this.from.y + speedY * elapsedTime;
                    callbacks.onUpdate({ x: newX, y: newY });
                }
                if (elapsedTime >= duration) {
                    callbacks.onStop()
                    this.isAnimation = false
                    this.ticker.remove(this.animationHandler);
                    
                }
            }

        }
        
        this.ticker.add(this.animationHandler);
    }

    /**
     * Отсанавливает анимацию
     */
    stop() {
        this.isAnimation = false
    }

    updateTicker(ticker: Ticker) {
       
        this.ticker = ticker
    }
}