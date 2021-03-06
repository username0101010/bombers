import { Dispatch } from "redux";
import { Socket } from "socket.io-client";

import * as LobbyActions from "../ui/redux/actions/lobby-actions";
import * as Shared from "@bombers/shared/src/idnex";

export const startHandlingGameLobbySocket = (
    address: string, 
    socket: Socket, 
    dispatch: Dispatch
) => {
    let pingTimestamp: number = null;

    // получаем состояние игровой комнаты
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_SET_ROOM_STATE),
        (room: Shared.Interfaces.IStateLobbyGameRoom) => {
            dispatch(
                LobbyActions.action_lobby_set_server_room(address, room)
            );
            
            // пингуем сервер
            setTimeout(() => {
                pingTimestamp = Date.now();
                socket.emit(
                    String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG)
                );
            });
        }
    );

    // высчитываем сетевую задержку
    socket.on(
        String(Shared.Enums.SocketChannels.GAME_ON_PING_PONG),
        () => {
            dispatch(
                LobbyActions.action_lobby_set_server_connect_status(address, true)
            );
            dispatch(
                LobbyActions.action_lobby_set_server_ping(address, Date.now() - pingTimestamp)
            );
        }
    );
};
