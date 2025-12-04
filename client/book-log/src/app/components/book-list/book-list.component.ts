import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private bookService: BookService,
    private router: Router, 
) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(response => {
      this.books = response.books;
    });
  }

  newBook() {
    this.router.navigate(['books', 'new']);
  }

  viewBook(id?: string) {
    if (!id) return;
    this.router.navigate(['/books', id]);
  }

  deleteBook(id?: string) {
    if (!id) return;
    if (!confirm('Delete this book?')) return;

    this.bookService.deleteBook(id).subscribe(() => {
      this.loadBooks();
    });
  }
}
