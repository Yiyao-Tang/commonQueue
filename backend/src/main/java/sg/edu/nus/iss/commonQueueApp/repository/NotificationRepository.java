// NotificationRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Notification;
import sg.edu.nus.iss.commonQueueApp.entity.Customer;
import sg.edu.nus.iss.commonQueueApp.entity.NotificationStatus;
import sg.edu.nus.iss.commonQueueApp.entity.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByCustomerOrderByCreatedAtDesc(Customer customer);

    List<Notification> findByStatusOrderByCreatedAtAsc(NotificationStatus status);

    List<Notification> findByNotificationTypeAndStatusOrderByCreatedAtAsc(NotificationType type, NotificationStatus status);

    @Query("SELECT n FROM Notification n WHERE n.status = 'PENDING' AND n.createdAt <= :maxAge")
    List<Notification> findPendingNotificationsOlderThan(@Param("maxAge") LocalDateTime maxAge);

    @Query("SELECT n FROM Notification n WHERE n.status = 'FAILED' AND n.retryCount < 3")
    List<Notification> findFailedNotificationsForRetry();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.customer.id = :customerId AND n.status = 'SENT' AND n.readAt IS NULL")
    Long countUnreadNotificationsByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT n FROM Notification n WHERE n.customer.id = :customerId AND n.createdAt >= :since ORDER BY n.createdAt DESC")
    List<Notification> findRecentNotificationsByCustomerId(@Param("customerId") Long customerId, @Param("since") LocalDateTime since);
}