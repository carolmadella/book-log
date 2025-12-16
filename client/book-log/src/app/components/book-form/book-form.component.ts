import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { trigger, transition, style, animate } from '@angular/animations';


@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '200ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ])
    ])
  ]
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode = false;
  bookId: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  
  }

  ngOnInit(): void {
   
    this.createForm();

    this.bookId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.bookId;

    if (this.isEditMode && this.bookId) {
      this.loadBook(this.bookId);
    }
  }

  createForm() {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      status: ['not-started'],
      totalPages: [null, [Validators.min(1), Validators.required]],
      currentPage: [null, [Validators.min(0)]],
      rating: [null, [Validators.min(1), Validators.max(5)]],
      notes: ['']
    });
  }

  loadBook(id: string) {
    this.loading = true;
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue(book);
        this.loading = false;
      },
      error: () => {
        alert('Error to load the book');
        this.loading = false;
      }
    });
  }

  submitForm() {
    if (this.bookForm.invalid) {
      this.bookForm.markAllAsTouched();
      return;
    }

    const book: Book = this.bookForm.value;

    if (this.isEditMode && this.bookId) {
      this.bookService.updateBook(this.bookId, book).subscribe(() => {
        alert('Book Updated Succesfully!');
        this.router.navigate(['/books']);
      });
    } else {
      this.bookService.createBook(book).subscribe(() => {
        alert('Book Added Successfully!');
        this.router.navigate(['/books']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/books']);
  }
}
