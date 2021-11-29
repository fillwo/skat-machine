/* -------------------------------------------------------------------------- */
/*         The Main Trick Logic for playing a Suit, Grand or Zero Game        */
/* -------------------------------------------------------------------------- */

import { Card, Suit, Face } from './interfaces'

const suitGameHierarchy: Array<{face: Face, strength: number}> = [
    { face: 'Seven', strength: 0 },
    { face: 'Eight', strength: 1 },
    { face: 'Nine', strength: 2 },
    { face: 'Queen', strength: 3 },
    { face: 'King', strength: 4 },
    { face: 'Ten', strength: 5 },
    { face: 'Ace', strength: 6 }
]

const jackHierarchy: Array<{suit: Suit, strength: number}> = [
    { suit: 'Diamonds', strength: 0 },
    { suit: 'Hearts', strength: 1 },
    { suit: 'Spades', strength: 2 },
    { suit: 'Clubs', strength: 3 }
]

const zeroGameHierarchy: Array<{face: Face, strength: number}> = [
    { face: 'Seven', strength: 0 },
    { face: 'Eight', strength: 1 },
    { face: 'Nine', strength: 2 },
    { face: 'Ten', strength: 3 },
    { face: 'Jack', strength: 4 },
    { face: 'Queen', strength: 5 },
    { face: 'King', strength: 6 },
    { face: 'Ace', strength: 7 }
]

/* -------------------------------- suit game ------------------------------- */
const suitGameLogic = {
    /**
     * check if this is a valid move in a suit game
     * @param stack cards in the current trick
     * @param card card the player attempts to play
     * @param remainingCards remaining cards of the player
     * @param trumpSuit trump suit
     */
    validateMove (stack: Card[], card: Card, remainingCards: Card[], trumpSuit: Suit) {
        if (stack.length === 0) return true

        const { suit: firstCardSuit, face: firstCardFace } = stack[0]
        const isTrump = firstCardFace === 'Jack' || firstCardSuit === trumpSuit

        if (!isTrump) {
            if (card.suit === firstCardSuit && card.face !== 'Jack') return true
            // otherwise we need to check if player is allowed to play other card
            if (remainingCards.filter(c => c.suit === firstCardSuit && c.face !== 'Jack').length > 0) {
                return false
            } else {
                return true
            }
        } else {
            if (card.suit === trumpSuit || card.face === 'Jack') return true
            // otherwise we need to check if player is allowed to play other card
            if (remainingCards.filter(c => c.suit === trumpSuit || c.face === 'Jack').length > 0) {
                return false
            } else {
                return true
            }
        }
    },
    /**
     * determines the winner of a trick
     * @param stack cards in trick
     * @param trumpSuit trump suit
     */
    findWinner (stack: Card[], trumpSuit: Suit) {
        let winningCard: Card | null = null

        const containsTrump = stack.filter(c => c.suit === trumpSuit || c.face === 'Jack').length > 0
        const { suit: firstCardSuit } = stack[0]

        if (!containsTrump) {
            // highest card with suit of first card wins
            winningCard = stack.filter(c => c.suit === firstCardSuit)
                // adding strength to card object
                .map(c => {
                    return {
                        ...c,
                        strength: suitGameHierarchy.filter(d => d.face === c.face)[0].strength
                    }
                })
                // finding max strength card object
                .reduce((prev, curr) => {
                    return prev?.strength > curr.strength
                      ? {
                          suit: prev.suit,
                          face: prev.face,
                          strength: prev.strength
                        }
                      : {
                          suit: curr.suit,
                          face: curr.face,
                          strength: curr.strength
                        }
                }, { strength: -1, suit: 'Clubs', face: 'Jack' })
        } else {
            // highest trump card wins
            const containsJacks = stack.filter(c => c.face === 'Jack').length > 0
            if (!containsJacks) {
                // highest trump card wins
                winningCard = stack.filter(c => c.suit === trumpSuit)
                // adding strength to card object
                .map(c => {
                    return {
                        ...c,
                        strength: suitGameHierarchy.filter(d => d.face === c.face)[0].strength
                    }
                })
                // finding max strength card object
                .reduce((prev, curr) => {
                    return prev?.strength > curr.strength
                      ? {
                          suit: prev.suit,
                          face: prev.face,
                          strength: prev.strength
                        }
                      : {
                          suit: curr.suit,
                          face: curr.face,
                          strength: curr.strength
                        }
                }, { strength: -1, suit: 'Clubs', face: 'Jack' })
            } else {
                // highest jack wins
                winningCard = stack.filter(c => c.face === 'Jack')
                // adding strength to card object
                .map(c => {
                    return {
                        ...c,
                        strength: jackHierarchy.filter(d => d.suit === c.suit)[0].strength
                    }
                })
                // finding max strength card object
                .reduce((prev, curr) => {
                    return prev?.strength > curr.strength
                      ? {
                          suit: prev.suit,
                          face: prev.face,
                          strength: prev.strength
                        }
                      : {
                          suit: curr.suit,
                          face: curr.face,
                          strength: curr.strength
                        }
                }, { strength: -1, suit: 'Clubs', face: 'Jack' })
            }
        }
        // return index of winning card
        return stack.findIndex(c => c.face === winningCard?.face && c.suit === winningCard?.suit)
    }
}

/* ------------------------------- grand game ------------------------------- */
const grandGameLogic = {
    /**
     * check if this is a valid move in a grand game
     * @param stack cards in the current trick
     * @param card card the player attempts to play
     * @param remainingCards remaining cards of the player
     */
    validateMove (stack: Card[], card: Card, remainingCards: Card[]) {
        if (stack.length === 0) return true

        const { suit: firstCardSuit, face: firstCardFace } = stack[0]
        const isTrump = firstCardFace === 'Jack'

        if (!isTrump) {
            if (card.suit === firstCardSuit && card.face !== 'Jack') return true
            // otherwise we need to check if player is allowed to play other card
            if (remainingCards.filter(c => c.suit === firstCardSuit && c.face !== 'Jack').length > 0) {
                return false
            } else {
                return true
            }
        } else {
            if (card.face === 'Jack') return true
            // otherwise we need to check if player is allowed to play other card
            if (remainingCards.filter(c => c.face === 'Jack').length > 0) {
                return false
            } else {
                return true
            }
        }
    },
    /**
     * determines the winner of a trick
     * @param stack cards in trick
     */
    findWinner (stack: Card[]) {
        let winningCard: Card | null = null

        const containsTrump = stack.filter(c => c.face === 'Jack').length > 0
        const { suit: firstCardSuit } = stack[0]

        if (!containsTrump) {
            // highest card with suit of first card wins
            winningCard = stack.filter(c => c.suit === firstCardSuit)
                // adding strength to card object
                .map(c => {
                    return {
                        ...c,
                        strength: suitGameHierarchy.filter(d => d.face === c.face)[0].strength
                    }
                })
                // finding max strength card object
                .reduce((prev, curr) => {
                    return prev?.strength > curr.strength
                      ? {
                          suit: prev.suit,
                          face: prev.face,
                          strength: prev.strength
                        }
                      : {
                          suit: curr.suit,
                          face: curr.face,
                          strength: curr.strength
                        }
                }, { strength: -1, suit: 'Clubs', face: 'Jack' })
        } else {
            // highest jack card wins
            winningCard = stack.filter(c => c.face === 'Jack')
            // adding strength to card object
            .map(c => {
                return {
                    ...c,
                    strength: jackHierarchy.filter(d => d.suit === c.suit)[0].strength
                }
            })
            // finding max strength card object
            .reduce((prev, curr) => {
                return prev?.strength > curr.strength
                    ? {
                        suit: prev.suit,
                        face: prev.face,
                        strength: prev.strength
                    }
                    : {
                        suit: curr.suit,
                        face: curr.face,
                        strength: curr.strength
                    }
            }, { strength: -1, suit: 'Clubs', face: 'Jack' })
        }
        // return index of winning card
        return stack.findIndex(c => c.face === winningCard?.face && c.suit === winningCard?.suit)
    }
}

/* -------------------------------- zero game ------------------------------- */
const zeroGameLogic = {
    /**
     * check if this is a valid move in a grand game
     * @param stack cards in the current trick
     * @param card card the player attempts to play
     * @param remainingCards remaining cards of the player
     */
    validateMove (stack: Card[], card: Card, remainingCards: Card[]) {
        if (stack.length === 0) return true

        const { suit: firstCardSuit } = stack[0]

        if (card.suit === firstCardSuit) return true
        // otherwise we need to check if player is allowed to play other card
        if (remainingCards.filter(c => c.suit === firstCardSuit).length > 0) {
            return false
        } else {
            return true
        }
    },
    /**
     * determines the winner of a trick
     * @param stack cards in trick
     */
    findWinner (stack: Card[]) {
        let winningCard: Card | null = null

        const { suit: firstCardSuit } = stack[0]

        // highest card with suit of first card wins
        winningCard = stack.filter(c => c.suit === firstCardSuit)
            // adding strength to card object
            .map(c => {
                return {
                    ...c,
                    strength: zeroGameHierarchy.filter(d => d.face === c.face)[0].strength
                }
            })
            // finding max strength card object
            .reduce((prev, curr) => {
                return prev?.strength > curr.strength
                    ? {
                        suit: prev.suit,
                        face: prev.face,
                        strength: prev.strength
                    }
                    : {
                        suit: curr.suit,
                        face: curr.face,
                        strength: curr.strength
                    }
            }, { strength: -1, suit: 'Clubs', face: 'Jack' })
        // return index of winning card
        return stack.findIndex(c => c.face === winningCard?.face && c.suit === winningCard?.suit)
    }
}

export { suitGameLogic, grandGameLogic, zeroGameLogic }
