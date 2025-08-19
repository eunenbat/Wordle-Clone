import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { StartPage } from './start-page/start-page';
import { ResultsPage } from './results-page/results-page';
import { GamePage } from './game-page/game-page';
import { WordService } from './word.service';
import { App } from './app';

export const routes: Routes = [
    { path: "", component: StartPage, title: "Start"},
    { path: "game", component: GamePage, title: "Game"},
    { path: "results", component: ResultsPage, title: "Results"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [WordService],
//   bootstrap: [App]
})
export class AppRoutingModule { }