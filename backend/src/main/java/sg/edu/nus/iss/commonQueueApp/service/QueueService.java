package sg.edu.nus.iss.commonQueueApp.service;

import sg.edu.nus.iss.commonQueueApp.entity.*;
import sg.edu.nus.iss.commonQueueApp.repository.*;
import sg.edu.nus.iss.commonQueueApp.dto.QueueTimingRequest;
import sg.edu.nus.iss.commonQueueApp.dto.QueueStatusResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service for managing queue operations
 */
@Service
@Transactional
public class QueueService {

    @Autowired
    private QueueRepository queueRepository;

    @Autowired
    private QueueEntryRepository queueEntryRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private NotificationService notificationService;

    /**
     * Create a new queue for business
     */
    public Queue createQueue(Long businessId, QueueTimingRequest request) {
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        Queue queue = new Queue();
        queue.setQueueName(request.getQueueName());
        queue.setDescription(request.getDescription());
        queue.setBusiness(business);
        queue.setQueueType(request.getQueueType());
        queue.setAvgServiceTimeMinutes(request.getAvgServiceTimeMinutes());
        queue.setMaxCapacity(request.getMaxCapacity());
        queue.setColorCode(request.getColorCode());

        return queueRepository.save(queue);
    }

    /**
     * Update queue timing information
     */
    public Queue updateQueueTiming(Long queueId, QueueTimingRequest request) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        queue.setQueueName(request.getQueueName());
        queue.setDescription(request.getDescription());
        queue.setQueueType(request.getQueueType());
        queue.setAvgServiceTimeMinutes(request.getAvgServiceTimeMinutes());
        queue.setMaxCapacity(request.getMaxCapacity());

        // Update estimated wait times for all waiting entries
        updateEstimatedWaitTimes(queue);

        return queueRepository.save(queue);
    }

    /**
     * Delete/deactivate a queue
     */
    public void deleteQueue(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        // Cancel all active queue entries
        List<QueueEntry> activeEntries = queueEntryRepository.findActiveEntriesByQueueId(queueId);
        for (QueueEntry entry : activeEntries) {
            entry.markAsCancelled();
            queueEntryRepository.save(entry);

            // Send cancellation notification
            notificationService.sendQueueCancellationNotification(entry);
        }

        queue.setIsActive(false);
        queueRepository.save(queue);
    }

    /**
     * Get queue status with current statistics
     */
    public QueueStatusResponse getQueueStatus(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        List<QueueEntry> activeEntries = queueEntryRepository.findActiveEntriesByQueueId(queueId);

        QueueStatusResponse response = new QueueStatusResponse();
        response.setQueueId(queueId);
        response.setQueueName(queue.getQueueName());
        response.setCurrentNumber(queue.getCurrentNumber());
        response.setNextNumber(queue.getNextNumber());
        response.setTotalWaiting(activeEntries.size());
        response.setEstimatedWaitTime(queue.getEstimatedWaitTimeMinutes());
        response.setIsActive(queue.getIsActive());
        response.setMaxCapacity(queue.getMaxCapacity());
        response.setAvgServiceTime(queue.getAvgServiceTimeMinutes());
        response.setServedToday(queue.getServedTodayCount());

        return response;
    }

    /**
     * Join a customer to queue
     */
    public QueueEntry joinQueue(Long queueId, Long customerId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Check if queue is active
        if (!queue.getIsActive()) {
            throw new RuntimeException("Queue is not active");
        }

        // Check if queue is at capacity
        if (queue.isAtCapacity()) {
            throw new RuntimeException("Queue is at maximum capacity");
        }

        // Check if customer is already in this queue
        Optional<QueueEntry> existingEntry = queueEntryRepository.findByQueueAndCustomerAndStatusIn(
                queue, customer, List.of(QueueEntryStatus.WAITING, QueueEntryStatus.CALLED));

        if (existingEntry.isPresent()) {
            throw new RuntimeException("Customer is already in this queue");
        }

        // Create new queue entry
        Integer queueNumber = queue.generateNextNumber();
        QueueEntry entry = new QueueEntry(queue, customer, queueNumber);
        entry.setEstimatedWaitTimeMinutes(queue.getEstimatedWaitTimeMinutes());

        queueRepository.save(queue); // Save updated next number
        QueueEntry savedEntry = queueEntryRepository.save(entry);

        // Send confirmation notification
        notificationService.sendQueueJoinedNotification(savedEntry);

        return savedEntry;
    }

    /**
     * Call next customer in queue
     */
    public QueueEntry callNextCustomer(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        // Find next waiting customer
        List<QueueEntry> waitingEntries = queueEntryRepository.findByQueueAndStatusInOrderByQueueNumberAsc(
                queue, List.of(QueueEntryStatus.WAITING));

        if (waitingEntries.isEmpty()) {
            throw new RuntimeException("No customers waiting in queue");
        }

        QueueEntry nextEntry = waitingEntries.get(0);
        nextEntry.markAsCalled();

        // Update queue current number
        queue.setCurrentNumber(nextEntry.getQueueNumber());
        queueRepository.save(queue);

        QueueEntry savedEntry = queueEntryRepository.save(nextEntry);

        // Send notification to called customer
        notificationService.sendTurnReadyNotification(savedEntry);

        // Update estimated wait times for remaining customers
        updateEstimatedWaitTimes(queue);

        return savedEntry;
    }

    /**
     * Mark customer as served
     */
    public QueueEntry markAsServed(Long entryId) {
        QueueEntry entry = queueEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        entry.markAsServed();
        QueueEntry savedEntry = queueEntryRepository.save(entry);

        // Update estimated wait times for remaining customers
        updateEstimatedWaitTimes(entry.getQueue());

        // Send feedback request notification
        notificationService.sendFeedbackRequestNotification(savedEntry);

        return savedEntry;
    }

    /**
     * Cancel queue entry
     */
    public QueueEntry cancelQueueEntry(Long entryId) {
        QueueEntry entry = queueEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        if (!entry.isActive()) {
            throw new RuntimeException("Queue entry is not active");
        }

        entry.markAsCancelled();
        QueueEntry savedEntry = queueEntryRepository.save(entry);

        // Update estimated wait times for remaining customers
        updateEstimatedWaitTimes(entry.getQueue());

        return savedEntry;
    }

    /**
     * Mark customer as no-show
     */
    public QueueEntry markAsNoShow(Long entryId) {
        QueueEntry entry = queueEntryRepository.findById(entryId)
                .orElseThrow(() -> new RuntimeException("Queue entry not found"));

        entry.markAsNoShow();
        QueueEntry savedEntry = queueEntryRepository.save(entry);

        // Update estimated wait times for remaining customers
        updateEstimatedWaitTimes(entry.getQueue());

        return savedEntry;
    }

    /**
     * Get customer's position in queue
     */
    public QueueEntry getCustomerQueuePosition(Long customerId, Long queueId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        return queueEntryRepository.findByQueueAndCustomerAndStatusIn(
                        queue, customer, List.of(QueueEntryStatus.WAITING, QueueEntryStatus.CALLED))
                .orElseThrow(() -> new RuntimeException("Customer not found in queue"));
    }

    /**
     * Get all active queues for a business
     */
    public List<Queue> getActiveQueuesByBusinessId(Long businessId) {
        return queueRepository.findByBusinessIdAndIsActiveTrue(businessId);
    }

    /**
     * Get queue entries for a specific queue
     */
    public List<QueueEntry> getQueueEntries(Long queueId) {
        return queueEntryRepository.findActiveEntriesByQueueId(queueId);
    }

    /**
     * Reset queue (usually done daily)
     */
    public void resetQueue(Long queueId) {
        Queue queue = queueRepository.findById(queueId)
                .orElseThrow(() -> new RuntimeException("Queue not found"));

        queue.resetQueue();
        queueRepository.save(queue);
    }

    /**
     * Update estimated wait times for all waiting customers in queue
     */
    private void updateEstimatedWaitTimes(Queue queue) {
        List<QueueEntry> waitingEntries = queueEntryRepository.findByQueueAndStatusInOrderByQueueNumberAsc(
                queue, List.of(QueueEntryStatus.WAITING));

        int position = 1;
        for (QueueEntry entry : waitingEntries) {
            int estimatedWaitTime = position * queue.getAvgServiceTimeMinutes();
            entry.setEstimatedWaitTimeMinutes(estimatedWaitTime);
            position++;
        }

        queueEntryRepository.saveAll(waitingEntries);
    }

    /**
     * Get queue statistics for business dashboard
     */
    public QueueStatistics getQueueStatistics(Long businessId, LocalDateTime startDate, LocalDateTime endDate) {
        List<QueueEntry> entries = queueEntryRepository.findEntriesByBusinessIdAndDateRange(businessId, startDate, endDate);

        QueueStatistics stats = new QueueStatistics();
        stats.setTotalCustomers(entries.size());
        stats.setServedCustomers(entries.stream().mapToLong(e -> e.getStatus() == QueueEntryStatus.SERVED ? 1 : 0).sum());
        stats.setCancelledCustomers(entries.stream().mapToLong(e -> e.getStatus() == QueueEntryStatus.CANCELLED ? 1 : 0).sum());
        stats.setNoShowCustomers(entries.stream().mapToLong(e -> e.getStatus() == QueueEntryStatus.NO_SHOW ? 1 : 0).sum());

        // Calculate average wait time for served customers
        double avgWaitTime = entries.stream()
                .filter(e -> e.getStatus() == QueueEntryStatus.SERVED && e.getActualWaitTimeMinutes() != null)
                .mapToLong(QueueEntry::getActualWaitTimeMinutes)
                .average()
                .orElse(0.0);
        stats.setAverageWaitTimeMinutes(avgWaitTime);

        return stats;
    }

    // Inner class for statistics
    public static class QueueStatistics {
        private long totalCustomers;
        private long servedCustomers;
        private long cancelledCustomers;
        private long noShowCustomers;
        private double averageWaitTimeMinutes;

        // Getters and setters
        public long getTotalCustomers() { return totalCustomers; }
        public void setTotalCustomers(long totalCustomers) { this.totalCustomers = totalCustomers; }

        public long getServedCustomers() { return servedCustomers; }
        public void setServedCustomers(long servedCustomers) { this.servedCustomers = servedCustomers; }

        public long getCancelledCustomers() { return cancelledCustomers; }
        public void setCancelledCustomers(long cancelledCustomers) { this.cancelledCustomers = cancelledCustomers; }

        public long getNoShowCustomers() { return noShowCustomers; }
        public void setNoShowCustomers(long noShowCustomers) { this.noShowCustomers = noShowCustomers; }

        public double getAverageWaitTimeMinutes() { return averageWaitTimeMinutes; }
        public void setAverageWaitTimeMinutes(double averageWaitTimeMinutes) { this.averageWaitTimeMinutes = averageWaitTimeMinutes; }
    }
}