package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.Response;

public interface IDashboardService {
    
    // Staff Dashboard APIs
    Response getStaffStats();
    Response getStaffActivities();
    Response getStaffTasks();
    
    // Admin Dashboard APIs (for future use)
    Response getAdminStats();
    Response getAdminTopPerformers();
    Response getAdminRevenueData();
    
    // Customer Dashboard APIs (for future use)
    Response getCustomerStats(String cccd);

    // Staff specific APIs for customer management
    Response getRecentCustomers();
    Response getTodayCheckIns();
    Response getTodayCheckOuts();
    Response getPendingReservations();
    Response getCurrentGuests(); // Khách đang lưu trú (đã check-in, chưa check-out)
}
