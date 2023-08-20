from boop_util import(
  Age, Board, Color, Coord, GameState, Move, Piece,
  HEIGHT, VALID_CATS, VALID_KITTENS, WIDTH
)
from enum import Enum
from random import choice
from typing import List


class AIType(Enum):
  RANDOM = 0
  MINIMAX = 1


def get_move(state: GameState, ai_type: AIType) -> Move:
  if ai_type == AIType.RANDOM:
    return get_random_move(state)
  else:
    raise Exception("Only random AI implemented")


def get_random_move(state: GameState) -> Move:
  empty_coords = get_empty_coordinates(state.board)
  coord = choice(empty_coords)
  age = Age.KITTEN
  if state.num_pieces[(state.current_turn, Age.CAT)] > 0:
    age = choice(list(Age))
  return Move(coord, Piece(state.current_turn, age))


def get_empty_coordinates(board: Board) -> List[Coord]:
  empty_coords = []
  for x in range(WIDTH):
    for y in range(HEIGHT):
      if board[(x, y)] == "_":
        empty_coords.append((x, y))
  return empty_coords

