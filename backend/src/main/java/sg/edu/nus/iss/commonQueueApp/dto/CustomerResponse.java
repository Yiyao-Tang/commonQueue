
// CustomerResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.Customer;
import sg.edu.nus.iss.commonQueueApp.entity.NotificationPreference;
import java.time.LocalDateTime;

public class CustomerResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private NotificationPreference notificationPreference;
    private String languagePreference;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;

    public static CustomerResponse fromEntity(Customer customer) {
        CustomerResponse response = new CustomerResponse();
        response.id = customer.getId();
        response.name = customer.getName();
        response.email = customer.getEmail();
        response.phone = customer.getPhone();
        response.notificationPreference = customer.getNotificationPreference();
        response.languagePreference = customer.getLanguagePreference();
        response.isActive = customer.getIsActive();
        response.createdAt = customer.getCreatedAt();
        response.lastLogin = customer.getLastLogin();
        return response;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public NotificationPreference getNotificationPreference() { return notificationPreference; }
    public void setNotificationPreference(NotificationPreference notificationPreference) { this.notificationPreference = notificationPreference; }

    public String getLanguagePreference() { return languagePreference; }
    public void setLanguagePreference(String languagePreference) { this.languagePreference = languagePreference; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getLastLogin() { return lastLogin; }
    public void setLastLogin(LocalDateTime lastLogin) { this.lastLogin = lastLogin; }
}
