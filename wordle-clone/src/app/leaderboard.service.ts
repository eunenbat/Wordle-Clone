import { Injectable } from '@angular/core';

export interface Score {
  name: string;
  tries: number;
//   date: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
    private storageKey = 'leaderboard'

    getScores(): Score[] {
        const scores = localStorage.getItem(this.storageKey)
        return scores ? JSON.parse(scores) : [] 
    }

    addScore(score: Score) {
        const scores = this.getScores()
        scores.push(score)
        scores.sort((a, b) => a.tries - b.tries)
        scores.slice(0, 10)
        localStorage.setItem(this.storageKey, JSON.stringify(scores))
    }

    sortScore() {
        const scores = this.getScores()
        scores.sort((a, b) => a.tries - b.tries)
        localStorage.setItem(this.storageKey, JSON.stringify(scores))
    }

    clearScore() {
        localStorage.removeItem(this.storageKey)
    }
}