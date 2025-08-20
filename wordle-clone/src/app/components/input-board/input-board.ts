import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-input-board',
  imports: [],
  templateUrl: './input-board.html',
  styleUrl: './input-board.css'
})
export class InputBoard {
  constructor(private fb: FormBuilder) {}
}
