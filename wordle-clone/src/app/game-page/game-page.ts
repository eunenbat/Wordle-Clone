import { Component, HostListener, Input, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-game-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css'
})
export class GamePage implements OnInit {
  selectedWord: string = '';
  wordLength: number = 5;
  row: number = 0
  column: number = 0

  // gameBoard: string[] = [];
  gameBoard: {letter: string, class: string}[][] = []

  constructor(private wordService: WordService, private fb: FormBuilder, private settingService: SettingsService) {
    this.wordLength = this.settingService.getSettings().lettersPerWord;
    this.wordService.word$.subscribe((word: string) => {
      console.log('Received:', word);
      this.selectedWord = word;
      if (word) {
        this.wordLength = word.length;
        this.setBoard(); // Set up the board when word is received
        console.log(this.gameBoard)
      }
    });

  }

  ngOnInit() {
    
  }

  

  setBoard() {
    this.gameBoard = new Array(6).fill(null).map(_ => 
      new Array(this.wordLength).fill(null).map(() => ({ letter: '', class: '' }))
  )
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (/^[a-z]$/.test(event.key) && this.column < this.wordLength) {
      this.gameBoard[this.row][this.column].letter = event.key
      this.column++
    }
    if (event.key === 'Enter') {
      if (this.column === this.wordLength) {
        this.checkWin()
        this.column = 0
        this.row++
      }
    }
  }

  checkWin() {
    if (this.column !== this.wordLength) return

    if (this.gameBoard[this.row].join('') === this.selectedWord) {
      // what to do if they won (redirect to winning screen with leaderboard, need to pass the number of tries)
    } else {
      this.addColorToTiles()
    }
  }

  addColorToTiles() {
    let splitWord = this.selectedWord.split('')
    this.gameBoard[this.row].forEach( (tile, index) => {
      if (splitWord[index] == tile.letter) {
        tile.class = 'correct'
      } else if (splitWord.includes(tile.letter)) {
        tile.class = 'present'
      } else {
        tile.class = 'incorrect'
      }
    })
  }
}


