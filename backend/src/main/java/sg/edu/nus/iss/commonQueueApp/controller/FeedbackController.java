package sg.edu.nus.iss.commonQueueApp.controller;

import sg.edu.nus.iss.commonQueueApp.dto.FeedbackRequest;
import sg.edu.nus.iss.commonQueueApp.dto.FeedbackResponse;
import sg.edu.nus.iss.commonQueueApp.entity.*;
import sg.edu.nus.iss.commonQueueApp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/feedback")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BusinessRepository businessRepository;

    @Autowired
    private QueueEntryRepository queueEntryRepository;

    /**
     * Submit feedback
     */
    @PostMapping
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @Valid @RequestBody FeedbackRequest request) {

        Business business = businessRepository.findById(request.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));

        Customer customer = null;
        if (request.getCustomerId() != null) {
            customer = customerRepository.findById(request.getCustomerId())
                    .orElse(null);
        }

        QueueEntry queueEntry = null;
        if (request.getQueueEntryId() != null) {
            queueEntry = queueEntryRepository.findById(request.getQueueEntryId())
                    .orElse(null);
        }

        Feedback feedback = new Feedback();
        feedback.setBusiness(business);
        feedback.setCustomer(customer);
        feedback.setQueueEntry(queueEntry);
        feedback.setAccuracyRating(request.getAccuracyRating());
        feedback.setServiceRating(request.getServiceRating());
        feedback.setComment(request.getComment());
        feedback.setIsAnonymous(request.getIsAnonymous());
        feedback.setFeedbackType(FeedbackType.QUEUE_ACCURACY);

        Feedback savedFeedback = feedbackRepository.save(feedback);

        return ResponseEntity.ok(FeedbackResponse.fromEntity(savedFeedback));
    }

    /**
     * Get feedback for business
     */
    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<FeedbackResponse>> getBusinessFeedback(
            @PathVariable Long businessId) {

        List<Feedback> feedbacks = feedbackRepository.findByBusinessIdOrderByCreatedAtDesc(businessId);
        List<FeedbackResponse> responses = feedbacks.stream()
                .map(FeedbackResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Get feedback by customer
     */
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FeedbackResponse>> getCustomerFeedback(
            @PathVariable Long customerId) {

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Feedback> feedbacks = feedbackRepository.findByCustomerOrderByCreatedAtDesc(customer);
        List<FeedbackResponse> responses = feedbacks.stream()
                .map(FeedbackResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}