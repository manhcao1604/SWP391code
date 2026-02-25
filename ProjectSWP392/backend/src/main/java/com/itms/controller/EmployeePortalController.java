package com.itms.controller;

import com.itms.dto.common.ResponseDto;
import com.itms.dto.employee.CreateFeedbackRequest;
import com.itms.dto.employee.EmployeePortalDto;
import com.itms.security.CustomUserDetails;
import com.itms.service.EmployeePortalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYEE')")
public class EmployeePortalController {
    private final EmployeePortalService employeePortalService;

    @GetMapping("/portal")
    public ResponseEntity<ResponseDto<EmployeePortalDto>> getPortal(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        EmployeePortalDto data = employeePortalService.getPortalData(userDetails.getId());
        return ResponseEntity.ok(ResponseDto.success(data, "Employee portal data"));
    }

    @PostMapping("/feedback")
    public ResponseEntity<ResponseDto<Void>> createFeedback(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateFeedbackRequest request
    ) {
        employeePortalService.createFeedback(userDetails.getId(), request);
        return ResponseEntity.ok(ResponseDto.success(null, "Gửi phản hồi thành công"));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<ResponseDto<Void>> markNotificationRead(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Integer id
    ) {
        employeePortalService.markNotificationRead(userDetails.getId(), id);
        return ResponseEntity.ok(ResponseDto.success(null, "Đã đánh dấu đã đọc"));
    }
}
