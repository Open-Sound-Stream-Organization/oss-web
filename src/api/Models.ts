export interface IModel {
    id: number;
    name: string;
    resource_uri: string;
}

export interface ISong extends IModel {
    title: string;
    artists: string[];
    album: string;
    length: number;
    audio: string;
}

export interface ITag extends IModel {
}

type date = string;
type Type = 'P' | 'G' | 'O' | 'C' | 'F' | 'O';
export interface IArtist extends IModel {
    type: Type;
    begin?: date;
    end?: date;
    tags: string[];
    albums: string[];
}

export interface IAlbum extends IModel {
    release: date;
    artists: string[];
    cover_url?: string;
    tags: string[];
    songs: string[];
}

export interface IPlaylist extends IModel {
    tags: string[];
    songs: string[];
}

export interface IList<O> {
    objects: O[];
    meta: {
        limit: number;
        offset: number;
        total_count: number;
    }
}