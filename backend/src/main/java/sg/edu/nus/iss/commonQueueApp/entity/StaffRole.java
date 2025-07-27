package sg.edu.nus.iss.commonQueueApp.entity;

public enum StaffRole {
    ADMIN("Administrator"),
    MANAGER("Manager"),
    STAFF("Staff Member");

    private final String displayName;

    StaffRole(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
