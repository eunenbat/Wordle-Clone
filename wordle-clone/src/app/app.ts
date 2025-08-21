import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from "./components/nav-bar/nav-bar";
import { LeaderBoard } from './components/leaderboard/leaderboard';

@Component({
  // declarations: [
  //   GamePage,
  //   LeaderBoard
  // ],
  selector: 'app-root',
  imports: [RouterOutlet, NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('wordle-clone');
}
