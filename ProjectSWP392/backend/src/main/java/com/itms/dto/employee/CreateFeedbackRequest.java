package com.itms.dto.employee;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateFeedbackRequest {
    @NotNull
    private Integer enrollmentId;

    @NotNull
    private Integer sessionId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotBlank
    private String comment;

    private String suggestions;
}
