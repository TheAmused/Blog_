import { Component, Input, OnInit } from '@angular/core';
import { BlogItemImageComponent } from "../blog-item-image/blog-item-image.component";
import { BlogItemTextComponent } from "../blog-item-text/blog-item-text.component";
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service'; 
import { RatingComponent } from '../../shared/rating/rating.component';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'blog-item', 
  standalone: true,
  imports: [
    BlogItemImageComponent, 
    BlogItemTextComponent, 
    CommonModule,
    RatingComponent
  ],
  templateUrl: './blog-item.component.html',
  styleUrl: './blog-item.component.scss'
})
export class BlogItemComponent implements OnInit {
  @Input() image?: string;
  @Input() text?: string;
  @Input() id?: string;
  @Input() likes: string[] = []; 
  
  public isFavorite: boolean = false; 
  public isLiked: boolean = false;

  constructor(
    private favoritesService: FavoritesService,
    private dataService: DataService,
    private authService: AuthService
  ) {} 

  ngOnInit() {
    if (this.id) {
      this.isFavorite = this.favoritesService.isFavorite(this.id);
    }
    this.checkIfLiked();
  }

  checkIfLiked() {
    const currentUser = this.authService.currentUser;
    if (currentUser && this.likes) {
      this.isLiked = this.likes.includes(currentUser.userId);
    }
  }

  toggleFavorite() {
    if (this.id) {
      this.favoritesService.toggleFavorite(this.id);
      this.isFavorite = !this.isFavorite; 
    }
  }

  toggleLike() {
    if (!this.id) return;

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      alert('Zaloguj się, aby polubić post!');
      return;
    }

    this.dataService.toggleLike(this.id, currentUser.userId).subscribe({
      next: (res: any) => {
        this.likes = res.likes;
        this.checkIfLiked();
      },
      error: (err) => {
        console.error('Błąd like:', err);
      }
    });
  }
}