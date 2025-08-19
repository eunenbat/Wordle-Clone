import { Component, Input } from '@angular/core';
import { WordService } from '../word.service';

@Component({
  selector: 'app-game-page',
  imports: [],
  templateUrl: './game-page.html',
  styleUrl: './game-page.css'
})
export class GamePage {
  selectedWord: string = '';
  alphabet: Record<string, boolean> = {};
  gameBoard: {} = {};
  
  constructor(private wordService: WordService) {
    this.wordService.word$.subscribe((word: string) => {
      console.log('Received:', word);
      this.selectedWord = word;
      // console.log(this.selectedWord)
    });
  }

  setKeyboard() {
    for (let i = 0; i < 26; i++) {
      const char = String.fromCharCode(97 + i); // 97 is ASCII for 'a'
      this.alphabet[char] = false;
    }
  }

  setBoard(size: number) {
    
  }
  
}
