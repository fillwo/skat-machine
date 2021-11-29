import Game from '../Game'
import { GameEventStatus, GameOKEvent } from '../interfaces'

test('player 2 starts challenge', () => {
    let game = new Game(0)
    expect(game.challenge(0, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)

    game = new Game(1)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(0, 18).status).toBe(GameEventStatus.OK)

    game = new Game(2)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(0, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
})

test('challenge is high enough', () => {
    let game = new Game(0)
    expect(game.challenge(2, 17).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    // now only next player may challenge
    expect(game.challenge(1, 48).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 48).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(0, 20).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(0, 22).status).toBe(GameEventStatus.OK)

    expect(game.challenge(1, 24).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 24).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, 22).status).toBe(GameEventStatus.OK)

    expect(game.challenge(0, 22).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(0, 23).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, 22).status).toBe(GameEventStatus.ERROR)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
})

test('challenge winner 0', () => {
    let game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 22).status).toBe(GameEventStatus.OK)
    let response = game.challenge(2, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(22)
    expect(response.singlePlayer).toBe(0)

    game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 22).status).toBe(GameEventStatus.OK)
    response = game.challenge(1, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(22)
    expect(response.singlePlayer).toBe(0)
})

test('challenge winner 1', () => {
    let game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 20).status).toBe(GameEventStatus.OK)
    let response = game.challenge(0, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(20)
    expect(response.singlePlayer).toBe(1)
})

test('challenge winner 2', () => {
    let game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(2, 20).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    let response = game.challenge(0, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(20)
    expect(response.singlePlayer).toBe(2)
})

test('all pass', () => {
    const game = new Game(0)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, null).status).toBe(GameEventStatus.OK)
    const response = game.challenge(1, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.END)
    expect(response.phase).toBe(4)
})

test('two pass', () => {
    let game = new Game(0)
    expect(game.challenge(2, 18).status).toBe(GameEventStatus.OK)
    expect(game.challenge(1, null).status).toBe(GameEventStatus.OK)
    let response = game.challenge(0, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(18)
    expect(response.singlePlayer).toBe(2)

    game = new Game(0)
    expect(game.challenge(2, null).status).toBe(GameEventStatus.OK)
    expect(game.challenge(0, 18).status).toBe(GameEventStatus.OK)
    response = game.challenge(1, null) as GameOKEvent
    expect(response.status).toBe(GameEventStatus.OK)
    expect(response.phase).toBe(2)
    expect(response.currentChallenge).toBe(18)
    expect(response.singlePlayer).toBe(0)
})
