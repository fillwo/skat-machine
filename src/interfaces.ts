

/* ------------------------------- card types ------------------------------- */
export type Suit = 'Clubs' | 'Spades' | 'Hearts' | 'Diamonds'
export type Face = 'Seven' | 'Eight' | 'Nine' | 'Ten' | 'Jack' | 'Queen' | 'King' | 'Ace'

export interface Card {
    suit: Suit;
    face: Face;
}

/* ------------------------------- game cycle ------------------------------- */
/** 0: challenge, 1: challenge (one player folded),
 *  2: game selection, 3: main game, 4: game ended
 * */
export type Phase = 0 | 1 | 2 | 3 | 4
export type Player = 0 | 1 | 2

/* ------------------------------- event types ------------------------------ */
export enum GameEventStatus {
    ERROR = 'ERROR',
    OK = 'OK',
    WARNING = 'WARNING',
    END = 'END',
    INFO = 'INFO'
}

export interface GameOKEvent {
    status: GameEventStatus.OK;
    currentPlayer: Player;
    phase: Phase;
    singlePlayer: null | Player;
    currentChallenge: number;
    skat: [Card, Card] | null,
    ownCards: Card[]
}

export interface GameWarningEvent {
    status: GameEventStatus.WARNING;
    currentPlayer: Player;
    details: string;
}

export interface GameErrorEvent {
    status: GameEventStatus.ERROR;
    details: string;
}

export interface GameInfoEvent {
    status: GameEventStatus.INFO;
    lastTrick?: Card[];
}

export interface GameEndEvent {
    status: GameEventStatus.END;
    phase: Phase;
    singlePlayer: Player | null;
    cardsWonSinglePlayer: Card[];
    cardsWonOthers: Card[];
    pointsSinglePlayer: number;
    pointsOthers: number;
    skat: Card[];
    initialSkat: Card[];
    skatUsed: boolean;
    gameHistory: Array<{winner: number; trick: Card[]}>;
    currentChallenge: number;
    game: GameType | null;
    gameResult: GameResult | null;
    singlePlayerAllInitialCards: Card[];
}

export type GameEvent = GameOKEvent | GameWarningEvent | GameErrorEvent | GameEndEvent | GameInfoEvent

/* ---------------------------------- game ---------------------------------- */
export type GameName = 'Suit' | 'Zero' | 'Grand'

export interface GameType {
    name: GameName;
    suit?: Suit;
    hand?: boolean;
    schneider?: boolean;
    schwarz?: boolean;
    ouvert?: boolean;
}

export interface GameResult {
    gameValue: number;
    gameValueText: string;
    singlePlayerWon: boolean;
    overbidden: boolean;
}

