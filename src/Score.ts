import { Card, Suit, GameEndEvent, Face, GameType, GameResult } from './interfaces'

const suitValues: Record<Suit, number> = {
    'Clubs': 12,
    'Spades': 11,
    'Hearts': 10,
    'Diamonds': 9
}

const spitzen = (cards: Card[], suit: Suit, without: boolean) => {
    const rank: Face[] = ['Ace', 'Ten', 'King', 'Queen', 'Nine', 'Eight', 'Seven']

    if (without) {
        let val = 0
        for (let i = 0; i < rank.length; i++) {
            if (cards.findIndex(d => d.suit === suit && d.face === rank[i]) === -1) {
                val++
            } else {
                break
            }
        }
        return val
    } else {
        let val = 0
        for (let i = 0; i < rank.length; i++) {
            if (cards.findIndex(d => d.suit === suit && d.face === rank[i]) !== -1) {
                val++
            } else {
                break
            }
        }
        return val
    }
}

const jackValue = (cards: Card[], suit: Suit | null = null) => {
    const jacks = cards.filter(d => d.face === 'Jack')

    // all or none
    if (jacks.length === 0) {
        let s = 0
        if (suit) s = spitzen(cards, suit, true)
        return {
            value: 5 + s,
            explanation: 'ohne vier Spiel fünf'
        }
    }
    if (jacks.length === 4) {
        let s = 0
        if (suit) s = spitzen(cards, suit, false)
        return {
            value: 5 + s,
            explanation: 'mit vier Spiel fünf'
        }
    }
    // having the top jack
    if (jacks.findIndex(d => d.suit === 'Clubs') !== -1) {
        // not having spades
        if (jacks.findIndex(d => d.suit === 'Spades') === -1) {
            return {
                value: 2,
                explanation: 'mit einem Spiel zwei'
            }
        } else {
            // not having hearts
            if (jacks.findIndex(d => d.suit === 'Hearts') === -1) {
                return {
                    value: 3,
                    explanation: 'mit zwei Spiel drei'
                }
            } else {
                // having all four is already ruled out
                return {
                    value: 4,
                    explanation: 'mit drei Spiel vier'
                }
            }
        }

    } else {
        // having spades
        if (jacks.findIndex(d => d.suit === 'Spades') !== -1) {
            return {
                value: 2,
                explanation: 'ohne einem Spiel zwei'
            }
        } else {
            // having hearts
            if (jacks.findIndex(d => d.suit === 'Hearts') !== -1) {
                return {
                    value: 3,
                    explanation: 'ohne zwei Spiel drei'
                }
            } else {
                // not having all four is already ruled out
                return {
                    value: 4,
                    explanation: 'ohne drei Spiel vier'
                }
            }
        }
    }
}

export const analyzeGame = (
    sPCards: Card[],
    sPPoints: number,
    sPNumCardsWon: number,
    game: GameType,
    challenge: number
): GameResult => {

    let singlePlayerWon: boolean
    let gameValue: number
    let gameValueText: string
    let overbidden = false

    /* -------------------------------- zero game ------------------------------- */
    if (game.name === 'Zero') {
        singlePlayerWon = sPNumCardsWon === 0

        if (game.ouvert && game.hand) {
            gameValue = 59
            gameValueText = 'Null Ouvert Hand = 59'
        } else if (game.hand) {
            gameValue = 35
            gameValueText = 'Null Hand = 35'
        } else if (game.ouvert) {
            gameValue = 46
            gameValueText = 'Null Ouvert = 46'
        }
        else {
            gameValue = 23
            gameValueText = 'Null = 23'
        }
    }
    /* ---------------------------- suit & grand game --------------------------- */
    else {
        let baseValue: number

        if (game.name === 'Grand') {
            baseValue = 24
        } else {
            if (!game.suit) throw new Error('suit missing')
            baseValue = suitValues[game.suit]
        }

        const jackMultiplier = jackValue(sPCards, game.name === 'Grand' ? null : game.suit)

        const hand = game.hand ? true : false

        const schneiderClaimed = game.schneider ? true : false
        const schneider = sPPoints >= 90

        const schwarzClaimed = game.schwarz ? true : false
        const schwarz = sPNumCardsWon === 30

        const ouvert = game.ouvert ? true : false
        
        let totalMultiplier = 1
        if (ouvert) {
            totalMultiplier = jackMultiplier.value + 6
        } else if (schwarzClaimed) {
            totalMultiplier = jackMultiplier.value + 5
        } else if (schneiderClaimed) {
            totalMultiplier = jackMultiplier.value + 3
        } else {
            totalMultiplier = jackMultiplier.value + Number(hand) + Number(schneider) + Number(schwarz) 
        }

        gameValue = baseValue * totalMultiplier
        
        gameValueText = `${baseValue} x ( ${jackMultiplier.explanation}`
        if (hand) gameValueText += ' (Hand) +1'
        if (schneiderClaimed) gameValueText += ' (Schneider angesagt) +2'
        if (schneider && !schneiderClaimed) gameValueText += ' (Schneider) +1'
        if (schwarzClaimed) gameValueText += ' (Schwarz angesagt) +2'
        if (schwarz && !schwarzClaimed) gameValueText += ' (Schwarz) +1'
        if (ouvert) gameValueText += ' (Ouvert) +1'
        gameValueText += ` ) = ${gameValue}`

        // single player wins, if > 60 points and all modifiers fulfilled and not overbidden

        // not overbidden
        if (gameValue >= challenge) {
            let claimesFulfilled = true
            if (schneiderClaimed && !schneider) claimesFulfilled = false
            if (schwarzClaimed && !schwarz) claimesFulfilled = false
            singlePlayerWon = sPPoints > 60 && claimesFulfilled
        } else {
            singlePlayerWon = false
            let overbiddenValue = 0
            while (overbiddenValue < challenge) {
                overbiddenValue += baseValue
            }
            gameValue = overbiddenValue
            gameValueText += ' Überreizt!'
            overbidden = true
        }
    }

    return { gameValue, gameValueText, singlePlayerWon, overbidden }
}

export const analyzeGameEvent = (gameEndEvent: Omit<GameEndEvent, 'gameResult'>): GameResult => {
    if (gameEndEvent.game === null) {
        throw new Error('game hasn\'t been played')
    }

    return analyzeGame(
        gameEndEvent.singlePlayerAllInitialCards,
        gameEndEvent.pointsSinglePlayer,
        gameEndEvent.cardsWonSinglePlayer.length,
        gameEndEvent.game,
        gameEndEvent.currentChallenge
    )
}
