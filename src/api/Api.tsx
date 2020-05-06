import querystring, { ParsedUrlQueryInput } from 'querystring';
import { API_URL } from '../config';
import format from 'dateformat';
import { IApiKey } from './Models'
import { SSL_OP_TLS_ROLLBACK_BUG } from 'constants';

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
            .catch(e => callback(undefined, e));
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

    private getApiKey(): IApiKey | null {
        const key = localStorage.getItem('apikey');
        if (key) return JSON.parse(key);
        return null;
    }

    public async isLoggedIn() {
        if (!this.getApiKey()) return false;

        return this.fetch('artist')
            .then(() => true)
            .catch(e => {
                console.log(e);
                //localStorage.removeItem('apikey');
                return false;
            });
    }

    public async audio(url: string) {
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error('Not logged in');

        //const response = await fetch(require('../test.mp3'), {
        const response = await fetch(`/${url}`, {
            headers: {
                'Authorization': apiKey.key,
            }
        });

        if (response.status !== 200) throw new Error(response.statusText);

        const buffer = await response.arrayBuffer();

        /*
        const audio = new AudioContext();
        const src = audio.createBufferSource();
        src.start(audio.currentTime);

        src.buffer = await audio.decodeAudioData(buffer);
        src.connect(audio.destination);

        const content = await response.body?.getReader().read();
        if (!content?.value) throw new Error('No audio found');
        */

        const blob = new Blob([buffer], { type: 'audio/*' })
        return URL.createObjectURL(blob);

    }

    async upload(endpoint: string, file: File) {
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error('Not logged in');

        let url = endpoint;
        if (!url.startsWith(API_URL)) url = `${API_URL}/${url}`
        url += '/';

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                //'Content-Type': 'application/json',
                'Authorization': apiKey.key,
            },
            body: file,
        });

    }

    private async method<O>(method: Method, endpoint: string, args?: any, update = true) {
        const apiKey = this.getApiKey();
        if (!apiKey) throw new Error('Not logged in');

        let url = endpoint;
        if (!url.startsWith(API_URL)) url = `${API_URL}/${url}`
        if (method !== 'get') url += '/';

        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': apiKey.key,
            },
            body: args ? JSON.stringify(args) : undefined,
        });

        if (update && method !== 'get') this.update();

        if (response.status === 200)
            return response.json() as Promise<Response<O>>;
        else
            throw new Error('Not logged in');

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

    async logout() {
        const apiKey = this.getApiKey();

        console.log('Logout');

        /*
                if (apiKey) await this.delete(`apikey/${apiKey.id}`)
                    .catch(e => console.error(e))
        */

        localStorage.removeItem('apikey');
        window.location.reload();
    }

    async login(base64: string) {

        const url = `${API_URL}/apikey/`;

        const { platform, vendor } = navigator;
        const date = format(new Date());

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Basic ${base64}`,
            },
            body: JSON.stringify({ purpose: `${vendor} ${platform}, ${date}` }),
        });

        this.update();

        if (response.status !== 201) throw new Error('Invalid credentials');

        const key = await response.json()
        localStorage.setItem('apikey', JSON.stringify(key));

        window.location.reload();

    }

}



const API = new Api();

export default API;