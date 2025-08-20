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
  currentSettings!: GameSettings
  settingsForm!: FormGroup;


  constructor(private wordService: WordService, private settingService: SettingsService, private router: Router, private musicService: MusicService) {
    this.currentSettings = this.settingService.getSettings()
    this.setSettingsForm()
    this.wordLength = this.settingService.getSettings().lettersPerWord
  }
  
  sendWord(word: string) {
    this.wordService.sendWord(word);
  }
  
  onSubmit() {
    this.settingService.saveSettings(this.settingsForm.value)
    this.wordLength = this.settingsForm.value.lettersPerWord
    this.musicService.setVolume(this.settingService.getSettings().volume)
    // this.musicService.play()
    this.currentSettings = this.settingService.getSettings()
    this.setSettingsForm
  }
  
  setSettingsForm() {
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

  startGame() {
    // this.musicService.play()
    this.router.navigate(['game']);
  }

  sameSettings() {
    console.log('current settings',this.currentSettings)
    console.log('form settings:', this.settingsForm.value)
    return this.currentSettings.darkMode === this.settingsForm.value.darkMode 
    && this.currentSettings.volume === this.settingsForm.value.volume 
    && this.currentSettings.lettersPerWord === this.settingsForm.value.lettersPerWord
  }
}
