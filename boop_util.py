from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List

WIDTH = 6
HEIGHT = 6
VALID_KITTENS = ["o", "b"]
VALID_CATS = ["O", "B"]
VALID_PIECES = VALID_KITTENS + VALID_CATS

Coord = tuple[int, int]
Board = Dict[Coord, str]

class Color(Enum):
  ORANGE = 0
  BROWN = 1

class Age(Enum):
  KITTEN = 0
  CAT = 1

@dataclass
class Piece:
  color: Color
  age: Age

@dataclass
class Move:
  coord: Coord
  piece: Piece

@dataclass
class GameState:
  board: Board
  current_turn: Color = Color.ORANGE
  num_pieces: Dict[tuple[Color, Age], int] = field(default_factory = lambda: ({
    (Color.ORANGE, Age.KITTEN): 8,
    (Color.BROWN, Age.KITTEN): 8,
    (Color.ORANGE, Age.CAT): 0,
    (Color.BROWN, Age.CAT): 0,
  }))

  def get_current_player(self) -> str:
    return {
      Color.ORANGE: "Orange",
      Color.BROWN: "Brown",
    }[self.current_turn]

  def player_has_enough_pieces(self, age: Age) -> bool:
    return self.num_pieces[(self.current_turn, age)] > 0

  def square_is_empty(self, coord: Coord) -> bool:
    return self.board[coord] == "_"

  def get_color_on_board(self, coord: Coord) -> Color:
    return {
      "o": Color.ORANGE,
      "O": Color.ORANGE,
      "b": Color.BROWN,
      "B": Color.BROWN,
    }[self.board[coord]]

  def get_player_from_board_letter(self, l: str) -> str:
    return {
      "o": "Orange",
      "O": "Orange",
      "b": "Brown",
      "B": "Brown",
    }[l]