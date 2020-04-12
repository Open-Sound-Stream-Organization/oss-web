import querystring, { ParsedUrlQueryInput } from 'querystring';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import API from './FakeApi';

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
    //return <div className='loading' />;
    return <p>Loading...</p>
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