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
        return Ajax.get(url);
    }
};

export default API;