import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private comments: Map<string, string[]> = new Map();

  getComments(postId: string): string[] {
    if (!this.comments.has(postId)) {
      this.comments.set(postId, []);
    }
    return this.comments.get(postId) || [];
  }

  addComment(postId: string, text: string) {
    const currentComments = this.getComments(postId);
    currentComments.push(text);
  }
}