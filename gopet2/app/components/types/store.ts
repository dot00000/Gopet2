type Lat = number;
type Lng = number;
export type Coordinates = [Lat, Lng];

export type Store = {
    id: string;
    name: string;
    images: string[];
    description?: string;
}