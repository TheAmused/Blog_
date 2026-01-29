import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


interface RatingData {
  sum: number;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly STORAGE_KEY = 'blog_ratings';
  private ratings: { [key: string]: RatingData } = {};

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadRatings();
  }

  getRating(postId: string): RatingData {
    return this.ratings[postId] || { sum: 0, count: 0 };
  }


  addRating(postId: string, value: number): void {
    if (!this.ratings[postId]) {
      this.ratings[postId] = { sum: 0, count: 0 };
    }
    
    this.ratings[postId].sum += value;
    this.ratings[postId].count += 1;
    
    this.saveRatings();
  }

  getAverage(postId: string): number {
    const data = this.getRating(postId);
    if (data.count === 0) return 0;
    return data.sum / data.count;
  }

  private loadRatings() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        this.ratings = JSON.parse(data);
      }
    }
  }

  private saveRatings() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.ratings));
    }
  }
}