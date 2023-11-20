import { Sprite } from "pixi.js";
import { getSprite } from "./SpritesController";
import { AnimatedObject } from "./Base";

export class Ball extends AnimatedObject {
    private url: string
    private sprite: Sprite

    constructor(url: string, position: { x: number, y: number }) {
        super(position)
        this.url = url
    }

    init(stage: any) {
        this.sprite = getSprite(this.url)
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.position.x
        this.sprite.y = this.position.y
        stage.addChild(this.sprite);
    }

    moveTo(position: {x:number, y: number}) {
        this.position = position
        this.sprite.x = this.position.x
        this.sprite.y = this.position.y
    }
}