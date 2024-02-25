import { Sprite, Ticker } from "pixi.js"
import { Point, Speed } from "../utils/CustomTypes"
import { getSpeed } from "../utils/Hepters"

export class AnimationPosition {
    private from: { x: number, y: number }
    private to: { x: number, y: number }
    private path: Point[]
    private speedValue: Speed
    private currentStep = -1 //отризательное значение чтобы при выполнение initSpeedValue() начальное значение было 0
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

    setMultiplePath(path: Point[]) {
        this.path = path
    }

    resetToDefault(){
        this.currentStep = -1
    }

    initSpeedValue() {
        this.currentStep++
        if (this.currentStep < this.path.length - 1 ) {
            this.speedValue = getSpeed(this.path[this.currentStep], this.path[this.currentStep+1], this.speed)
         }
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

        

        const speedValue = getSpeed(this.from, this.to, this.speed)

       

        let startTime: number = null;
        this.isAnimation = true

        callbacks.onStart()

        this.animationHandler = () => {
            if (this.isAnimation) {
                let currentTime = performance.now(); //Тукущее время
                if (!startTime) startTime = currentTime;
                let elapsedTime = currentTime - startTime; //Время с начала анимации

                if (elapsedTime < speedValue.duration) {
                    let newX = this.from.x + speedValue.speedX * elapsedTime;
                    let newY = this.from.y + speedValue.speedY * elapsedTime;
                    callbacks.onUpdate({ x: newX, y: newY });
                }
                if (elapsedTime >= speedValue.duration) {
                    callbacks.onStop()
                    this.isAnimation = false
                    this.ticker.remove(this.animationHandler);

                }
            }

        }

        this.ticker.add(this.animationHandler);
    }

    startPath(callbacks: {
        onStart?: () => void,
        onUpdate: (position: { x: number, y: number }) => void,
        onStop?: () => void
    }) {
        
        if (this.animationHandler) {
            this.ticker.remove(this.animationHandler);
            this.animationHandler = undefined;
        }

    
        this.initSpeedValue()

        let startTime: number = null;
        this.isAnimation = true

        callbacks.onStart()

        this.animationHandler = () => {
            if (this.isAnimation) {
                 if (this.currentStep === this.path.length - 1) {
                    callbacks.onStop()
                    this.isAnimation = false
                    this.ticker.remove(this.animationHandler);
                } 

                let currentTime = performance.now(); //Текущее время
                if (!startTime) startTime = currentTime;
                let elapsedTime = currentTime - startTime; //Время с начала анимации
                
                if (elapsedTime < this.speedValue.duration) {
                    let newX = this.path[this.currentStep].x + this.speedValue.speedX * elapsedTime;
                    let newY = this.path[this.currentStep].y + this.speedValue.speedY * elapsedTime;
                    callbacks.onUpdate({ x: newX, y: newY });
                } else {
                    
                    this.initSpeedValue()
                    currentTime = performance.now();
                    startTime = currentTime;
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