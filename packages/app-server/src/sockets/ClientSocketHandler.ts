import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";

interface IPaginationData {
    paginationPage: number;
    paginationItems: number;
}

/**
 * Обрабатывает сообщения клиента по веб-сокету.
 */
export default class ClientSocketHandler {
    public static handle(
        socket: Socket,
        manager: SocketManager,
        currentSocketUserData: Shared.Interfaces.IUser
    ) {
        // обновляем состояние приложения, если пользователь отключился
        socket.on("disconnect", () => {
            manager.removeUserFromState(currentSocketUserData);
        });

        // получение серверов
        socket.on(
            String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS),
            (data: IPaginationData) => {
                const { paginationPage, paginationItems } = data;

                const sliceFrom = paginationPage * paginationItems - paginationItems;
                const sliceTo = paginationPage * paginationItems;

                let servers: Shared.Interfaces.ILobbyServer[] = manager.state.lobby.slice(
                    ...(
                        manager.state.lobby.length < sliceTo ? [-paginationItems] : [sliceFrom, sliceTo]
                    )
                );
                
                // отправляем часть серверов
                socket.emit(
                    String(Shared.Enums.SocketChannels.APP_ON_GET_PORTION_GAME_SERVERS), 
                    servers
                );
            });

        // обрабатываем сообщение, которое пользователь отправил из чата
        socket.on(
            String(Shared.Enums.SocketChannels.APP_ON_ADD_CHAT_MESSAGE),
            (message: string) => {
                manager.addMessageToState({
                    author: currentSocketUserData,
                    message: message.slice(0, Shared.Constants.CHAT_MAX_MESSAGE_LENGTH),
                    date: Date.now()
                });
            });
    }
}