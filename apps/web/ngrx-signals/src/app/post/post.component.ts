import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { PostStore } from './post.store';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
  providers: [PostStore],
})
export class PostComponent implements OnInit {
  readonly store = inject(PostStore);

  ngOnInit(): void {
    const query = this.store.filter.query;
    this.store.loadByQuery(query);
  }
}
