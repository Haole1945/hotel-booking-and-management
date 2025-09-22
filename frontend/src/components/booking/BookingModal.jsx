import React, { useState } from 'react';
import { X, Phone, Users, Calendar, CreditCard } from 'lucide-react';
import BookingConfirmation from './BookingConfirmation';
import ContactInfo from './ContactInfo';
import PaymentStep from './PaymentStep';

const BookingModal = ({ room, searchDates, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    room: room,
    checkIn: null,
    checkOut: null,
    guests: 1,
    nights: 0,
    roomQuantity: 1,
    customerInfo: null,
    totalAmount: 0,
    depositAmount: 0
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Deposit calculation is now handled in BookingConfirmation component

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BookingConfirmation
            room={room}
            bookingData={bookingData}
            setBookingData={setBookingData}
            searchDates={searchDates}
            onNext={() => setCurrentStep(2)}
            onClose={onClose}
          />
        );
      case 2:
        return (
          <ContactInfo
            bookingData={bookingData}
            setBookingData={setBookingData}
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 3:
        return (
          <PaymentStep
            bookingData={bookingData}
            onBack={() => setCurrentStep(2)}
            onComplete={onClose}
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'Xác nhận thông tin đặt phòng';
      case 2:
        return 'Thông tin liên lạc';
      case 3:
        return 'Thanh toán đặt cọc';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{getStepTitle()}</h2>
            <div className="flex items-center mt-2 space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2 text-sm">Xác nhận</span>
              </div>
              <div className={`w-8 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2 text-sm">Liên lạc</span>
              </div>
              <div className={`w-8 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2 text-sm">Thanh toán</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
