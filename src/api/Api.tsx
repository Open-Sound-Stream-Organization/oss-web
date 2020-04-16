import querystring, { ParsedUrlQueryInput } from 'querystring';
import { API_URL, DEV } from '../config';

/**
 * Replaced once we know the format the data will be sent by the server
 */
type Response<O> = O;


interface IObserver<O> {
    url: string;
    params?: ParsedUrlQueryInput | string;
    callback: (result?: O, error?: Error) => unknown;
}

export interface IApi {

    subscribe<O>(url: string, params?: ParsedUrlQueryInput | string): ({
        then: (callback: (result?: O | undefined, error?: Error | undefined) => unknown) => () => void;
    });

    post<O>(url: string, args: any): Promise<O>;

    delete<O>(url: string, args: any): Promise<O>;

    put<O>(url: string, args: any): Promise<O>;

}

type Method = 'post' | 'delete' | 'put' | 'get';
class Api implements IApi {

    observers: Set<IObserver<any>> = new Set();

    call<O>(observer: IObserver<O>) {
        const { url, params, callback } = observer;
        this.fetch<O>(url, params)
            .then(r => callback(r))
            .catch(() => callback(undefined, new Error(`Unable to fetch ${url}`)));
    }

    update() {
        this.observers.forEach(o => this.call(o));
    }

    subscribe<O>(url: string, params?: ParsedUrlQueryInput | string) {
        return {
            then: (callback: (result?: O, error?: Error) => unknown) => {
                const o = { url, params, callback };
                this.observers.add(o);
                this.call(o);
                return () => {
                    this.observers.delete(o);
                }
            }
        }
    }

    async fetch<O>(endpoint: string, params?: ParsedUrlQueryInput | string) {
        const query = typeof params === 'string' ? params : querystring.encode(params ?? {});
        return this.method<O>('get', `${endpoint}?${query}`);
    }

    private async method<O>(method: Method, endpoint: string, args?: any) {

        const url = `${API_URL}/${endpoint}`;

        const apiKey = 'testapikey';

        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: args ? JSON.stringify(args) : undefined,
        });

        if (method !== 'get') this.update();

        return response.json() as Promise<Response<O>>;
    }

    async post<O = string>(url: string, args: any = {}) {
        return this.method<O>('post', url, args);
    }

    async put<O = string>(url: string, args: any = {}) {
        return this.method<O>('put', url, args);
    }

    async delete<O = string>(url: string, args: any = {}) {
        return this.method<O>('delete', url, args);
    }

}

const API = new Api();

export default API;