export const WIDTH: number = 6;
export const HEIGHT: number = 6;

export type Coord = [number, number];

export enum Color {
  ORANGE,
  BROWN,
}

export enum Age {
  KITTEN,
  CAT,
}

export class Piece {
  constructor(public color: Color, public age: Age) {}
}

export function arePiecesEqual(piece1: Piece | null, piece2: Piece | null): boolean {
  // If both pieces are null, consider them equal
  if (piece1 === null && piece2 === null) {
    return true;
  }

  // If only one of the pieces is null, they are not equal
  if (piece1 === null || piece2 === null) {
    return false;
  }

  // Compare the properties of the non-null pieces
  return piece1.color === piece2.color && piece1.age === piece2.age;
}

export class Move {
  constructor(public coord: Coord, public piece: Piece) {}
}

export type Board = (Piece | null)[][];
