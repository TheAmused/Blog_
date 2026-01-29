import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service'; // Potrzebny AuthService!
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId: string = '';
  public comments: any[] = [];
  public newCommentText: string = '';
  public currentUserId: string | null = null;
  
  // Zmienna do śledzenia, który komentarz jest edytowany
  public editingCommentId: string | null = null;
  public editBuffer: string = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Pobieramy ID zalogowanego użytkownika (metoda zależy od Twojego AuthService)
    // Zakładam, że masz metodę getUserId() lub podobną
    const user = this.authService.getUser(); // lub this.authService.getUserId()
    this.currentUserId = user ? user.id : null; 
    
    this.loadComments();
  }

  loadComments() {
    if (this.postId) {
      this.dataService.getById(this.postId).subscribe((res: any) => {
        if (res && res.comments) {
          this.comments = res.comments.reverse();
        }
      });
    }
  }

  addComment() {
    if (this.newCommentText.trim() && this.postId && this.currentUserId) {
      this.dataService.addComment(this.postId, this.newCommentText, this.currentUserId).subscribe(() => {
        this.newCommentText = '';
        this.loadComments(); // Odświeżamy listę
      });
    }
  }

  // --- USUWANIE ---
  deleteComment(commentId: string) {
    if (confirm('Czy na pewno chcesz usunąć ten komentarz?')) {
      this.dataService.removeComment(this.postId, commentId).subscribe(() => {
        this.loadComments();
      });
    }
  }

  // --- EDYCJA ---
  startEdit(comment: any) {
    this.editingCommentId = comment._id;
    this.editBuffer = comment.text;
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editBuffer = '';
  }

  saveEdit(commentId: string) {
    if (this.editBuffer.trim()) {
      this.dataService.updateComment(this.postId, commentId, this.editBuffer).subscribe(() => {
        this.editingCommentId = null;
        this.loadComments();
      });
    }
  }
}