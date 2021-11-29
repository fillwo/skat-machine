import { grandGameLogic } from '../GameLogic'
import { Card } from '../interfaces'

test('first move is always valid', () => {
    expect(grandGameLogic.validateMove([], { suit: 'Clubs', face: 'Jack' }, []))
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

    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining))
        .toBe(false)
    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining))
        .toBe(false)
    expect(grandGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining))
        .toBe(true)

    stack = [
        { suit: 'Clubs', face: 'Nine' },
        { suit: 'Hearts', face: 'Jack' }
    ]

    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining))
        .toBe(false)
    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining))
        .toBe(false)
    expect(grandGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining))
        .toBe(true)

    // play trump on trump
    stack = [
        { suit: 'Clubs', face: 'Jack' },
        { suit: 'Hearts', face: 'Nine' }
    ]

    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Ace' }, remaining))
        .toBe(false)
    expect(grandGameLogic.validateMove(stack, { suit: 'Spades', face: 'Jack' }, remaining))
        .toBe(true)
    expect(grandGameLogic.validateMove(stack, { suit: 'Clubs', face: 'Eight' }, remaining))
        .toBe(false)
})


test('trick winner', () => {
    let stack: Card[] = [
        { suit: 'Clubs', face: 'Seven' },
        { suit: 'Clubs', face: 'Ace' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(grandGameLogic.findWinner(stack)).toBe(1)

    stack = [
        { suit: 'Hearts', face: 'Queen' },
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Diamonds', face: 'Seven' }
    ]
    expect(grandGameLogic.findWinner(stack)).toBe(1)

    stack = [
        { suit: 'Spades', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' },
        { suit: 'Diamonds', face: 'Jack' }
    ]
    expect(grandGameLogic.findWinner(stack)).toBe(0)

    stack = [
        { suit: 'Spades', face: 'Seven' },
        { suit: 'Diamonds', face: 'Jack' },
        { suit: 'Hearts', face: 'Jack' }
    ]
    expect(grandGameLogic.findWinner(stack)).toBe(2)
})