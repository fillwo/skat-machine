
import CardDeck from './CardDeck'
import { Card, Player, Phase, GameType, GameEvent, GameEventStatus, GameEndEvent } from './interfaces'
import { suitGameLogic, grandGameLogic, zeroGameLogic } from './GameLogic'
import { analyzeGameEvent} from './Score'


export default class Game {

    private giver: Player
    private listener: Player
    private excludedPlayer: Player | null
    private currentPlayer: Player
    private singlePlayer: Player | null = null
    private needResponse = false
    private bothOut = false
    private phase: Phase = 0
    private currentChallenge = 17
    private selectedGame: null | GameType = null
    private skatUsed = false
    // cards
    private cardDeck: CardDeck
    private playerCards: [Card[], Card[], Card[]] = [[], [], []]
    private skat: Card[]
    private initialSkat: Card[]
    private singlePlayerAllInitialCards: Card[] = []
    // main game logic
    private stack: Card[] = []
    private cardsWonSinglePlayer: Card[] = []
    private cardsWonOthers: Card[] = []
    private gameHistory: Array<{winner: number; trick: Card[]}> = []

    constructor (giver: Player) {
        this.giver = giver
        this.excludedPlayer = giver
        this.listener = (this.giver + 1) % 3 as Player
        this.currentPlayer = (this.giver + 2) % 3 as Player
        this.cardDeck = new CardDeck()
        this.cardDeck.shuffleDeck()
        const { p1, p2, p3, skat } = this.cardDeck.distributeDeck()
        this.playerCards[0] = p1
        this.playerCards[1] = p2
        this.playerCards[2] = p3
        this.skat = skat
        this.initialSkat = skat
    }

    private incrementPlayer (steps: number) {
        this.currentPlayer = (this.currentPlayer + steps) % 3 as Player

        if (this.excludedPlayer === this.currentPlayer) {
            this.incrementPlayer(1)
        }
    }

    getCards (player: Player) {
        if (player < 0 || player > 2) {
            throw new Error('player must be 0, 1 or 2')
        }
        return this.playerCards[player]
    }

    takeSkat (player: Player): GameEvent {
        if (this.phase !== 2 || this.singlePlayer !== player) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you are not allowed to take the skat'
            }
        }
        this.skatUsed = true
        return {
            status: GameEventStatus.OK,
            currentPlayer: this.currentPlayer,
            phase: this.phase,
            singlePlayer: this.singlePlayer,
            currentChallenge: this.currentChallenge,
            skat: [this.skat[0], this.skat[1]],
            ownCards: this.playerCards[player]
        }
    }

    setSkat (player: Player, skat: [Card, Card]): GameEvent {
        if (this.phase !== 2 || this.singlePlayer !== player || !this.skatUsed) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you are not allowed to set the skat'
            }
        }
        // catch same card in skat
        if (skat[0].face === skat[1].face && skat[0].suit === skat[1].suit) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you cannot put these cards in the skat'
            }
        }
        const allCards = [...this.playerCards[player], ...this.skat]
        const idx0 = allCards.findIndex(c => c.face === skat[0].face && c.suit === skat[0].suit)
        const idx1 = allCards.findIndex(c => c.face === skat[1].face && c.suit === skat[1].suit)
        if (idx0 === -1 || idx1 === -1) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you cannot put these cards in the skat'
            }
        }
        const newCards: Card[] = []
        for (let i = 0; i < allCards.length; i++) {
            if (i !== idx0 && i !== idx1 ) {
                newCards.push({ ...allCards[i] })
            }
        }
        this.playerCards[player] = newCards
        this.skat = skat
        return {
            status: GameEventStatus.OK,
            currentPlayer: this.currentPlayer,
            phase: this.phase,
            singlePlayer: this.singlePlayer,
            currentChallenge: this.currentChallenge,
            skat: [this.skat[0], this.skat[1]],
            ownCards: this.playerCards[player]
        }
    }

    challenge (player: Player, value: number | null): GameEvent {
        // catch wrong player
        if (player !== this.currentPlayer || player === this.excludedPlayer) {
            return {
                status: GameEventStatus.ERROR,
                details: 'it\'s not your turn to challenge!'
            }
        }
        // catch wrong phase
        if (this.phase > 1) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you cannot challenge when game is running!'
            }
        }
        // catch both out
        if (this.bothOut) {
            if (value !== null && value !== 18) {
                return {
                    status: GameEventStatus.ERROR,
                    details: `you need to repsond with null or 18`
                }
            }
            if (value === null) {
                this.phase = 4
                return {
                    status: GameEventStatus.END,
                    phase: this.phase,
                    singlePlayer: this.singlePlayer,
                    cardsWonSinglePlayer: this.cardsWonSinglePlayer,
                    cardsWonOthers: this.cardsWonOthers,
                    pointsSinglePlayer: 0,
                    pointsOthers: 0,
                    skat: this.skat,
                    initialSkat: this.initialSkat,
                    skatUsed: false,
                    gameHistory: this.gameHistory,
                    currentChallenge: 0,
                    game: this.selectedGame,
                    gameResult: null,
                    singlePlayerAllInitialCards: this.singlePlayerAllInitialCards
                }
            } else {
                this.currentPlayer = (this.giver + 1) % 3 as Player
                this.phase = 2
                this.singlePlayer = player
                return {
                    status: GameEventStatus.OK,
                    currentChallenge: this.currentChallenge,
                    currentPlayer: this.currentPlayer,
                    phase: this.phase,
                    singlePlayer: this.singlePlayer,
                    skat: null,
                    ownCards: this.playerCards[player]
                }
            }
        }
        // catch wrong response
        if (this.needResponse && value !== null && value !== this.currentChallenge) {
            return {
                status: GameEventStatus.ERROR,
                details: `you need to repsond with null or ${this.currentChallenge}`,
            }
        }
        // player passes
        if (value === null) {
            if (this.phase === 0) {
                this.phase = 1
                this.excludedPlayer = player
                this.currentPlayer = this.giver
                this.needResponse = false
                return {
                    status: GameEventStatus.OK,
                    currentChallenge: this.currentChallenge,
                    currentPlayer: this.currentPlayer,
                    phase: this.phase,
                    singlePlayer: this.singlePlayer,
                    skat: null,
                    ownCards: this.playerCards[player]
                }
            } else if (this.phase === 1) {
                // at least on made a challenge
                if (this.currentChallenge > 17) {
                    this.currentPlayer = (this.giver + 1) % 3 as Player
                    this.phase = 2
                    this.singlePlayer = [0,1,2].filter(d => d !== this.excludedPlayer && d !== player)[0] as Player
                    return {
                        status: GameEventStatus.OK,
                        currentChallenge: this.currentChallenge,
                        currentPlayer: this.currentPlayer,
                        phase: this.phase,
                        singlePlayer: this.singlePlayer,
                        skat: null,
                        ownCards: this.playerCards[player]
                    }
                } else { // both folded
                    this.currentPlayer = [0,1,2].filter(d => d !== this.excludedPlayer && d !== player)[0] as Player
                    this.bothOut = true
                    return {
                        status: GameEventStatus.OK,
                        currentChallenge: this.currentChallenge,
                        currentPlayer: this.currentPlayer,
                        phase: this.phase,
                        singlePlayer: this.singlePlayer,
                        skat: null,
                        ownCards: this.playerCards[player]
                    }
                }
            } else {
                throw new Error('this should not happen')
            }
        }
        // player responds
        if (this.needResponse) {
            this.incrementPlayer(1)
            this.needResponse = false
            return {
                status: GameEventStatus.OK,
                currentChallenge: this.currentChallenge,
                currentPlayer: this.currentPlayer,
                phase: this.phase,
                singlePlayer: this.singlePlayer,
                skat: null,
                ownCards: this.playerCards[player]
            }
        }
        // player challenges
        if (value <= this.currentChallenge) {
            return {
                status: GameEventStatus.ERROR,
                details: `you must challenge higher than ${this.currentChallenge}`
            }
        } else {
            this.currentChallenge = value
            this.incrementPlayer(1)
            this.needResponse = true
            return {
                status: GameEventStatus.OK,
                currentChallenge: this.currentChallenge,
                currentPlayer: this.currentPlayer,
                phase: this.phase,
                singlePlayer: this.singlePlayer,
                skat: null,
                ownCards: this.playerCards[player]
            }
        }
    }

    // todo: check if player is allowd to play certain zero game!!!
    selectGame (player: Player, game: GameType): GameEvent {
        const modifiers = [game.hand, game.schneider, game.schwarz, game.ouvert]
                            .map(m => m ? '1' : '0').join('')

        // catch wrong phase
        if (this.phase !== 2 || player !== this.singlePlayer) {
            return {
                status: GameEventStatus.ERROR,
                details: 'it\'s not your turn to choose a game!'
            }
        }

        // catch wrong hand game
        if (game.hand && this.skatUsed) {
            return {
                status: GameEventStatus.ERROR,
                details: 'cannot play hand, because yout inspected the skat'
            }
        }

        // catch overbidden zero game
        if (game.name === 'Zero' && this.currentChallenge > 23) {
            let allowed = true
            switch (modifiers) {
                case '0000':
                    allowed = this.currentChallenge <= 23
                    break
                case '1000':
                    allowed = this.currentChallenge <= 35
                    break
                case '0001':
                    allowed = this.currentChallenge <= 46
                    break
                case '1001':
                    allowed = this.currentChallenge <= 59
                    break
            }
            if (!allowed) {
                return {
                    status: GameEventStatus.ERROR,
                    details: `zero play is not higher than current challenge ${this.currentChallenge}`
                }
            }
        }

        // color game
        if (game.name === 'Suit') {
            if (!game.suit) {
                return {
                    status: GameEventStatus.ERROR,
                    details: 'please provide a suit to play'
                }
            }
            if (!['0000', '1000', '1100', '1110', '1111'].includes(modifiers)) {
                return {
                    status: GameEventStatus.ERROR,
                    details: 'invalid combination of game modifiers'
                }
            }
        }

        // grand
        if (game.name === 'Grand') {
            if (!['0000', '1000', '1100', '1110', '1111'].includes(modifiers)) {
                return {
                    status: GameEventStatus.ERROR,
                    details: 'invalid combination of game modifiers'
                }
            }
        }

        // zero
        if (game.name === 'Zero') {
            if (!['0000', '1000', '1001', '0001'].includes(modifiers)) {
                return {
                    status: GameEventStatus.ERROR,
                    details: 'invalid combination of game modifiers'
                }
            }
        }

        this.selectedGame = game
        this.phase = 3
        this.currentPlayer = this.listener
        this.excludedPlayer = null
        this.singlePlayerAllInitialCards = [...this.skat, ...this.playerCards[player]]

        return {
            status: GameEventStatus.OK,
            currentChallenge: this.currentChallenge,
            currentPlayer: this.currentPlayer,
            phase: this.phase,
            singlePlayer: this.singlePlayer,
            skat: null,
            ownCards: this.playerCards[player]
        }
    }

    playCard (player: Player, card: Card): GameEvent {
        if (this.currentPlayer !== player || this.phase !== 3) {
            return {
                status: GameEventStatus.ERROR,
                details: 'it\'s not your turn to play a card!'
            }
        }
        if (this.playerCards[player].findIndex(c => c.face === card.face && c.suit === card.suit) === -1) {
            return {
                status: GameEventStatus.ERROR,
                details: 'you do not have this card!'
            }
        }

        const game = this.selectedGame
        if (game === null) {
            throw new Error('selected Game should not be null now!')
        } 
        let validMove = true
        const remainingCards = this.playerCards[player]
            .filter(d => !(d.suit === card.suit && d.face === card.face))
            .map(d => { return { ...d } })
        // check valid move (if stack is empty you can play any card)
        if (this.stack.length > 0) {
            switch (game.name) {
                case 'Suit':
                    if (typeof game.suit === 'undefined') throw new Error('suit is missing')
                    validMove = suitGameLogic.validateMove(this.stack, card, remainingCards, game.suit)
                    break
                case 'Grand':
                    validMove = grandGameLogic.validateMove(this.stack, card, remainingCards)
                    break
                case 'Zero':
                    validMove = zeroGameLogic.validateMove(this.stack, card, remainingCards)
                    break
                default:
                    throw new Error('this should not happen')
            }
        }

        if (!validMove) {
            return {
                status: GameEventStatus.ERROR,
                details: 'this is not a valid move'
            }
        }

        this.stack.push(card)
        this.playerCards[player] = remainingCards

        // check if this was the third card
        // then find the winner
        if (this.stack.length === 3) {
            let winningCardIdx = -1
            switch (game.name) {
                case 'Suit':
                    if (typeof game.suit === 'undefined') throw new Error('suit is missing')
                    winningCardIdx = suitGameLogic.findWinner(this.stack, game.suit)
                    break
                case 'Grand':
                    winningCardIdx = grandGameLogic.findWinner(this.stack)
                    break
                case 'Zero':
                    winningCardIdx = zeroGameLogic.findWinner(this.stack)
                    break
                default:
                    throw new Error('this should not happen')
            }

            if (winningCardIdx < 0) {
                throw new Error('wrong winning card idx')
            }
            // when idx = 2 then player who has played the card wins
            // when idx = 1 then one before that player
            // when id = 0 then two before that player
            const winner = Math.abs((player - (2 - winningCardIdx)) % 3)
            if (winner === this.singlePlayer) {
                this.cardsWonSinglePlayer = [
                    ...this.cardsWonSinglePlayer.map(d => { return { ...d }}),
                    ...this.stack.map(d => { return { ...d }})
                ]
            } else {
                this.cardsWonOthers = [
                    ...this.cardsWonOthers.map(d => { return { ...d }}),
                    ...this.stack.map(d => { return { ...d }})
                ]
            }
            this.gameHistory.push({ winner: winner, trick: this.stack.map(d => { return { ...d } }) })
            this.stack = []
            this.currentPlayer = winner as Player
        } else {
            this.incrementPlayer(1)
        }

        // check if this is the end of the game
        if (this.playerCards[0].length === 0 && this.playerCards[1].length === 0 && this.playerCards[2].length === 0) {
            this.phase = 4
            this.currentPlayer = this.listener
            const res: Omit<GameEndEvent, 'gameResult'> = {
                status: GameEventStatus.END,
                phase: this.phase,
                singlePlayer: this.singlePlayer,
                cardsWonSinglePlayer: this.cardsWonSinglePlayer,
                cardsWonOthers: this.cardsWonOthers,
                pointsSinglePlayer: CardDeck.countPoints([...this.cardsWonSinglePlayer, ...this.skat]),
                pointsOthers: CardDeck.countPoints(this.cardsWonOthers),
                skat: this.skat,
                initialSkat: this.initialSkat,
                skatUsed: this.skatUsed,
                gameHistory: this.gameHistory,
                currentChallenge: this.currentChallenge,
                game: this.selectedGame,
                singlePlayerAllInitialCards: this.singlePlayerAllInitialCards
            }
            const gameRes = analyzeGameEvent(res)

            return { ...res, gameResult: gameRes }
        }

        // todo peak last trick

        return {
            status: GameEventStatus.OK,
            currentPlayer: this.currentPlayer,
            phase: this.phase,
            singlePlayer: this.singlePlayer,
            currentChallenge: this.currentChallenge,
            ownCards: this.playerCards[player],
            skat: null
        }
    }

    peakLastTrick (player: Player): GameEvent {
        if (this.phase !== 3) {
            return {
                status: GameEventStatus.ERROR,
                details: 'cannot peak last trick in this phase'
            }
        }

        // check if player has already played a card in this round
        const stackLength = this.stack.length
        let allowed = false
        const nextP = (this.currentPlayer + 1) % 3

        switch (stackLength) {
            case 0:
                allowed = true
                break
            case 1:
                allowed = player === this.currentPlayer || player === nextP
                break
            case 2:
                allowed = player === this.currentPlayer
                break
            case 3:
                allowed = false
                break
        }

        if (!allowed) {
            return {
                status: GameEventStatus.ERROR,
                details: 'not allowed to inspect last trick!'
            }
        }

        return {
            status: GameEventStatus.INFO,
            lastTrick: this.gameHistory[this.gameHistory.length - 1].trick
        }
    }

}
