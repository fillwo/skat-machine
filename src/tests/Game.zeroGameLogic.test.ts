import { zeroGameLogic } from '../GameLogic'
import { Card } from '../interfaces'

test('first move is always valid', () => {
    expect(zeroGameLogic.validateMove([], { suit: 'Clubs', face: 'Jack' }, []))
        .toBe(true)
})

test('play correct suit', () => {
    let remaining: Card[] = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Clubs', face: 'Ace' },
        { suit: 'Diamonds', face: 'Seven' }
    ]

    let stack: Card[] = [
        { suit: 'Clubs', face: 'Nine' },
        { suit: 'Hearts', face: 'Nine' }
    ]

    expect(zeroGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining))
        .toBe(false)
    expect(zeroGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining))
        .toBe(false)
    expect(zeroGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining))
        .toBe(true)

    // there is no trump on trump
    stack = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Hearts', face: 'Nine' }
    ]

    expect(zeroGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining))
        .toBe(false)
    expect(zeroGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining))
        .toBe(false)
    expect(zeroGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining))
        .toBe(true)
})


test('trick winner', () => {
    let stack: Card[] = [
        { suit: 'Clubs', face: 'Seven' },
        { suit: 'Clubs', face: 'Ace' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(zeroGameLogic.findWinner(stack)).toBe(1)

    stack = [
        { suit: 'Hearts', face: 'Queen' },
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(zeroGameLogic.findWinner(stack)).toBe(0)

    stack = [
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' },
        { suit: 'Diamonds', face: 'Jack' }
    ]
    expect(zeroGameLogic.findWinner(stack)).toBe(0)

    stack = [
        { suit: 'Spades', face: 'Seven' },
        { suit: 'Diamonds', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' }
    ]
    expect(zeroGameLogic.findWinner(stack)).toBe(0)

    // Ten & Jack are before Queen
    stack = [
        { suit: 'Diamonds', face: 'Ten' },
        { suit: 'Diamonds', face: 'Queen' },
        { suit: 'Diamonds', face: 'Jack' }
    ]
    expect(zeroGameLogic.findWinner(stack)).toBe(1)
})
