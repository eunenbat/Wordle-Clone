import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import GameSettings from '../../models/GameSettings';
import { MusicService } from '../../music.service';
import { SettingsService } from '../../settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent implements OnInit {
  @Input() currentSettings!: GameSettings;
  @Output() save = new EventEmitter<GameSettings>();
  @Output() close = new EventEmitter<void>();

  settingsForm!: FormGroup;

  ngOnInit(): void {
    this.setForm();
  }

  constructor(private musicService: MusicService, private settingService: SettingsService) { }

  private setForm() {
    this.settingsForm = new FormGroup({
      volume: new FormControl(this.currentSettings.volume),
      darkMode: new FormControl(this.currentSettings.darkMode),
      lettersPerWord: new FormControl(this.currentSettings.lettersPerWord, [
        Validators.required,
        Validators.min(3),
        Validators.max(8)
      ])
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      this.handleSave(this.settingsForm.value)
      this.save.emit(this.settingsForm.value);
    }
  }

  handleSave(newSettings: GameSettings) {
    this.settingService.saveSettings(newSettings);
    this.musicService.setVolume(newSettings.volume);
    this.currentSettings = newSettings;
    this.toggleDarkMode();

  }

  toggleDarkMode() {
    this.currentSettings.darkMode
      ? document.body.classList.add('dark-mode')
      : document.body.classList.remove('dark-mode');
  }

  sameSettings() {
    return this.currentSettings.darkMode === this.settingsForm.value.darkMode
      && this.currentSettings.volume === this.settingsForm.value.volume
      && this.currentSettings.lettersPerWord === this.settingsForm.value.lettersPerWord;
  }
}
