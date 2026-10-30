---
title: "GA4 Lead Conversion Tracking with GTM: Measure Successful Form Submissions"
date: 2026-10-30 21:46:00 +0800
lang: en
description: "Track successful inquiry form submissions with GTM and GA4: dataLayer events, generate_lead tags, key events, DebugView tests, and conversion reports."
translation_url: /blog/ga4-gtm-lead-tracking/
---

For websites focused on generating customer inquiries, knowing how many people viewed a page is not enough. More useful questions are: **How many visitors successfully submitted an inquiry? Which channels brought them to the website?**

This tutorial explains how to use Google Analytics 4 (GA4) and Google Tag Manager (GTM) to track successfully submitted inquiries and analyze the results in GA4 reports.

## 1. Understand the Tracking Flow

A reliable inquiry conversion tracking setup usually follows these steps:

1. A visitor completes and submits an inquiry form.
2. The website's server confirms that the submission was successful.
3. The website pushes a success event to the GTM data layer.
4. GTM sends a `generate_lead` event to GA4.
5. GA4 records `generate_lead` as a key event.

**The key distinction: clicking the Submit button does not necessarily mean the inquiry succeeded.** If form validation fails, a network error occurs, or the server rejects the request, the attempted submission should not be counted as a successful inquiry.

This tutorial uses the GA4 recommended event name `generate_lead` to represent a successfully acquired lead.

## 2. Prerequisites

Before you begin, make sure that:

- You have created a GA4 property and web data stream.
- You have the GA4 Measurement ID, which starts with `G-`.
- You have created a GTM web container and installed its code on your website.
- You have configured a base Google tag or Google Analytics tag in GTM.
- You can edit and publish your GTM container and manage GA4 events.

You can use GTM's Preview mode to verify that the base tag loads correctly. If GA4 has not yet been set up, finish the basic integration before configuring inquiry conversions.

## 3. Send an Event Only After a Successful Inquiry

The most reliable approach is to have the website push a custom event to the data layer **after the website has confirmed that the server processed the inquiry successfully**.

For example, add this code to the success branch of your form submission logic:

```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'inquiry_success'
});
```

Place this code where the website has already confirmed a successful submission. The exact location depends on how your form works, so you may need help from a developer.

Do not include names, email addresses, phone numbers, inquiry messages, or other personal information in the event. If you only need to count successful submissions, the event name alone is enough.

### If You Cannot Change the Website Code Yet

Some websites display a success message with a stable identifier after a form has been submitted. A developer can assess whether GTM can detect this state and then fire a custom event.

This approach depends on the page's structure. Tracking can break if the success message's identifier or styling changes. If you use GTM's Element Visibility trigger, also consider whether the message must enter the visitor's visible viewport before the trigger fires. Whichever approach you choose, verify it using a real submission flow.

## 4. Create a Custom Event Trigger in GTM

The following steps assume that the website pushes the custom event `inquiry_success` after a successful submission.

1. Open [Google Tag Manager](https://tagmanager.google.com/).
2. Select your website's container and open the **Workspace**.
3. Select **Triggers** in the left sidebar, then click **New**.
4. Give the trigger a descriptive name, such as:

   ```text
   Inquiry Success — Custom Event
   ```

5. Click **Trigger Configuration**.
6. Choose **Custom Event**.
7. Enter this event name:

   ```text
   inquiry_success
   ```

8. Save the trigger.

The event name must match the `event` value pushed by your website to the data layer exactly.

## 5. Create a GA4 Event Tag in GTM

1. In your GTM Workspace, select **Tags** and click **New**.
2. Name the tag, for example:

   ```text
   GA4 — Inquiry Success generate_lead
   ```

3. Open **Tag Configuration**.
4. Select **Google Analytics: GA4 Event**.
5. Enter your web data stream's Measurement ID:

   ```text
   G-XXXXXXXXXX
   ```

6. Set the event name to:

   ```text
   generate_lead
   ```

7. Under **Triggering**, select the **Inquiry Success — Custom Event** trigger you just created.
8. Save the tag.

`inquiry_success` is the internal event GTM uses to recognize a successful submission. `generate_lead` is the event ultimately sent to GA4. The two names can differ, but each must match its corresponding configuration.

## 6. Mark the Event as a Key Event in GA4

GA4 uses **key events** to identify user actions that are important to your business.

1. Open [Google Analytics](https://analytics.google.com/).
2. Select the relevant GA4 property.
3. Go to **Admin → Data display → Events**.
4. If `generate_lead` already appears in the event list, mark it as a **key event**.
5. If the event is not listed yet, use the available event creation controls and follow the interface instructions to register the code-sent `generate_lead` as a key event in advance.

If you do not have a verified monetary value for an inquiry, avoid assigning an arbitrary default value. Depending on your business needs, you can choose to count every successful inquiry or count no more than one per session.

Google may update its interface labels over time. Follow the labels shown in the current interface.

## 7. Test Before Publishing

### 7.1 Start GTM Preview Mode

1. Return to your GTM Workspace.
2. Click **Preview** in the upper-right corner.
3. Enter the URL of your website's inquiry page and connect.
4. Your website opens in a new tab, and Tag Assistant shows the connection status.

GTM Preview mode lets you test workspace changes before publishing and see when tags fire. [Google: Preview and debug containers](https://support.google.com/tagmanager/answer/6107056?hl=en)

### 7.2 Submit a Test Inquiry

Complete and submit the form normally on the preview page. Clearly label the message **“Test inquiry — please ignore.”**

Test inquiries usually enter the real business workflow, so notify the people responsible for handling inquiries beforehand.

### 7.3 Check Tag Assistant

After a successful submission, return to Tag Assistant:

1. Find `inquiry_success` in the event timeline.
2. Select the event and verify that the GA4 inquiry tag fired successfully.
3. Inspect the outgoing hit and confirm the event name is `generate_lead`.
4. Check that the destination Measurement ID is correct.
5. Confirm that one successful submission fires the event only once.

Also test failure cases. For example, a form that fails validation must not trigger the successful inquiry event.

### 7.4 Check GA4 DebugView

1. In GA4, go to **Admin → Data display → DebugView**.
2. Select the corresponding debug device.
3. Look for `generate_lead` in the event timeline.

If Tag Assistant shows that the tag fired but the event does not appear in DebugView immediately, check the debug connection, Measurement ID, browser blockers, and your website's privacy and consent settings. [Google: Monitor events in DebugView](https://support.google.com/analytics/answer/7201382?hl=en)

## 8. Publish the GTM Container

Once the tests pass:

1. Return to the GTM Workspace and click **Submit**.
2. Review all changes included in the release.
3. Add a version name and description, such as:

   ```text
   Version name: GA4 Successful Inquiry Conversion
   Version description: Send generate_lead after a successful inquiry; verified in Preview mode.
   ```

4. Choose **Publish and Create Version**.
5. Click **Publish**.
6. Open **Versions** and confirm that the new version is marked as published.

Before publishing, check for unfinished changes made by other team members in the same workspace. Submitting a version publishes the changes included in that version.

## 9. View Inquiry Conversion Data

### View Real-Time Events

1. Open GA4.
2. Go to **Reports → Realtime overview**.
3. Look for `generate_lead` in the event list by event name.

Realtime reports are useful for confirming that recent events were received. DebugView is better for examining individual events from a debug device. [Google: View key event reports](https://support.google.com/analytics/answer/12571843?hl=en)

### Analyze Long-Term Trends and Traffic Sources

In GA4 reports, select a date range and analyze metrics and dimensions such as:

- `generate_lead` event counts and key event counts;
- Traffic channels such as organic search, direct, and social;
- Source / medium;
- Pages visitors viewed;
- The number of key events attributed to each channel.

Remember: **a successfully submitted inquiry is not a completed sale.** Repeat submissions, test messages, and spam inquiries can also be counted. Use your business or CRM system to assess actual lead quality.

## 10. Frequently Asked Questions

### The Form Was Submitted. Why Is There No Conversion?

Check the following in order:

1. Did the website confirm that the server processed the submission successfully?
2. Did the website push the agreed data layer event after success?
3. Does the GTM Custom Event trigger name exactly match the event pushed by the website?
4. Is the GA4 Event tag connected to the correct trigger?
5. Is the Measurement ID in the tag correct?
6. Has the latest GTM container version been published?
7. Could browser extensions, network conditions, or privacy settings be preventing the tag from running?

### Why Is One Inquiry Counted Twice?

Possible causes include the website pushing the success event more than once, duplicate GA4 Event tags, or multiple triggers sending the same `generate_lead` event. Use Tag Assistant to inspect the event timeline, fired tags, and the number of outgoing hits.

### Why Not Use a Generic “Form Submission” Trigger as a Successful Inquiry?

A form submission event may simply indicate that a visitor attempted to submit the form, before the server has confirmed success. Using a success signal after server confirmation more accurately separates successful submissions from failed attempts.

### Should Tracking Be Rechecked After a Website Redesign?

Yes. In particular, rerun the full test when the form submission logic, success message, data layer event, or GTM container changes. If your tracking relies on specific page elements or CSS selectors, structural changes to the page can also break the trigger.
