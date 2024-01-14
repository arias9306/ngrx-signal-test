import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostComponent } from './post/post.component';

@Component({
  standalone: true,
  imports: [RouterModule, PostComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ngrx-signals';
  hide: boolean = false;
  hidePost() {
    this.hide = !this.hide;
  }
}
