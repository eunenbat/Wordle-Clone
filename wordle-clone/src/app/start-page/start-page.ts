import { CommonModule } from '@angular/common';
import { SettingsComponent } from '../components/settings/settings';
import { LeaderBoard } from '../components/leaderboard/leaderboard';
import GameSettings from '../models/GameSettings';
import { SettingsService } from '../settings.service';
import { Router } from '@angular/router';
import { MusicService } from '../music.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-start-page',
  imports: [CommonModule, LeaderBoard, SettingsComponent],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css'
})
export class StartPage {
  currentSettings!: GameSettings;
  settingsPage = false;
  showLeaderBoard = false;

  constructor(
    private settingService: SettingsService,
    private router: Router,
    private musicService: MusicService
  ) {
    this.currentSettings = this.settingService.getSettings();
  }

  startGame() {
    this.router.navigate(['game']);
  }

  showSettingsPage() {
    this.settingsPage = true;
  }

  handleCloseSettings() {
    this.settingsPage = false;
  }

  openLeaderBoard() {
    this.showLeaderBoard = true;
  }

  handleCloseLeaderBoard(closed: boolean) {
    this.showLeaderBoard = !closed;
  }

  importNewSettings(newSetting: GameSettings) {
    this.currentSettings = newSetting
  }
}
