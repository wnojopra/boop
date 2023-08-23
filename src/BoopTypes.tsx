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

export class Move {
  constructor(public coord: Coord, public piece: Piece) {}
}

export type Board = (Piece | null)[][];
