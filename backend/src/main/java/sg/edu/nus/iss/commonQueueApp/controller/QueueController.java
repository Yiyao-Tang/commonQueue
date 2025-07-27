package sg.edu.nus.iss.commonQueueApp.controller;

import sg.edu.nus.iss.commonQueueApp.dto.*;
import sg.edu.nus.iss.commonQueueApp.entity.Queue;
import sg.edu.nus.iss.commonQueueApp.entity.QueueEntry;
import sg.edu.nus.iss.commonQueueApp.service.QueueService;
import sg.edu.nus.iss.commonQueueApp.service.QueueService.QueueStatistics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

/**
 * REST Controller for queue management operations
 */
@RestController
@RequestMapping("/queues")
@CrossOrigin(origins = "*", maxAge = 3600)
public class QueueController {

    @Autowired
    private QueueService queueService;

    /**
     * Create new queue (Business owners only)
     */
    @PostMapping("/business/{businessId}")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueResponse> createQueue(
            @PathVariable Long businessId,
            @Valid @RequestBody QueueTimingRequest request) {

        Queue queue = queueService.createQueue(businessId, request);
        QueueResponse response = QueueResponse.fromEntity(queue);

        return ResponseEntity.ok(response);
    }

    /**
     * Update queue timing information
     */
    @PutMapping("/{queueId}")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueResponse> updateQueueTiming(
            @PathVariable Long queueId,
            @Valid @RequestBody QueueTimingRequest request) {

        Queue queue = queueService.updateQueueTiming(queueId, request);
        QueueResponse response = QueueResponse.fromEntity(queue);

        return ResponseEntity.ok(response);
    }

    /**
     * Delete/deactivate queue
     */
    @DeleteMapping("/{queueId}")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse> deleteQueue(@PathVariable Long queueId) {
        queueService.deleteQueue(queueId);
        return ResponseEntity.ok(new ApiResponse(true, "Queue deleted successfully"));
    }

    /**
     * Get queue status (Public endpoint)
     */
    @GetMapping("/{queueId}/status")
    public ResponseEntity<QueueStatusResponse> getQueueStatus(@PathVariable Long queueId) {
        QueueStatusResponse status = queueService.getQueueStatus(queueId);
        return ResponseEntity.ok(status);
    }

    /**
     * Join queue (Customers)
     */
    @PostMapping("/{queueId}/join")
    public ResponseEntity<QueueEntryResponse> joinQueue(
            @PathVariable Long queueId,
            @RequestBody JoinQueueRequest request) {

        QueueEntry entry = queueService.joinQueue(queueId, request.getCustomerId());
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Call next customer (Business staff)
     */
    @PostMapping("/{queueId}/call-next")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueEntryResponse> callNextCustomer(@PathVariable Long queueId) {
        QueueEntry entry = queueService.callNextCustomer(queueId);
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Mark customer as served
     */
    @PutMapping("/entries/{entryId}/served")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueEntryResponse> markAsServed(@PathVariable Long entryId) {
        QueueEntry entry = queueService.markAsServed(entryId);
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Cancel queue entry
     */
    @PutMapping("/entries/{entryId}/cancel")
    public ResponseEntity<QueueEntryResponse> cancelQueueEntry(@PathVariable Long entryId) {
        QueueEntry entry = queueService.cancelQueueEntry(entryId);
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Mark customer as no-show
     */
    @PutMapping("/entries/{entryId}/no-show")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueEntryResponse> markAsNoShow(@PathVariable Long entryId) {
        QueueEntry entry = queueService.markAsNoShow(entryId);
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Get customer's position in queue
     */
    @GetMapping("/{queueId}/position/{customerId}")
    public ResponseEntity<QueueEntryResponse> getCustomerPosition(
            @PathVariable Long queueId,
            @PathVariable Long customerId) {

        QueueEntry entry = queueService.getCustomerQueuePosition(customerId, queueId);
        QueueEntryResponse response = QueueEntryResponse.fromEntity(entry);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all active queues for a business
     */
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<QueueResponse>> getBusinessQueues(@PathVariable Long businessId) {
        List<Queue> queues = queueService.getActiveQueuesByBusinessId(businessId);
        List<QueueResponse> responses = queues.stream()
                .map(QueueResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Get queue entries for a specific queue
     */
    @GetMapping("/{queueId}/entries")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<List<QueueEntryResponse>> getQueueEntries(@PathVariable Long queueId) {
        List<QueueEntry> entries = queueService.getQueueEntries(queueId);
        List<QueueEntryResponse> responses = entries.stream()
                .map(QueueEntryResponse::fromEntity)
                .toList();

        return ResponseEntity.ok(responses);
    }

    /**
     * Reset queue (daily operation)
     */
    @PostMapping("/{queueId}/reset")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<ApiResponse> resetQueue(@PathVariable Long queueId) {
        queueService.resetQueue(queueId);
        return ResponseEntity.ok(new ApiResponse(true, "Queue reset successfully"));
    }

    /**
     * Get queue statistics
     */
    @GetMapping("/business/{businessId}/statistics")
    @PreAuthorize("hasRole('BUSINESS') or hasRole('STAFF')")
    public ResponseEntity<QueueStatistics> getQueueStatistics(
            @PathVariable Long businessId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {

        QueueStatistics stats = queueService.getQueueStatistics(businessId, startDate, endDate);
        return ResponseEntity.ok(stats);
    }

    /**
     * Get public queue view (for displays)
     */
    @GetMapping("/public/{businessId}")
    public ResponseEntity<List<PublicQueueView>> getPublicQueueView(@PathVariable Long businessId) {
        List<Queue> queues = queueService.getActiveQueuesByBusinessId(businessId);
        List<PublicQueueView> publicViews = queues.stream()
                .map(this::createPublicQueueView)
                .toList();

        return ResponseEntity.ok(publicViews);
    }

    /**
     * Get queue data for customers (mobile app view)
     */
    @GetMapping("/customer/{customerId}/active")
    public ResponseEntity<List<QueueEntryResponse>> getCustomerActiveQueues(@PathVariable Long customerId) {
        // Implementation would get all active queue entries for customer
        return ResponseEntity.ok(List.of());
    }

    /**
     * Helper method to create public queue view
     */
    private PublicQueueView createPublicQueueView(Queue queue) {
        PublicQueueView view = new PublicQueueView();
        view.setQueueId(queue.getId());
        view.setQueueName(queue.getQueueName());
        view.setCurrentNumber(queue.getCurrentNumber());
        view.setTotalWaiting(queue.getCurrentQueueLength());
        view.setEstimatedWaitTime(queue.getEstimatedWaitTimeMinutes());
        view.setColorCode(queue.getColorCode());
        view.setQueueType(queue.getQueueType().getDisplayName());
        return view;
    }
}

// DTO Classes

class PublicQueueView {
    private Long queueId;
    private String queueName;
    private Integer currentNumber;
    private Integer totalWaiting;
    private Integer estimatedWaitTime;
    private String colorCode;
    private String queueType;

    // Getters and setters
    public Long getQueueId() { return queueId; }
    public void setQueueId(Long queueId) { this.queueId = queueId; }

    public String getQueueName() { return queueName; }
    public void setQueueName(String queueName) { this.queueName = queueName; }

    public Integer getCurrentNumber() { return currentNumber; }
    public void setCurrentNumber(Integer currentNumber) { this.currentNumber = currentNumber; }

    public Integer getTotalWaiting() { return totalWaiting; }
    public void setTotalWaiting(Integer totalWaiting) { this.totalWaiting = totalWaiting; }

    public Integer getEstimatedWaitTime() { return estimatedWaitTime; }
    public void setEstimatedWaitTime(Integer estimatedWaitTime) { this.estimatedWaitTime = estimatedWaitTime; }

    public String getColorCode() { return colorCode; }
    public void setColorCode(String colorCode) { this.colorCode = colorCode; }

    public String getQueueType() { return queueType; }
    public void setQueueType(String queueType) { this.queueType = queueType; }
}