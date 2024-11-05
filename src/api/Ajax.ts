'use strict';

interface PostParams {
    url: string;
    body: object;
}

interface RequestParams {
    url: string;
    body?: object;
    method: string;
}


class Ajax {
    static get(url: string): Promise<any> {
        return this.#makeRequest({
            method: 'GET',
            url: url,
        });
    }

    static post({ url, body }: PostParams): Promise<any> {
        return this.#makeRequest({ method: 'POST', url, body });
    }

    static delete({ url, body }: PostParams): Promise<any> {
        return this.#makeRequest({ method: 'DELETE', url, body });
    }

    static async #makeRequest({
        method,
        url,
        body = {},
    }: RequestParams): Promise<any> {
        let request: Request;
        if (method === 'GET') {
            request = new Request(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
        } else {
            request = new Request(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(body),
            });
        }

        return await fetch(request);
    }
}

export default Ajax;