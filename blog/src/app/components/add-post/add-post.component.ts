import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service'; 
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'add-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.scss' 
})
export class AddPostComponent {
  
  postForm = new FormGroup({
    title: new FormControl('', Validators.required),
    text: new FormControl('', [Validators.required, Validators.minLength(10)]),
    image: new FormControl('')
  });

  constructor(
    private dataService: DataService, 
    private router: Router,
    public authService: AuthService 
  ) {}

  createPost() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      alert('Błąd: Nie jesteś zalogowany!');
      return;
    }

    const newPost = {
      title: this.postForm.value.title,
      text: this.postForm.value.text,
      image: this.postForm.value.image || 'https://via.placeholder.com/300',
      userId: currentUser.userId 
    };
    
    this.dataService.addPost(newPost).subscribe({
      next: (res) => {
        alert('Post dodany!');
        this.router.navigate(['/blog']); 
      },
      error: (err) => {
        console.error('Błąd dodawania:', err);
        alert('Nie udało się dodać posta.');
      }
    });
  }

  get f() { return this.postForm.controls; }
  get formValues() { return this.postForm.value; }
}