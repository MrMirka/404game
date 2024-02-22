import './index.html'
import './index.css'
import './img/character/run.png'
import './img/levels/lab404.png'
import './img/levels/labirint2.jpg'
import './img/items/ball.png'
import './img/items/goal.png'

import { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';
import { Player } from './models/Character';
import { AnimationPosition } from './animation/controls';

import { characterAtlasData } from './utils/configurations';
import { findTargetPoint, getPath, getSafeDestination, isClickToObject, isPathClear, isPointInsideSquare, reflectVector } from './utils/gameMechanics'
import { Ball, Goal } from './models/Ball'
import { getDistance, simplyfyCollitionObj } from './utils/Hepters'
import { objectsColl, goalEdge } from './models/CollitionObjects'
import { DrawBoundingBox, drawLine } from './utils/Draw'
import { Collisions } from './utils/Collition'
import { lineShader } from './models/Shaders'


const app = new Application(
    {
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: true,
        backgroundAlpha: 1,
        resolution: 1
    }
);
document.body.appendChild(app.view as unknown as Node);

const planeGeometry = new PIXI.PlaneGeometry(window.innerWidth, window.innerHeight);
const plane = new PIXI.Mesh(planeGeometry, lineShader);
app.stage.addChild(plane);


const collitions = new Collisions() //Препятствия

objectsColl.forEach(element => {
    app.stage.addChild(DrawBoundingBox(element))
    collitions.addCollition(element)
})
collitions.initCollitions()
const colLine = collitions.getCollitionsItems()

const goal = new Collisions() //Ворота
//app.stage.addChild(DrawBoundingBox(goalEdge[0]))
goal.addCollition(goalEdge[0])
goal.initCollitions()

//const testPoint = {x:597,y:155}
const goalLInes = goal.getCollitionsItems()
//const res = isPointInsideSquare(simplyfyCollitionObj(goalLInes), testPoint)



const goal2 = new Goal('/img/goal.png', { x: window.innerWidth /2 , y: 85 })
goal2.init(app.stage)

const banny = new Player(characterAtlasData, { x: window.innerWidth / 2, y: window.innerHeight / 2 })
banny.init(app.stage)
const characterAction = new AnimationPosition(400, app.ticker)

const ball = new Ball('/img/ball.png', { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight })
ball.init(app.stage)
const ballAction = new AnimationPosition(900, app.ticker)




document.addEventListener('click', (event) => {
    characterAction.resetToDefault()
    const isKick = isClickToObject(ball.getPosition(), { x: event.clientX, y: event.clientY }, 40);
    const reflects = getPath(banny.getPosition(), { x: event.clientX, y: event.clientY }, colLine, 15)

    reflects.unshift(banny.getPosition())

    /* const lineR = drawLine(reflects)
    app.stage.addChild(lineR) */

    characterAction.updateTicker(app.ticker)
    characterAction.setMultiplePath(reflects)


    if (isKick) {
        var playerStart = banny.getPosition()
    }


    /*  characterAction.start({
         onStart: () => { banny.run() },
         onUpdate: (position) => { banny.moveTo({ x: position.x, y: position.y }) },
         onStop: () => {
             banny.stop()
             if (isKick) {
                 const hitPower = getDistance(playerStart, ball.getPosition()) //Дистация на которую улетит мяч, равна дистанции до удара 
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
     }); */

    characterAction.startPath({
        onStart: () => { banny.run() },
        onUpdate: (position) => { banny.moveTo({ x: position.x, y: position.y }) },
        onStop: () => {
            banny.stop()
            if (isKick) {
                ballAction.resetToDefault()
                const hitPower = getDistance(playerStart, ball.getPosition()) //Дистация на которую улетит мяч, равна дистанции до удара 
                const target = findTargetPoint(playerStart, ball.getPosition(), hitPower)
                const pathToBall = getPath(ball.getPosition(), target, colLine, 36)
                pathToBall.unshift(ball.getPosition())
                ballAction.updateTicker(app.ticker)
                ballAction.setMultiplePath(pathToBall)
                ballAction.startPath({
                    onStart:() => {},
                    onUpdate: (position) => { ball.moveTo({ x: position.x, y: position.y }) },
                    onStop: () => {
                        const isGoal = isPointInsideSquare(simplyfyCollitionObj(goalLInes), ball.getPosition())
                        if(isGoal) {
                            console.log(isGoal)
                            setTimeout(()=>{ball.moveTo({x: window.innerWidth/2, y: window.innerHeight/2})},100)
                    }      
                            
                        }
                        

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