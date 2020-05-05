import querystring, { ParsedUrlQueryInput } from 'querystring';
import React, { SyntheticEvent, useEffect, useState, useMemo } from 'react';
import API from './Api';
import { IModel, IList } from './Models';

/**
 * React hook to subscibe to a specific api endpoint
 * @param endpoint The url
 * @param params Optional query parameters
 */
export function useApi<R>(endpoint: string, params?: ParsedUrlQueryInput) {
    const [result, setResult] = useState<undefined | R>();
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState<string | undefined>();

    const query = querystring.encode(params);
    useEffect(() => {
        setLoading(true);
        setResult(undefined);

        return API.subscribe<R>(endpoint, query).then((r, e) => {
            setResult(r);
            setMessage(e?.message);
            setLoading(false);
        })
    }, [query, endpoint]);

    return [result, loading, message] as [R | undefined, boolean, string | undefined];
}

export function useApiBunch<R>(endpoints: string[]) {
    const [results, setResults] = useState<R[]>([]);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<string[]>([]);

    useEffect(() => {
        if (results.length === endpoints.length) setLoading(false);
    }, [results, endpoints])

    useEffect(() => {
        setLoading(true);
        setResults([]);

        Promise.all(endpoints.map((endpoint, i) => API.fetch<R>(endpoint)
            .catch(e => setMessages(m => [...m, e]))
        )).then(results => setResults(results.filter(r => typeof r === 'object') as R[]));

    }, [endpoints]);

    return [results, loading, messages] as [R[], boolean, string[]];
}

export function useApiList<M extends IModel>(endpoint: string, params?: ParsedUrlQueryInput) {
    const [models, loading, message] = useApi<IList<M>>(endpoint, params);
    const sorted = useMemo(() => (models?.objects ?? [])
        .sort((a, b) => a.id - b.id), [models]);

    return [sorted, loading, message] as [M[] | undefined, boolean, string | undefined];
}

export function useLoadingList<M extends IModel>(endpoint: string, params: ParsedUrlQueryInput | Render<M[]>, render?: Render<M[]>): JSX.Element | null {
    const p = typeof params === 'object' ? params : undefined;
    const r = typeof params === 'function' ? params : render;
    const [result, loading, error] = useApiList<M>(endpoint, p);

    if (loading) return <Loading />
    if (!result) return <span className='empty-info'>{error || 'Not found'}</span>
    return r ? r(result) : null;
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
export const Loading = () => {
    return <span className='loading' />;
}

export type Render<R> = (result: R) => JSX.Element | null;

/**
 * React hook to render loading componets universally
 * @param endpoint The api url
 * @param params Optional query parameters
 * @param render The render function called once the data has been received
 */
export function useLoading<R>(endpoint: string, params: ParsedUrlQueryInput | Render<R>, render?: Render<R>): JSX.Element | null {
    const p = typeof params === 'object' ? params : undefined;
    const r = typeof params === 'function' ? params : render;
    const [result, loading, error] = useApi<R>(endpoint, p);

    if (loading) return <Loading />
    if (!result) return <span className='empty-info'>{error || 'Not found'}</span>
    return r ? r(result) : null;
}