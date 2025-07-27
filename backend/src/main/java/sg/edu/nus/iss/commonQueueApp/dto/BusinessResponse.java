// BusinessResponse.java
package sg.edu.nus.iss.commonQueueApp.dto;

import sg.edu.nus.iss.commonQueueApp.entity.Business;
import sg.edu.nus.iss.commonQueueApp.entity.BusinessType;
import java.time.LocalTime;
import java.time.LocalDateTime;

public class BusinessResponse {
    private Long id;
    private String businessName;
    private String email;
    private String phone;
    private String address;
    private String description;
    private String logoUrl;
    private String themeColor;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private Boolean isActive;
    private Boolean isVerified;
    private BusinessType businessType;
    private LocalDateTime createdAt;
    private boolean isOpen;

    public static BusinessResponse fromEntity(Business business) {
        BusinessResponse response = new BusinessResponse();
        response.id = business.getId();
        response.businessName = business.getBusinessName();
        response.email = business.getEmail();
        response.phone = business.getPhone();
        response.address = business.getAddress();
        response.description = business.getDescription();
        response.logoUrl = business.getLogoUrl();
        response.themeColor = business.getThemeColor();
        response.openingTime = business.getOpeningTime();
        response.closingTime = business.getClosingTime();
        response.isActive = business.getIsActive();
        response.isVerified = business.getIsVerified();
        response.businessType = business.getBusinessType();
        response.createdAt = business.getCreatedAt();
        response.isOpen = business.isOpen();
        return response;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBusinessName() { return businessName; }
    public void setBusinessName(String businessName) { this.businessName = businessName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public String getThemeColor() { return themeColor; }
    public void setThemeColor(String themeColor) { this.themeColor = themeColor; }

    public LocalTime getOpeningTime() { return openingTime; }
    public void setOpeningTime(LocalTime openingTime) { this.openingTime = openingTime; }

    public LocalTime getClosingTime() { return closingTime; }
    public void setClosingTime(LocalTime closingTime) { this.closingTime = closingTime; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public BusinessType getBusinessType() { return businessType; }
    public void setBusinessType(BusinessType businessType) { this.businessType = businessType; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean getIsOpen() { return isOpen; }
    public void setIsOpen(boolean isOpen) { this.isOpen = isOpen; }
}
