import { analyzeGame } from '../Score'
import { Card, GameType } from '../interfaces'

const cards: Card[] = [
    { suit: 'Spades', face: 'Jack' },
    { suit: 'Diamonds', face: 'Jack' },
    { suit: 'Spades', face: 'Ace' },
    { suit: 'Spades', face: 'Ten' },
    { suit: 'Spades', face: 'Eight' },
    { suit: 'Clubs', face: 'Ace' },
    { suit: 'Clubs', face: 'King' },
    { suit: 'Hearts', face: 'Queen' },
    { suit: 'Hearts', face: 'Nine' },
    { suit: 'Hearts', face: 'Seven' },
    // skat
    { suit: 'Hearts', face: 'Eight' },
    { suit: 'Spades', face: 'King' }
]

/* --------------------------- winning hearts game -------------------------- */
test('win hearts game', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 71, 18, game, 18)

    expect(result.gameValue).toBe(20)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game schneider', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 90, 18, game, 18)


    expect(result.gameValue).toBe(30)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game schneider schwarz', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 120, 30, game, 18)


    expect(result.gameValue).toBe(40)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 71, 18, game, 18)

    expect(result.gameValue).toBe(30)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand schneider', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 90, 18, game, 18)

    expect(result.gameValue).toBe(40)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand schneider schwarz', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 120, 30, game, 18)

    expect(result.gameValue).toBe(50)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand schneider claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true }
    const result = analyzeGame(cards, 90, 21, game, 18)

    expect(result.gameValue).toBe(50)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand schneider claimed schwarz claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true }
    const result = analyzeGame(cards, 120, 30, game, 18)

    expect(result.gameValue).toBe(70)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win hearts game hand schneider claimed schwarz claimed ouvert', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true, ouvert: true }
    const result = analyzeGame(cards, 120, 30, game, 18)

    expect(result.gameValue).toBe(80)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

/* --------------------------- loosing hearts game -------------------------- */
test('loose hearts game', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 60, 15, game, 18)

    expect(result.gameValue).toBe(20)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose hearts game hand', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 60, 15, game, 18)

    expect(result.gameValue).toBe(30)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose hearts game hand schneider claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true }
    const result = analyzeGame(cards, 89, 21, game, 18)

    expect(result.gameValue).toBe(50)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose hearts game hand schneider claimed schwarz claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true }
    const result = analyzeGame(cards, 120, 27, game, 18)

    expect(result.gameValue).toBe(70)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose hearts game hand schneider claimed schwarz claimed ouvert', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true, ouvert: true }
    const result = analyzeGame(cards, 120, 27, game, 18)

    expect(result.gameValue).toBe(80)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

/* ------------------------------- overbidding ------------------------------ */
test('overbidding: loose hearts game', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 61, 15, game, 27)

    expect(result.gameValue).toBe(30)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(true)
})

test('overbidding: loose hearts game hand', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 61, 15, game, 33)

    expect(result.gameValue).toBe(40)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(true)
})

test('overbidding: loose hearts game hand schneider claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true }
    const result = analyzeGame(cards, 91, 15, game, 54)

    expect(result.gameValue).toBe(60)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(true)
})

test('overbidding: loose hearts game hand schneider claimed schwarz claimed', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true }
    const result = analyzeGame(cards, 120, 30, game, 72)

    expect(result.gameValue).toBe(80)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(true)
})

test('overbidding: loose hearts game hand schneider claimed schwarz claimed ouvert', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true, schneider: true, schwarz: true, ouvert: true }
    const result = analyzeGame(cards, 120, 30, game, 96)

    expect(result.gameValue).toBe(100)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(true)
})

test('overbidding: win hearts game 30', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 90, 15, game, 30)

    expect(result.gameValue).toBe(30)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('overbidding: win hearts game 40', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards, 120, 30, game, 40)

    expect(result.gameValue).toBe(40)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('overbidding: win hearts game hand 40', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 90, 15, game, 40)

    expect(result.gameValue).toBe(40)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('overbidding: win hearts game hand 50', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts', hand: true }
    const result = analyzeGame(cards, 120, 30, game, 50)

    expect(result.gameValue).toBe(50)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

/* ------------------------------- grand game ------------------------------- */
test('win grand game', () => {
    const game: GameType = { name: 'Grand' }
    const result = analyzeGame(cards, 71, 18, game, 18)

    expect(result.gameValue).toBe(48)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

/* ------------------------------- zero games ------------------------------- */
test('win zero game', () => {
    const game: GameType = { name: 'Zero' }
    const result = analyzeGame(cards, 0, 0, game, 18)

    expect(result.gameValue).toBe(23)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win zero game hand', () => {
    const game: GameType = { name: 'Zero', hand: true }
    const result = analyzeGame(cards, 0, 0, game, 18)

    expect(result.gameValue).toBe(35)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win zero game ouvert', () => {
    const game: GameType = { name: 'Zero', ouvert: true }
    const result = analyzeGame(cards, 0, 0, game, 18)

    expect(result.gameValue).toBe(46)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('win zero game ouvert hand', () => {
    const game: GameType = { name: 'Zero', ouvert: true, hand: true }
    const result = analyzeGame(cards, 0, 0, game, 18)

    expect(result.gameValue).toBe(59)
    expect(result.singlePlayerWon).toBe(true)
    expect(result.overbidden).toBe(false)
})

test('loose zero game', () => {
    const game: GameType = { name: 'Zero' }
    const result = analyzeGame(cards, 0, 3, game, 18)

    expect(result.gameValue).toBe(23)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose zero game hand', () => {
    const game: GameType = { name: 'Zero', hand: true }
    const result = analyzeGame(cards, 0, 3, game, 18)

    expect(result.gameValue).toBe(35)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose zero game ouvert', () => {
    const game: GameType = { name: 'Zero', ouvert: true }
    const result = analyzeGame(cards, 0, 3, game, 18)

    expect(result.gameValue).toBe(46)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

test('loose zero game ouvert hand', () => {
    const game: GameType = { name: 'Zero', ouvert: true, hand: true }
    const result = analyzeGame(cards, 0, 3, game, 18)

    expect(result.gameValue).toBe(59)
    expect(result.singlePlayerWon).toBe(false)
    expect(result.overbidden).toBe(false)
})

/* --------------------------------- spitzen -------------------------------- */

const cards2: Card[] = [
    { suit: 'Spades', face: 'Jack' },
    { suit: 'Diamonds', face: 'Jack' },
    { suit: 'Spades', face: 'Ace' },
    { suit: 'Spades', face: 'Ten' },
    { suit: 'Spades', face: 'Eight' },
    { suit: 'Clubs', face: 'Ace' },
    { suit: 'Clubs', face: 'King' },
    { suit: 'Hearts', face: 'Queen' },
    { suit: 'Hearts', face: 'Nine' },
    { suit: 'Hearts', face: 'Seven' },
    // skat
    { suit: 'Clubs', face: 'Jack' },
    { suit: 'Hearts', face: 'Jack' }
]

test('spades game with 6', () => {
    const game: GameType = { name: 'Suit', suit: 'Spades' }
    const result = analyzeGame(cards2, 61, 15, game, 18)

    expect(result.gameValue).toBe(77)
})

test('hearts game with 4', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards2, 61, 15, game, 18)

    expect(result.gameValue).toBe(50)
})

const cards3: Card[] = [
    { suit: 'Clubs', face: 'Ten' },
    { suit: 'Clubs', face: 'Queen' },
    { suit: 'Spades', face: 'Ace' },
    { suit: 'Spades', face: 'Ten' },
    { suit: 'Spades', face: 'Eight' },
    { suit: 'Clubs', face: 'Ace' },
    { suit: 'Clubs', face: 'King' },
    { suit: 'Hearts', face: 'Queen' },
    { suit: 'Hearts', face: 'Nine' },
    { suit: 'Hearts', face: 'Seven' },
    // skat
    { suit: 'Hearts', face: 'Eight' },
    { suit: 'Spades', face: 'King' }
]

test('hearts game without 7', () => {
    const game: GameType = { name: 'Suit', suit: 'Hearts' }
    const result = analyzeGame(cards3, 61, 15, game, 18)

    expect(result.gameValue).toBe(80)
})

test('clubs game without 4', () => {
    const game: GameType = { name: 'Suit', suit: 'Clubs' }
    const result = analyzeGame(cards3, 61, 15, game, 18)

    expect(result.gameValue).toBe(60)
})
