import { IAlbum, IArtist, ITag, ITrack, IPlaylist } from './Models';
import API from './Api';

const tracknames = [
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

function range<T>(array: T[], i: number) {
    return array.sort((a, b) => Math.random() - 0.5).slice(0, Math.min(array.length, i));
}

function randomDate() {
    return `${1960 + Math.floor(Math.random() * 60)}`;
}

class Seeder {

    tags(count: number): ITag[] {
        return []
    }

    artists(count: number): IArtist[] {
        return [
            {
                name: 'Dieter Bohlen',
                tags: this.tags(2),
                type: 'P',
            }
        ].map((a, id) => ({ ...a, id } as IArtist));
    }

    albums(count: number): IAlbum[] {
        return [
            {
                name: 'Top 10 Nationalhymnen',
                release: randomDate(),
                artist: this.artists(2),
                cover_url: require('../img/example-cover.jpg'),
                tags: this.tags(3),
            }
        ].map((a, id) => ({ ...a, id }));
    }

    tracks(count: number): ITrack[] {
        return range(tracknames, count).map((title, id) => ({
            id,
            title,
            artist: this.artists(Math.random() * 1 + 1),
            album: this.albums(1)[0],
            length: Math.floor(Math.random() * 100 + 100),
        }));
    }

    playlists(count: number): IPlaylist[] {
        return new Array(count).fill(null).map((_, id) => ({
            id, name: 'A Playlist', tags: [], tracks: this.tracks(Math.random() * 5 + 6)
        }));
    }

    seed() {

        

    }

}

const SEEDER = new Seeder();

export default SEEDER;