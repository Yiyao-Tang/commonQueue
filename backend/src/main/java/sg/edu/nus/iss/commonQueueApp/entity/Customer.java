package sg.edu.nus.iss.commonQueueApp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Customer entity representing customers who join queues
 */
@Entity
@Table(name = "customers")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must not exceed 100 characters")
    @Column(name = "name", nullable = false)
    private String name;

    @Email(message = "Please provide a valid email")
    @Column(name = "email")
    private String email;

    @Size(max = 20, message = "Phone number must not exceed 20 characters")
    @Column(name = "phone")
    private String phone;

    @Column(name = "notification_preference")
    @Enumerated(EnumType.STRING)
    private NotificationPreference notificationPreference = NotificationPreference.BOTH;

    @Column(name = "language_preference")
    private String languagePreference = "en";

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<QueueEntry> queueEntries = new ArrayList<>();

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Feedback> feedbacks = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "customer_favorite_businesses",
            joinColumns = @JoinColumn(name = "customer_id"),
            inverseJoinColumns = @JoinColumn(name = "business_id")
    )
    private List<Business> favoriteBusinesses = new ArrayList<>();

    // Constructors
    public Customer() {}

    public Customer(String name, String email, String phone) {
        this.name = name;
        this.email = email;
        this.phone = phone;
    }

    public Customer(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public NotificationPreference getNotificationPreference() { return notificationPreference; }
    public void setNotificationPreference(NotificationPreference notificationPreference) { this.notificationPreference = notificationPreference; }

    public String getLanguagePreference() { return languagePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<QueueEntry> getQueueEntries() { return queueEntries; }
    public void setQueueEntries(List<QueueEntry> queueEntries) { this.queueEntries = queueEntries; }

    public List<Feedback> getFeedbacks() { return feedbacks; }
    public void setFeedbacks(List<Feedback> feedbacks) { this.feedbacks = feedbacks; }

    public List<Business> getFavoriteBusinesses() { return favoriteBusinesses; }
    public void setFavoriteBusinesses(List<Business> favoriteBusinesses) { this.favoriteBusinesses = favoriteBusinesses; }

    // Business Methods

    /**
     * Check if customer can receive email notifications
     */
    public boolean canReceiveEmailNotifications() {
        return email != null && !email.isEmpty() &&
                (notificationPreference == NotificationPreference.EMAIL ||
                        notificationPreference == NotificationPreference.BOTH);
    }

    /**
     * Check if customer can receive SMS notifications
     */
    public boolean canReceiveSmsNotifications() {
        return phone != null && !phone.isEmpty() &&
                (notificationPreference == NotificationPreference.SMS ||
                        notificationPreference == NotificationPreference.BOTH);
    }

    /**
     * Get active queue entries
     */
    public List<QueueEntry> getActiveQueueEntries() {
        return queueEntries.stream()
                .filter(QueueEntry::isActive)
                .toList();
    }

    /**
     * Get current queue position (if any)
     */
    public QueueEntry getCurrentQueueEntry() {
        return queueEntries.stream()
                .filter(QueueEntry::isActive)
                .findFirst()
                .orElse(null);
    }

    /**
     * Check if customer is currently in any queue
     */
    public boolean isCurrentlyInQueue() {
        return getCurrentQueueEntry() != null;
    }

    /**
     * Add to favorite businesses
     */
    public void addFavoriteBusiness(Business business) {
        if (!favoriteBusinesses.contains(business)) {
            favoriteBusinesses.add(business);
        }
    }

    /**
     * Remove from favorite businesses
     */
    public void removeFavoriteBusiness(Business business) {
        favoriteBusinesses.remove(business);
    }

    /**
     * Update last login timestamp
     */
    public void updateLastLogin() {
        this.lastLogin = LocalDateTime.now();
    }

    /**
     * Get total visits count
     */
    public long getTotalVisitsCount() {
        return queueEntries.stream()
                .filter(entry -> entry.getStatus() == QueueEntryStatus.SERVED)
                .count();
    }

    /**
     * Get visits to specific business
     */
    public long getVisitsToBusinessCount(Business business) {
        return queueEntries.stream()
                .filter(entry -> entry.getQueue().getBusiness().equals(business))
                .filter(entry -> entry.getStatus() == QueueEntryStatus.SERVED)
                .count();
    }
}

