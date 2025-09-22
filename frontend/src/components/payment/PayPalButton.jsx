import React, { useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { convertVNDToUSD, convertUSDToVND } from '../../config/paypal';
import toast from 'react-hot-toast';

const PayPalButton = ({ 
  amount, // Số tiền VND
  currency = "VND",
  onSuccess,
  onError,
  onCancel,
  disabled = false,
  bookingData
}) => {
  const [{ isPending }] = usePayPalScriptReducer();
  const [processing, setProcessing] = useState(false);

  // Convert VND to USD for PayPal
  const usdAmount = convertVNDToUSD(amount);

  const createOrder = (data, actions) => {
    console.log('Creating PayPal order with amount:', usdAmount, 'USD');
    console.log('Booking data:', bookingData);

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: usdAmount.toString(),
          },
          description: `Đặt cọc phòng khách sạn - ${bookingData?.room?.tenKieuPhong || 'Phòng'}`,
          custom_id: `booking_${Date.now()}`, // Unique booking ID
        },
      ],
      application_context: {
        shipping_preference: "NO_SHIPPING", // Không cần địa chỉ giao hàng
      },
    }).catch(error => {
      console.error('Error creating PayPal order:', error);
      throw error;
    });
  };

  const onApprove = async (data, actions) => {
    setProcessing(true);
    try {
      const details = await actions.order.capture();
      
      console.log('PayPal Payment Success:', details);
      
      // Prepare payment data for backend
      const paymentData = {
        paypalOrderId: details.id,
        paypalPayerId: details.payer.payer_id,
        paymentStatus: details.status,
        amountPaid: {
          usd: parseFloat(details.purchase_units[0].amount.value),
          vnd: amount
        },
        paymentMethod: 'PAYPAL',
        transactionId: details.purchase_units[0].payments.captures[0].id,
        paymentTime: new Date().toISOString(),
        payerInfo: {
          email: details.payer.email_address,
          name: details.payer.name?.given_name + ' ' + details.payer.name?.surname,
          payerId: details.payer.payer_id
        }
      };

      toast.success('Thanh toán PayPal thành công!');
      
      if (onSuccess) {
        onSuccess(paymentData);
      }
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast.error('Có lỗi xảy ra khi xử lý thanh toán');
      
      if (onError) {
        onError(error);
      }
    } finally {
      setProcessing(false);
    }
  };

  const onErrorHandler = (err) => {
    console.error('PayPal Error:', err);
    toast.error('Có lỗi xảy ra với PayPal');
    
    if (onError) {
      onError(err);
    }
  };

  const onCancelHandler = (data) => {
    console.log('PayPal Payment Cancelled:', data);
    toast('Thanh toán đã bị hủy', {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: 'white',
      },
    });

    if (onCancel) {
      onCancel(data);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Đang tải PayPal...</span>
      </div>
    );
  }

  return (
    <div className="paypal-button-container">
      {/* Amount Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-blue-600 mb-1">Số tiền thanh toán</p>
          <p className="text-lg font-bold text-blue-800">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(amount)}
          </p>
          <p className="text-sm text-blue-500">
            ≈ ${usdAmount} USD
          </p>
        </div>
      </div>

      {/* PayPal Buttons */}
      <PayPalButtons
        style={{
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "paypal",
          height: 45
        }}
        disabled={disabled || processing}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onErrorHandler}
        onCancel={onCancelHandler}
      />

      {processing && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600">Đang xử lý thanh toán...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayPalButton;
