import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getAll(page: number = 1, limit: number = 4, title: string = ''): Observable<any> {
    return this.http.get(`${this.url}/api/posts?page=${page}&limit=${limit}&title=${title}`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`http://localhost:3000/api/post/${id}`);
  }

  public addPost(post: any): Observable<any> {
    return this.http.post(this.url + '/api/post', post);
  }

  public addComment(postId: string, text: string, userId: string): Observable<any> {
        return this.http.post(`${this.url}/api/post/comment/${postId}`, { text, userId });
    }

    public removeComment(postId: string, commentId: string): Observable<any> {
        return this.http.delete(`${this.url}/api/post/comment/${postId}/${commentId}`);
    }

    public updateComment(postId: string, commentId: string, text: string): Observable<any> {
        return this.http.put(`${this.url}/api/post/comment/${postId}/${commentId}`, { text });
    }

    public deletePost(postId: string): Observable<any> {
        return this.http.delete(`${this.url}/api/post/${postId}`);
    }
  
  public toggleLike(postId: string, userId: string): Observable<any> {
    return this.http.post(`${this.url}/api/post/like/${postId}`, { userId });
  }
}