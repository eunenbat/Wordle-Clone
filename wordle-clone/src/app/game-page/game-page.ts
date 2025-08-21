import { Component, HostListener, Input, OnInit, Type } from '@angular/core';
import { WordService } from '../word.service';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, FormBuilder, FormArray, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../settings.service';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { LeaderBoard } from '../components/leaderboard/leaderboard';
import { MusicService } from '../music.service';
import { SettingsComponent } from '../components/settings/settings';
import GameSettings from '../models/GameSettings';
import { KeyState } from '../models/key-states';


@Component({
  selector: 'app-game-page',
  imports: [CommonModule, ReactiveFormsModule, LeaderBoard, SettingsComponent],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css'
})
export class GamePage implements OnInit {
  reload() {
    window.location.reload()
  }

  currentSettings!: GameSettings;
  selectedWord: string = '';
  wordLength: number = 5;
  row: number = 0
  column: number = 0
  validEnglishWords: Set<string> = new Set();
  isPopupVisible: boolean = false
  isGuessWrong: boolean = false
  showLeaderBoard: boolean = false
  gameEndedWin: boolean = false
  gameFailed: boolean = false
  showFailPopup: boolean = false
  settingsPage = false

  keyboard!: Record<string, KeyState>
  qwertyRows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

  gameBoard: { letter: string, class: string }[][] = []

  constructor(private wordService: WordService, private settingService: SettingsService, private http: HttpClient, private router: Router, private musicService: MusicService) {
    this.currentSettings = this.settingService.getSettings();
    this.wordLength = this.settingService.getSettings().lettersPerWord;
    this.setBoard(); // Set up the board when word is received
    this.createKeyboard();
  };



  ngOnInit() {
    const wordList: string = 'assets/25k-popular.json'
    // const wordList: string = 'assets/english-words.json'
    // sets up the dictionary Set and also makes sure that the word retrieved from the dictionary is valid
    this.http.get<{ [word: string]: number }>(wordList).subscribe(data => {
      this.validEnglishWords = new Set(Object.keys(data).map(w => w.toUpperCase()));
      this.getValidWord()
    });
    // this.musicService.play()
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
    if (this.gameEndedWin || this.gameFailed) return;
    // if (this.column >= this.wordLength) {
    //   this.column = this.wordLength - 1;
    // }
    if (/^[a-z]$/.test(event.key) && this.column < this.wordLength) {
      console.log(this.column)
      if (this.gameBoard[this.row][this.column].letter === '') {
        this.gameBoard[this.row][this.column].letter = event.key
        this.column++;
      }
      console.log(this.column)
    }
    if (event.key === 'Enter') {
      const guess = this.gameBoard[this.row]
        .map(tile => tile.letter)
        .join('');
  
      if (guess.length === (this.wordLength) && this.validateWord(guess)) {
        this.addColorToTiles()
        this.updateKeyboard(guess)
        this.checkWin()
        this.column = 0
        this.row++
      }
      else {
        this.showPopup()
      }
    }
    if (event.key === 'Backspace') {
      if (this.column <= 0) {
        this.column = 0
        return
      }
      if (this.gameBoard[this.row][this.column] === undefined || this.gameBoard[this.row][this.column].letter === '') {
        this.column--;
        this.gameBoard[this.row][this.column].letter = ''
        
      } else if (this.column >= this.wordLength-1) {
        this.gameBoard[this.row][this.column].letter = ''
      } else {
        this.gameBoard[this.row][this.column].letter = ''
        this.column--;
      }
    }
  }

  checkWin() {
    const guess = this.gameBoard[this.row]
      .map(tile => tile.letter)
      .join('');   
    if (guess.length !== (this.wordLength)){ 
      return
    }

    if (guess === this.selectedWord) {
      this.openLeaderBoard()
      this.gameEndedWin = true
      this.column = 100
      this.row = 100
      return
    } else if (this.row >= 5) {
      this.handleGameFailed()
      return
    }

  }

  addColorToTiles() {
    let splitWord = this.selectedWord.split('')
    this.gameBoard[this.row].forEach((tile, index) => {
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
    return this.validEnglishWords.has(guess.trim().toUpperCase());
  }

  showPopup() {
    this.isPopupVisible = true;
    this.isGuessWrong = true;
    setTimeout(() => {
      this.isPopupVisible = false;
      this.isGuessWrong = false;
    }, 1500);
  }

  openLeaderBoard() {
    this.showLeaderBoard = true;
  }
  handleCloseLeaderBoard(closed: boolean) {
    this.showLeaderBoard = !closed;
  }

  showSettingsPage() {
    this.settingsPage = true;
  }

  handleCloseSettings() {
    this.settingsPage = false;
    this.reload()
  }

  handleGameFailed() {
    this.gameFailed = true;
    this.showFailPopup = true;
  }

  closeFailPopup() {
    this.showFailPopup = false;
  }

  createKeyboard() {
    this.keyboard = {}
    for (let i = 65; i <= 90; i++) {
      this.keyboard[String.fromCharCode(i)] = 'unused';
    }
  }

  changeKeyState(state: KeyState, key: string) {
    this.keyboard[key.toUpperCase()] = state
  }

  updateKeyboard(guess : string) {
    guess.split('').forEach((char, i) => {
      if (char.toUpperCase() == this.selectedWord[i].toUpperCase()) {
        this.changeKeyState('correct', char.toUpperCase())
      } else if (this.selectedWord.toUpperCase().includes(char.toUpperCase())) {
        this.changeKeyState('present', char.toUpperCase())
      } else {
        this.changeKeyState('absent', char.toUpperCase())
      }
    })
  }

}
