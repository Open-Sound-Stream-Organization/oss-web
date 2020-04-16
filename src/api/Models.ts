export interface IModel {
    id: number;
}

export interface ITrack extends IModel {
    title: string;
    artists: string[];
    album: string;
    length: number;
}

export interface IActiveTrack extends ITrack {
    position: number;
}

export interface ITag extends IModel {
    name: string;
}

type date = string;
type Type = 'P' | 'G' | 'O' | 'C' | 'F' | 'O';
export interface IArtist extends IModel {
    name: string;
    type: Type;
    begin?: date;
    end?: date;
    tags: string[];

}

export interface IAlbum extends IModel {
    name: string;
    release: date;
    artists: string[];
    cover_url?: string;
    tags: string[];
}

export interface IPlaylist extends IModel {
    name: string;
    tags: string[],
}

export interface IList<O> {
    objects: O[];
    meta: {
        limit: number;
        offset: number;
        total_count: number;
    }
}