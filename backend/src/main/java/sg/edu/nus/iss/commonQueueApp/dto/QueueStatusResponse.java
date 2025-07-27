
// QueueStatusResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

public class QueueStatusResponse {
    private Long queueId;
    private String queueName;
    private Integer currentNumber;
    private Integer nextNumber;
    private Integer totalWaiting;
    private Integer estimatedWaitTime;
    private Boolean isActive;
    private Integer maxCapacity;
    private Integer avgServiceTime;
    private Long servedToday;

    // Getters and setters
    public Long getQueueId() { return queueId; }
    public void setQueueId(Long queueId) { this.queueId = queueId; }

    public String getQueueName() { return queueName; }
    public void setQueueName(String queueName) { this.queueName = queueName; }

    public Integer getCurrentNumber() { return currentNumber; }
    public void setCurrentNumber(Integer currentNumber) { this.currentNumber = currentNumber; }

    public Integer getNextNumber() { return nextNumber; }
    public void setNextNumber(Integer nextNumber) { this.nextNumber = nextNumber; }

    public Integer getTotalWaiting() { return totalWaiting; }
    public void setTotalWaiting(Integer totalWaiting) { this.totalWaiting = totalWaiting; }

    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getAvgServiceTime() { return avgServiceTime; }
    public void setAvgServiceTime(Integer avgServiceTime) { this.avgServiceTime = avgServiceTime; }

    public Long getServedToday() { return servedToday; }
    public void setServedToday(Long servedToday) { this.servedToday = servedToday; }
}
