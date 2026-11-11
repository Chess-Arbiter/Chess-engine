import { bookMove } from "./book";
import { BotSettings } from "./levels";
import { moveToUci } from "./notation";
import { BotPosition, Position } from "./position";
import { search } from "./search";

/**
 * Picks the bot's move in UCI ("e2e4", "e7e8q"): a book move in the opening, otherwise the best
 * move found within the level's time and depth limits (sometimes a random one on the easier
 * levels). `history` holds the earlier positions of the game, to avoid repetitions.
 * Returns null when there is no legal move.
 */
export function chooseUciMove(
  current: BotPosition,
  history: BotPosition[],
  settings: BotSettings
): string | null {
  const position = new Position(current, history);
  const move = pickMove(position, settings);
  return move ? moveToUci(move) : null;
}

function pickMove(position: Position, settings: BotSettings): number {
  const legal = position.legalMoves();
  if (legal.length === 0) return 0;

  let move = 0;
  if (Math.random() < settings.randomMoveChance) {
    move = legal[Math.floor(Math.random() * legal.length)];
  }
  if (!move && settings.useBook) move = bookMove(position);
  if (!move) move = search(position, settings.timeLimitMs, settings.maxDepth).move;
  return move;
}
