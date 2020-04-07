export interface ITrack {
    name: string;
    artist: IArtist;
    album: IAlbum;
    length: number;
}

export interface IActiveTrack extends ITrack {
    position: number;
}

export interface IArtist {
    name: string;
}

export interface IAlbum {
    name: string;
}