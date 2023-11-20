import * as PIXI from 'pixi.js';

/**
 * Забираем простой sprite
 * @param url картинки
 * @returns 
 */
export function getSprite(url: string) {
    const sprite = PIXI.Sprite.from(url);
    return sprite;
}

/**
 * Забраем скофигурированный SpriteSheet
 * @param config JSON
 * @returns 
 */
export async function getSpriteSheet(config: any) {
    const spritesheet = new PIXI.Spritesheet(
        PIXI.BaseTexture.from(config.meta.image),
        config
    );
    await spritesheet.parse();
    const anim = new PIXI.AnimatedSprite(spritesheet.animations.Run);
    return anim
   
}