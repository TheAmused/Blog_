import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'blog-item-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentsSectionComponent],
  templateUrl: './blog-item-details.component.html',
  styleUrl: './blog-item-details.component.scss'
})
export class BlogItemDetailsComponent implements OnInit {
  public image: string = '';
  public text: string = '';
  public title: string = ''; 
  public views: number = 0;
  public id: string = '';

  public likes: string[] = [];
  public isLiked: boolean = false;

  public currentUserId: string | null = null;
  public postUserId: string = '';

  constructor(
    private service: DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUser();
    this.currentUserId = user ? user.id : null;

    this.route.paramMap.subscribe(params => {
      const paramId = params.get('id');
      if (paramId) {
        this.id = paramId;
        
        this.service.getById(this.id).subscribe((res: any) => {
          if (res) {
            this.image = res.image;
            this.text = res.text;
            this.title = res.title;
            this.views = res.views;
            this.postUserId = res.userId;

            this.likes = res.likes || [];
            if (this.currentUserId) {
              this.isLiked = this.likes.includes(this.currentUserId);
            }
          }
        });
      }
    });
  }

  toggleLike() {
    if (!this.currentUserId) {
      alert('Musisz być zalogowany, aby polubić post.');
      return;
    }
    if (this.isLiked) {
      this.likes = this.likes.filter(id => id !== this.currentUserId);
      this.isLiked = false;
    } else {
      this.likes.push(this.currentUserId);
      this.isLiked = true;
    }

    this.service.toggleLike(this.id, this.currentUserId).subscribe({
      next: (res: any) => {
      },
      error: (err) => {
        console.error('Błąd like:', err);
        this.isLiked = !this.isLiked;
        if (this.isLiked) this.likes.push(this.currentUserId!);
        else this.likes = this.likes.filter(id => id !== this.currentUserId);
      }
    });
  }

  deletePost() {
    if (confirm('Czy na pewno chcesz usunąć ten artykuł? Tego nie da się cofnąć.')) {
      this.service.deletePost(this.id).subscribe({
        next: () => {
          this.router.navigate(['/blog']);
        },
        error: (err) => {
          console.error('Błąd usuwania posta:', err);
          alert('Nie udało się usunąć posta.');
        }
      });
    }
  }
}