package com.itms.repository;

import com.itms.entity.TrainingAssignment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainingAssignmentRepository extends JpaRepository<TrainingAssignment, Integer> {
    
    @Query("SELECT ta FROM TrainingAssignment ta WHERE ta.user.id = :userId ORDER BY ta.deadline ASC")
    Page<TrainingAssignment> findByUserId(@Param("userId") Integer userId, Pageable pageable);
    
    @Query("SELECT ta FROM TrainingAssignment ta WHERE ta.user.id = :userId AND ta.completionStatus = :status ORDER BY ta.deadline ASC")
    List<TrainingAssignment> findByUserIdAndStatus(@Param("userId") Integer userId, @Param("status") String status);
    
    @Query("SELECT COUNT(ta) FROM TrainingAssignment ta WHERE ta.user.id = :userId AND ta.completionStatus = 'PENDING'")
    long countPendingAssignments(@Param("userId") Integer userId);
}
