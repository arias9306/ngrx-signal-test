import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Post } from './post.store';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor() {}

  getByQuery(query: string): Observable<Post[]> {
    console.log(query);
    return of([
      {
        title: 'Post 1',
      },
    ]);
  }
}
