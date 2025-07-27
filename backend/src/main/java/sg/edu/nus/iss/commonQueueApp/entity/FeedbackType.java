package sg.edu.nus.iss.commonQueueApp.entity;

public enum FeedbackType {
    QUEUE_ACCURACY("Queue Time Accuracy"),
    SERVICE_QUALITY("Service Quality"),
    GENERAL("General Feedback"),
    COMPLAINT("Complaint"),
    SUGGESTION("Suggestion");

    private final String displayName;

    FeedbackType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
