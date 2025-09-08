import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './about.html',
  styleUrls: ['./about.css']
})
export class AboutComponent {
  // Example founder info
  founder = {
    name: 'Prerna Gupta',
    image: '/assets/images/prerna.jpg',
    message: 'Hello! I\'m Prerna, the creator of AesthHome. AesthHome was born from a simple idea — to make beautiful and premium-quality home products accessible to every family. Our journey started with a passion for design and a belief that a well-designed home creates joy in everyday living.”'
  };

  // Optional: Team or achievements
  stats = [
    { number: '500+', label: 'Products' },
    { number: '2000+', label: 'Happy Customers' },
    { number: '1500+', label: 'Orders Delivered' }
  ];
}
