package sg.edu.nus.iss.commonQueueApp.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class DashboardController {

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard(Authentication authentication) {
        String businessEmail = authentication.getName();

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Login successful! Welcome to Queue Management System");
        response.put("businessEmail", businessEmail);
        response.put("timestamp", java.time.LocalDateTime.now());

        Map<String, String> availableEndpoints = new HashMap<>();
        availableEndpoints.put("GET /api/queues/business/{businessId}", "Get your business queues");
        availableEndpoints.put("POST /api/queues/business/{businessId}", "Create new queue");
        availableEndpoints.put("GET /api/queues/{queueId}/status", "Get queue status (public)");
        availableEndpoints.put("POST /api/queues/{queueId}/join", "Customer joins queue (public)");
        availableEndpoints.put("POST /api/queues/{queueId}/call-next", "Call next customer");
        availableEndpoints.put("PUT /api/queues/entries/{entryId}/served", "Mark customer as served");

        response.put("availableEndpoints", availableEndpoints);

        return response;
    }
}