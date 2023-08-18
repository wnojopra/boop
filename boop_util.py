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
  ORANGE = 1
  BROWN = 2

class Age(Enum):
  KITTEN = 1
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
  orange_pieces: List[Piece]
  brown_pieces: List[Piece]
  kittens: Dict[str, int] = field(default_factory = lambda: ({
    "Orange": 8,
    "Brown": 8,
  }))
  cats: Dict[str, int] = field(default_factory = lambda: ({
    "Orange": 0,
    "Brown": 0,
  }))
