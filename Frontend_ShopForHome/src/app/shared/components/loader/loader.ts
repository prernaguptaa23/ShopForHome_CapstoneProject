import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrls: ['./loader.css'],
  imports:[ FormsModule, CommonModule]
})
export class LoaderComponent {
  @Input() isLoading: boolean = false;
}
