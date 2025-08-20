import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordService } from '../word.service';
import { SettingsService } from '../settings.service';
import GameSettings from '../models/GameSettings';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MusicService } from '../music.service';

@Component({
  selector: 'app-start-page',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css'
})
export class StartPage {

  wordLength: number
  selectedWord: string = ''
  currentSettings: GameSettings
  settingsForm: FormGroup


  constructor(private wordService: WordService, private settingService: SettingsService, private router: Router, private musicService: MusicService) {
    this.currentSettings = this.settingService.getSettings();
    this.wordLength = this.settingService.getSettings().lettersPerWord
    this.settingsForm = new FormGroup({
      volume: new FormControl(this.currentSettings.volume),
      darkMode: new FormControl(this.currentSettings.darkMode),
      lettersPerWord: new FormControl(this.currentSettings.lettersPerWord, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(8)
      ])
    })
  }

  sendWord(word: string) {
    this.wordService.sendWord(word);
  }

  onSubmit() {
    this.settingService.saveSettings(this.settingsForm.value)
    this.wordLength = this.settingsForm.value.lettersPerWord
    this.musicService.setVolume(this.settingService.getSettings().volume)
    this.musicService.play()
  }

  startGame() {
    this.musicService.play()
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

  sameSettings() {
    return this.currentSettings.darkMode === this.settingsForm.value.darkMode 
    && this.currentSettings.volume === this.settingsForm.value.volume 
    && this.currentSettings.lettersPerWord === this.settingsForm.value.lettersPerWord
  }
}
