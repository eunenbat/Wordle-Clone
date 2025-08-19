import { HttpClient } from '@angular/common/http'
import { AppRoutingModule } from './app.routes'
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private wordSource = new Subject<string>();
  word$ = this.wordSource.asObservable();

  sendWord(word: string) {
    this.wordSource.next(word);
  }
  
  constructor(private http: HttpClient) {}

  getWord(wordLength: number) {
    return this.http.get<string[]>(`https://random-word-api.herokuapp.com/word?length=${wordLength}`)
  }
}