from absl import app
from typing import Sequence
from boop_util import WIDTH, HEIGHT, VALID_KITTENS, VALID_CATS, Coord, Board, GameState


def init_gameboard() -> Board:
  board = {}
  for x in range(WIDTH):
    for y in range(HEIGHT):
      board[(x, y)] = "_"
  return board


def init_gamestate() -> GameState:
  return GameState(init_gameboard())


def print_gameboard(board: Board) -> None:
  for x in range(WIDTH):
    row = "|"
    for y in range(HEIGHT):
      row += board[(x, y)]
      row += "|"
    row += f" {HEIGHT-x}"
    print(row)
  print(" A B C D E F")


def coord_to_key(coord: str) -> Coord:
  """
  Refer to this grid
  |_|_|_|_|_|_| 6
  |_|_|_|_|_|_| 5
  |_|_|_|_|_|_| 4
  |_|_|_|_|_|_| 3
  |_|_|_|_|_|_| 2
  |_|_|_|_|_|_| 1
   A B C D E F

  Top left corner (A6) is (0, 0)
  Top right corner (F6) is (0, 5)
  Bottom left corner (A1) is (5, 0)
  Bottom right corner (F1) is (5, 5)
  """
  valid_coords = [
    "A1", "A2", "A3", "A4", "A5", "A6",
    "B1", "B2", "B3", "B4", "B5", "B6",
    "C1", "C2", "C3", "C4", "C5", "C6",
    "D1", "D2", "D3", "D4", "D5", "D6",
    "E1", "E2", "E3", "E4", "E5", "E6",
    "F1", "F2", "F3", "F4", "F5", "F6",
  ]
  if coord not in valid_coords:
    return None
  y = ord(coord[0]) - ord("A")  # So A is col0, B is col1, etc
  x = HEIGHT - int(coord[1])
  return (x, y)


def check_winner(board: Board) -> str:
  # Check rows
  for y in range(HEIGHT):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y)) == board.get((x + 2, y)) and board.get((x, y)) in VALID_CATS:
        return board.get((x, y))
  
  # Check columns
  for x in range(WIDTH):
    for y in range(HEIGHT - 2):
      if board.get((x, y)) == board.get((x, y + 1)) == board.get((x, y + 2)) and board.get((x, y)) in VALID_CATS:
        return board.get((x, y))
  
  # Check diagonals
  for y in range(HEIGHT - 2):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y + 1)) == board.get((x + 2, y + 2)) and board.get((x, y)) in VALID_CATS:
        return board.get((x, y))
      
      if board.get((x + 2, y)) == board.get((x + 1, y + 1)) == board.get((x, y + 2)) and board.get((x + 2, y)) in VALID_CATS:
        return board.get((x + 2, y))
  
  return None  # No winner found


def check_triple_kitty(state: GameState, player: str) -> None:
  board = state.board
  # Check rows
  for y in range(HEIGHT):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y)) == board.get((x + 2, y)) and board.get((x, y)) in VALID_KITTENS:
        board[(x, y)] = board[(x + 1, y)] = board[(x + 2, y)] = "_"
        state.cats[player] += 3
  
  # Check columns
  for x in range(WIDTH):
    for y in range(HEIGHT - 2):
      if board.get((x, y)) == board.get((x, y + 1)) == board.get((x, y + 2)) and board.get((x, y)) in VALID_KITTENS:
        board[(x, y)] = board[(x, y + 1)] = board[(x, y + 2)] = "_"
        state.cats[player] += 3
  
  # Check diagonals
  for y in range(HEIGHT - 2):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y + 1)) == board.get((x + 2, y + 2)) and board.get((x, y)) in VALID_KITTENS:
        board[(x, y)] = board[(x + 1, y + 1)] = board[(x + 2, y + 2)] = "_"
        state.cats[player] += 3
      
      if board.get((x + 2, y)) == board.get((x + 1, y + 1)) == board.get((x, y + 2)) and board.get((x + 2, y)) in VALID_KITTENS:
        board[(x + 2, y)] = board[(x + 1, y + 1)] = board[(x, y + 2)] = "_"
        state.cats[player] += 3


def boop(board: Board, coordinate: Coord) -> None:
  x, y = coordinate
  for dx in [-1, 0, 1]:
    for dy in [-1, 0, 1]:
      if dx == dy == 0:
        continue
      nx = x + dx
      ny = y + dy
      if board[(x, y)] in VALID_KITTENS and board[(nx, ny)] in VALID_CATS:
        # Cats can't be booped by kitties
        continue
      if 0 <= nx < WIDTH and 0 <= ny < HEIGHT:
        # Check behind the neighbor
        bx = nx + dx
        by = ny + dy
        if bx not in range(0, WIDTH) or by not in range(0, HEIGHT):
          # Booped off
          board[(nx, ny)] = "_"
        elif board[(bx, by)] == "_":
          # Boop the cat backwards
          board[(bx, by)] = board[(nx, ny)]
          board[(nx, ny)] = "_"
        else:
          # There's a cat in the way. No booping.
          pass


def make_move(state: GameState, coordinate: Coord, player: str, cat=False) -> None:
  boop(state.board, coordinate)
  state.board[coordinate] = player[0] if cat else player[0].lower()
  if cat:
    state.cats[player] -= 1
  check_triple_kitty(state, player)


def main(argv: Sequence[str]) -> None:
  state = init_gamestate()
  players = ["Orange", "Brown"]
  turn_counter  = 0
  while True:
    print_gameboard(state.board)
    turn = players[turn_counter%2]
    coord = input(f"Enter move for {turn} cat: ")
    cat = False
    if coord[-1] in ["C", "c"]:
      cat = True
      coord = coord[:-1]

    k = coord_to_key(coord)
    if not k:
      print(f"{coord} is not a valid move. Please try again: ")
      continue
    make_move(state, k, turn, cat)
    turn_counter += 1
    winner = check_winner(state.board)
    if winner:
      print_gameboard(state.board)
      print(f"{turn} has won!")
      break


if __name__ == "__main__":
  app.run(main)
