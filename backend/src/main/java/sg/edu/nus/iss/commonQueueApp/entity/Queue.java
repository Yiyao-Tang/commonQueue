package sg.edu.nus.iss.commonQueueApp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Queue entity representing different service queues within a business
 */
@Entity
@Table(name = "queues")
public class Queue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Queue name is required")
    @Size(max = 100, message = "Queue name must not exceed 100 characters")
    @Column(name = "queue_name", nullable = false)
    private String queueName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    @Column(name = "description")
    private String description;

    @NotNull(message = "Business is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @Positive(message = "Average service time must be positive")
    @Column(name = "avg_service_time_minutes", nullable = false)
    private Integer avgServiceTimeMinutes = 10;

    @Column(name = "current_number")
    private Integer currentNumber = 0;

    @Column(name = "next_number")
    private Integer nextNumber = 1;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Enumerated(EnumType.STRING)
    @Column(name = "queue_type")
    private QueueType queueType = QueueType.GENERAL;

    @Column(name = "max_capacity")
    private Integer maxCapacity;

    @Column(name = "color_code")
    private String colorCode = "#007bff";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "queue", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QueueEntry> queueEntries = new ArrayList<>();

    // Constructors
    public Queue() {}

    public Queue(String queueName, Business business) {
        this.queueName = queueName;
        this.business = business;
    }

    public Queue(String queueName, Business business, QueueType queueType, Integer avgServiceTimeMinutes) {
        this.queueName = queueName;
        this.business = business;
        this.queueType = queueType;
        this.avgServiceTimeMinutes = avgServiceTimeMinutes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQueueName() { return queueName; }
    public void setQueueName(String queueName) { this.queueName = queueName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Business getBusiness() { return business; }
    public void setBusiness(Business business) { this.business = business; }

    public Integer getAvgServiceTimeMinutes() { return avgServiceTimeMinutes; }
    public void setAvgServiceTimeMinutes(Integer avgServiceTimeMinutes) { this.avgServiceTimeMinutes = avgServiceTimeMinutes; }

    public Integer getCurrentNumber() { return currentNumber; }
    public void setCurrentNumber(Integer currentNumber) { this.currentNumber = currentNumber; }

    public Integer getNextNumber() { return nextNumber; }
    public void setNextNumber(Integer nextNumber) { this.nextNumber = nextNumber; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public QueueType getQueueType() { return queueType; }
    public void setQueueType(QueueType queueType) { this.queueType = queueType; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<QueueEntry> getQueueEntries() { return queueEntries; }
    public void setQueueEntries(List<QueueEntry> queueEntries) { this.queueEntries = queueEntries; }

    // Business Methods

    /**
     * Get the current queue length (active entries)
     */
    public int getCurrentQueueLength() {
        if (queueEntries == null) return 0;
        return (int) queueEntries.stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.WAITING ||
                        entry.getStatus() == QueueEntryStatus.CALLED)
                .count();
    }

    /**
     * Calculate estimated wait time for new customer
     */
    public int getEstimatedWaitTimeMinutes() {
        int queueLength = getCurrentQueueLength();
        return queueLength * avgServiceTimeMinutes;
    }

    /**
     * Generate next queue number
     */
    public synchronized Integer generateNextNumber() {
        Integer number = this.nextNumber;
        this.nextNumber++;
        return number;
    }

    /**
     * Check if queue is at capacity
     */
    public boolean isAtCapacity() {
        if (maxCapacity == null) return false;
        return getCurrentQueueLength() >= maxCapacity;
    }

    /**
     * Get waiting customers count
     */
    public long getWaitingCustomersCount() {
        return queueEntries.stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.WAITING)
                .count();
    }

    /**
     * Get called customers count
     */
    public long getCalledCustomersCount() {
        return queueEntries.stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.CALLED)
                .count();
    }

    /**
     * Get served customers count for today
     */
    public long getServedTodayCount() {
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        return queueEntries.stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.SERVED)
                .filter(entry -> entry.getServedAt() != null && entry.getServedAt().isAfter(startOfDay))
                .count();
    }

    /**
     * Reset queue numbers (usually done daily)
     */
    public void resetQueue() {
        this.currentNumber = 0;
        this.nextNumber = 1;
    }

    /**
     * Add queue entry
     */
    public void addQueueEntry(QueueEntry entry) {
        queueEntries.add(entry);
        entry.setQueue(this);
    }

    /**
     * Remove queue entry
     */
    public void removeQueueEntry(QueueEntry entry) {
        queueEntries.remove(entry);
        entry.setQueue(null);
    }
}

