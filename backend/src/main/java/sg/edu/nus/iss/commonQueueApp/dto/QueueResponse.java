// QueueResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.Queue;
import sg.edu.nus.iss.commonQueueApp.entity.QueueType;
import java.time.LocalDateTime;

public class QueueResponse {
    private Long id;
    private String queueName;
    private String description;
    private QueueType queueType;
    private Integer avgServiceTimeMinutes;
    private Integer currentNumber;
    private Integer nextNumber;
    private Boolean isActive;
    private Integer maxCapacity;
    private String colorCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static QueueResponse fromEntity(Queue queue) {
        QueueResponse response = new QueueResponse();
        response.id = queue.getId();
        response.queueName = queue.getQueueName();
        response.description = queue.getDescription();
        response.queueType = queue.getQueueType();
        response.avgServiceTimeMinutes = queue.getAvgServiceTimeMinutes();
        response.currentNumber = queue.getCurrentNumber();
        response.nextNumber = queue.getNextNumber();
        response.isActive = queue.getIsActive();
        response.maxCapacity = queue.getMaxCapacity();
        response.colorCode = queue.getColorCode();
        response.createdAt = queue.getCreatedAt();
        response.updatedAt = queue.getUpdatedAt();
        return response;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getQueueName() { return queueName; }
    public void setQueueName(String queueName) { this.queueName = queueName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public QueueType getQueueType() { return queueType; }
    public void setQueueType(QueueType queueType) { this.queueType = queueType; }

    public Integer getAvgServiceTimeMinutes() { return avgServiceTimeMinutes; }
    public void setAvgServiceTimeMinutes(Integer avgServiceTimeMinutes) { this.avgServiceTimeMinutes = avgServiceTimeMinutes; }

    public Integer getCurrentNumber() { return currentNumber; }
    public void setCurrentNumber(Integer currentNumber) { this.currentNumber = currentNumber; }

    public Integer getNextNumber() { return nextNumber; }
    public void setNextNumber(Integer nextNumber) { this.nextNumber = nextNumber; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}