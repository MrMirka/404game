import { Sprite, AnimatedSprite } from "pixi.js";
import { getSpriteSheet } from "./SpritesController";
import { AnimatedObject } from "./Base";


export class Player extends AnimatedObject {
    private animConfig: any;
    private sprite: AnimatedSprite
    private isWalk: boolean = false
    constructor(animConfig: any, position: { x: number, y: number }) {
        super(position)
        this.animConfig = animConfig

    }

    /**
     * Ставит игрока с стартовую позицию
     * @param stage сцена PIXI.JS
     */
    init(stage: any) {
        if (stage) {
            getSpriteSheet(this.animConfig).then(anim => {
                this.sprite = anim;
                this.sprite.anchor.set(0.5);
                this.sprite.x = this.position.x
                this.sprite.y = this.position.y
                this.sprite.animationSpeed = 0.1666;
                stage.addChild(this.sprite);
            });


        }
    }

    /**
     * Перемещает игрока по заданным координатам
     * @param position X & Y
     */
    moveTo(position: { x: number, y: number }) {
        if (this.sprite) {
            this.position = position
            this.sprite.x = this.position.x
            this.sprite.y = this.position.y
        }

    }

    getIsWalk() {
        return this.isWalk
    }

    run() {
        if (this.sprite) {
            this.isWalk = true
            this.sprite.play()
        }
    }

    stop() {
        if (this.sprite) {
            this.isWalk = false
            this.sprite.stop()
        }
    }
}