package sg.edu.nus.iss.commonQueueApp.entity;

public enum QueueType {
    GENERAL("General Service"),
    CONSULTATION("Consultation"),
    PHARMACY("Pharmacy"),
    CASHIER("Cashier"),
    APPOINTMENT("Appointment"),
    PRIORITY("Priority Service"),
    EXPRESS("Express Service"),
    WALKLN("Walk-in");

    private final String displayName;

    QueueType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
