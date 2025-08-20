import { Component, HostListener, Input, OnInit } from '@angular/core';
import { WordService } from '../word.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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
  validEnglishWords: Set<string> = new Set();

  // gameBoard: string[] = [];
  gameBoard: {letter: string, class: string}[][] = []

  constructor(private wordService: WordService, private settingService: SettingsService, private http: HttpClient, private router: Router) {
    this.wordLength = this.settingService.getSettings().lettersPerWord;
    this.setBoard(); // Set up the board when word is received    
  };

  

  ngOnInit() {
    // sets up the dictionary Set and also makes sure that the word retrieved from the dictionary is valid
    this.http.get<{ [word: string]: number }>('assets/english-words.json').subscribe(data => {
      this.validEnglishWords =  new Set(Object.keys(data).map(w => w.toUpperCase()));
      this.getValidWord()
    });
  }

  getValidWord() {
    this.wordService.getWord(this.wordLength).subscribe(response => {
      const word = response[0];
      if (this.validateWord(word)) {
        this.selectedWord = word;
        console.log("Selected valid word:", this.selectedWord);
      } else {
        // Try again recursively
        this.getValidWord();
      }
    });
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
      // console.log(this.gameBoard[this.row])
      const guess = this.gameBoard[this.row]
        .map(tile => tile.letter)
        .join('');
      if (this.column === this.wordLength && this.validateWord(guess)) {
        this.addColorToTiles()
        this.checkWin()
        this.column = 0
        this.row++
      }
    }
    if (event.key ==='Backspace') {
      if (this.column === 0) {
      } else {
        this.column--
        this.gameBoard[this.row][this.column].letter = '' 
      }
    }
  }

  checkWin() {
    // let currGuess = this.gameBoard[this.row].join('')
    const guess = this.gameBoard[this.row]
        .map(tile => tile.letter)
        .join('');
    if (this.column !== this.wordLength) return

    if (guess === this.selectedWord) {
      // what to do if they won (redirect to winning screen with leaderboard, need to pass the number of tries)
      this.router.navigate(['results']);
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

  validateWord(guess: string): boolean {
    // console.log("valid word?: ", this.validEnglishWords.has(guess.trim().toUpperCase()))
    return this.validEnglishWords.has(guess.trim().toUpperCase());
  }
}


