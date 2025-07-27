
// QueueEntryRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.QueueEntry;
import sg.edu.nus.iss.commonQueueApp.entity.QueueEntryStatus;
import sg.edu.nus.iss.commonQueueApp.entity.Queue;
import sg.edu.nus.iss.commonQueueApp.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {

    List<QueueEntry> findByQueueAndStatusInOrderByQueueNumberAsc(Queue queue, List<QueueEntryStatus> statuses);

    List<QueueEntry> findByCustomerAndStatusIn(Customer customer, List<QueueEntryStatus> statuses);

    Optional<QueueEntry> findByQueueAndCustomerAndStatusIn(Queue queue, Customer customer, List<QueueEntryStatus> statuses);

    @Query("SELECT qe FROM QueueEntry qe WHERE qe.queue.id = :queueId AND qe.status IN ('WAITING', 'CALLED') ORDER BY qe.queueNumber ASC")
    List<QueueEntry> findActiveEntriesByQueueId(@Param("queueId") Long queueId);

    @Query("SELECT qe FROM QueueEntry qe WHERE qe.customer.id = :customerId AND qe.status IN ('WAITING', 'CALLED')")
    List<QueueEntry> findActiveEntriesByCustomerId(@Param("customerId") Long customerId);

    @Query("SELECT qe FROM QueueEntry qe WHERE qe.status = 'WAITING' AND qe.notificationSent = false AND qe.estimatedWaitTimeMinutes <= 15")
    List<QueueEntry> findEntriesReadyForNotification();

    @Query("SELECT qe FROM QueueEntry qe WHERE qe.queue.business.id = :businessId AND qe.joinedAt >= :startDate AND qe.joinedAt <= :endDate")
    List<QueueEntry> findEntriesByBusinessIdAndDateRange(@Param("businessId") Long businessId,
                                                         @Param("startDate") LocalDateTime startDate,
                                                         @Param("endDate") LocalDateTime endDate);

    @Query("SELECT COUNT(qe) FROM QueueEntry qe WHERE qe.queue.id = :queueId AND qe.status = 'WAITING'")
    Long countWaitingEntriesInQueue(@Param("queueId") Long queueId);

    @Query("SELECT qe FROM QueueEntry qe WHERE qe.queue.id = :queueId AND qe.queueNumber = :queueNumber")
    Optional<QueueEntry> findByQueueIdAndQueueNumber(@Param("queueId") Long queueId, @Param("queueNumber") Integer queueNumber);

    @Query("SELECT MAX(qe.queueNumber) FROM QueueEntry qe WHERE qe.queue.id = :queueId")
    Optional<Integer> findMaxQueueNumberByQueueId(@Param("queueId") Long queueId);
}