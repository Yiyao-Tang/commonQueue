package sg.edu.nus.iss.commonQueueApp.entity;

public enum NotificationStatus {
    PENDING("Pending"),
    SENT("Sent"),
    FAILED("Failed"),
    CANCELLED("Cancelled");

    private final String displayName;

    NotificationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
