import Game from '../Game'
import { Card, GameEventStatus, GameOKEvent } from '../interfaces'

test('select game', () => {
    const game = new Game(0)
    expect(game.selectGame(0, { name: 'Suit', suit: 'Clubs' }).status).toBe(GameEventStatus.ERROR)

    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, null).status).toBe(GameEventStatus.OK)

    expect(game.selectGame(1, { name: 'Suit', suit: 'Clubs' }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(0, { name: 'Suit', suit: 'Clubs' }).status).toBe(GameEventStatus.ERROR)

    const response = game.selectGame(2, { name: 'Suit', suit: 'Clubs' }) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.singlePlayer).toBe(2)
    expect(response.phase).toBe(3)
    expect(response.currentPlayer).toBe(1)
})

test('only single player can take & set skat', () => {
    const skat: [Card, Card] = [
        { face: 'Ace', suit: 'Clubs' },
        { face: 'Ace', suit: 'Spades' },
    ] 
    let game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, null).status).toBe(GameEventStatus.OK)

    expect(game.takeSkat(1).status).toBe(GameEventStatus.ERROR)
    expect(game.takeSkat(0).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(1, skat).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(0, skat).status).toBe(GameEventStatus.ERROR)

    let response = game.takeSkat(2) as GameOKEvent

    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.skat).toHaveLength(2)

    expect(response.skat).not.toBe(null)

    expect(response.skat?.[0]).toHaveProperty('suit')
    expect(response.skat?.[0]).toHaveProperty('face')

    game = new Game(0)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)

    expect(game.takeSkat(2).status).toBe(GameEventStatus.ERROR)
    expect(game.takeSkat(0).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(2, skat).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(0, skat).status).toBe(GameEventStatus.ERROR)
    expect(game.takeSkat(1).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)

    expect(game.takeSkat(2).status).toBe(GameEventStatus.ERROR)
    expect(game.takeSkat(1).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(2, skat).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(1, skat).status).toBe(GameEventStatus.ERROR)
    expect(game.takeSkat(0).status).toBe(GameEventStatus.OK)
})

test('get cards', () => {
    const game = new Game(0)
    expect(game.getCards(0)).toHaveLength(10)
    expect(game.getCards(1)).toHaveLength(10)
    expect(game.getCards(2)).toHaveLength(10)
})

test('set skat', () => {
    const game = new Game(0)
    const cards0 = game.getCards(0)
    const card00 = cards0[0]
    const card01 = cards0[1]

    const otherCard = game.getCards(1)[0]

    game.challenge(2, null)
    game.challenge(0, 18)
    game.challenge(1, null)

    const skat = (game.takeSkat(0) as GameOKEvent).skat

    expect(game.setSkat(0, [otherCard, card00]).status).toBe(GameEventStatus.ERROR)
    expect(game.setSkat(0, [card01, otherCard]).status).toBe(GameEventStatus.ERROR)

    let response = game.setSkat(0, [card00, card01]) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    const newSkat = response.skat?.map(d => d.face + d.suit)
    const newCards = response.ownCards.map(d => d.face + d.suit)
    expect(newSkat).toContain(card00.face + card00.suit)
    expect(newSkat).toContain(card01.face + card01.suit)
    expect(newCards).not.toContain(card00.face + card00.suit)
    expect(newCards).not.toContain(card01.face + card01.suit)
    expect(newCards).toContain(String(skat?.[0].face) + String(skat?.[0].suit))
    expect(newCards).toContain(String(skat?.[1].face) + String(skat?.[1].suit))
})

test('same card as skat', () => {
    const game = new Game(0)

    game.challenge(2, null)
    game.challenge(0, 18)
    game.challenge(1, null)

    const cards = game.getCards(0)
    game.takeSkat(0)

    const skatRespone = game.setSkat(0, [
      cards[0],
      cards[0]
    ])
    expect(skatRespone.status).toBe(GameEventStatus.ERROR)
})

test('select game wrong modifier', () => {
    let game = new Game(0)
    game.challenge(2, null)
    game.challenge(0, null)
    game.challenge(1, 18)

    expect(game.selectGame(1, { name: 'Suit' }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(1, { name: 'Suit', suit: 'Diamonds' }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, null)
    game.challenge(0, null)
    game.challenge(1, 18)

    game.takeSkat(1)
    expect(game.selectGame(1, { name: 'Suit', suit: 'Hearts', hand: true }).status).toBe(GameEventStatus.ERROR)

    game = new Game(0)
    game.challenge(2, null)
    game.challenge(0, null)
    game.challenge(1, 18)

    expect(game.selectGame(1, { name: 'Suit', suit: 'Spades', hand: true }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, null)
    game.challenge(0, null)
    game.challenge(1, 18)

    expect(game.selectGame(1, { name: 'Suit', suit: 'Spades', schneider: true }).status).toBe(GameEventStatus.ERROR)
})

test('zero game', () => {
    let game = new Game(0)
    game.challenge(2, null)
    game.challenge(0, null)
    game.challenge(1, 18)

    expect(game.selectGame(1, { name: 'Zero' }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, null)
    game.challenge(0, 24)
    game.challenge(2, null)

    expect(game.selectGame(0, { name: 'Zero' }).status).toBe(GameEventStatus.ERROR)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, null)
    game.challenge(0, 35)
    game.challenge(2, null)

    expect(game.selectGame(0, { name: 'Zero', hand: true }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, null)
    game.challenge(0, 36)
    game.challenge(2, null)

    expect(game.selectGame(0, { name: 'Zero', hand: true }).status).toBe(GameEventStatus.ERROR)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, 23)
    game.challenge(2, 24)
    game.challenge(1, 24)
    game.challenge(2, 46)
    game.challenge(1, null)
    game.challenge(0, null)

    expect(game.selectGame(0, { name: 'Zero', hand: true }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(2, { name: 'Zero', ouvert: true }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, 23)
    game.challenge(2, 24)
    game.challenge(1, 24)
    game.challenge(2, 48)
    game.challenge(1, null)
    game.challenge(0, null)

    expect(game.selectGame(0, { name: 'Zero' }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(0, { name: 'Zero', hand: true }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(0, { name: 'Zero', ouvert: true }).status).toBe(GameEventStatus.ERROR)
    expect(game.selectGame(2, { name: 'Zero', ouvert: true, hand: true }).status).toBe(GameEventStatus.OK)

    game = new Game(0)
    game.challenge(2, 23)
    game.challenge(1, 23)
    game.challenge(2, 24)
    game.challenge(1, 24)
    game.challenge(2, 60)
    game.challenge(1, null)
    game.challenge(0, null)

    expect(game.selectGame(1, { name: 'Zero', ouvert: true, hand: true }).status).toBe(GameEventStatus.ERROR)
})
