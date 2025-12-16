export interface Book {
  _id?: string;
  id?: number;
  title: string;
  author: string;
  status: 'not-started' | 'reading' | 'finished';
  genre: string;
  totalPages: number;
  currentPage?: number;
  percentageRead?: number;
  rating?: number;
  notes?: string;
  startDate?: string;
  endDate?: string;
}
