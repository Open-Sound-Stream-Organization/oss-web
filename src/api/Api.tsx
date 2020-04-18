import querystring, { ParsedUrlQueryInput } from 'querystring';
import { API_URL } from '../config';

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

    private observers: Set<IObserver<any>> = new Set();

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
        return this.method<O>('get', `${endpoint}/?${query}`);
    }

    private getApiKey() {
        return 'webuserkey';
    }

    public async audio(url: string) {

        const response = await fetch(require('../test.mp3'), {
            //const response = await fetch(url, {
            headers: {
                'Authorization': this.getApiKey()
            }
        });

        console.log(response);

        const content = await response.body?.getReader().read();
        if (!content?.value) throw new Error('No audio found');

        const blob = new Blob([content.value], { type: 'audio/mp3' })
        return URL.createObjectURL(blob);

    }

    private async method<O>(method: Method, endpoint: string, args?: any, update = true) {

        let url = endpoint;
        if (!url.startsWith(API_URL)) url = `${API_URL}/${url}`
        if (method !== 'get') url += '/';

        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': this.getApiKey(),
            },
            body: args ? JSON.stringify(args) : undefined,
        });

        if (update && method !== 'get') this.update();

        if (response.status === 200)
            return response.json() as Promise<Response<O>>;
        else
            return {} as Response<O>;

    }

    async post<O = string>(url: string, args: any = {}, update = true) {
        return this.method<O>('post', url, args, update);
    }

    async put<O = string>(url: string, args: any = {}, update = true) {
        return this.method<O>('put', url, args, update);
    }

    async delete<O = string>(url: string, args: any = {}, update = true) {
        return this.method<O>('delete', url, args, update);
    }

}

const API = new Api();

export default API;