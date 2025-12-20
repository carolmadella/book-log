import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
  animations: [
    trigger('listStagger', [
      transition(':enter', [
        query(
          'tbody tr',
          [
            style({ opacity: 0, transform: 'translateY(5px)' }),
            stagger(60, [
              animate(
                '200ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              )
            ])
          ],
          { optional: true }
        )
      ])
    ])
  ]
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  originalBooks: Book[] = [];

  filters = {
    search: '',
    status: ''
  };

  constructor(
    private bookService: BookService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(response => {
      this.originalBooks = response.books.map(this.addPercentage);
      this.books = this.originalBooks;
    });
  }
  addPercentage(book: Book): Book {
    if (book.totalPages && book.currentPage !== undefined) {
      book.percentageRead = Math.min(
        Math.round((book.currentPage / book.totalPages) * 100),
        100
      );
    } else {
      book.percentageRead = 0;
    }
    return book;
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

  getStatusLabel(book: Book): string {
    let label: string = 'Not started';

    if (book.status === 'reading') label = 'Reading'

    if (book.status === 'finished') label = 'Finished'

    return label;
  }

  applyFilters() {
    const search = this.filters.search.toLowerCase();
    const status = this.filters.status;

    this.books = this.originalBooks.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search);

      const matchesStatus =
        !status || book.status === status;

      return matchesSearch && matchesStatus;
    });
  }

  resetFilters() {
    this.filters = { search: '', status: '' };
    this.books = [...this.originalBooks];
  }

}
