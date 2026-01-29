import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styles: [`
    .rating-container { font-size: 1.2rem; color: #ffc107; }
    .fa { transition: transform 0.2s; }
    .fa:hover { transform: scale(1.2); }
    .stats { font-size: 0.8rem; color: #6c757d; margin-left: 10px; }
  `]
})
export class RatingComponent implements OnInit {
  @Input() postId: string = '';
  
  public stars: number[] = [1, 2, 3, 4, 5];
  public hoverRating: number = 0;   
  public averageRating: number = 0; 
  public votesCount: number = 0;    

  constructor(private ratingService: RatingService) {}

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    if (this.postId) {
      this.averageRating = this.ratingService.getAverage(this.postId);
      const data = this.ratingService.getRating(this.postId);
      this.votesCount = data.count;
    }
  }

  onStarHover(rating: number) {
    this.hoverRating = rating;
  }

  onStarLeave() {
    this.hoverRating = 0;
  }

  onStarClick(rating: number) {
    if (this.postId) {
      this.ratingService.addRating(this.postId, rating);
      this.refreshData(); 
    }
  }
}