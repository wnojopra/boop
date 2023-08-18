from dataclasses import dataclass, field
from typing import Dict

WIDTH = 6
HEIGHT = 6
VALID_KITTENS = ["o", "b"]
VALID_CATS = ["O", "B"]
VALID_PIECES = VALID_KITTENS + VALID_CATS

Coord = tuple[int, int]
Board = Dict[Coord, str]

@dataclass
class GameState:
  board: Board
  kittens: Dict[str, int] = field(default_factory = lambda: ({
    "Orange": 8,
    "Brown": 8,
  }))
  cats: Dict[str, int] = field(default_factory = lambda: ({
    "Orange": 0,
    "Brown": 0,
  }))
