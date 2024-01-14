import { computed, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import {
  debounceTime,
  distinctUntilChanged,
  interval,
  pipe,
  switchMap,
  tap,
} from 'rxjs';
import { PostService } from './post.service';

export type Post = {
  title: string;
};

type PostState = {
  posts: Post[];
  isLoading: boolean;
  filter: { query: string; order: 'asc' | 'desc' };
  count: number;
};

const initalState: PostState = {
  posts: [{ title: 'post 1' }, { title: 'post 2' }],
  isLoading: false,
  filter: {
    query: '',
    order: 'asc',
  },
  count: 0,
};

export const PostStore = signalStore(
  withState(initalState),
  withComputed(({ posts, filter }) => ({
    postCount: computed(() => posts().length),
    sortedPosts: computed(() => {
      const direction = filter.order() === 'asc' ? 1 : -1;
      return posts().toSorted(
        (a, b) => direction * a.title.localeCompare(b.title)
      );
    }),
  })),
  withMethods((store, postService: PostService = inject(PostService)) => ({
    increment() {
      console.log('increment', store.count());

      patchState(store, { count: store.count() + 1 });
    },
    updateQuery(query: string): void {
      patchState(store, (state) => ({ filter: { ...state.filter, query } }));
    },
    updateOrder(order: 'asc' | 'desc'): void {
      patchState(store, (state) => ({ filter: { ...state.filter, order } }));
    },
    loadByQuery: rxMethod<string>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap((query) => {
          return postService.getByQuery(query).pipe(
            tapResponse({
              next: (posts: Post[]) => patchState(store, { posts }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit({ increment }) {
      interval(2_000)
        .pipe(takeUntilDestroyed())
        .subscribe(() => increment());
    },
    onDestroy({ count }) {
      console.log('count on destroy', count());
    },
  })
);
