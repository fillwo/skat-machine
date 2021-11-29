import Game from '../Game'
import CardDeck from '../CardDeck'
import { GameEventStatus, GameEndEvent, GameInfoEvent } from '../interfaces'
import { debug } from 'console'

// this took me hours... 
// because of this: https://github.com/kulshekhar/ts-jest/issues/120
// jest.mock('../CardDeck', () => {
//   const mConstructor = jest.fn().mockImplementation(() => {
//     return {
//       distributeDeck: mockDistributeDeck,
//       shuffleDeck: mockShuffleDeck,
//     }
//   }) as any
//   mConstructor.countPoints = jest.fn().mockImplementation((cards: Card[]) => {
//     console.log('debug from inside mock', mockCardPoints)
//     return cards.reduce((prev, curr) => {
//       return prev + mockCardPoints[curr.face]
//     }, 0)
//   })
//   return {
//     default: mConstructor
//   }
// })

jest.spyOn(CardDeck.prototype, 'distributeDeck').mockImplementation(() => {
  return {
    p1: [
      { suit: 'Spades', face: 'Jack' },
      { suit: 'Diamonds', face: 'Jack' },
      { suit: 'Spades', face: 'Ace' },
      { suit: 'Spades', face: 'Ten' },
      { suit: 'Spades', face: 'Eight' },
      { suit: 'Clubs', face: 'Ace' },
      { suit: 'Clubs', face: 'King' },
      { suit: 'Hearts', face: 'Queen' },
      { suit: 'Hearts', face: 'Nine' },
      { suit: 'Hearts', face: 'Seven' }
    ],
    p2: [
      { suit: 'Clubs', face: 'Ten' },
      { suit: 'Clubs', face: 'Nine' },
      { suit: 'Clubs', face: 'Seven' },
      { suit: 'Hearts', face: 'Ace' },
      { suit: 'Hearts', face: 'King' },
      { suit: 'Diamonds', face: 'Ace' },
      { suit: 'Diamonds', face: 'King' },
      { suit: 'Diamonds', face: 'Queen' },
      { suit: 'Diamonds', face: 'Eight' },
      { suit: 'Diamonds', face: 'Nine' },
    ],
    p3: [
      { suit: 'Clubs', face: 'Jack' },
      { suit: 'Hearts', face: 'Jack' },
      { suit: 'Clubs', face: 'Queen' },
      { suit: 'Clubs', face: 'Eight' },
      { suit: 'Spades', face: 'Queen' },
      { suit: 'Spades', face: 'Nine' },
      { suit: 'Spades', face: 'Seven' },
      { suit: 'Hearts', face: 'Ten' },
      { suit: 'Diamonds', face: 'Seven' },
      { suit: 'Diamonds', face: 'Ten' },
    ],
    skat: [
      { suit: 'Hearts', face: 'Eight' },
      { suit: 'Spades', face: 'King' }
    ]
  }
})

const spyShuffle = jest.spyOn(CardDeck.prototype, 'shuffleDeck')

test('main gameplay', () => {
    const game = new Game(0)

    expect(spyShuffle).toBeCalledTimes(1)

    const cardsP0 = game.getCards(0)
    const cardsP1 = game.getCards(1)
    const cardsP2 = game.getCards(2)

    expect(cardsP0).toHaveLength(10)
    expect(cardsP1).toHaveLength(10)
    expect(cardsP2).toHaveLength(10)

    game.challenge(2, null)
    game.challenge(0, 18)
    game.challenge(1, null)

    game.takeSkat(0)
    const skatRespone = game.setSkat(0, [
      { suit: 'Clubs', face: 'King' },
      { suit: 'Spades', face: 'King' }
    ])
    expect(skatRespone.status).toBe(GameEventStatus.OK)

    // select the game
    game.selectGame(0, { name: 'Suit', suit: 'Hearts' })

    /* -------------------------------- round one ------------------------------- */
    // only player 1 may begin
    expect(game.playCard(0, { suit: 'Spades', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(2, { suit: 'Clubs', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)

    // player 1 must play card he owns
    expect(game.playCard(1, { suit: 'Spades', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(1, { suit: 'Spades', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)
    
    // play seven of clubs
    expect(game.playCard(1, { suit: 'Clubs', face: 'Seven' }).status).toBe(GameEventStatus.OK)

    // player 2 has to play clubs
    expect(game.playCard(2, { suit: 'Spades', face: 'Nine' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(2, { suit: 'Clubs', face: 'Eight' }).status).toBe(GameEventStatus.OK)

    // player 0 has to play ace of clubs (king is in skat)
    expect(game.playCard(0, { suit: 'Diamonds', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(0, { suit: 'Clubs', face: 'King' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(0, { suit: 'Clubs', face: 'Ace' }).status).toBe(GameEventStatus.OK)

    /* -------------------------------- round two ------------------------------- */
    // now only player 0 may start
    expect(game.playCard(1, { suit: 'Clubs', face: 'Ten' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(2, { suit: 'Clubs', face: 'Jack' }).status).toBe(GameEventStatus.ERROR)
    // player 0 cannot play a card which has been played earlier by him
    expect(game.playCard(0, { suit: 'Clubs', face: 'Ace' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(0, { suit: 'Hearts', face: 'Seven' }).status).toBe(GameEventStatus.OK)
    // player 1 & 2 must play the trump suit
    expect(game.playCard(1, { suit: 'Diamonds', face: 'Nine' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(2, { suit: 'Diamonds', face: 'Seven' }).status).toBe(GameEventStatus.ERROR)
    // they may play hearts
    expect(game.playCard(1, { suit: 'Hearts', face: 'Ace' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(2, { suit: 'Hearts', face: 'Ten' }).status).toBe(GameEventStatus.OK)
  
    /* ------------------------------- round three ------------------------------ */
    expect(game.playCard(1, { suit: 'Clubs', face: 'Ten' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(2, { suit: 'Clubs', face: 'Queen' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(0, { suit: 'Hearts', face: 'Queen' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round four ------------------------------ */
    expect(game.playCard(0, { suit: 'Hearts', face: 'Eight' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Diamonds', face: 'Ace' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(1, { suit: 'Hearts', face: 'King' }).status).toBe(GameEventStatus.OK)
    // test peaking
    expect(game.peakLastTrick(1).status).toBe(GameEventStatus.ERROR)
    const lastTrick = game.peakLastTrick(2) as GameInfoEvent
    expect(lastTrick.lastTrick).toHaveLength(3)
    expect(lastTrick.lastTrick?.[0].suit).toBe('Clubs')
    expect(lastTrick.lastTrick?.[0].face).toBe('Ten')
    
    expect(game.playCard(2, { suit: 'Diamonds', face: 'Ten' }).status).toBe(GameEventStatus.ERROR)
    expect(game.playCard(2, { suit: 'Hearts', face: 'Jack' }).status).toBe(GameEventStatus.OK)
    
    /* ------------------------------- round five ------------------------------- */
    expect(game.playCard(2, { suit: 'Spades', face: 'Seven' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(0, { suit: 'Spades', face: 'Ace' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Diamonds', face: 'Nine' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round six ------------------------------- */
    expect(game.playCard(0, { suit: 'Spades', face: 'Jack' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Diamonds', face: 'Ace' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(2, { suit: 'Clubs', face: 'Jack' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round seven ------------------------------- */
    expect(game.playCard(2, { suit: 'Diamonds', face: 'Ten' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(0, { suit: 'Hearts', face: 'Nine' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Diamonds', face: 'Eight' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round eight ------------------------------- */
    expect(game.playCard(0, { suit: 'Spades', face: 'Ten' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Clubs', face: 'Nine' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(2, { suit: 'Spades', face: 'Nine' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round nine ------------------------------- */
    expect(game.playCard(0, { suit: 'Spades', face: 'Eight' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(1, { suit: 'Diamonds', face: 'King' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(2, { suit: 'Spades', face: 'Queen' }).status).toBe(GameEventStatus.OK)

    /* ------------------------------- round ten ------------------------------- */
    expect(game.playCard(2, { suit: 'Diamonds', face: 'Seven' }).status).toBe(GameEventStatus.OK)
    expect(game.playCard(0, { suit: 'Diamonds', face: 'Jack' }).status).toBe(GameEventStatus.OK)

    const endResponse = game.playCard(1, { suit: 'Diamonds', face: 'Queen' }) as GameEndEvent
    expect(endResponse.status).toBe(GameEventStatus.END)
    expect(endResponse.singlePlayer).toBe(0)
    expect(endResponse.pointsSinglePlayer).toBe(71)
    expect(endResponse.pointsOthers).toBe(49)
    expect(endResponse.phase).toBe(4)
    expect(endResponse.skatUsed).toBe(true)
    expect(endResponse.currentChallenge).toBe(18)
    expect(endResponse.game).not.toBeNull()
    expect(endResponse.game?.name).toBe('Suit')
    expect(endResponse.game?.suit).toBe('Hearts')
    expect(endResponse.gameResult?.gameValue).toBe(20)
    expect(endResponse.gameResult?.singlePlayerWon).toBe(true)
    expect(endResponse.gameResult?.overbidden).toBe(false)
    expect(endResponse.gameResult).toHaveProperty('gameValueText')

    /* -------------------------- summary cards played -------------------------- */
    /* 
    skat: { suit: 'Clubs', face: 'King' }, { suit: 'Spades', face: 'King' }
    cards played:
    1: { suit: 'Clubs', face: 'Seven' }
    2: { suit: 'Clubs', face: 'Eight' }
    0: { suit: 'Clubs', face: 'Ace' }
    --> 0 wins
    
    0: { suit: 'Hearts', face: 'Seven' }
    1: { suit: 'Hearts', face: 'Ace' }
    2: { suit: 'Hearts', face: 'Ten' }
    --> 1 wins

    1: { suit: 'Clubs', face: 'Ten' }
    2: { suit: 'Clubs', face: 'Queen' }
    0: { suit: 'Hearts', face: 'Queen' }
    --> 0 wins

    0: { suit: 'Hearts', face: 'Eight' }
    1: { suit: 'Hearts', face: 'King' }
    2: { suit: 'Hearts', face: 'Jack' }
    --> 2 wins

    2: { suit: 'Spades', face: 'Seven' }
    0: { suit: 'Spades', face: 'Ace' }
    1: { suit: 'Diamonds', face: 'Nine' }
    --> 0 wins

    0: { suit: 'Spades', face: 'Jack' }
    1: { suit: 'Diamonds', face: 'Ace' }
    2: { suit: 'Clubs', face: 'Jack' }
    --> 2 wins

    2: { suit: 'Diamonds', face: 'Ten' }
    0: { suit: 'Hearts', face: 'Nine' }
    1: { suit: 'Diamonds', face: 'Eight' }
    --> 0 wins

    0: { suit: 'Spades', face: 'Ten' }
    1: { suit: 'Clubs', face: 'Nine' }
    2: { suit: 'Spades', face: 'Nine' }
    --> 0 wins

    0: { suit: 'Spades', face: 'Eight' }
    1: { suit: 'Diamonds', face: 'King' }
    2: { suit: 'Spades', face: 'Queen' }
    --> 2 wins

    2: { suit: 'Diamonds', face: 'Seven' }
    0: { suit: 'Diamonds', face: 'Jack' }
    1: { suit: 'Diamonds', face: 'Queen' }
    --> 0 wins
    */

})
