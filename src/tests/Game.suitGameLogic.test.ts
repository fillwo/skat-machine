import { suitGameLogic } from '../GameLogic'
import { Card } from '../interfaces'

test('first move is always valid', () => {
    expect(suitGameLogic.validateMove([], { suit: 'Clubs', face: 'Jack' }, [], 'Spades'))
        .toBe(true)
})

test('play correct suit', () => {
    let remaining: Card[] = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Clubs', face: 'Ace' },
        { suit: 'Diamonds', face: 'Seven' }
    ]

    let stack: Card[] = [
        { suit: 'Clubs', face: 'Nine' }
    ]

    expect(suitGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining, 'Spades'))
        .toBe(false)
    expect(suitGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining, 'Spades'))
        .toBe(false)
    expect(suitGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining, 'Spades'))
        .toBe(true)


    remaining = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Diamonds', face: 'Seven' }
    ]

    expect(suitGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining, 'Spades'))
        .toBe(true)


    remaining = [
            { suit: 'Clubs', face: 'Seven' }
        ]

    expect(suitGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Jack' }, remaining, 'Spades'))
        .toBe(false)


    // need to play trump on trump

    remaining = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Diamonds', face: 'Seven' }
    ]

    stack = [
        { suit: 'Clubs', face: 'Nine' }
    ]

    expect(suitGameLogic.validateMove(stack, { suit: 'Diamonds', face: 'Seven' }, remaining, 'Clubs'))
        .toBe(false)

    expect(suitGameLogic.validateMove(stack, { suit: 'Diamonds', face: 'Jack' }, remaining, 'Clubs'))
        .toBe(true)

    expect(suitGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Ace' }, remaining, 'Clubs'))
        .toBe(true)

})

test('trick winner', () => {
    let stack: Card[] = [
        { suit: 'Clubs', face: 'Seven' },
        { suit: 'Clubs', face: 'Ace' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(suitGameLogic.findWinner(stack, 'Hearts')).toBe(1)
    expect(suitGameLogic.findWinner(stack, 'Diamonds')).toBe(2)
    expect(suitGameLogic.findWinner(stack, 'Clubs')).toBe(1)

    stack = [
        { suit: 'Hearts', face: 'Queen' },
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(suitGameLogic.findWinner(stack, 'Hearts')).toBe(1)
    expect(suitGameLogic.findWinner(stack, 'Diamonds')).toBe(1)
    expect(suitGameLogic.findWinner(stack, 'Spades')).toBe(1)

    stack = [
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' },
        { suit: 'Diamonds', face: 'Jack' }
    ]
    expect(suitGameLogic.findWinner(stack, 'Hearts')).toBe(0)

    stack = [
        { suit: 'Spades', face: 'Seven' },
        { suit: 'Diamonds', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' }
    ]
    expect(suitGameLogic.findWinner(stack, 'Hearts')).toBe(2)
    expect(suitGameLogic.findWinner(stack, 'Diamonds')).toBe(2)
    expect(suitGameLogic.findWinner(stack, 'Clubs')).toBe(2)
    expect(suitGameLogic.findWinner(stack, 'Spades')).toBe(2)
})