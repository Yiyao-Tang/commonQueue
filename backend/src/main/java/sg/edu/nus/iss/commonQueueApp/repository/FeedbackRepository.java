// FeedbackRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Feedback;
import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.entity.Customer;
import sg.edu.nus.iss.commonQueueApp.entity.FeedbackType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByBusinessOrderByCreatedAtDesc(Business business);

    List<Feedback> findByBusinessIdOrderByCreatedAtDesc(Long businessId);

    List<Feedback> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Feedback> findByFeedbackTypeOrderByCreatedAtDesc(FeedbackType feedbackType);

    @Query("SELECT f FROM Feedback f WHERE f.business.id = :businessId AND f.createdAt >= :startDate AND f.createdAt <= :endDate")
    List<Feedback> findByBusinessIdAndDateRange(@Param("businessId") Long businessId,
                                                @Param("startDate") LocalDateTime startDate,
                                                @Param("endDate") LocalDateTime endDate);

    @Query("SELECT AVG(f.accuracyRating) FROM Feedback f WHERE f.business.id = :businessId")
    Double getAverageAccuracyRatingByBusinessId(@Param("businessId") Long businessId);

    @Query("SELECT AVG(f.serviceRating) FROM Feedback f WHERE f.business.id = :businessId AND f.serviceRating IS NOT NULL")
    Double getAverageServiceRatingByBusinessId(@Param("businessId") Long businessId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.business.id = :businessId AND f.accuracyRating >= 4")
    Long countPositiveFeedbackByBusinessId(@Param("businessId") Long businessId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.business.id = :businessId")
    Long countTotalFeedbackByBusinessId(@Param("businessId") Long businessId);
}