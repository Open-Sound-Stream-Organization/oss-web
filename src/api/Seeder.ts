import Api from './Api';
import { IList, IModel, IArtist, IAlbum, ISong } from './Models';
import { Dispatch, SetStateAction } from 'react';

const songNames = [
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
];

const artistNames = [
    'Talking Heads',
    'Carl Perkins',
    'Curtis Mayfield',
    'R.E.M.',
    'Diana Ross and the Supremes',
    'Lynyrd Skynyrd',
    'Nine Inch Nails',
    'Booker T. and the MGs',
    'Guns n’ Roses',
    'Tom Petty',
    'Carlos Santana',
    'The Yardbirds',
    'Jay-Z',
    'Gram Parsons',
    'Tupac Shakur',
    'Black Sabbath',
    'James Taylor',
    'Eminem',
    'Creedence Clearwater Revival',
    'The Drifters',
    'Elvis Costello',
    'The Four Tops',
    'The Stooges',
    'Beastie Boys',
    'The Shirelles',
    'Eagles',
    'Hank Williams',
    'Radiohead',
    'AC/DC',
    'Frank Zappa',
    'The Police',
    'Jackie Wilson',
    'The Temptations',
    'Cream',
    'Al Green',
    'The Kinks',
    'Phil Spector',
    'Tina Turner',
    'Joni Mitchell',
    'Metallica',
    'The Sex Pistols',
    'Aerosmith',
    'Parliament and Funkadelic',
    'Grateful Dead',
    'Dr. Dre',
    'Eric Clapton',
    'Howlin’ Wolf',
    'The Allman Brothers Band',
    'Queen',
    'Pink Floyd'
]

function range<T>(array: T[], i: number) {
    return array.sort((a, b) => Math.random() - 0.5).slice(0, Math.min(array.length, i));
}

function random<T>(array: T[]) {
    return range(array, 1)[0];
}

function randomDate() {
    return `${1960 + Math.floor(Math.random() * 60)}`;
}

export interface ITracker {
    setTotal: Dispatch<SetStateAction<number>>,
    setProgress: Dispatch<SetStateAction<number>>,
    setMessage?: Dispatch<SetStateAction<string | null>>,
}

class Seeder {

    tags(count: number) {
        return []
    }

    artists(count: number) {
        return range(artistNames, count).map(name => ({ name, type: 'P' }));
    }

    albums(artists: IArtist[]) {
        const artistIds = artists.map(a => a.resource_uri);
        return (count: number) => range(songNames, count).map(name => ({
            name,
            artists: range(artistIds, 2),
            release: randomDate(),
        }));
    }

    songs(albums: IAlbum[]) {
        return (count: number) => range(songNames, count).map(title => {
            const { artists, resource_uri } = random(albums);
            return {
                title,
                artists,
                album: resource_uri,
                length: Math.floor(Math.random() * 100 + 100),
            };
        })
    }

    playlists(count: number) {
        return new Array(count).fill(null).map((_, i) => ({
            name: 'Playlist ' + i,
        }));
    }

    private wait(millis: number) {
        return new Promise(res => setTimeout(res, millis));
    }

    private async seedModels<M extends IModel>(endpoint: string, count: number, generator: (i: number) => unknown[], tracker?: ITracker) {

        tracker?.setMessage?.call(null, `Fetching ${endpoint}s`)
        tracker?.setProgress(0);

        const old = await Api.fetch<IList<IModel>>(endpoint);
        tracker?.setTotal(old.objects.length + count);

        tracker?.setMessage?.call(null, `Deleting ${endpoint}s`)
        await Promise.all(old.objects.map(m =>
            Api.delete(m.resource_uri, {}, false)
                .catch(e => console.error(e))
                .then(() => tracker?.setProgress(i => i + 1))
        ));

        tracker?.setMessage?.call(null, `Seeding ${endpoint}s`)
        await Promise.all(generator(count).map(m =>
            Api.post(endpoint, m, false)
                .catch(e => console.error(e))
                .then(() => tracker?.setProgress(i => i + 1))
        ));

        const { objects } = await Api.fetch<IList<M>>(endpoint);
        return objects;
    }

    async uploadFile(songs: ISong[], tracker?: ITracker) {
        tracker?.setTotal(songs.length);
        tracker?.setProgress(0);
        tracker?.setMessage?.call(null, 'Uploading Songs');
        
        songs.map(() => {

            const audio = require('../test.mp3');
            console.log(audio);

            tracker?.setProgress(i => i + 1);
        });
    }

    async seed(tracker?: ITracker) {

        const artists = await this.seedModels<IArtist>('artist', 20, this.artists, tracker);
        const albums = await this.seedModels<IAlbum>('album', 20, this.albums(artists), tracker);
        const songs = await this.seedModels<ISong>('song', 70, this.songs(albums), tracker);
        await this.uploadFile(songs, tracker);


        tracker?.setMessage?.call(null, 'Done');
        this.wait(200);
        tracker?.setTotal(0);
        tracker?.setMessage?.call(null, null);

        Api.update();

    }

}

const SEEDER = new Seeder();

export default SEEDER;