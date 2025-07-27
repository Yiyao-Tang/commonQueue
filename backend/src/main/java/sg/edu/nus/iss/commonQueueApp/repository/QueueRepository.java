// QueueRepository.java
package sg.edu.nus.iss.commonQueueApp.repository;

import sg.edu.nus.iss.commonQueueApp.entity.Queue;
import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.entity.QueueType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<Queue, Long> {

    List<Queue> findByBusinessAndIsActiveTrueOrderByQueueNameAsc(Business business);

    List<Queue> findByBusinessIdAndIsActiveTrue(Long businessId);

    Optional<Queue> findByIdAndIsActiveTrue(Long id);

    List<Queue> findByQueueTypeAndIsActiveTrue(QueueType queueType);

    @Query("SELECT q FROM Queue q WHERE q.business.id = :businessId AND q.isActive = true AND SIZE(q.queueEntries) > 0")
    List<Queue> findActiveQueuesWithCustomers(@Param("businessId") Long businessId);

    @Query("SELECT COUNT(qe) FROM QueueEntry qe WHERE qe.queue.id = :queueId AND qe.status IN ('WAITING', 'CALLED')")
    Long countActiveEntriesInQueue(@Param("queueId") Long queueId);

    @Query("SELECT q FROM Queue q JOIN q.queueEntries qe WHERE qe.customer.id = :customerId AND qe.status IN ('WAITING', 'CALLED')")
    List<Queue> findQueuesByCustomerId(@Param("customerId") Long customerId);
}