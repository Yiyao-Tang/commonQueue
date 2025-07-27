
// FeedbackResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.Feedback;
import sg.edu.nus.iss.commonQueueApp.entity.FeedbackType;
import java.time.LocalDateTime;

public class FeedbackResponse {
    private Long id;
    private String customerName;
    private String businessName;
    private Integer accuracyRating;
    private Integer serviceRating;
    private String comment;
    private FeedbackType feedbackType;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
    private Double overallRating;

    public static FeedbackResponse fromEntity(Feedback feedback) {
        FeedbackResponse response = new FeedbackResponse();
        response.id = feedback.getId();
        response.customerName = feedback.getIsAnonymous() ? "Anonymous" : feedback.getCustomer().getName();
        response.businessName = feedback.getBusiness().getBusinessName();
        response.accuracyRating = feedback.getAccuracyRating();
        response.serviceRating = feedback.getServiceRating();
        response.comment = feedback.getComment();
        response.feedbackType = feedback.getFeedbackType();
        response.isAnonymous = feedback.getIsAnonymous();
        response.createdAt = feedback.getCreatedAt();
        response.overallRating = feedback.getOverallRating();
        return response;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

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

    public Double getOverallRating() { return overallRating; }
    public void setOverallRating(Double overallRating) { this.overallRating = overallRating; }
}