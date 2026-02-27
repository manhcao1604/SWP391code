package com.itms.repository;

import com.itms.entity.TrainingNotification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrainingNotificationRepository extends JpaRepository<TrainingNotification, Integer> {
    
    @Query("SELECT tn FROM TrainingNotification tn WHERE tn.user.id = :userId ORDER BY tn.createdAt DESC")
    Page<TrainingNotification> findByUserId(@Param("userId") Integer userId, Pageable pageable);
    
    @Query("SELECT tn FROM TrainingNotification tn WHERE tn.user.id = :userId AND tn.isRead = false ORDER BY tn.createdAt DESC")
    List<TrainingNotification> findUnreadNotifications(@Param("userId") Integer userId);
    
    @Query("SELECT COUNT(tn) FROM TrainingNotification tn WHERE tn.user.id = :userId AND tn.isRead = false")
    long countUnreadNotifications(@Param("userId") Integer userId);
}
