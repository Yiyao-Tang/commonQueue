package sg.edu.nus.iss.commonQueueApp.entity;

public enum NotificationPreference {
    EMAIL("Email Only"),
    SMS("SMS Only"),
    BOTH("Email and SMS"),
    NONE("No Notifications");

    private final String displayName;

    NotificationPreference(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
