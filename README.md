# Boop

This is a digital version of the [Boop board game](https://boardgamegeek.com/boardgame/355433/boop). This was originally created as a text version written in Python. An online version written in JavaScript is in development.

# Python

## Local development

### Python dependencies 

1. Create a new virtual environment. In this example, it is named "boop".
```
python3 -m venv boop
```
2. Enter the virtual environment.
```
source boop/bin/activate
```
3. Install dependencies.
```
pip install -r requirements.txt
```

### Flags

By default, a a standard game is played where moves for both players are input by users:
```
python boop.py
```
For testing, moves can be read redirected to stdin from a file:
```
python boop.py < test_script.txt
```
You can slow down the printing of moves and boards with the `--demo` flag:
```
python boopy.py --demo < test_script.txt
```
You can play against the AI with the `--ai=AI_TYPE` flag. Current available types are `random` and `minimax`
```
python boop.py --ai=random
```

# JavaScript

In the `js` directory run
```
npm start
```