import { SHIPS_MOCK } from "../modules/mock";
"use strict";

interface Ship {
    id: string;
    ship_name: string;
    description: string;
    year: number;
    displacement: number;
    length: number;
    crew: number;
    country: string;
    photo: string;
};

interface RegisterParams {
    username: string;
    password: string;
}

interface LoginParams {
    username: string;
    password: string;
}


import Ajax from "./Ajax.ts";

const API = {
    BASE_URL: `http://${window.location.hostname}:8000`,

    async login({ username, password }: LoginParams) {
        const url = this.BASE_URL + "/login/";
        const body = {
            username: username,
            password: password,
        };
        return Ajax.post({ url, body });
    },

    async register({ username, password }: RegisterParams) {
        const url = this.BASE_URL + "/users/auth/";
        const body = {
            username: username,
            password: password,
        };

        return Ajax.post({ url, body });
    },

    async getShips(){
        const url = this.BASE_URL + "/ships/";
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных с бэкенда:", error);
            return SHIPS_MOCK;
        }
        //return Ajax.get(url);
    },

    //async getShipDetails(shipId: string) {
    //    const url = this.BASE_URL + `/ships/${shipId}`;
    //    return Ajax.get(url);
    //},

    async getShipDetails(shipId: string) {
        const url = this.BASE_URL + `/ships/${shipId}`;
        try {
            const data = await Ajax.get(url);
            return data;
        } catch (error) {
            console.error("Ошибка при загрузке данных о корабле:", error);
            const mockShip = SHIPS_MOCK.find((s) => s.id === shipId);
            if (mockShip) {
                return mockShip; // Возвращаем мок-данные для конкретного корабля
            } else {
                throw new Error("Корабль не найден в мок-данных");
            }
        }
    },
    
};

export default API;