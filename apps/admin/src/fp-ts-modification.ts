import * as A from 'fp-ts/Array';

export type DropLeft<T extends any[]> = T extends [any, ...infer Rest] ? Rest : [];

export function dropLeft<T extends any[]>(n: number): DropLeft<T> {
    return A.dropLeft(n) as unknown as DropLeft<T>;
}

// declare module 'fp-ts/Array' {

    
 
// }