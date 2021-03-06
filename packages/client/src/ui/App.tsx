import React from "react";
import { Loader } from "pixi.js";
import { Dispatch } from "redux";
import bridge from '@vkontakte/vk-bridge';
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

import Routes from "./Routes";
import store from "./redux/store";
import * as UserSelectors from "./redux/selectors/user-selecrots";
import * as UserActions from "./redux/actions/user-actions";
import * as Shared from "@bombers/shared/src/idnex";
import { startHandlingAppSocket } from "../handlers/socket-app-handler";
import LoaderComponent from "./components/Loader";
import { debug } from "@bombers/shared/src/tools/debugger";

const dispatchSocialData = (
    type: string, 
    id: number, 
    dispatch: Dispatch
) => {
    dispatch(
        UserActions.action_user_set_social_type(type)
    );
    dispatch(
        UserActions.action_uesr_set_social_uid(id)
    );
    dispatch(
        UserActions.action_user_set_auth_is_social(true)
    );
};

const Main = () => {
    const dispatch = useDispatch();

    const [roomToRedirect, setRoomToRedirect] = React.useState(``);

    const isAuthViaSocial = useSelector(UserSelectors.select_user_auth_is_social);
    const authToken = useSelector(UserSelectors.select_user_auth_token);
    const userUid = useSelector(UserSelectors.select_user_social_uid);
    const userSocialType = useSelector(UserSelectors.select_user_social_type);
    const errorCode = useSelector(UserSelectors.select_user_error_code);
    const isAuth = useSelector(UserSelectors.select_user_auth);
    const socket = useSelector(UserSelectors.select_user_socket_instance);
   
    React.useEffect(
        () => {
            // режим разработки. задаём невалидные данные, чтобы создать новый аккаунт
            if (isDevMode) {
                const id = window.crypto.getRandomValues(new Uint16Array(1))[0];
                dispatchSocialData("vk", id, dispatch);
            }
            
            // авторизация через IFrame
            else if (window.parent != window) {
                const host = window.parent.location.host;

                if (host === "vk.com") {
                    bridge.send(`VKWebAppInit`).then(async () => {
                        const { id } = await bridge.send("VKWebAppGetUserInfo");
                        dispatchSocialData("vk", id, dispatch);
                    });
                }
            }
        }, 
        []
    );
    
    React.useEffect(
        () => {
            // авторизация выполнена через социальную сеть, получаем данные через API
            if (isAuthViaSocial === true) {
                dispatch(
                    UserActions.action_user_fetch_data_social({
                        uid: userUid,
                        social: userSocialType
                    })
                );
            }
            
            // TODO:
            if (isAuthViaSocial === false) { }
        }, 
        [isAuthViaSocial]
    );
  
    React.useEffect(
        () => {
            switch (errorCode) { 
                // пользователь не был найден в базе данных - создаём
                case Shared.Enums.ApiResponseCodes.USER_NOT_EXISTS_SOCIAL:
                    dispatch(
                        UserActions.action_user_create_social({
                            uid: userUid,
                            social: userSocialType,
                            data: {
                                nickname: `user${userUid}`
                            }
                        })
                    );
                    break;
            }
        }, 
        [errorCode]
    );

    React.useEffect(
        () => {
            (async () => {
                if (isAuth) {
                    // подключение к веб-сокету по авторизационному токену
                    const _socket = io("/client", {
                        query: {
                            authToken
                        }
                    });
                    
                    startHandlingAppSocket(
                        _socket, 
                        dispatch, 
                        setRoomToRedirect
                    );

                    // подгружаем игровые ресурсы
                    Loader.shared
                        .add([
                            Shared.Constants.GAME_RESOURCES_SPRITESHEET_EXPLOSION,
                            Shared.Constants.GAME_RESOURCES_IMAGE_GRASS,
                            Shared.Constants.GAME_RESOURCES_IMAGE_TILESET
                        ])
                        .load(() => { 
                            debug(
                                "Assets have been loaded",
                                Loader.shared.resources
                            ); 

                            dispatch(
                                UserActions.action_user_set_socket_instance(_socket)
                            );
                        });
                }
            })();
        }, 
        [isAuth]
    );

    if (!isAuth || !socket) {
        return (<LoaderComponent />);
    }

    return (
        <BrowserRouter>
            <Routes roomToRedirect={roomToRedirect} />
        </BrowserRouter>
    );
};

const App = () => {
    return (
        <Provider store={store}>
            <Main />
        </Provider>
    );
};


export default App;
