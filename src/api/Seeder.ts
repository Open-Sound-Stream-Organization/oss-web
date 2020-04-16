import Api from './Api';

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

    tags(count: number) {
        return []
    }

    artists(count: number) {
        return [
            {
                name: 'Dieter Bohlen',
                type: 'P',
            }
        ].slice(0, count).map((a) => ({ ...a }));
    }

    albums(count: number) {
        return [
            {
                name: 'Top 10 Nationalhymnen',
                release: randomDate(),
                artist: this.artists(2),
                cover_url: require('../img/example-cover.jpg')
            }
        ].slice(0, count).map((a) => ({ ...a }));
    }

    tracks(count: number) {
        return range(tracknames, count).map((title, id) => ({
            title,
            //artist: this.artists(Math.random() * 1 + 1),
            //album: this.albums(1)[0],
            length: Math.floor(Math.random() * 100 + 100),
        }));
    }

    playlists(count: number) {
        return new Array(count).fill(null).map((_, i) => ({
            name: 'Playlist ' + i,
        }));
    }

    async seed() {

        const artists = this.artists(20);
        const albums = this.artists(20);
        const tracks = this.tracks(1);
        const playlists = this.playlists(6);

        await Promise.all([
            //...artists.map(a => Api.post('artist', a)),
            //...albums.map(a => Api.post('album', a)),
            ...tracks.map(t => Api.post('track', t)),
            //...playlists.map(p => Api.post('playlist', p)),
        ]).then(r => console.log(r));

    }

}

const SEEDER = new Seeder();

export default SEEDER;