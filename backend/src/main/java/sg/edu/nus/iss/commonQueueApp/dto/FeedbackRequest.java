// FeedbackRequest.java
package sg.edu.nus.iss.commonQueueApp.dto;

import jakarta.validation.constraints.*;

public class FeedbackRequest {
    private Long customerId;
    private Long businessId;
    private Long queueEntryId;

    @NotNull(message = "Accuracy rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer accuracyRating;

    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer serviceRating;

    @Size(max = 1000, message = "Comment must not exceed 1000 characters")
    private String comment;

    private Boolean isAnonymous = false;

    // Getters and setters
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public Long getBusinessId() { return businessId; }
    public void setBusinessId(Long businessId) { this.businessId = businessId; }

    public Long getQueueEntryId() { return queueEntryId; }
    public void setQueueEntryId(Long queueEntryId) { this.queueEntryId = queueEntryId; }

    public Integer getAccuracyRating() { return accuracyRating; }
    public void setAccuracyRating(Integer accuracyRating) { this.accuracyRating = accuracyRating; }

    public Integer getServiceRating() { return serviceRating; }
    public void setServiceRating(Integer serviceRating) { this.serviceRating = serviceRating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getIsAnonymous() { return isAnonymous; }
    public void setIsAnonymous(Boolean isAnonymous) { this.isAnonymous = isAnonymous; }
}