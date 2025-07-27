package sg.edu.nus.iss.commonQueueApp.service;

import sg.edu.nus.iss.commonQueueApp.entity.*;
import sg.edu.nus.iss.commonQueueApp.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Service for handling notifications
 */
@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private JavaMailSender mailSender;

    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    /**
     * Send queue joined confirmation notification
     */
    @Async
    public void sendQueueJoinedNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Queue Joined Successfully";
        String message = String.format(
                "You have joined the queue for %s at %s. Your number is %d. Estimated wait time: %d minutes.",
                queue.getQueueName(),
                queue.getBusiness().getBusinessName(),
                queueEntry.getQueueNumber(),
                queueEntry.getEstimatedWaitTimeMinutes()
        );

        // Send email notification
        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.QUEUE_JOINED, queueEntry);
        }

        // Send SMS notification (placeholder - would integrate with SMS service)
        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.QUEUE_JOINED, queueEntry);
        }
    }

    /**
     * Send turn approaching notification (15 minutes before)
     */
    @Async
    public void sendTurnApproachingNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Your Turn is Approaching";
        String message = String.format(
                "Your turn at %s (%s) is approaching. You are number %d. Please be ready in approximately 15 minutes.",
                queue.getBusiness().getBusinessName(),
                queue.getQueueName(),
                queueEntry.getQueueNumber()
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.TURN_APPROACHING, queueEntry);
        }

        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.TURN_APPROACHING, queueEntry);
        }

        // Mark notification as sent
        queueEntry.setNotificationSent(true);
    }

    /**
     * Send turn ready notification
     */
    @Async
    public void sendTurnReadyNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Your Turn is Ready!";
        String message = String.format(
                "It's your turn at %s (%s). Please proceed to the service counter. Your number is %d.",
                queue.getBusiness().getBusinessName(),
                queue.getQueueName(),
                queueEntry.getQueueNumber()
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.TURN_READY, queueEntry);
        }

        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.TURN_READY, queueEntry);
        }
    }

    /**
     * Send queue cancellation notification
     */
    @Async
    public void sendQueueCancellationNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Queue Cancelled";
        String message = String.format(
                "The queue for %s at %s has been cancelled. We apologize for any inconvenience.",
                queue.getQueueName(),
                queue.getBusiness().getBusinessName()
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.QUEUE_CANCELLED, queueEntry);
        }

        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.QUEUE_CANCELLED, queueEntry);
        }
    }

    /**
     * Send feedback request notification
     */
    @Async
    public void sendFeedbackRequestNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "How was your experience?";
        String message = String.format(
                "Thank you for visiting %s. Please take a moment to rate your experience and help us improve our service.",
                queue.getBusiness().getBusinessName()
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.FEEDBACK_REQUEST, queueEntry);
        }
    }

    /**
     * Send reminder notification (5 minutes before)
     */
    @Async
    public void sendReminderNotification(QueueEntry queueEntry) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Reminder: Your Turn is Coming Soon";
        String message = String.format(
                "Reminder: Your turn at %s (%s) is in approximately 5 minutes. Number %d.",
                queue.getBusiness().getBusinessName(),
                queue.getQueueName(),
                queueEntry.getQueueNumber()
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.REMINDER, queueEntry);
        }

        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.REMINDER, queueEntry);
        }

        // Mark reminder as sent
        queueEntry.setReminderSent(true);
    }

    /**
     * Send email notification
     */
    private void sendEmailNotification(Customer customer, String title, String message,
                                       NotificationType type, QueueEntry queueEntry) {
        try {
            // Create notification record
            Notification notification = new Notification(
                    customer, type, NotificationChannel.EMAIL, title, message, customer.getEmail()
            );
            notification.setQueueEntry(queueEntry);
            notificationRepository.save(notification);

            // Send email
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setTo(customer.getEmail());
            mailMessage.setSubject(title);
            mailMessage.setText(message);
            mailMessage.setFrom("noreply@commonqueue.com");

            mailSender.send(mailMessage);

            // Mark as sent
            notification.markAsSent();
            notificationRepository.save(notification);

        } catch (Exception e) {
            // Log error and mark notification as failed
            Notification notification = new Notification(
                    customer, type, NotificationChannel.EMAIL, title, message, customer.getEmail()
            );
            notification.setQueueEntry(queueEntry);
            notification.markAsFailed(e.getMessage());
            notificationRepository.save(notification);
        }
    }

    /**
     * Send SMS notification (placeholder implementation)
     */
    private void sendSmsNotification(Customer customer, String title, String message,
                                     NotificationType type, QueueEntry queueEntry) {
        // Create notification record
        Notification notification = new Notification(
                customer, type, NotificationChannel.SMS, title, message, customer.getPhone()
        );
        notification.setQueueEntry(queueEntry);
        notificationRepository.save(notification);

        try {
            // TODO: Integrate with SMS service provider (Twilio, AWS SNS, etc.)
            // For now, just mark as sent
            notification.markAsSent();
            notificationRepository.save(notification);

        } catch (Exception e) {
            notification.markAsFailed(e.getMessage());
            notificationRepository.save(notification);
        }
    }

    /**
     * Process pending notifications (scheduled task)
     */
    public void processPendingNotifications() {
        List<Notification> pendingNotifications = notificationRepository
                .findByStatusOrderByCreatedAtAsc(NotificationStatus.PENDING);

        for (Notification notification : pendingNotifications) {
            try {
                if (notification.getChannel() == NotificationChannel.EMAIL) {
                    resendEmailNotification(notification);
                } else if (notification.getChannel() == NotificationChannel.SMS) {
                    resendSmsNotification(notification);
                }
            } catch (Exception e) {
                notification.markAsFailed(e.getMessage());
                notificationRepository.save(notification);
            }
        }
    }

    /**
     * Retry failed notifications
     */
    public void retryFailedNotifications() {
        List<Notification> failedNotifications = notificationRepository.findFailedNotificationsForRetry();

        for (Notification notification : failedNotifications) {
            notification.incrementRetryCount();
            notification.setStatus(NotificationStatus.PENDING);
            notificationRepository.save(notification);
        }
    }

    /**
     * Send queue delay notification
     */
    @Async
    public void sendQueueDelayNotification(QueueEntry queueEntry, int additionalMinutes) {
        Customer customer = queueEntry.getCustomer();
        Queue queue = queueEntry.getQueue();

        String title = "Queue Delay Notice";
        String message = String.format(
                "There is a delay in the queue at %s (%s). Your estimated wait time has increased by %d minutes. We apologize for the inconvenience.",
                queue.getBusiness().getBusinessName(),
                queue.getQueueName(),
                additionalMinutes
        );

        if (customer.canReceiveEmailNotifications()) {
            sendEmailNotification(customer, title, message, NotificationType.QUEUE_DELAYED, queueEntry);
        }

        if (customer.canReceiveSmsNotifications()) {
            sendSmsNotification(customer, title, message, NotificationType.QUEUE_DELAYED, queueEntry);
        }
    }

    /**
     * Get customer notifications
     */
    public List<Notification> getCustomerNotifications(Long customerId) {
        Customer customer = new Customer();
        customer.setId(customerId);
        return notificationRepository.findByCustomerOrderByCreatedAtDesc(customer);
    }

    /**
     * Mark notification as read
     */
    public void markNotificationAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.markAsRead();
        notificationRepository.save(notification);
    }

    /**
     * Get unread notifications count for customer
     */
    public Long getUnreadNotificationsCount(Long customerId) {
        return notificationRepository.countUnreadNotificationsByCustomerId(customerId);
    }

    /**
     * Send bulk notifications to all customers in queue
     */
    @Async
    public void sendBulkQueueNotification(Long queueId, String title, String message) {
        // This would be used for emergency notifications or general announcements
        // Implementation would fetch all active queue entries and send notifications
    }

    /**
     * Resend email notification
     */
    private void resendEmailNotification(Notification notification) throws Exception {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(notification.getRecipient());
        mailMessage.setSubject(notification.getTitle());
        mailMessage.setText(notification.getMessage());
        mailMessage.setFrom("noreply@commonqueue.com");

        mailSender.send(mailMessage);

        notification.markAsSent();
        notificationRepository.save(notification);
    }

    /**
     * Resend SMS notification
     */
    private void resendSmsNotification(Notification notification) throws Exception {
        // TODO: Implement SMS resend logic
        notification.markAsSent();
        notificationRepository.save(notification);
    }

    /**
     * Clean up old notifications (scheduled task)
     */
    public void cleanupOldNotifications() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);
        List<Notification> oldNotifications = notificationRepository
                .findPendingNotificationsOlderThan(cutoffDate);

        // Mark old pending notifications as cancelled
        for (Notification notification : oldNotifications) {
            notification.setStatus(NotificationStatus.CANCELLED);
        }

        notificationRepository.saveAll(oldNotifications);
    }
}