import { IApi } from "./Api";
import { IModel, ISong, IArtist, IAlbum, ITag, IPlaylist } from "./Models";
import { ParsedUrlQueryInput } from "querystring";
import Seeder from './Seeder';

interface FakeMethods<O> {
    get: () => O,
    delete?: (id: number) => unknown,
    put?: (id: number, o: O) => unknown,
    post?: (o: any) => unknown
}

class FakeApi implements IApi {

    private fakes = new Map<string, FakeMethods<any>>();

    public fakeModels<O extends IModel>(endpoint: string, models: O[]) {
        this.fake<O[]>(endpoint, {
            get: () => models,
            post: m => models.push(m)
        });

        models.forEach(m => this.fake(`${endpoint}/${m.id}`, {
            get: () => m,
            delete: id => {
                models = models.filter(m => m.id !== id);
            },
            put: (id, m) => {
                const o = models.find(m => m.id === id);
                if (!o) return;
                const n = { ...o, m } as O;
                models[models.indexOf(o)] = n;
            }
        }));
    }

    public fake<O = IModel>(endpoint: string, data: FakeMethods<O> | (() => {})) {
        if (typeof data === 'function') this.fake(endpoint, { get: data });
        else this.fakes.set(endpoint, data);
    }

    public async fakeFor(url: string) {
        return new Promise<FakeMethods<unknown>>((res, rej) => window.setTimeout(() => {

            const endpoint = url.match(/^\/?([a-zA-Z0-9_/-]+?)\??\/?\??$/);
            if (endpoint) {
                const fake = this.fakes.get(endpoint[1]);

                if (fake) res(fake);
                rej(new Error('Not Found'));

            } else rej(new Error('Invalid Endpoint'));

        }, 1000 * (Math.random() + 1)))
    }

    public subscribe<O>(url: string, params?: ParsedUrlQueryInput) {

        return {
            then: (cb: (result: O | undefined, error?: Error) => unknown) => {

                this.fakeFor(url)
                    .then(f => f.get())
                    .then(r => cb(r as O))
                    .catch(e => cb(undefined, e));

                return () => { };
            }
        }

    }

    public async post<O = string>(url: string, args: any) {
        const fake = await this.fakeFor(url);
        if (fake?.post) fake?.post(args);
        return "Posted" as any as O;
    }

    public async delete<O = string>(url: string, args: any) {
        const fake = await this.fakeFor(url);
        if (fake?.delete) fake?.delete(args.id);
        return "Deleted" as any as O;
    }

    public async put<O = string>(url: string, args: any) {
        const fake = await this.fakeFor(url);
        if (fake?.put) fake?.put(args.id, args);
        return "Updated" as any as O;
    }

}

const API = new FakeApi();

//API.fakeModels<ISong>('song', Seeder.songs(20));
//API.fakeModels<IArtist>('artist', Seeder.artists(20));
//API.fakeModels<IAlbum>('album', Seeder.albums(20));
//API.fakeModels<ITag>('tag', Seeder.tags(20));
//API.fakeModels<IPlaylist>('playlist', Seeder.playlists(6));

//API.fake<IActiveSong>('active-song', () => {
//    const song = Seeder.songs(1)[0];
//    return { ...song, position: Math.floor(Math.random() * song.length) }
//});


export default API;