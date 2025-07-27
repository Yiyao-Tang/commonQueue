package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.QueueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

/**
 * 队列配置请求 DTO
 */
public class QueueTimingRequest {

    @NotBlank(message = "Queue name is required")
    @Size(max = 100, message = "Queue name must not exceed 100 characters")
    private String queueName;

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    private QueueType queueType;

    @Positive(message = "Average service time must be positive")
    private Integer avgServiceTimeMinutes;

    private Integer maxCapacity;

    private String colorCode;

    // Constructors
    public QueueTimingRequest() {}

    public QueueTimingRequest(String queueName, QueueType queueType, Integer avgServiceTimeMinutes) {
        this.queueName = queueName;
        this.queueType = queueType;
        this.avgServiceTimeMinutes = avgServiceTimeMinutes;
    }

    // Getters and Setters
    public String getQueueName() {
        return queueName;
    }

    public void setQueueName(String queueName) {
        this.queueName = queueName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public QueueType getQueueType() {
        return queueType;
    }

    public void setQueueType(QueueType queueType) {
        this.queueType = queueType;
    }

    public Integer getAvgServiceTimeMinutes() {
        return avgServiceTimeMinutes;
    }

    public void setAvgServiceTimeMinutes(Integer avgServiceTimeMinutes) {
        this.avgServiceTimeMinutes = avgServiceTimeMinutes;
    }

    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public String getColorCode() {
        return colorCode;
    }

    public void setColorCode(String colorCode) {
        this.colorCode = colorCode;
    }
}