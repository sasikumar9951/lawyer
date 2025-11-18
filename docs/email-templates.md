# Email Templates Documentation

## Overview

This document contains all email templates for the Legal Consultancy Platform, covering both Twilio WhatsApp notifications and regular email notifications. The templates are designed to handle various scenarios including payment notifications, case assignments, status updates, and meeting notifications.

## Template Categories

### 1. Payment Notifications

### 2. Case Assignment Notifications

### 3. Case Status Update Notifications

### 4. Meeting Notifications

### 5. General Notifications

---

## 1. Payment Notifications

### 1.1 Payment Success Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "payment_success_notification",
  "body": "🎉 Payment Successful!\n\nDear {{1}},\n\nYour payment of ₹{{2}} for {{3}} has been received successfully.\n\nCase ID: {{4}}\nTransaction ID: {{5}}\nDate: {{6}}\n\nOur team will review your case and assign a lawyer within 24-48 hours. You'll receive a notification once assigned.\n\nThank you for choosing our legal services!\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name",
    "2": "amount",
    "3": "service_name",
    "4": "case_id",
    "5": "transaction_id",
    "6": "payment_date"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Payment Successful</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #28a745;">🎉 Payment Successful!</h1>
      </div>

      <p>Dear <strong>{{customer_name}}</strong>,</p>

      <p>
        We're pleased to confirm that your payment has been processed
        successfully.
      </p>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #495057;">Payment Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Amount:</strong> ₹{{amount}}</li>
          <li><strong>Service:</strong> {{service_name}}</li>
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Transaction ID:</strong> {{transaction_id}}</li>
          <li><strong>Date:</strong> {{payment_date}}</li>
        </ul>
      </div>

      <p>
        Our team will review your case and assign a qualified lawyer within
        24-48 hours. You'll receive a notification once your case has been
        assigned.
      </p>

      <p>If you have any questions, please don't hesitate to contact us.</p>

      <p>Thank you for choosing our legal services!</p>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

### 1.2 Payment Failure Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "payment_failure_notification",
  "body": "❌ Payment Failed\n\nDear {{1}},\n\nWe're sorry, but your payment of ₹{{2}} for {{3}} could not be processed.\n\nCase ID: {{4}}\nError: {{5}}\n\nPlease try again or contact our support team for assistance.\n\nYou can retry payment by visiting: {{6}}\n\nIf you continue to experience issues, please call us at {{7}}.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name",
    "2": "amount",
    "3": "service_name",
    "4": "case_id",
    "5": "error_message",
    "6": "retry_url",
    "7": "support_phone"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Payment Failed</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #dc3545;">❌ Payment Failed</h1>
      </div>

      <p>Dear <strong>{{customer_name}}</strong>,</p>

      <p>We're sorry, but your payment could not be processed at this time.</p>

      <div
        style="background-color: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;"
      >
        <h3 style="margin-top: 0; color: #721c24;">Payment Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Amount:</strong> ₹{{amount}}</li>
          <li><strong>Service:</strong> {{service_name}}</li>
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Error:</strong> {{error_message}}</li>
        </ul>
      </div>

      <p>Please try again or contact our support team for assistance.</p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{retry_url}}"
          style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Retry Payment</a
        >
      </div>

      <p>
        If you continue to experience issues, please call us at
        <strong>{{support_phone}}</strong>.
      </p>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 2. Case Assignment Notifications

### 2.1 Lawyer Assignment Notification (Client)

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "lawyer_assigned_client",
  "body": "👨‍💼 Lawyer Assigned!\n\nDear {{1}},\n\nGreat news! We've assigned a qualified lawyer to your case.\n\nCase ID: {{2}}\nService: {{3}}\nLawyer: {{4}}\nExperience: {{5}} years\nSpecialization: {{6}}\n\nYour lawyer will contact you within 24 hours to discuss your case details.\n\nIf you have any questions, please contact our support team.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name",
    "2": "case_id",
    "3": "service_name",
    "4": "lawyer_name",
    "5": "lawyer_experience",
    "6": "lawyer_specialization"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Lawyer Assigned to Your Case</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #28a745;">👨‍💼 Lawyer Assigned!</h1>
      </div>

      <p>Dear <strong>{{customer_name}}</strong>,</p>

      <p>Great news! We've assigned a qualified lawyer to your case.</p>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #495057;">Case Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Service:</strong> {{service_name}}</li>
          <li><strong>Lawyer:</strong> {{lawyer_name}}</li>
          <li><strong>Experience:</strong> {{lawyer_experience}} years</li>
          <li><strong>Specialization:</strong> {{lawyer_specialization}}</li>
        </ul>
      </div>

      <p>
        Your lawyer will contact you within 24 hours to discuss your case
        details and next steps.
      </p>

      <p>If you have any questions, please contact our support team.</p>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

### 2.2 Lawyer Assignment Notification (Lawyer)

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "lawyer_assigned_lawyer",
  "body": "📋 New Case Assignment\n\nDear {{1}},\n\nYou have been assigned a new case.\n\nCase ID: {{2}}\nService: {{3}}\nClient: {{4}}\nClient Phone: {{5}}\nClient Email: {{6}}\n\nPlease review the case details and contact the client within 24 hours.\n\nCase documents are available in your dashboard.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "lawyer_name",
    "2": "case_id",
    "3": "service_name",
    "4": "customer_name",
    "5": "customer_phone",
    "6": "customer_email"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>New Case Assignment</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #007bff;">📋 New Case Assignment</h1>
      </div>

      <p>Dear <strong>{{lawyer_name}}</strong>,</p>

      <p>You have been assigned a new case. Please review the details below:</p>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #495057;">Case Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Service:</strong> {{service_name}}</li>
          <li><strong>Client Name:</strong> {{customer_name}}</li>
          <li><strong>Client Phone:</strong> {{customer_phone}}</li>
          <li><strong>Client Email:</strong> {{customer_email}}</li>
        </ul>
      </div>

      <p>
        <strong>Action Required:</strong> Please contact the client within 24
        hours to discuss the case details.
      </p>

      <p>
        Case documents and additional information are available in your
        dashboard.
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{dashboard_url}}"
          style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >View Case Details</a
        >
      </div>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 3. Case Status Update Notifications

### 3.1 Case Status Update (Client)

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "case_status_update_client",
  "body": "📊 Case Status Update\n\nDear {{1}},\n\nYour case status has been updated.\n\nCase ID: {{2}}\nPrevious Status: {{3}}\nNew Status: {{4}}\nUpdated By: {{5}}\nDate: {{6}}\n\n{{7}}\n\nFor any questions, please contact your assigned lawyer.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name",
    "2": "case_id",
    "3": "previous_status",
    "4": "new_status",
    "5": "updated_by",
    "6": "update_date",
    "7": "status_description"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Case Status Update</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #17a2b8;">📊 Case Status Update</h1>
      </div>

      <p>Dear <strong>{{customer_name}}</strong>,</p>

      <p>Your case status has been updated. Here are the details:</p>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #495057;">Status Update:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Previous Status:</strong> {{previous_status}}</li>
          <li><strong>New Status:</strong> {{new_status}}</li>
          <li><strong>Updated By:</strong> {{updated_by}}</li>
          <li><strong>Date:</strong> {{update_date}}</li>
        </ul>
      </div>

      <div
        style="background-color: #e7f3ff; padding: 15px; border-radius: 8px; margin: 20px 0;"
      >
        <p style="margin: 0;">
          <strong>Description:</strong><br />
          {{status_description}}
        </p>
      </div>

      <p>
        For any questions regarding this update, please contact your assigned
        lawyer.
      </p>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 4. Meeting Notifications

### 4.1 Meeting Scheduled Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "meeting_scheduled_notification",
  "body": "📅 Meeting Scheduled\n\nDear {{1}},\n\nYour legal consultation meeting has been scheduled.\n\nCase ID: {{2}}\nDate: {{3}}\nTime: {{4}}\nDuration: {{5}} minutes\nMeeting Link: {{6}}\n\nPlease join the meeting 5 minutes before the scheduled time.\n\nIf you need to reschedule, please contact us at least 24 hours in advance.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "recipient_name",
    "2": "case_id",
    "3": "meeting_date",
    "4": "meeting_time",
    "5": "duration",
    "6": "meeting_link"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Meeting Scheduled</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #28a745;">📅 Meeting Scheduled</h1>
      </div>

      <p>Dear <strong>{{recipient_name}}</strong>,</p>

      <p>
        Your legal consultation meeting has been scheduled. Here are the
        details:
      </p>

      <div
        style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;"
      >
        <h3 style="margin-top: 0; color: #495057;">Meeting Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Date:</strong> {{meeting_date}}</li>
          <li><strong>Time:</strong> {{meeting_time}}</li>
          <li><strong>Duration:</strong> {{duration}} minutes</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{meeting_link}}"
          style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Join Meeting</a
        >
      </div>

      <p><strong>Important Notes:</strong></p>
      <ul>
        <li>Please join the meeting 5 minutes before the scheduled time</li>
        <li>Ensure you have a stable internet connection</li>
        <li>
          If you need to reschedule, please contact us at least 24 hours in
          advance
        </li>
      </ul>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

### 4.2 Meeting Reminder Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "meeting_reminder_notification",
  "body": "⏰ Meeting Reminder\n\nDear {{1}},\n\nThis is a reminder for your upcoming legal consultation meeting.\n\nCase ID: {{2}}\nDate: {{3}}\nTime: {{4}} (in {{5}} hours)\nMeeting Link: {{6}}\n\nPlease ensure you're ready to join the meeting on time.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "recipient_name",
    "2": "case_id",
    "3": "meeting_date",
    "4": "meeting_time",
    "5": "hours_until_meeting",
    "6": "meeting_link"
  }
}
```

#### Email Template

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Meeting Reminder</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #ffc107;">⏰ Meeting Reminder</h1>
      </div>

      <p>Dear <strong>{{recipient_name}}</strong>,</p>

      <p>
        This is a friendly reminder for your upcoming legal consultation
        meeting.
      </p>

      <div
        style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;"
      >
        <h3 style="margin-top: 0; color: #856404;">Meeting Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>Case ID:</strong> {{case_id}}</li>
          <li><strong>Date:</strong> {{meeting_date}}</li>
          <li><strong>Time:</strong> {{meeting_time}}</li>
          <li><strong>Starts in:</strong> {{hours_until_meeting}} hours</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{meeting_link}}"
          style="background-color: #ffc107; color: #212529; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;"
          >Join Meeting</a
        >
      </div>

      <p>
        Please ensure you're ready to join the meeting on time with a stable
        internet connection.
      </p>

      <div
        style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;"
      >
        <p style="margin: 0;">
          <strong>Best regards,</strong><br />
          Legal Consultancy Team
        </p>
      </div>
    </div>
  </body>
</html>
```

---

## 5. General Notifications

### 5.1 Welcome Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "welcome_notification",
  "body": "👋 Welcome to Legal Consultancy!\n\nDear {{1}},\n\nThank you for choosing our legal services. We're here to help you with your legal needs.\n\nYour account has been created successfully.\n\nIf you have any questions, feel free to contact our support team.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name"
  }
}
```

### 5.2 Case Completion Notification

#### WhatsApp Template (Twilio)

```json
{
  "friendlyName": "case_completion_notification",
  "body": "✅ Case Completed\n\nDear {{1}},\n\nYour case has been successfully completed!\n\nCase ID: {{2}}\nService: {{3}}\nCompletion Date: {{4}}\n\nThank you for choosing our services. We hope we were able to help you effectively.\n\nIf you need any further assistance, please don't hesitate to contact us.\n\nBest regards,\nLegal Consultancy Team",
  "language": "en",
  "category": "UTILITY",
  "variables": {
    "1": "customer_name",
    "2": "case_id",
    "3": "service_name",
    "4": "completion_date"
  }
}
```

---

## Implementation Notes

### Template Variables

All templates use the following variable naming convention:

- `{{1}}`, `{{2}}`, etc. for WhatsApp templates (Twilio requirement)
- `{{variable_name}}` for email templates

### Template Categories

- **UTILITY**: For transactional messages (payments, status updates, etc.)
- **AUTHENTICATION**: For verification messages
- **MARKETING**: For promotional content (not used in this system)

### Template Status

Templates go through the following status flow:

1. **PENDING**: Template submitted for approval
2. **APPROVED**: Template approved by Twilio
3. **REJECTED**: Template rejected by Twilio

### Usage Guidelines

1. **WhatsApp Templates**: Must be pre-approved by Twilio before sending
2. **Email Templates**: Can be sent immediately without approval
3. **Variable Replacement**: All variables must be provided when sending
4. **Language Support**: Currently supports English (en) only
5. **Character Limits**: WhatsApp templates have a 1024 character limit

### Error Handling

- Failed notifications are logged in the database
- Retry mechanisms should be implemented for failed deliveries
- Support team should be notified of persistent failures

### Security Considerations

- Never include sensitive information in templates
- Use secure channels for all communications
- Implement rate limiting to prevent spam
- Validate all template variables before sending

---

## Database Schema Integration

The templates integrate with the existing database schema:

```sql
-- WhatsApp Templates
model WhatsAppTemplate {
  id           String                 @id @default(cuid())
  twilioSid    String                 @unique
  friendlyName String
  category     String
  language     String
  body         String
  status       WhatsAppTemplateStatus @default(PENDING)
  isActive     Boolean                @default(false)
  createdAt    DateTime               @default(now())
  updatedAt    DateTime               @updatedAt
  notifications WhatsAppNotification[]
}

-- WhatsApp Notifications
model WhatsAppNotification {
  id          String   @id @default(cuid())
  recipientPhone    String
  recipientType     RecipientType
  messageType       MessageType
  templateName      String?
  messageContent    String
  status            NotificationStatus @default(PENDING)
  twilioMessageSid  String?
  deliveredAt       DateTime?
  failedAt          DateTime?
  errorMessage      String?
  templateId        String?
  template          WhatsAppTemplate? @relation(fields: [templateId], references: [id], onDelete: SetNull)
  caseId            String?
  case              Case? @relation(fields: [caseId], references: [id], onDelete: Cascade)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

This comprehensive template system ensures consistent, professional communication across all touchpoints in the legal consultancy platform.
