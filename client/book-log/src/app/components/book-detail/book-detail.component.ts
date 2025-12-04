import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  book!: Book | null;
  loading = true;
  bookId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id') || '';

    this.bookService.getBook(this.bookId).subscribe({
      next: (data: Book) => {
        this.book = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        // Optional: redirect if not found
      }
    });
  }

  editBook(): void {
    this.router.navigate(['/books', this.bookId, 'edit']);
  }

  deleteBook(): void {
    if (!confirm('Are you sure you want to delete this book?')) return;

    this.bookService.deleteBook(this.bookId).subscribe(() => {
      this.router.navigate(['/books']);
    });
  }

  goBack(): void {
    this.router.navigate(['/books']);
  }
}
