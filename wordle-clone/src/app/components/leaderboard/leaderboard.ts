import { Component, Input, Output, EventEmitter } from '@angular/core';
import { LeaderboardService, Score } from "../../leaderboard.service";
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.css'
})
export class LeaderBoard {
  @Input() show: boolean = false;
  @Input() numTries!: number;
  @Output() closeLeaderBoard: EventEmitter<boolean> = new EventEmitter<boolean>();
  displayBottomPart: boolean = true;

  scores: Score[] = [];
  scoreForm = new FormGroup({
    name: new FormControl('', Validators.required),
  });

  constructor(private lbService: LeaderboardService) {
    this.lbService.sortScore();
    this.scores = this.lbService.getScores();
  }

  open() {
    this.lbService.sortScore();
    this.scores = this.lbService.getScores();
    
    this.show = true;
  }

  close() {
    this.show = false;
    this.closeLeaderBoard.emit(true);
  }

  addScore() {
    if (this.scoreForm.invalid) return;

    const newScore: Score = {
      name: this.scoreForm.value.name!,
      tries: this.numTries
      // tries: Number(this.scoreForm.value.tries),
    };
    this.displayBottomPart = false
    this.lbService.addScore(newScore);
    this.scores = this.lbService.getScores();
    this.scoreForm.reset();
  }

  
}
