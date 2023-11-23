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