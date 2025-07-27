// QueueEntryResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.QueueEntry;
import sg.edu.nus.iss.commonQueueApp.entity.QueueEntryStatus;
import java.time.LocalDateTime;

public class QueueEntryResponse {
    private Long id;
    private Long queueId;
    private String queueName;
    private Long customerId;
    private String customerName;
    private Integer queueNumber;
    private QueueEntryStatus status;
    private Integer estimatedWaitTimeMinutes;
    private LocalDateTime joinedAt;
    private LocalDateTime calledAt;
    private LocalDateTime servedAt;
    private Integer positionInQueue;
    private String businessName;

    public static QueueEntryResponse fromEntity(QueueEntry entry) {
        QueueEntryResponse response = new QueueEntryResponse();
        response.id = entry.getId();
        response.queueId = entry.getQueue().getId();
        response.queueName = entry.getQueue().getQueueName();
        response.customerId = entry.getCustomer().getId();
        response.customerName = entry.getCustomer().getName();
        response.queueNumber = entry.getQueueNumber();
        response.status = entry.getStatus();
        response.estimatedWaitTimeMinutes = entry.getEstimatedWaitTimeMinutes();
        response.joinedAt = entry.getJoinedAt();
        response.calledAt = entry.getCalledAt();
        response.servedAt = entry.getServedAt();
        response.positionInQueue = entry.getPositionInQueue();
        response.businessName = entry.getQueue().getBusiness().getBusinessName();
        return response;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQueueId() { return queueId; }
    public void setQueueId(Long queueId) { this.queueId = queueId; }

    public String getQueueName() { return queueName; }
    public void setQueueName(String queueName) { this.queueName = queueName; }

    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

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

    public Integer getPositionInQueue() { return positionInQueue; }
    public void setPositionInQueue(Integer positionInQueue) { this.positionInQueue = positionInQueue; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }
}
