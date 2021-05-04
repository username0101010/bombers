import configurateStore from "redux-mock-store";
import { render } from "enzyme";
import { Provider } from "react-redux";
import React from "react";

import * as Shared from "@bombers/shared/src/idnex";
import Slots from "@bombers/client/src/ui/components/Battle/Slots";

describe("Slots component should render correctly", () => {
    const mockStore = configurateStore();
    let wrapper: cheerio.Cheerio;

    const setStore = (store: any) => {
        wrapper = render(<Provider store={store}><Slots /></Provider>)
    };

    it("should renders 4 empty slots", () => {
        const store = mockStore({ game: { slots: Shared.Slots.slots } });
        setStore(store);

        expect(wrapper.find("li")).toHaveLength(4);
    });

    it("should render 1 slot with the nickname John Doe", () => {
        const store = mockStore({
            game: {
                slots: {
                    [Shared.Enums.PlayerColors.PURPLE]: {
                        user: {
                            nickname: "John Doe"
                        }
                    }
                }
            }
        });
        setStore(store);

        expect(wrapper.text()).toContain("John Doe");
    });
});
