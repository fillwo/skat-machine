
import { Card, Suit, Face } from './interfaces'

const cardPoints: Record<Face, number> = {
    'Seven': 0,
    'Eight': 0,
    'Nine': 0,
    'Jack': 2,
    'Queen': 3,
    'King': 4,
    'Ten': 10,
    'Ace': 11
}

export default class CardDeck {

    cards: Card[] = []
    suits: Suit[] = ['Clubs', 'Spades', 'Hearts', 'Diamonds']
    faces: Face[] = ['Seven', 'Eight', 'Nine', 'Ten', 'Jack', 'Queen', 'King', 'Ace']

    constructor () {
        this.initFreshDeck()
    }

    static countPoints (cards: Card[]) {
        return cards.reduce((prev, curr) => {
            return prev + cardPoints[curr.face]
        }, 0)
    }

    /** initializes a fresh deck in new deck order */
    initFreshDeck () {
        for (let s = 0; s < this.suits.length; s++) {
            for (let f = 0; f < this.faces.length; f++) {
                switch (this.faces[f]) {
                    case 'Seven':
                    case 'Eight':
                    case 'Nine':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                    case 'Ten':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                    case 'Jack':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                    case 'Queen':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                    case 'King':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                    case 'Ace':
                        this.cards.push({ suit: this.suits[s], face: this.faces[f] })
                        break
                }
            }
        }
    }
    /**
     * shuffles deck using Fisher-Yates algorithm
     */
    shuffleDeck () {
        for (let i = this.cards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let x = { ...this.cards[i] }
            this.cards[i] = { ...this.cards[j] }
            this.cards[j] = x
        }
    }
    /**
     * cuts the deck at certain position
     * @param position - cut position (0 - 31)
     */
    cutDeck (position: number) {
        if (position < 0 || position > this.cards.length - 1) return
        const topCut: Card[] = []
        const bottomCut: Card[] = []
        for (let i = 0; i < this.cards.length; i++) {
            if (i <= position) {
                topCut.push({ ...this.cards[i] })
            } else {
                bottomCut.push({ ...this.cards[i] })
            }
        }
        this.cards = bottomCut.concat(topCut)
    }
    /** distributes the deck to three players (plus skat) in a classic skat manner */
    distributeDeck () {
        const p1: Card[] = []
        const p2: Card[] = []
        const p3: Card[] = []
        const skat: Card[] = []
        // first round
        for (let i = 0; i < 3; i++) {
            p1.push({ ...this.cards[i] })
        }
        for (let i = 3; i < 6; i++) {
            p2.push({ ...this.cards[i] })
        }
        for (let i = 6; i < 9; i++) {
            p3.push({ ...this.cards[i] })
        }
        skat.push({ ...this.cards[9] })
        // second round
        for (let i = 10; i < 14; i++) {
            p1.push({ ...this.cards[i] })
        }
        for (let i = 14; i < 18; i++) {
            p2.push({ ...this.cards[i] })
        }
        for (let i = 18; i < 22; i++) {
            p3.push({ ...this.cards[i] })
        }
        skat.push({ ...this.cards[22] })
        // third round
        for (let i = 23; i < 26; i++) {
            p1.push({ ...this.cards[i] })
        }
        for (let i = 26; i < 29; i++) {
            p2.push({ ...this.cards[i] })
        }
        for (let i = 29; i < 32; i++) {
            p3.push({ ...this.cards[i] })
        }
        return { p1, p2, p3, skat }
    }
}
