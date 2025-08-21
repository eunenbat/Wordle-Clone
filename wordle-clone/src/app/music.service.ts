import { Injectable } from '@angular/core'
import { SettingsService } from './settings.service'

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio: HTMLAudioElement
  private currVolume: number

  constructor(private settingsService: SettingsService) {
    this.audio = new Audio()
    this.audio.src = 'assets/background-music.mp3'
    this.audio.loop = true 
    this.setVolume(settingsService.getSettings().volume)
    this.currVolume = settingsService.getSettings().volume // added this variable
    console.log(settingsService.getSettings().volume)
    this.audio.load()
  }

  setVolume(volumeSetting: number) {
    console.log(volumeSetting)
    this.audio.volume = (volumeSetting / 100)
  }

  pause() {
    this.audio.pause()
  }

  play() {
    this.audio.play().catch(err => console.warn(err))
  }

  playSound(audioFile: string) {
    const soundEff = new Audio
    soundEff.src = audioFile
    soundEff.volume = this.currVolume / 100  // for some reason, you have to set volume per sound?
    soundEff.play()
  }
}