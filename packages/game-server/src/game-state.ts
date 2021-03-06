import * as Shared from "@bombers/shared/src/idnex";

/**
 * Создаёт игровое состояние.
 */
export const createState = (
    map: number[][][]
): Shared.Interfaces.IGameState => ({
    map,
    players: {},
    wall: null
});

/**
 * Создаёт нового игрока для игрового состояния.
 */
export const createPlayer = (
    x: number, 
    y: number
): Shared.Interfaces.IGameStatePlayer => ({
    health: 3,
    bombs: 1,
    speed: 2,
    radius: 1,
    direction: Shared.Enums.MoveDirections.DOWN,
    isImmortal: false,
    emotion: Shared.Enums.EntityNumbers.EMOTION_1_FRONT,
    x,
    y
});
