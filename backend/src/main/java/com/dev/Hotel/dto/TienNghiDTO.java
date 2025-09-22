package com.dev.Hotel.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TienNghiDTO {
    
    private String idTn;
    private String tenTn;
    private String icon;
    private String moTa;
}
