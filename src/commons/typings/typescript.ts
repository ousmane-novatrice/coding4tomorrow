export interface AnyObject {
  [key: string]: any;
}

export interface ObjectOfPrimitives {
  [key: string]: string | number | boolean;
}

export interface ObjectOfStringLists {
  [key: string]: string[];
}

export type FuncType = () => void;

export type MapType = Record<string, any>;

export type LatLongType = [number, number];
