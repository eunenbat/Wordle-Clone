import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { WordService } from '../word.service';
import { SettingsService } from '../settings.service';
import GameSettings from '../models/GameSettings';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MusicService } from '../music.service';
import { LeaderBoard } from '../components/leaderboard/leaderboard';

@Component({
  selector: 'app-start-page',
  imports: [ReactiveFormsModule, CommonModule, LeaderBoard],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css'
})
export class StartPage implements OnInit{

  currentSettings!: GameSettings
  settingsForm!: FormGroup;
  settingsPage: boolean = false
  showLeaderBoard: boolean = false


  constructor(private wordService: WordService, private settingService: SettingsService, private router: Router, private musicService: MusicService) {
    
    this.setSettingsForm()
  }
  ngOnInit(): void {
    this.currentSettings.darkMode ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')
  }

  toggleDarkMode() {
    this.currentSettings.darkMode ? document.body.classList.add('dark-mode') : document.body.classList.remove('dark-mode')
  }
  
  onSubmit() {
    this.settingService.saveSettings(this.settingsForm.value)
    this.musicService.setVolume(this.settingService.getSettings().volume)
    // this.musicService.play()
    this.currentSettings = this.settingService.getSettings()
    this.toggleDarkMode()
    this.setSettingsForm()
  }
  
  setSettingsForm() {
    this.currentSettings = this.settingService.getSettings()
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
    this.router.navigate(['game']);
  }

  sameSettings() {
    console.log('current settings',this.currentSettings)
    console.log('form settings:', this.settingsForm.value)
    return this.currentSettings.darkMode === this.settingsForm.value.darkMode 
    && this.currentSettings.volume === this.settingsForm.value.volume 
    && this.currentSettings.lettersPerWord === this.settingsForm.value.lettersPerWord
  }

  showSettingsPage() {
    // this.musicService.play()
    this.settingsPage = true
  }

  hideSettingsPage() {
    this.settingsPage = false
  }

  openLeaderBoard() {
    this.showLeaderBoard = true;
  }
  handleCloseLeaderBoard(closed: boolean) {
    this.showLeaderBoard = !closed;
  }
}
