import { IApi } from "./Api";
import { IModel, ITrack, IActiveTrack, IArtist, IAlbum, ITag, IPlaylist } from "./Models";
import { ParsedUrlQueryInput } from "querystring";

interface FakeMethods<O> {
    get: () => O,
    delete?: (id: number) => unknown,
    put?: (id: number, o: O) => unknown,
    post?: (o: any) => unknown
}

class FakeApi implements IApi {
    catch(arg0: (e: any) => void) {
        throw new Error("Method not implemented.");
    }

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

function random<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}

function range<T>(array: T[], i: number) {
    return array.sort((a, b) => Math.random() - 0.5).slice(0, Math.min(array.length, i));
}

function randomDate() {
    return `${1960 + Math.floor(Math.random() * 60)}`;
}

const tags: ITag[] = []

const artists: IArtist[] = [
    {
        name: 'Dieter Bohlen',
        tags: range(tags, 3),
        type: 'P',
    }
].map((a, id) => ({ ...a, id } as IArtist));

const albums: IAlbum[] = [
    {
        name: 'Top 10 Nationalhymnen',
        release: randomDate(),
        artist: range(artists, 2),
        cover_url: require('../img/example-cover.jpg'),
        tags: range(tags, 3),
    }
].map((a, id) => ({ ...a, id }));

const tracks: ITrack[] = [
    "Daunting Moons",
    "The Inside-Out Matter",
    "No One Works At Anger",
    "It Uses They",
    "Pawns At the Spring",
    "The Bowl Find",
    "Obstructing History",
    "Sing Doors",
    "Feverish Thorns",
    "Listen",
    "Thoughts",
    "From The Phantom Penguins",
    "Rule Dos On a Prisoner",
    "Visions In Cadenza",
    "The Ambitious Sweet Child",
    "The Love of Journal",
    "The Magic's Act",
    "Mercy Buy School",
    "Gamble Broadcasting",
    "On They Savior",
    "Dreaming Universes",
    "Missing",
    "Bound Cigars",
    "The Smooth Stream",
    "I Sends Through Expression",
    "No One Finishs Everybody",
    "Something Without the Swords",
    "The Harmony Imagine",
    "Typing Activity",
    "Try Right Now",
    "Bare Machinations",
    "Have",
    "Moment",
    "Of The Venturesome Bond",
    "Photography Cans From a Building",
    "Power From Serenade",
    "The Cool Yearning",
    "The Places of Sweet Child",
    "The Souls's Children",
    "Earaches Listen Crafter",
    "Healing Kneeling",
    "From He Person",
    "Drooling Lines",
    "Undoubted",
    "Bad Outlaws",
    "The Which Island",
    "It Stands Under Expectations",
    "I Puts Its",
    "Date Under the Forever",
    "The Death Give",
    "Slaughtering Matter",
    "Lose War",
    "Solitary Body",
    "Drink",
    "Touch",
    "Like The Same Fair",
    "Building Feels Under a Rose",
    "Flames Of Official",
    "The Abandoned Disk",
    "The Height of Silk",
    "The Anything's Terror",
    "Hope Understand Muse",
    "Village Sailing",
    "Through We Woman",
    "Pleading Names",
    "Hungry"
].map((title, id) => ({
    id,
    title,
    artist: range(artists, Math.random() * 1 + 1),
    album: random(albums),
    length: Math.floor(Math.random() * 100 + 100),
}));

const playlists: IPlaylist[] = new Array(6).fill(null).map((_, id) => ({
    id, name: 'A Playlist', tags: [], tracks: range(tracks, Math.random() * 5 + 6)
}))

API.fakeModels<ITrack>('track', tracks);
API.fakeModels<IArtist>('artist', artists);
API.fakeModels<IAlbum>('album', albums);
API.fakeModels<ITag>('tag', tags);
API.fakeModels<IPlaylist>('playlist', playlists);

API.fake<IActiveTrack>('active-track', () => {
    const track = random(tracks);
    return { ...track, position: Math.floor(Math.random() * track.length) }
});


export default API;