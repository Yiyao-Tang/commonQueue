package sg.edu.nus.iss.commonQueueApp.entity;

public enum NotificationType {
    QUEUE_JOINED("Queue Joined"),
    TURN_APPROACHING("Your Turn is Approaching"),
    TURN_READY("Your Turn is Ready"),
    QUEUE_CANCELLED("Queue Cancelled"),
    QUEUE_DELAYED("Queue Delayed"),
    REMINDER("Reminder"),
    FEEDBACK_REQUEST("Feedback Request");

    private final String displayName;

    NotificationType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
