package sg.edu.nus.iss.commonQueueApp.entity;

public enum QueueEntryStatus {
    WAITING("Waiting"),
    CALLED("Called"),
    SERVED("Served"),
    CANCELLED("Cancelled"),
    NO_SHOW("No Show");

    private final String displayName;

    QueueEntryStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
