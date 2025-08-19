import { Injectable } from '@angular/core'
import GameSettings from './models/GameSettings'

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private storageKey = 'wordle-settings'

  private defaultSettings: GameSettings = {
    volume: 50,
    darkMode: false,
    lettersPerWord: 3
  }

  getSettings(): GameSettings {
    let saved = localStorage.getItem(this.storageKey)
    return saved ? JSON.parse(saved) : this.defaultSettings
  }

  saveSettings(settings: GameSettings) {
    localStorage.setItem(this.storageKey, JSON.stringify(settings))
  }

}