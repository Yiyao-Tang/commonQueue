package sg.edu.nus.iss.commonQueueApp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * QueueEntry entity representing a customer's position in a specific queue
 */
@Entity
@Table(name = "queue_entries")
public class QueueEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Queue is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_id", nullable = false)
    private Queue queue;

    @NotNull(message = "Customer is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Positive(message = "Queue number must be positive")
    @Column(name = "queue_number", nullable = false)
    private Integer queueNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private QueueEntryStatus status = QueueEntryStatus.WAITING;

    @Column(name = "estimated_wait_time_minutes")
    private Integer estimatedWaitTimeMinutes;

    @Column(name = "joined_at", nullable = false)
    @CreationTimestamp
    private LocalDateTime joinedAt;

    @Column(name = "called_at")
    private LocalDateTime calledAt;

    @Column(name = "served_at")
    private LocalDateTime servedAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "no_show_at")
    private LocalDateTime noShowAt;

    @Column(name = "priority_level")
    private Integer priorityLevel = 0; // 0 = normal, higher numbers = higher priority

    @Column(name = "notes")
    private String notes;

    @Column(name = "notification_sent")
    private Boolean notificationSent = false;

    @Column(name = "reminder_sent")
    private Boolean reminderSent = false;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public QueueEntry() {}

    public QueueEntry(Queue queue, Customer customer, Integer queueNumber) {
        this.queue = queue;
        this.customer = customer;
        this.queueNumber = queueNumber;
        this.estimatedWaitTimeMinutes = calculateEstimatedWaitTime();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Queue getQueue() { return queue; }
    public void setQueue(Queue queue) { this.queue = queue; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Integer getQueueNumber() { return queueNumber; }
    public void setQueueNumber(Integer queueNumber) { this.queueNumber = queueNumber; }

    public QueueEntryStatus getStatus() { return status; }
    public void setStatus(QueueEntryStatus status) { this.status = status; }

    public Integer getEstimatedWaitTimeMinutes() { return estimatedWaitTimeMinutes; }
    public void setEstimatedWaitTimeMinutes(Integer estimatedWaitTimeMinutes) { this.estimatedWaitTimeMinutes = estimatedWaitTimeMinutes; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }

    public LocalDateTime getCalledAt() { return calledAt; }
    public void setCalledAt(LocalDateTime calledAt) { this.calledAt = calledAt; }

    public LocalDateTime getServedAt() { return servedAt; }
    public void setServedAt(LocalDateTime servedAt) { this.servedAt = servedAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public LocalDateTime getNoShowAt() { return noShowAt; }
    public void setNoShowAt(LocalDateTime noShowAt) { this.noShowAt = noShowAt; }

    public Integer getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(Integer priorityLevel) { this.priorityLevel = priorityLevel; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public Boolean getNotificationSent() { return notificationSent; }
    public void setNotificationSent(Boolean notificationSent) { this.notificationSent = notificationSent; }

    public Boolean getReminderSent() { return reminderSent; }
    public void setReminderSent(Boolean reminderSent) { this.reminderSent = reminderSent; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Business Methods

    /**
     * Calculate estimated wait time based on queue position
     */
    private Integer calculateEstimatedWaitTime() {
        if (queue == null) return null;

        long customersAhead = queue.getQueueEntries().stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.WAITING ||
                        entry.getStatus() == QueueEntryStatus.CALLED)
                .filter(entry -> entry.getQueueNumber() < this.queueNumber)
                .count();

        return (int) (customersAhead * queue.getAvgServiceTimeMinutes());
    }

    /**
     * Update estimated wait time
     */
    public void updateEstimatedWaitTime() {
        this.estimatedWaitTimeMinutes = calculateEstimatedWaitTime();
    }

    /**
     * Get actual wait time in minutes
     */
    public Long getActualWaitTimeMinutes() {
        if (joinedAt == null) return null;

        LocalDateTime endTime = calledAt != null ? calledAt : LocalDateTime.now();
        return ChronoUnit.MINUTES.between(joinedAt, endTime);
    }

    /**
     * Get service time in minutes
     */
    public Long getServiceTimeMinutes() {
        if (calledAt == null || servedAt == null) return null;
        return ChronoUnit.MINUTES.between(calledAt, servedAt);
    }

    /**
     * Check if customer should be notified (15 minutes before estimated time)
     */
    public boolean shouldNotify() {
        if (notificationSent || status != QueueEntryStatus.WAITING) return false;
        if (estimatedWaitTimeMinutes == null) return false;

        LocalDateTime estimatedCallTime = joinedAt.plusMinutes(estimatedWaitTimeMinutes);
        LocalDateTime notificationTime = estimatedCallTime.minusMinutes(15);

        return LocalDateTime.now().isAfter(notificationTime);
    }

    /**
     * Check if customer should receive reminder (5 minutes before)
     */
    public boolean shouldSendReminder() {
        if (reminderSent || status != QueueEntryStatus.WAITING) return false;
        if (estimatedWaitTimeMinutes == null) return false;

        LocalDateTime estimatedCallTime = joinedAt.plusMinutes(estimatedWaitTimeMinutes);
        LocalDateTime reminderTime = estimatedCallTime.minusMinutes(5);

        return LocalDateTime.now().isAfter(reminderTime);
    }

    /**
     * Mark as called
     */
    public void markAsCalled() {
        this.status = QueueEntryStatus.CALLED;
        this.calledAt = LocalDateTime.now();
    }

    /**
     * Mark as served
     */
    public void markAsServed() {
        this.status = QueueEntryStatus.SERVED;
        this.servedAt = LocalDateTime.now();
    }

    /**
     * Mark as cancelled
     */
    public void markAsCancelled() {
        this.status = QueueEntryStatus.CANCELLED;
        this.cancelledAt = LocalDateTime.now();
    }

    /**
     * Mark as no show
     */
    public void markAsNoShow() {
        this.status = QueueEntryStatus.NO_SHOW;
        this.noShowAt = LocalDateTime.now();
    }

    /**
     * Check if entry is active (waiting or called)
     */
    public boolean isActive() {
        return status == QueueEntryStatus.WAITING || status == QueueEntryStatus.CALLED;
    }

    /**
     * Get position in queue (among active entries)
     */
    public int getPositionInQueue() {
        if (queue == null) return 0;

        return (int) queue.getQueueEntries().stream()
                .filter(QueueEntry::isActive)
                .filter(entry -> entry.getQueueNumber() <= this.queueNumber)
                .count();
    }
}

