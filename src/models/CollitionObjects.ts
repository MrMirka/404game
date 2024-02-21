import { BoundingBox } from "../utils/Collition";

export const objectsColl: BoundingBox[] = [
    {
        id: 1,
        coordinate: { x: 500, y: 550 },
        width: 800,
        height: 100
    },

    {
        id: 2,
        coordinate: { x: 700, y: 350 },
        width: 400,
        height: 60
    },


]

export const goalEdge: BoundingBox[] = [
    {
        id: 1,
        coordinate: { x: window.innerWidth / 2 - 200, y: 0 },
        width: 400,
        height: 150
    }
]

