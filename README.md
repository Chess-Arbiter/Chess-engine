# Chess Engine

A chess engine written from scratch in TypeScript, playing on Lichess as
[devchessplayer-bot](https://lichess.org/@/devchessplayer-bot).

## The engine

The engine lives in `src/engine`, with no chess libraries.

- 0x88 board with make/unmake and Zobrist hashing (move generation verified with perft)
- Iterative deepening alpha-beta (PVS) with a transposition table, null-move pruning,
  late move reductions, check extensions and a quiescence search
- Move ordering: hash move, MVV-LVA captures, killer moves, history heuristic
- Tapered PeSTO evaluation, plus a mop-up term that drives a lone king to the edge to deliver mate
- Small opening book with common main lines (as Black it plays the Petrov: 1.e4 e5 2.Nf3 Nf6),
  and repetition avoidance
- Five levels, from Beginner (1 ply, sometimes a random move) to Expert (4 s per move);
  the Lichess bot plays at Expert

## Lichess bot

`lichess/bot.ts` plays the engine on Lichess through the Bot API. It accepts standard and
from-position challenges, one game at a time, and thinks less when its clock runs low.
It needs a BOT account and an API token with the `bot:play` scope, in `.env`:

    LICHESS_TOKEN=lip_...

- `npm start` runs the bot.
- `npm run lichess -- upgrade` turns a fresh account (no games played) into a BOT account. This cannot be undone.
- `npm test` runs the engine tests, `npm run typecheck` checks the types.

### On a server (Docker)

    git clone https://github.com/ArtyomSukiasyan/Chess-engine.git
    cd Chess-engine
    echo "LICHESS_TOKEN=lip_..." > .env
    docker compose up -d --build

Docker restarts the bot after crashes and reboots. `docker compose logs -f` shows its games;
after `git pull`, run `docker compose up -d --build` again to update it.
Run the bot in one place only: two copies on the same account would both play the same games.
