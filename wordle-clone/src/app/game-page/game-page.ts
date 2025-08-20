import { Component, Input, OnInit } from '@angular/core';
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
  wordLength: number = 0;
  keyboard: Record<string, boolean> = {};
  // gameBoard: string[] = [];
  gameBoard!: FormGroup;

  constructor(private wordService: WordService, private fb: FormBuilder, private settingService: SettingsService) {
    this.gameBoard = this.fb.group({
      rows: this.fb.array([])
    })
    this.wordLength = this.settingService.getSettings().lettersPerWord;
    this.wordService.word$.subscribe((word: string) => {
      console.log('Received:', word);
      this.selectedWord = word;
      if (word) {
        this.wordLength = word.length;
        this.setBoard(); // Set up the board when word is received
      }
    });

  }

  ngOnInit() {
    this.setKeyboard();
    console.log(this.gameBoard)
    console.log(this.keyboard)
  }

  setKeyboard() {
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(97 + i); // 97 is ASCII for 'a'
      this.keyboard[char] = false;
    }
  }

  get getRowsAsArray(): FormArray {
    return this.gameBoard.get('rows') as FormArray;
  }

  setBoard() {
    for (let r = 0; r < 6; r++) {
      const row: { [key: string]: FormControl } = {};
      for (let c = 0; c < this.wordLength; c++) {
        row[`r${r}-c${c}`] = this.fb.control('')
      }
      this.getRowsAsArray.push(this.fb.group(row))
    }
  }

  getRow(idx: number): FormGroup {
    return this.getRowsAsArray.at(idx) as FormGroup;
  }
}
