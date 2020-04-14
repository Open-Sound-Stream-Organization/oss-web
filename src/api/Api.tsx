import querystring, { ParsedUrlQueryInput } from 'querystring';
import { API_URL } from '../config';

/**
 * Replaced once we know the format the data will be sent by the server
 */
type Response<O> = any;


interface IObserver<O> {
    url: string;
    params?: ParsedUrlQueryInput;
    callback: (result?: O, error?: Error) => unknown;
}

export interface IApi {

    subscribe<O>(url: string, params?: ParsedUrlQueryInput): ({
        then: (callback: (result?: O | undefined, error?: Error | undefined) => unknown) => () => void;
    });

    post<O>(url: string, args: any): Promise<O>;

    delete<O>(url: string, args: any): Promise<O>;

    put<O>(url: string, args: any): Promise<O>;

}

type method = 'post' | 'delete' | 'put';
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

    async fetch<O>(url: string, params?: ParsedUrlQueryInput) {

        const query = params ? '?' + querystring.encode(params) : '';
        return await fetch(`${API_URL}/${url}${query}`)
            .then(raw => raw.json() as Promise<Response<O>>)
            .then(({ success, reason, data, ...e }: Response<O>) => {
                if (success) return data;
                else throw new Error(reason);
            });
    }

    subscribe<O>(url: string, params?: ParsedUrlQueryInput) {
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

    private async method<O = string>(method: method, url: string, args: any = {}) {
        const response = await fetch(`${API_URL}/${url}`, {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(args),
        });
        this.update();
        return response.json()
            .then(({ success, reason, data, ...e }: Response<O>) => {
                if (success) return data;
                else throw new Error(reason);
            });
    }

    async post<O = string>(url: string, args: any = {}) {
        return this.method('post', url, args);
    }

    async put<O = string>(url: string, args: any = {}) {
        return this.method('put', url, args);
    }

    async delete<O = string>(url: string, args: any = {}) {
        return this.method('delete', url, args);
    }

}

const API = new Api();

export default API;