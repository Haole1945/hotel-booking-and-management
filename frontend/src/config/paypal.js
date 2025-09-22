// PayPal Configuration
export const PAYPAL_CONFIG = {
  clientId: "AWd71JYJ5rhOGMtC5FaBIss6Pv_pldqO_twujPjS7GGlGESeN1eEoOR3zqxxsZdTzOETmskFLhdcPeyg",
  currency: "USD", // PayPal sandbox chỉ hỗ trợ USD
  intent: "capture",
  environment: "sandbox", // Đổi thành "production" khi deploy thật
  
  // Sandbox accounts for testing
  businessAccount: "sb-rhoaa33973611@business.example.com",
  personalAccount: "sb-rfs7j33973612@personal.example.com",
  
  // PayPal options
  options: {
    clientId: "AWd71JYJ5rhOGMtC5FaBIss6Pv_pldqO_twujPjS7GGlGESeN1eEoOR3zqxxsZdTzOETmskFLhdcPeyg",
    currency: "USD",
    intent: "capture",
    // "disable-funding": "credit,card", // Tạm thời bỏ để test dễ hơn
    // "enable-funding": "venmo"
  }
};

// Convert VND to USD (tỷ giá tạm thời cho demo)
export const convertVNDToUSD = (vndAmount) => {
  const exchangeRate = 24000; // 1 USD = 24,000 VND (tỷ giá tạm thời)
  return Math.round((vndAmount / exchangeRate) * 100) / 100; // Làm tròn 2 chữ số thập phân
};

// Convert USD back to VND for display
export const convertUSDToVND = (usdAmount) => {
  const exchangeRate = 24000;
  return Math.round(usdAmount * exchangeRate);
};
