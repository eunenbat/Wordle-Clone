import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private audio: HTMLAudioElement

  constructor() {
    this.audio = new Audio()
    this.audio.src = 'assets/background-music.mp3'
    this.audio.loop = true 
    this.audio.load()
    this.audio.play()
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
}