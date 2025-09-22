package com.dev.Hotel.service.interfac;

import com.dev.Hotel.dto.TienNghiRequest;
import com.dev.Hotel.dto.Response;

public interface ITienNghiService {

    Response getAllTienNghi();

    Response getTienNghiById(String id);

    Response addTienNghi(TienNghiRequest request);

    Response updateTienNghi(String id, TienNghiRequest request);

    Response deleteTienNghi(String id);
}
