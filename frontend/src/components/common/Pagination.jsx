import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex justify-center items-center space-x-2 mt-8'>
      <button 
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Trước
      </button>
      
      <div className="flex space-x-1">
        {pageNumbers.map((number) => (
          <button 
            key={number}
            onClick={() => paginate(number)} 
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === number 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-100'
            }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button 
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
