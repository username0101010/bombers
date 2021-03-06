import BaseEntity from "../core/BaseEntity";
import * as Shared from "@bombers/shared/src/idnex";

const { 
    GAME_RESOLUTION_TILE_SIZE,
    GAME_RESOLUTION_CANVAS_MARGIN
} = Shared.Constants;

export default class CraterEntity extends BaseEntity {
    constructor(frameX: number, frameY: number) {
        super(frameX, frameY, false);
    }

    setPosition(row: number, col: number) {
        const x = col * GAME_RESOLUTION_TILE_SIZE; 
        const y = row * GAME_RESOLUTION_TILE_SIZE;

        this.x = x + GAME_RESOLUTION_CANVAS_MARGIN;
        this.y = y + GAME_RESOLUTION_CANVAS_MARGIN;
    }
}
