import { BoundingBox } from "../utils/Collition";

export const objectsColl: BoundingBox[] = [
    {
        id: 1,
        coordinate: { x: 500, y:  200 },
        width: 100,
        height: 100
    },

    {
        id: 2,
        coordinate: { x: 1000, y: 350 },
        width: 100,
        height: 100
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

