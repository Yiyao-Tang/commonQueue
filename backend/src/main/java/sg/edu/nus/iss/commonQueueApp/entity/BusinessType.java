package sg.edu.nus.iss.commonQueueApp.entity;

public enum BusinessType {
    CLINIC("Clinic"),
    RESTAURANT("Restaurant"),
    RETAIL("Retail Store"),
    SERVICE_CENTER("Service Center"),
    PHARMACY("Pharmacy"),
    BANK("Bank"),
    GOVERNMENT("Government Office"),
    OTHER("Other");

    private final String displayName;

    BusinessType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
