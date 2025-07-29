package sg.edu.nus.iss.commonQueueApp.controller;

import sg.edu.nus.iss.commonQueueApp.dto.BusinessResponse;
import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.repository.BusinessRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/businesses")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BusinessController {

    @Autowired
    private BusinessRepository businessRepository;

    /**
     * Get all active businesses
     */
    @GetMapping
    public ResponseEntity<List<BusinessResponse>> getAllBusinesses() {
        List<Business> businesses = businessRepository.findByIsActiveTrueOrderByBusinessNameAsc();
        List<BusinessResponse> responses = businesses.stream()
                .map(BusinessResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }

    /**
     * Get business by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<BusinessResponse> getBusinessById(@PathVariable Long id) {
        Business business = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        return ResponseEntity.ok(BusinessResponse.fromEntity(business));
    }

    /**
     * Search businesses by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<BusinessResponse>> searchBusinesses(@RequestParam String q) {
        List<Business> businesses = businessRepository
                .findByBusinessNameContainingIgnoreCaseAndIsActiveTrue(q);

        List<BusinessResponse> responses = businesses.stream()
                .map(BusinessResponse::fromEntity)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}