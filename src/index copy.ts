import './index.html'
import './index.css'
import './img/character/run.png'
import './img/levels/lab404.png'
import './img/levels/labirint2.jpg'
import './img/items/ball.png'

import { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Player } from './models/Character';
import { AnimationPosition } from './animation/controls';

import { characterAtlasData } from './utils/configurations';
import { findTargetPoint, getSafeDestination2, isClickToObject, isPathClear } from './utils/gameMechanics'
import { Ball } from './models/Ball'
import { getDistance } from './utils/Hepters'
import { objectsColl } from './models/CollitionObjects'
import { DrawBoundingBox } from './utils/Draw'
import { Collisions } from './utils/Collition'


const app = new Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        backgroundAlpha: 0,
        resolution: 1
    }
);
document.body.appendChild(app.view as unknown as Node);

const textureLevel = PIXI.Texture.from('./img/labirint2.jpg');
const spriteLevel = new PIXI.Sprite(textureLevel);
spriteLevel.anchor.set(0.5);

spriteLevel.x = window.innerWidth / 2
spriteLevel.y = window.innerHeight / 2

app.stage.addChild(spriteLevel)

let blackPixels: { x: number; y: number; }[] = [];
let whitePixels: { x: number; y: number; }[] = [];



setTimeout(() => {

    const renderer = PIXI.autoDetectRenderer();
    const pixels = renderer.extract.pixels(spriteLevel);
    const width = spriteLevel.texture.width;
    const height = spriteLevel.texture.height;

    const spriteCenterX = spriteLevel.x;
    const spriteCenterY = spriteLevel.y;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    function isEdgePixel(x: number, y: number) {
        if (x <= 0 || x >= width - 1 || y <= 0 || y >= height - 1) {
            return true; // Край изображения всегда является контуром
        }

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Пропускаем сам пиксель

                let index = ((y + dy) * width + (x + dx)) * 4;
                if (pixels[index] !== 0 || pixels[index + 1] !== 0 || pixels[index + 2] !== 0) {
                    return true; // Найден соседний не-черный пиксель
                }
            }
        }
        return false;
    }

    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];

        let localX = (i / 4) % width;
        let localY = Math.floor((i / 4) / width);

        // Учитываем положение и точку привязки spriteLevel
        let globalX = spriteCenterX - halfWidth + localX;
        let globalY = spriteCenterY - halfHeight + localY;

        if (r === 0 && g === 0 && b === 0 && isEdgePixel(localX, localY)) {
            blackPixels.push({ x: Math.floor(globalX), y: Math.floor(globalY) });
        }
    }

    console.log(blackPixels.length)

}, 5000)

const collitions = new Collisions()

objectsColl.forEach(element=> {
    app.stage.addChild(DrawBoundingBox(element))
    collitions.addCollition(element)
})
collitions.initCollitions()
const colLine = collitions.getCollitionsItems()


const banny = new Player(characterAtlasData, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
banny.init(app.stage)
const movaAction = new AnimationPosition(400, app.ticker)

const ball = new Ball('/img/ball.png', { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight })
ball.init(app.stage)
const ballAction = new AnimationPosition(900, app.ticker)

document.addEventListener('click', (event) => {
    const isKick = isClickToObject(ball.getPosition(), { x: event.clientX, y: event.clientY }, 40);
    const intersectionCoordinate = getSafeDestination2(banny.getPosition(), { x: event.clientX, y: event.clientY }, colLine, 15)
    
    movaAction.updateTicker(app.ticker)
    movaAction.setAnimationCoordinate(banny.getPosition(), intersectionCoordinate ? intersectionCoordinate : { x: event.clientX, y: event.clientY })
   
    if(isKick) {
        var playerStart = banny.getPosition()
    }

    movaAction.start({
        onStart: () => { banny.run() },
        onUpdate: (position) => { banny.moveTo({ x: position.x, y: position.y }) },
        onStop: () => {
            banny.stop()
            if (isKick) {
                const hitPower = getDistance(playerStart, ball.getPosition())
                const target = findTargetPoint(playerStart, ball.getPosition(), hitPower)
                ballAction.updateTicker(app.ticker)
                ballAction.setAnimationCoordinate(ball.getPosition(), target)
                ballAction.start({
                    onStart:() => {},
                    onUpdate: (position) => { ball.moveTo({ x: position.x, y: position.y }) },
                    onStop: () => {}

                })
            }
        }
    });
    


})

/* const threshold = 2;
app.ticker.add(() => {
    if (blackPixels.length > 0) {
        let pos = banny.getPosition();

        let intersection = blackPixels.some(item =>
            Math.abs(item.x - pos.x) <= threshold && Math.abs(item.y - pos.y) <= threshold
        );

        if (intersection) console.log(`Пересечение на координатах ${pos.x} ${pos.y}`);
    }
});

 */