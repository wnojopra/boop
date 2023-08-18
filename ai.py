from boop_util import WIDTH, HEIGHT, VALID_PIECES, Coord, Board
from typing import List

def get_valid_moves(board: Board) -> List[Coord]:
  valid_moves = []
  for x in range(WIDTH):
    for y in range(HEIGHT):
      if board[(x, y)] == "_":
        valid_moves += (x, y)
  return valid_moves

