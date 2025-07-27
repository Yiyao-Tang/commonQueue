package sg.edu.nus.iss.commonQueueApp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Feedback entity for customer feedback on queue accuracy and service
 */
@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false)
    private Business business;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "queue_entry_id")
    private QueueEntry queueEntry;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    @Column(name = "accuracy_rating", nullable = false)
    private Integer accuracyRating;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    @Column(name = "service_rating")
    private Integer serviceRating;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    @Column(name = "comment")
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type")
    private FeedbackType feedbackType = FeedbackType.QUEUE_ACCURACY;

    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Constructors
    public Feedback() {}

    public Feedback(Customer customer, Business business, Integer accuracyRating) {
        this.customer = customer;
        this.business = business;
        this.accuracyRating = accuracyRating;
    }

    public Feedback(Customer customer, Business business, QueueEntry queueEntry, Integer accuracyRating, String comment) {
        this.customer = customer;
        this.business = business;
        this.queueEntry = queueEntry;
        this.accuracyRating = accuracyRating;
        this.comment = comment;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }

    public Business getBusiness() { return business; }
    public void setBusiness(Business business) { this.business = business; }

    public QueueEntry getQueueEntry() { return queueEntry; }
    public void setQueueEntry(QueueEntry queueEntry) { this.queueEntry = queueEntry; }

    public Integer getAccuracyRating() { return accuracyRating; }
    public void setAccuracyRating(Integer accuracyRating) { this.accuracyRating = accuracyRating; }

    public Integer getServiceRating() { return serviceRating; }
    public void setServiceRating(Integer serviceRating) { this.serviceRating = serviceRating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public FeedbackType getFeedbackType() { return feedbackType; }
    public void setFeedbackType(FeedbackType feedbackType) { this.feedbackType = feedbackType; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Business Methods

    /**
     * Check if feedback is positive (rating >= 4)
     */
    public boolean isPositiveFeedback() {
        return accuracyRating != null && accuracyRating >= 4;
    }

    /**
     * Get overall rating (average of accuracy and service if both exist)
     */
    public Double getOverallRating() {
        if (accuracyRating == null) return null;
        if (serviceRating == null) return accuracyRating.doubleValue();
        return (accuracyRating + serviceRating) / 2.0;
    }
}

