import { IServerAppState } from "@bombers/shared/src/utils/interfaces";

export const state: IServerAppState = {
    /**
     * Количество подключенных пользователей.
     */
    online: 0,
    chat: {
        /**
         * Сообщения из чата, сохраненные в буфере.
         */
        messages: [],
        /**
         * Подключенные к чату пользователи.
         */
        members: []
    },
    /** 
     * Список игровых серверов.
     */
    lobby: []
};
