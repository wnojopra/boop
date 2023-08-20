from absl import app, flags
from ai import AIType, get_move
from boop_util import(
  Age, Board, Color, Coord, GameState, Move, Piece,
  HEIGHT, VALID_CATS, VALID_KITTENS, WIDTH
)
from typing import Sequence
from time import sleep


FLAGS = flags.FLAGS
flags.DEFINE_boolean('demo', False, 'Enable to slow down displaying of board and user input.')
flags.DEFINE_string('ai', None, 'Play against an AI. Choices are random or minimax.')


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


def coordstr_to_coord(coord: str) -> Coord:
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
  y = ord(coord[0].upper()) - ord("A")  # So A is col0, B is col1, etc
  x = HEIGHT - int(coord[1])
  return (x, y)


def coord_to_coordstr(coord: Coord) -> str:
  x, y = coord
  rank = chr(y + ord("A"))
  file = HEIGHT - x
  return f"{rank}{file}"


def age_to_agestr(age: Age) -> str:
  return {
    Age.CAT: "C",
    Age.KITTEN: "K",
  }[age]


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


def check_triple_kitty(state: GameState, move: Move) -> None:
  board = state.board
  # Check rows
  for y in range(HEIGHT):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y)) == board.get((x + 2, y)) and board.get((x, y)) in VALID_KITTENS:
        color = state.get_color_on_board((x, y))
        board[(x, y)] = board[(x + 1, y)] = board[(x + 2, y)] = "_"
        state.num_pieces[(color, Age.CAT)] += 3
  
  # Check columns
  for x in range(WIDTH):
    for y in range(HEIGHT - 2):
      if board.get((x, y)) == board.get((x, y + 1)) == board.get((x, y + 2)) and board.get((x, y)) in VALID_KITTENS:
        color = state.get_color_on_board((x, y))
        board[(x, y)] = board[(x, y + 1)] = board[(x, y + 2)] = "_"
        state.num_pieces[(color, Age.CAT)] += 3
  
  # Check diagonals
  for y in range(HEIGHT - 2):
    for x in range(WIDTH - 2):
      if board.get((x, y)) == board.get((x + 1, y + 1)) == board.get((x + 2, y + 2)) and board.get((x, y)) in VALID_KITTENS:
        color = state.get_color_on_board((x, y))
        board[(x, y)] = board[(x + 1, y + 1)] = board[(x + 2, y + 2)] = "_"
        state.num_pieces[(color, Age.CAT)] += 3
      
      if board.get((x + 2, y)) == board.get((x + 1, y + 1)) == board.get((x, y + 2)) and board.get((x + 2, y)) in VALID_KITTENS:
        color = state.get_color_on_board((x + 1, y + 1))
        board[(x + 2, y)] = board[(x + 1, y + 1)] = board[(x, y + 2)] = "_"
        state.num_pieces[(color, Age.CAT)] += 3


def boop(board: Board, move: Move) -> None:
  x, y = move.coord
  for dx in [-1, 0, 1]:
    for dy in [-1, 0, 1]:
      if dx == dy == 0:
        continue
      nx = x + dx
      ny = y + dy
      if 0 <= nx < WIDTH and 0 <= ny < HEIGHT:
        #if not cat and board[(nx, ny)] in VALID_CATS:
        if move.piece.age == Age.KITTEN and board[(nx, ny)] in VALID_CATS:
          # Cats can't be booped by kitties
          continue
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


def make_move(state: GameState, move: Move) -> None:
  boop(state.board, move)
  board_chars = {
    (Color.ORANGE, Age.KITTEN): "o",
    (Color.BROWN, Age.KITTEN): "b",
    (Color.ORANGE, Age.CAT): "O",
    (Color.BROWN, Age.CAT): "B",
  }
  state.board[move.coord] = board_chars[(state.current_turn, move.piece.age)]
  state.num_pieces[(state.current_turn, move.piece.age)] -= 1
  check_triple_kitty(state, move)


def input_correctly_formatted(uinput: str) -> bool:
  valid_cols = ["A", "B", "C", "D", "E", "F", "a", "b", "c", "d", "e", "f"]
  valid_rows = ["1", "2", "3", "4", "5", "6"]
  valid_ages = ["K", "k", "C", "c"]
  return len(uinput) == 3 and uinput[0] in valid_cols and uinput[1] in valid_rows and uinput[2] in valid_ages


def get_and_check_player_move(state: GameState) -> Move:
  # 1) Get user input, check that it is formatted correctly
  # 2) Check that the square is empty
  # 3) Check that the piece is in the player's pool
  while True:
    uinput = input(f"Turn {state.turn_counter}: Enter move for {state.get_current_player()} cat: ")
    if(FLAGS.demo):
      sleep(1)
    if not input_correctly_formatted(uinput):
      print("Move should be a coordinate followed by a K (for kitten) or C (for cat)")
      print("Example: \"D4K\" places a kitten at D4")
      continue
    coord = coordstr_to_coord(uinput[:2])
    if not state.square_is_empty(coord):
      print(f"Square at {uinput[:2]} is not empty")
      print("Kittens and cats can only be placed on empty squares")
      continue
    age = Age.KITTEN if uinput[2] in ["k", "K"] else Age.CAT
    if not state.player_has_enough_pieces(age):
      print(f"Not enough {age} pieces")
      continue
    print(uinput)
    piece = Piece(state.current_turn, age)
    return Move(coord, piece)


def get_ai_move(state: GameState) -> Move:
  if FLAGS.ai == "random":
    move = get_move(state, AIType.RANDOM)
  elif FLAGS.ai == "minimax":
    move = get_move(state, AIType.MINIMAX)
  else:
    raise Exception(f"{FLAGS.ai} is an invalid AI option")
  print(f"Turn {state.turn_counter}: AI played {coord_to_coordstr(move.coord)}{age_to_agestr(move.piece.age)}")
  return move


def main(argv: Sequence[str]) -> None:
  state = init_gamestate()
  while True:
    print_gameboard(state.board)
    if FLAGS.ai and state.current_turn == Color.BROWN:
      move = get_ai_move(state)
    else:
      move = get_and_check_player_move(state)
    make_move(state, move)
    state.turn_counter += 1
    winner = check_winner(state.board)
    if winner:
      print_gameboard(state.board)
      print(f"{state.get_player_from_board_letter(winner)} has won!")
      break
    state.current_turn = Color.ORANGE if state.current_turn == Color.BROWN else Color.BROWN


if __name__ == "__main__":
  app.run(main)
