import { Socket } from "socket.io";

import SocketManager from "./SocketManager";
import * as Shared from "@bombers/shared/src/idnex";
import { debug } from "@bombers/shared/src/tools/debugger";
import * as Models from "../api/models";

interface IPaginationData {
    paginationPage: number;
    paginationItems: number;
}

/**
 * Обрабатывает сообщения клиента по веб-сокету.
 */
export default class ClientSocketHandler {
    public static connections: { [token: string]: any; } = {}
    
    /**
     * Добавляет сокет в список подключенных к серверу. Если сокет уже 
     * есть в списке, отключает предыдущий и перезписывает новым подключением.
     */
    public static addSocketToConnectionSotre(
        token: string, 
        socket: any
    ) {
        if (this.connections[token]) {
            debug(
                "Socket already in connection list",
                `token: ${token}`,
                "Disconnecting..."
            );

            this.connections[token].disconnect();
        }

        this.connections[token] = socket;
        
        debug(
            "Socket connected", 
             `token: ${token}`
        );

        Models.UserModel.findOneAndUpdate({ _id: token }, { is_online: true }).exec();
    }

    public static handle(
        socket: Socket,
        manager: SocketManager,
        currentSocketUserData: Shared.Interfaces.IUser,
        token: string
    ) {
        this.addSocketToConnectionSotre(token, socket);

        // обновляем состояние приложения, если пользователь отключился
        socket.on("disconnect", () => {
            Models.UserModel.findOneAndUpdate(
                { _id: token }, 
                { 
                    is_online: false,
                    last_seen: Date.now()
                }
            ).exec();

            manager.removeUserFromState(currentSocketUserData);
            delete this.connections[token];
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
                    message: message.slice(
                        0, 
                        Shared.Constants.CHAT_MAX_MESSAGE_LENGTH
                    ),
                    date: Date.now()
                });
            });
    }
}
