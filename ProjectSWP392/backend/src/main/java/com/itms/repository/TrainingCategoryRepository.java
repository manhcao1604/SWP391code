package com.itms.repository;

import com.itms.entity.TrainingCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TrainingCategoryRepository extends JpaRepository<TrainingCategory, Integer> {
    
    Optional<TrainingCategory> findByCode(String code);
    
    @Query("SELECT c FROM TrainingCategory c WHERE c.isActive = true ORDER BY c.displayOrder ASC")
    List<TrainingCategory> findActiveCategories();
}
