import * as Shared from "@bombers/shared/src/idnex";
import { createPlayer } from "./game-state";

export default class PlayerFactory {
    /**
     * Создаёт игрока, задавая начальные координаты на канвасе.
     */
    public static create(
        color: Shared.Enums.PlayerColors
    ): Shared.Interfaces.IGameStatePlayer {
        const tileSize = Shared.Constants.GAME_RESOLUTION_TILE_SIZE;

        const mapWidth = Shared.Helpers.calculateCanvasWidth();
        const mapHeight = Shared.Helpers.calculateCanvasHeight();

        switch (color) {
            case Shared.Enums.PlayerColors.BLUE:
                return createPlayer(0, 0);
            case Shared.Enums.PlayerColors.PURPLE:
                return createPlayer(
                    mapWidth - tileSize,
                    0
                );
            case Shared.Enums.PlayerColors.RED:
                return createPlayer(
                    0,
                    mapHeight - tileSize
                );
            case Shared.Enums.PlayerColors.YELLOW:
                return createPlayer(
                    mapWidth - tileSize,
                    mapHeight - tileSize
                );
        }
    }
}
