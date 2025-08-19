import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WordService } from '../word.service';
import { SettingsService } from '../settings.service';
import GameSettings from '../models/GameSettings';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-page',
  imports: [ReactiveFormsModule],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css'
})
export class StartPage{
  
  
  wordLength: number
  selectedWord: string = ''
  currentSettings: GameSettings
  settingsForm: FormGroup
  
  
  constructor(private wordService: WordService, private settingService: SettingsService, private router: Router) {
    this.currentSettings = this.settingService.getSettings();
    this.wordLength = this.settingService.getSettings().lettersPerWord
    this.settingsForm = new FormGroup({
      volume: new FormControl(this.currentSettings.volume),
      darkMode: new FormControl(this.currentSettings.darkMode),
      lettersPerWord: new FormControl(this.currentSettings.lettersPerWord)
    })
  }

  sendWord(word: string) {
    this.wordService.sendWord(word);
  }

  onSubmit() {
    this.settingService.saveSettings
    console.log(this.settingsForm.value);
    this.wordLength = this.settingsForm.value.lettersPerWord ?? 5;
    this.getWord()
    this.router.navigate(['game']);
  }

  getWord() {
    this.wordService.getWord(this.wordLength).subscribe(response => {
      this.selectedWord = response[0];
      console.log(response)
      this.sendWord(this.selectedWord);
    })
  }
}
