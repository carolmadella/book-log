const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  { 
    id: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    status: { type: String,
      enum: ['not-started', 'reading', 'finished'],
      default: 'not-started'
    },
    genre: { type: String, required: true },
    totalPages: { type: Number, required: true },
    currentPage: Number,
    rating: Number,
    notes: String,
    startDate: Date,
    endDate: Date
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);
