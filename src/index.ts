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
import { DrawBoundingBox, drawLine, drawSimpleLine } from './utils/Draw'
import { Collisions } from './utils/Collition'
import { lineShader } from './models/Shaders'
import { Strike } from './utils/Strike'

let startCount = 0 //Счетчик голов
let waitStrike = false
let strike: Strike



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

const count = document.getElementById("count")

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
goal.addCollition(goalEdge[0])
goal.initCollitions()

const goalLInes = goal.getCollitionsItems()

const goal2 = new Goal('/img/goal.png', { x: window.innerWidth / 2, y: 85 })
goal2.init(app.stage)

const banny = new Player(characterAtlasData, { x: window.innerWidth / 2, y: window.innerHeight / 1.7 })
banny.init(app.stage)
const characterAction = new AnimationPosition(400, app.ticker)

const ball = new Ball('/img/ball.png', { x: window.innerWidth / 2, y: window.innerHeight / 2 })
ball.init(app.stage)
const ballAction = new AnimationPosition(900, app.ticker)

let tmpLine: PIXI.Graphics = null




document.addEventListener('click', (event) => {
    if(!waitStrike) {
        const isKick = isClickToObject(ball.getPosition(), { x: event.clientX, y: event.clientY }, 40);

        if (isKick) {
            var playerStart = banny.getPosition()
        }
    
    
        characterAction.resetToDefault()
        const reflects = getPath(banny.getPosition(), { x: event.clientX, y: event.clientY }, colLine, 15)
    
        reflects.unshift(banny.getPosition())
    
        characterAction.updateTicker(app.ticker)
        characterAction.setMultiplePath(reflects)
    
    
     
    
        characterAction.startPath({
            onStart: () => { 
                banny.run()
             },
            onUpdate: (position) => { banny.moveTo({ x: position.x, y: position.y }) },
            onStop: () => {
                banny.stop()
                if (isKick) {
                    strike = new Strike(banny.getPosition())
                    strike.init(position => {
                        if (tmpLine) {
                            app.stage.removeChild(tmpLine)
                        }
                        const arrow = drawSimpleLine(banny.getPosition(), { x: position.x, y: position.y })
                        tmpLine = arrow
                        app.stage.addChild(tmpLine);
                    })
                    waitStrike = true
    
                   /*  ballAction.resetToDefault()
                    const hitPower = getDistance(playerStart, ball.getPosition()) //Дистация на которую улетит мяч, равна дистанции до удара 
                    const target = findTargetPoint(playerStart, ball.getPosition(), hitPower * 3)
                    const pathToBall = getPath(ball.getPosition(), target, colLine, 36)
                    pathToBall.unshift(ball.getPosition())
                    ballAction.updateTicker(app.ticker)
                    ballAction.setMultiplePath(pathToBall)
                    ballAction.startPath({
                        onStart: () => { },
                        onUpdate: (position) => { ball.moveTo({ x: position.x, y: position.y }) },
                        onStop: () => {
                            const isOutOfField = isPointInsideSquare([
                                { x: 0, y: 0 },
                                { x: window.innerWidth, y: 0 },
                                { x: window.innerWidth, y: window.innerHeight },
                                { x: 0, y: window.innerHeight }
                            ], ball.getPosition())
    
                            const isGoal = isPointInsideSquare(simplyfyCollitionObj(goalLInes), ball.getPosition())
                            if (!isOutOfField) {
                                startCount--
                                count.textContent = String(startCount)
                                setTimeout(() => { ball.moveTo({ x: window.innerWidth / 2, y: window.innerHeight / 2 }) }, 100)
                            } else if (isGoal) {
                                startCount++
                                count.textContent = String(startCount)
                                setTimeout(() => { ball.moveTo({ x: window.innerWidth / 2, y: window.innerHeight / 2 }) }, 100)
                            }
    
                        }
    
    
                    }) */
                }
            }
        });
    } else {
        if(strike) {
            console.log(ball.getPosition())
            console.log(strike.getEndPoint())
            console.log(colLine)
            ballAction.resetToDefault()
            const pathToBall = getPath(ball.getPosition(), strike.getEndPoint(), colLine, 36)
            pathToBall.unshift(ball.getPosition())
            ballAction.updateTicker(app.ticker)
            ballAction.setMultiplePath(pathToBall)
            ballAction.startPath({
                onStart: () => { },
                onUpdate: (position) => { ball.moveTo({ x: position.x, y: position.y }) },
                onStop: () => {
                    const isOutOfField = isPointInsideSquare([
                        { x: 0, y: 0 },
                        { x: window.innerWidth, y: 0 },
                        { x: window.innerWidth, y: window.innerHeight },
                        { x: 0, y: window.innerHeight }
                    ], ball.getPosition())
    
                    const isGoal = isPointInsideSquare(simplyfyCollitionObj(goalLInes), ball.getPosition())
                    if (!isOutOfField) {
                        startCount--
                        count.textContent = String(startCount)
                        setTimeout(() => { ball.moveTo({ x: window.innerWidth / 2, y: window.innerHeight / 2 }) }, 100)
                    } else if (isGoal) {
                        startCount++
                        count.textContent = String(startCount)
                        setTimeout(() => { ball.moveTo({ x: window.innerWidth / 2, y: window.innerHeight / 2 }) }, 100)
                    }
                    waitStrike = false
                }
    
    
            })
        }
       
    }
   



})
