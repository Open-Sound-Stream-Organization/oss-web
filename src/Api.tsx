import querystring, { ParsedUrlQueryInput } from 'querystring';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { API_URL } from './config';

/**
 * Replaced once we know the format the data will be sent by the server
 */
type Response<O> = any;


/**
 * React hook to subscibe to a specific api endpoint
 * @param endpoint The url
 * @param params Optional query parameters
 */
export function useApi<R>(endpoint: string, params?: ParsedUrlQueryInput) {
    const [result, setResult] = useState<undefined | R>();
    const [loading, setLoading] = useState(true);

    const query = querystring.encode(params);
    const url = `${endpoint}?${query}`;
    useEffect(() => {
        return API.subscribe<R>(url).then(r => {
            setResult(r);
            setLoading(false);
        })
    }, [url]);

    return [result, loading] as [R | undefined, boolean];
}

/**
 * React hook to send post requests
 * @param endpoint The url
 * @param data Optional body data
 * @param cb Optional callback function called on success with the response
 */
export function useSubmit<R = any>(endpoint: string, data?: any, cb?: (r?: R) => unknown) {
    const [error, setError] = useState<any>();
    const [inProgress, setLoading] = useState(false);

    const post = (e?: SyntheticEvent) => {
        e?.preventDefault();
        setLoading(true);
        API.post<R>(endpoint, data)
            .then(r => {
                if (cb) cb(r);
                return undefined;
            })
            .catch(e => e as Error)
            .then(e => {
                setError(e);
                setLoading(false);
            });
    }

    const message = error?.message;
    return { message, error, valid: !message, post, inProgress };
}

/**
 * A universal loading component
 */
export function Loading() {
    return <div className='loading' />;
}

type Render<R> = (result: R) => JSX.Element | null;

/**
 * React hook to render loading componets universally
 * @param enpoint The api url
 * @param params Optional query parameters
 * @param render The render function called once the data has been received
 */
export function useLoading<R>(enpoint: string, params: ParsedUrlQueryInput | Render<R>, render?: Render<R>): JSX.Element | null {
    const p = typeof params === 'object' ? params : undefined;
    const r = typeof params === 'function' ? params : render;
    const [result, loading] = useApi<R>(enpoint, p);

    if (loading) return <Loading />
    if (!result) return <span>Not found</span>
    return r ? r(result) : null;
}

interface IObserver<O> {
    url: string;
    params?: ParsedUrlQueryInput;
    callback: (result?: O, error?: Error) => unknown;
}

class Api {

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

    async post<O = string>(url: string, args: any = {}) {
        const response = await fetch(`${API_URL}/${url}`, {
            method: 'POST',
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

}

const API = new Api();