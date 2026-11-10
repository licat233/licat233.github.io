---
title: "Overseas B2B Social Media Operations Infrastructure: A Practical Guide"
date: 2026-11-10 12:00:00 +0800
lang: en
description: "A practical guide for export manufacturers and B2B teams covering brand and sales account ownership, devices, networks, publishing workflows, overseas phone numbers, platform permissions, security, recovery, and team setup."
translation_url: /blog/overseas-b2b-social-media-infrastructure-guide/
---

> **Audience:** Export manufacturers, international sales teams, and B2B marketing teams  
> **Platforms:** LinkedIn, Facebook, Instagram, YouTube, TikTok, WhatsApp, and related services  
> **Goal:** Build a stable, simple, low-maintenance, transferable, and company-controlled operating environment for official brand accounts and individual Sales profiles.  
> **Scope:** This is a general enterprise guide, not a description of any particular company’s setup. The mobile-operator comparisons in Section 6 are a research snapshot dated **2026-08-18**. Recheck current operator terms, the exact plan, local law, and real-world service before purchasing.

## Quick Index

1. Infrastructure Goals and Overall Architecture
2. Brand Environment
3. Sales Environment
4. Network and IP
5. Content and Publishing Workflow
6. Corporate Overseas SIMs and Phone Numbers
7. Platform Account Structure
8. Identity, Security, and Recovery
9. Example Enterprise Configuration
10. Frequently Asked Questions
11. Implementation Principles
12. The Desired End State

## 1. Infrastructure Goals and Overall Architecture

### What should this infrastructure solve?

Overseas B2B social media operations involve much more than registering a few accounts and publishing posts.

Over time, the following become valuable company digital assets:

- LinkedIn Company Pages;
- Facebook Pages;
- Instagram brand accounts;
- YouTube channels;
- TikTok brand accounts;
- Sales employees’ LinkedIn Personal Profiles;
- Business WhatsApp numbers;
- Corporate email accounts;
- Customer conversations and relationship history;
- Content, creative assets, and source files;
- Login credentials;
- Two-factor authentication (2FA);
- Recovery codes;
- Platform permissions and business portfolios;
- Account ownership and recovery records.

Without an operating model, companies often end up with:

- Brand accounts scattered across employees’ personal computers;
- Different employees using unrelated VPNs and country endpoints;
- Shared passwords for official accounts;
- Unclear rules about whether Sales should work on a computer or phone;
- Every employee being asked to configure proxies, fingerprint browsers, and complicated network environments;
- Account and customer handover problems when employees leave;
- No reliable recovery route when an overseas SIM stops working;
- No clear record of which accounts, numbers, devices, and permissions belong to the company.

The goal is not to make social media operations more complicated. It is to reduce unnecessary configuration while keeping networks stable, accounts secure, company assets controllable, and employee handovers manageable.

### Brand Environment and Sales Environment are two separate systems

The operating model has two layers.

#### A. Brand Environment — official brand operations

This layer manages official company assets:

- LinkedIn Company Page;
- Facebook Page;
- Instagram Brand Account;
- YouTube Channel;
- TikTok Brand Account;
- Meta Business Portfolio;
- Brand content and source assets;
- Account security and administrator permissions.

Core principle:

> **Centralize ownership and administration of brand assets.**

#### B. Sales Environment — individual customer development

This layer supports each Sales employee’s real business identity:

- LinkedIn Personal Profile;
- Corporate email;
- CRM;
- WhatsApp;
- Customer research;
- Customer conversations;
- Professional content published under the employee’s own name.

Core principle:

> **Each Sales employee uses their real identity and a consistent work setup.**

In one sentence:

> **Manage official brand accounts centrally; let Sales employees operate their own personal profiles. Keep the content strategy coordinated, but separate the publishing environments.**

### How many official brand accounts does each platform need?

For a company operating one primary B2B brand, the default is straightforward:

> **Usually maintain one official brand account per platform.**

| Platform | Typical official brand asset |
| --- | --- |
| LinkedIn | One Company Page |
| Facebook | One Page |
| Instagram | One Brand Account |
| YouTube | One Channel |
| TikTok | One Brand Account |
| WhatsApp | One main company number, plus Sales numbers where needed |

Avoid creating a collection of nearly identical accounts such as:

~~~text
Instagram
├── Main Brand
├── Product Brand A
├── Product Brand B
├── Regional Brand
└── Campaign Account
~~~

Separate accounts make sense when there is a genuinely independent brand, a separate country entity, a materially different business line, or a dedicated team that can maintain the account.

Otherwise, extra accounts tend to:

- Split the audience;
- Fragment content and engagement;
- Increase the number of passwords and permissions;
- Raise operating costs;
- Make ownership and handover harder.

---

## 2. Brand Environment

### How should official brand accounts be managed?

Set up a dedicated **Brand Publishing Workstation**: a company-controlled computer used for official brand operations.

It is not a shared computer for every social account in the company. Its scope is the official brand accounts.

### What does the Brand Publishing Workstation do?

Typical responsibilities include:

- LinkedIn Company Page;
- Facebook Page;
- Instagram Brand Account;
- YouTube;
- TikTok Brand Account;
- Meta Business Portfolio;
- Official brand publishing;
- Brand asset and source-file management;
- Company account security settings;
- Business administrator and permission management.

### Why use a dedicated computer?

If official brand accounts are routinely accessed from a changing mix of devices—

~~~text
Marketing manager’s computer
        ↓
Sales employee A’s computer
        ↓
Owner’s computer
        ↓
Sales employee B’s computer
        ↓
Temporary VPN or hotspot
~~~

—device history, browser sessions, cookies, network changes, passwords, and 2FA records become harder to manage. Troubleshooting and employee handovers also become less predictable.

A simpler arrangement is:

~~~text
Brand Publishing Workstation

Company-controlled computer
+
Consistent browser
+
Dedicated browser profile
+
Stable company network
+
Authorized operators
~~~

### Basic workstation requirements

Performance requirements are modest. An unused Mac mini, MacBook, or ordinary Windows office computer may be sufficient.

The important qualities are that the device is:

- Consistent;
- Dedicated to the task;
- Stable and maintained;
- Owned or controlled by the company.

Useful software and services include:

- Chrome, Edge, or Safari;
- A corporate password manager;
- Corporate email;
- Company cloud storage or a shared asset library;
- Canva, Figma, or other approved content tools;
- Necessary social media management tools;
- Documented network settings;
- 2FA and recovery-material management.

### Windows or macOS?

Both are suitable. The important factors are not the operating system itself, but device consistency, browser consistency, profile separation, network reliability, and controlled access.

The workstation mainly handles browser-based administration, publishing, Meta Business Portfolio, LinkedIn Company Page, YouTube Studio, TikTok and Instagram brand management, email, password management, asset uploads, and permissions. It does not need to be a high-performance workstation.

Choose the operating system that fits the company’s existing IT environment:

- If the company mainly uses macOS and can manage a dedicated Mac easily, reuse a supported Mac mini, MacBook Air, or existing Mac.
- If the company already has centralized Windows management, Windows 11 Pro is equally reasonable.
- If only one or a few brand workstations are needed, focus on a dedicated system user, a fixed browser profile, a corporate password manager, and appropriate security controls.

If the company later has a mature Windows environment—with Microsoft Entra or Active Directory, BitLocker, MDM, centralized software deployment, and IT support—Windows is a natural choice.

> macOS and Windows are both valid. Choose based on the company’s IT management model, not on claims about social-platform risk controls.

### The Brand Environment should not be only one computer

A complete Brand Environment is better treated as two fixed devices:

~~~text
Brand Environment
│
├── Brand Publishing Workstation
│
└── Brand Social Phone
~~~

Their responsibilities are different.

#### Brand Publishing Workstation

The primary working environment for:

- Content editing and publishing;
- Business administration;
- Meta Business Portfolio;
- LinkedIn Company Page;
- YouTube Studio;
- File and asset management;
- Permission management;
- Official account security.

#### Brand Social Phone

A company-controlled mobile device for:

- Official social media apps;
- The company’s overseas SIM;
- SMS verification;
- Login approvals;
- Authenticator apps;
- Passkeys;
- Mobile-only platform functions;
- Emergency recovery;
- Necessary mobile publishing and review.

The workstation is the main production and administration environment. The phone provides mobile capabilities and a second access path.

### Is a Brand Social Phone necessary?

For a company that depends on several official social accounts, one dedicated phone is recommended.

It should be treated as company infrastructure, not as an employee’s personal phone that happens to receive verification messages.

~~~text
Brand Social Phone

Fixed company-owned phone
+
Company-controlled overseas SIM
+
Official social apps
+
Authenticator
+
Password manager
+
Named authorized operator
~~~

This avoids situations where a SIM is moved from the owner’s phone to a marketing employee’s phone, then to another employee’s phone, leaving nobody certain where the number or recovery device is.

The Brand Social Phone can install and use LinkedIn, Facebook, Meta Business Suite, Instagram, TikTok, YouTube, an authenticator, and the company password manager.

It should remain a stable, low-change brand device—not a phone that constantly switches between unrelated networks, locations, and operators.

### Location permissions and device integrity

Apply the principle of least privilege. Disable unnecessary precise or background location access for apps that do not need it.

The purpose is privacy and limiting unnecessary data exposure, not falsifying a user’s location or bypassing platform security.

Do not use:

- GPS spoofing;
- Fake-location utilities;
- Constantly changing VPN countries;
- Device-parameter manipulation intended to disguise an account.

Recommended device baseline:

| Item | Standard |
| --- | --- |
| Ownership | Company asset |
| Operating system | Original iOS or Android |
| Root / jailbreak | Do not use |
| Bootloader | Keep locked |
| Custom ROM | Do not use |
| GPS spoofing / mock location | Do not use |
| App source | Official App Store / Google Play |
| System updates | Keep security updates current |
| Screen lock | Strong passcode plus biometrics |
| Device encryption | Enabled |
| Personal use | Avoid where practical |
| Social apps | Install and use normally |
| Location permissions | Minimum required permissions |

The objective is to reduce unnecessary variables and keep the device in a normal, explainable, recoverable state.

### Does the Brand Environment need a fingerprint browser?

**Not by default.**

For one brand with one official account per platform, a normal browser is sufficient:

~~~text
Fixed computer
+
Normal Chrome / Edge / Safari
+
Consistent browser profile
+
Persistent legitimate sessions
+
Stable company network
~~~

Tools such as AdsPower, Hubstudio, and BitBrowser should not be part of the standard setup merely because a company is operating overseas social accounts.

Consider browser-profile isolation only when there is a real requirement, such as multiple independent brands on the same machine, genuinely separate account environments, controlled test accounts, or distinct country teams.

> A fingerprint browser is an optional tool for specific isolation requirements, not a default social media requirement.

---

## 3. Sales Environment

### How should Sales workstations be configured?

Sales operations are different from official brand administration.

If an employee uses one real identity and one LinkedIn Personal Profile, there is no need to turn the employee’s everyday workflow into a complicated account-environment project.

A practical setup is:

~~~text
Sales

Consistent work computer
+
Normal browser
+
One fixed browser profile per person
+
Company-approved overseas network
+
Consistent work phone
+
Real LinkedIn profile
+
Corporate email
+
CRM
+
WhatsApp
~~~

### Standard Sales configuration

| Item | Recommendation |
| --- | --- |
| Work computer | Company-issued or consistently assigned |
| Browser | Chrome / Edge / Safari |
| Browser profile | One stable profile per employee |
| LinkedIn | Employee’s real Personal Profile |
| Corporate email | One account per employee |
| CRM | Company-managed system |
| Work phone | Consistent device per employee |
| WhatsApp | Business number assigned to the employee’s role |
| 2FA | Enabled |
| Network | Stable, company-approved egress |
| Individual residential IP | Not required by default |
| Fingerprint browser | Not required by default |

### Does Sales need a fingerprint browser?

**Not by default.**

If each Sales employee has:

- One real person;
- One LinkedIn account;
- One consistent computer;
- One consistent phone;
- One genuine company identity;

then normal platform usage is the simplest approach.

Requiring every employee to use AdsPower or a similar product can introduce:

- Training overhead;
- Proxy configuration errors;
- Lost browser profiles;
- More difficult network troubleshooting;
- Extra work when replacing a computer;
- Unnecessary IT maintenance.

> If there is no genuine account-isolation requirement, do not add an isolation tool.

### Should Sales use a computer or a phone?

Use both, with the computer as the main work environment and the phone as a companion.

**The work computer is primarily for:**

- LinkedIn prospecting;
- Publishing personal LinkedIn updates;
- Sales Navigator;
- Customer research;
- Company research;
- Comments and direct messages;
- Email;
- CRM;
- Content editing.

**The work phone is primarily for:**

- LinkedIn app;
- WhatsApp;
- Message notifications;
- Quick replies;
- Mobile engagement;
- Login approvals;
- 2FA.

### Where should Sales publish LinkedIn updates?

Do not use the Brand Publishing Workstation to publish employees’ personal content.

A clean arrangement is:

~~~text
Brand
  ↓
Brand Publishing Workstation
  ↓
LinkedIn Company Page


Sales A
  ↓
Sales A’s own work computer / work phone
  ↓
Sales A’s LinkedIn Personal Profile


Sales B
  ↓
Sales B’s own work computer / work phone
  ↓
Sales B’s LinkedIn Personal Profile
~~~

A Personal Profile represents a real individual. Centralizing every Sales employee’s personal LinkedIn account on the brand computer is unnecessary and makes account ownership and handover more complicated.

> The brand workstation manages official brand accounts. Sales employees publish their own personal content from their own assigned work devices.

---

## 4. Network and IP

### How should the Brand account network be configured?

The Brand Publishing Workstation should use a stable, transparent, company-managed network endpoint.

The objective is not to make the account appear to be in a particular country. It is to avoid unnecessary changes and make the operating environment predictable.

Prioritize a network service with:

- Clear ownership and service terms;
- A stable endpoint;
- Reliable connectivity;
- Documented maintenance;
- A support and recovery process;
- Compliance with local law and platform rules.

A specific country or residential IP is not a universal requirement. Whether an ISP or residential service is appropriate depends on a genuine business need, the provider’s terms, and applicable law.

The important principle is:

> Choose a legitimate, reliable endpoint and keep it consistent.

Avoid unnecessary changes such as moving between the United States, the United Kingdom, Hong Kong, and Japan every few days.

### How should the Sales team choose a shared network endpoint?

A fixed corporate egress can be considered when it is appropriate for the company’s location and business requirements.

For teams operating from mainland China, Hong Kong may be worth evaluating when the route, local compliance requirements, service reachability, and maintenance model make it suitable. It is not a default answer for every company or every location.

Evaluate:

- Network quality and latency between the actual office and the endpoint;
- Whether the target platforms and SaaS services are reachable;
- Local laws, regulatory requirements, and network compliance;
- Whether the IP is stable and its source is transparent;
- Provider reliability and support;
- Backup connectivity and fault handling.

Example:

~~~text
Company Office
        ↓
Company-approved fixed network endpoint
        ↓
Sales 1
Sales 2
Sales 3
…
~~~

The endpoint’s region should be chosen after evaluating the actual office, compliance requirements, route quality, platform accessibility, and maintenance capacity.

### Does each Sales employee need an individual IP?

**Usually not.**

If several Sales employees are real colleagues working for the same company at the same office, sharing a corporate public IP is a normal network arrangement when permitted by company policy, local law, and platform rules.

~~~text
Company network endpoint
        │
        ├── Sales 1
        ├── Sales 2
        ├── Sales 3
        └── …
~~~

There is no default need for:

~~~text
Sales 1 → Individual residential IP 01
Sales 2 → Individual residential IP 02
Sales 3 → Individual residential IP 03
…
~~~

Separate endpoints add cost, proxy maintenance, failure points, and employee complexity. Use isolation only when a real business, security, or compliance requirement justifies it.

### Must Brand and Sales use IP addresses in the same country?

No.

For example:

~~~text
Brand → approved corporate endpoint A

Sales → approved corporate endpoint B
~~~

There is no inherent conflict. A company may have a headquarters in one country, a separate network endpoint, a marketing team in another country, and remote employees elsewhere.

The important point is that each account’s own usage environment remains stable—not that every account in the company must originate from one country.

### What network behavior is unreasonable?

For example:

~~~text
Sales A

Monday    → Region A
Tuesday   → United States
Wednesday → Japan
Thursday  → Taiwan
Friday    → United States
~~~

Frequent changes without a business reason add complexity and make account activity harder to explain.

A better approach is to select a suitable region and keep it consistent.

### Must the computer and phone have exactly the same IP?

No.

A genuine employee may use the office network on a computer and mobile data on a phone. Different IP addresses do not automatically indicate a problem.

For a fixed Brand Environment, connecting the phone to the company Wi-Fi is often simpler because it reduces unnecessary network changes and makes troubleshooting easier.

The goal is stability, not forcing two devices to imitate one another.

### Recommended network architecture

~~~text
                 Company Office / Headquarters
                              │
              ┌───────────────┴────────────────┐
              │                                │
              ▼                                ▼
     Brand Environment                    Sales Team
              │                                │
       ┌──────┴──────┐                    Sales A / B / C
       │             │                         │
       ▼             ▼                         ▼
 Brand Workstation  Brand Phone          Sales Work Devices
       │             │                         │
       └──────┬──────┘                         │
              ▼                                ▼
      Brand endpoint A                 Sales endpoint B
~~~

### Can a VPS-based VPN be used?

Yes, where it is appropriate and compliant.

A VPS-based corporate gateway can be useful for:

- Google Workspace;
- Overseas SaaS;
- CRM;
- Internal company services;
- A company-managed network endpoint.

For example:

~~~text
Company Office
      ↓
WireGuard
      ↓
VPS in an evaluated region
      ↓
Fixed public IP
      ↓
Sales Team
~~~

The VPS should have a stable endpoint, a documented region, reliable operation, and a clear maintenance owner.

Avoid opaque shared proxy services with many users, rotating endpoints, and constant country changes. The main problem is not simply that an IP is not residential; it is that the environment is unstable and difficult to manage.

### The proper role of residential IPs

Residential IPs are not a default requirement for company social media operations and should not be treated as a way to reduce platform risk.

Only evaluate a specific ISP or residential service when there is a genuine, lawful business requirement and the provider’s terms allow it. Most companies should begin with a stable, transparent, maintainable corporate endpoint.

---

## 5. Content and Publishing Workflow

### Content production can be centralized, but publishing should remain separate

A company can create a shared **Sales Content Pack**.

The marketing team can provide each week:

- Topics;
- Product images;
- Customer pain points;
- Industry data;
- Core viewpoints;
- Copy frameworks;
- Calls to action (CTAs);
- Hashtags.

The material is then adapted for two different purposes.

#### Brand Content

Focus on:

- Company capabilities;
- Products and services;
- Integrated solutions;
- Technology;
- Engineering capability;
- Brand viewpoints.

Publish through the Brand Publishing Workstation and official brand accounts.

#### Sales Content

Focus on:

- Individual experience;
- Customer problems;
- Project observations;
- Industry opinions;
- Insights from customer conversations.

Publish through the Sales employee’s own Personal Profile.

### Do not ask every Sales employee to copy the same post

Suppose the shared topic is a configurable product or service.

The brand account might explain how the solution helps customers simplify installation, expansion, or maintenance.

Sales A might discuss a recurring problem customers face when upgrading equipment and changing wiring.

Sales B might explain why equipment manufacturers are paying more attention to compatibility, expandability, and maintenance.

Sales C might share a common installation or maintenance question from recent customer inquiries.

The result should be:

~~~text
One shared topic

        ↓

Brand Authority
        +
Sales Human Expertise
~~~

It should not be five employees publishing the exact same advertisement on the same day.

### Brand publishing workflow

A practical workflow is:

~~~text
Topic
  ↓
Research
  ↓
Copy
  ↓
Visual
  ↓
Review
  ↓
Publish
  ↓
Measure
~~~

The operating structure can be summarized as:

~~~text
Marketing Content Hub
        │
        ├── Brand Content
        │       ↓
        │  Brand Publishing Workstation
        │       ↓
        │  Official Brand Accounts
        │
        └── Sales Content Pack
                ↓
             Sales Employees
                ↓
             Personal Profiles
~~~

The content strategy is coordinated, but the voice, account ownership, and publishing environment remain distinct.

## 6. Corporate Overseas SIMs and Phone Numbers

> **Scope of this chapter:** The operator examples focus mainly on businesses operating from mainland China and compare Hong Kong, UK, US, and German products. Companies elsewhere should rebuild the candidate list around their actual operating location, local registration rules, roaming policies, number validity, and recovery options.
>
> **Policy date:** The operator comparison is a research snapshot dated **2026-08-18**. This article is published on **2026-11-10**; the dates are different. Operator terms, roaming partners, number-validity rules, identity checks, and OTP support can change. Verify the exact plan and current official terms before purchasing, then test the SIM in the real operating location.

### Why does the phone number matter?

An overseas phone number should not be purchased simply by asking which country is cheapest or which card can receive a verification code.

Once a number is linked to LinkedIn, Meta, Google, TikTok, WhatsApp, Microsoft, corporate email, important SaaS services, 2FA, or account recovery, it becomes part of the company’s digital identity infrastructure.

The purchasing process should therefore be:

~~~text
Define the number’s role
        ↓
Identify the product type
        ↓
Apply hard rejection criteria
        ↓
Check official operator policies
        ↓
Compare long-term ownership and recovery
        ↓
Test a real SIM
        ↓
Bind core accounts gradually
        ↓
Create renewal and disaster-recovery procedures
~~~

This chapter is not a permanent ranking of overseas SIM cards. Operator policies change, and even a recent third-party guide can become outdated. It provides a selection method and a dated candidate snapshot.

### Separate the different number roles

Do not treat every overseas number as interchangeable.

| Number role | Main purpose | Stability requirement | Can a low-cost travel eSIM replace it? |
| --- | --- | --- | --- |
| Brand Core Number | Core verification, recovery, and corporate digital identity | Highest | Not recommended |
| Backup Recovery Number | Secondary recovery route for important accounts | High | Depends on the product |
| Brand Public / WhatsApp Number | Public contact details and customer communication | High | Usually not recommended |
| Sales Business Number | Sales WhatsApp and customer development | Medium–high | Depends on business needs |
| Travel Data eSIM | Short-term data access while travelling | Normal | Yes, if data-only service is sufficient |

The Brand Core Number should not be selected because it is the cheapest, looks most local, or is easiest to buy for a one-time OTP.

It should be selected for:

- Long-term ownership;
- Ongoing usability from the company’s actual operating location;
- Reliable inbound SMS;
- Clear rules;
- Remote top-up;
- A recoverable account;
- SIM replacement or eSIM reissue;
- Ideally, number portability;
- No dependence on a temporary travel app.

### Understand the different types of overseas SIM products

Products marketed as overseas SIMs, eSIMs, or international phone numbers can be very different.

#### A. Native mobile number with a physical SIM

This is a traditional operator or MVNO prepaid / PAYG SIM.

It commonly provides:

- A real mobile number;
- Mobile network registration;
- SMS;
- Voice;
- Roaming;
- An ICCID;
- A physical SIM;
- In some cases, number portability.

This is the most familiar form of a long-term corporate number.

#### B. Native mobile number with a carrier eSIM

An eSIM is not automatically a virtual number.

If it is issued by a legitimate mobile operator or MVNO and provides a real mobile number, SMS, voice, roaming, an operator account, and an eSIM replacement process, its main difference from a physical SIM is how the SIM credentials are stored.

A physical SIM is not automatically more reliable than an eSIM. Compare:

- Whether the number is a real mobile number;
- Whether the operator is reliable;
- How to reissue the eSIM after device loss;
- How easily the number can be moved to another phone;
- Whether identity verification can be completed again;
- Whether the company can recover the operator account.

#### C. Long-term PAYG / prepaid numbers

These numbers are maintained through actions such as:

- Periodic top-up;
- A chargeable usage event;
- Purchasing a service pack;
- Maintaining a balance, where the operator’s terms allow it.

The advantage is cost control and the absence of a long contract.

The main risk is the inactivity and expiry policy. One operator may require activity every 90 days, another every 180 days, and another may require a minimum amount of chargeable usage.

Do not assume that a positive balance keeps a number active forever. Also do not assume that receiving an SMS counts as qualifying activity.

The most important question is:

> What exact action keeps this number active, and how often must the company perform it?

#### D. Monthly or annual mobile plans

These plans charge a recurring monthly or annual fee.

They can be easier to manage because the company does not need to remember whether a message or chargeable call was made during a long inactivity window.

Advantages:

- Simpler rules;
- Automatic renewal;
- Easier status tracking;
- Suitable for core assets.

Disadvantages:

- Higher annual cost;
- Payment-card failure can interrupt service;
- Some countries require a local address, payment method, or identity check.

For a core company number, paying somewhat more for a simpler maintenance model can be worthwhile.

#### E. Travel eSIM with a phone-number add-on

Some travel eSIM products combine global data with an additional mobile phone number.

For example, Saily’s 2026 product offering included a US wireless phone-number add-on with SMS and voice.

Do not automatically treat this as equivalent to a conventional long-term carrier number. Confirm:

- Which platforms’ OTP messages are supported;
- Whether short codes are supported;
- Whether number portability is available;
- What happens if the number or subscription is cancelled;
- KYC requirements;
- Long-term subscription rules;
- Whether the number can be retained;
- What happens if the service is discontinued.

Until key platform compatibility and recovery have been tested, this type of service is better treated as a backup or special-purpose candidate than as the only Brand Core Number.

#### F. Data-only travel eSIM

Many travel eSIMs provide only mobile data.

They do not provide:

- A phone number;
- SMS;
- Voice.

They are suitable for travel connectivity, not for corporate identity, SMS verification, or account recovery.

Seeing the word “eSIM” on a product page does not mean the product can receive verification messages.

Always confirm:

> Does it include a real mobile phone number with inbound SMS?

#### G. VoIP, temporary numbers, and rented numbers

Do not use the following as the only number for core corporate accounts:

- Public SMS-receiving websites;
- Temporary numbers;
- Rented numbers;
- Shared numbers;
- VoIP numbers without demonstrable long-term control;
- Numbers that cannot be replaced, ported, or clearly assigned to the company.

The issue is not simply whether a verification code can arrive today. The company must be able to control the same number several years from now.

### Apply hard rejection criteria before comparing prices

For a Brand Core Number, use hard rejection criteria. If a critical requirement cannot be met, do not move the product into the final comparison.

#### Rejection criterion 1: The number must be controllable long term

Confirm:

- Who owns the number?
- Who completes identity verification?
- Does the company have an operator account?
- Can the number’s status be checked?
- Can the number be moved to another device?
- Can the same number be restored through SIM replacement or eSIM reissue?

If these answers are unclear, do not use it as the Brand Core Number.

#### Rejection criterion 2: It must receive SMS from the real operating location

If a number will be maintained in mainland China, do not ask only whether it works in its home country.

The real question is:

> Can it continue to receive inbound SMS while roaming in mainland China?

Check:

- Mainland China roaming availability;
- Inbound SMS support;
- Whether VoLTE is required;
- Whether an account balance is required;
- Whether a roaming pack is needed;
- Whether Wi-Fi Calling is required;
- Whether permanent roaming or fair-use limits apply.

For a company operating elsewhere, run the same checks for its actual operating location.

#### Rejection criterion 3: The validity and inactivity rules must be explicit

Do not accept “it usually does not expire.”

Find the operator’s official answer to:

~~~text
How many days of inactivity can pass before suspension or deactivation?
~~~

Also confirm what counts as activity:

- Top-up;
- Outgoing SMS;
- Outgoing call;
- Mobile data;
- Service-pack purchase;
- Monthly renewal.

Receiving an SMS does not necessarily count as a qualifying activity.

Receiving verification codes every day does not prove that the number will remain active.

#### Rejection criterion 4: Top-up and account management must work remotely

A core SIM may stay in the company’s dedicated phone for years. Confirm:

- Can the account be topped up on the official website?
- Is there an app?
- Are the company’s payment methods accepted?
- Is auto-renew available?
- Does access to the operator account itself depend on the same SIM receiving an OTP?
- Can the company access the account if the phone is lost?

A product that requires someone to visit a local convenience store every few months may be unsuitable for a company whose team is elsewhere.

#### Rejection criterion 5: KYC and activation must be legally possible

Requirements differ by country. Confirm:

- Whether the company’s employees’ passports are accepted;
- Whether a local address is required;
- Whether a local bank account is required;
- Whether a local identity document is mandatory;
- Whether activation must be completed in person;
- Whether business customers are allowed;
- Whether an authorized company representative can complete the process.

Do not purchase a number that cannot be activated using a genuine, lawful identity.

#### Rejection criterion 6: There must be a same-number recovery path

Plan for this scenario:

~~~text
Phone lost
   ↓
SIM lost
   ↓
How does the company recover the same number?
~~~

Confirm:

- Physical SIM replacement;
- eSIM reissue;
- Whether KYC must be repeated;
- Replacement fees;
- Whether an in-person visit is required;
- Whether the original SIM is required;
- Whether a PIN or PUK is required;
- Whether recovery can be handled from abroad.

If losing the SIM means buying a completely new number, it should not be the only core number.

#### Rejection criterion 7: Test OTP compatibility with core platforms

Do not rely only on a marketing statement such as “OTP supported.”

Different platforms use different SMS gateways. Short-code and A2P SMS routes may behave differently. A number may receive WhatsApp verification but fail to receive a message from another SaaS service. A platform may also reject certain number ranges.

Buy a test SIM and verify it before binding important company assets.

Test only the platforms the company actually uses, such as:

- Google;
- Meta;
- Instagram;
- TikTok;
- LinkedIn;
- Microsoft;
- WhatsApp;
- Other critical SaaS services.

Do not repeatedly request large numbers of OTP messages. The purpose is to confirm normal business compatibility, not to generate unnecessary verification traffic.

#### Rejection criterion 8: There must be no obvious conflict with long-term overseas use

Some products are designed for local residents with occasional roaming.

If the real usage model is:

~~~text
Number kept outside its home country
+
Long-term roaming
+
Primarily used for corporate verification
~~~

check:

- Permanent roaming;
- Fair use;
- Long-term use abroad;
- Service suspension;
- Country-specific roaming restrictions.

A country code that looks international is not a valid reason to choose a core number.

#### Rejection criterion 9: The number must not be the only recovery method

Never build the whole account-recovery system around one SIM.

Use multiple independent recovery methods:

~~~text
Corporate Email
+
Brand Core Number
+
Authenticator / Passkey
+
Recovery Codes
+
Backup Admin
+
Backup Recovery Number
~~~

### Score candidates after they pass the rejection criteria

A 100-point scorecard can help compare products:

| Dimension | Weight | What to evaluate |
| --- | ---: | --- |
| Long-term ownership and clear rules | 20 | Whether validity and inactivity rules are explicit |
| Roaming and inbound SMS at the operating location | 20 | Whether the number can actually be maintained and receive SMS |
| OTP / 2FA compatibility | 15 | Whether important platforms work in real tests |
| SIM replacement / eSIM reissue / disaster recovery | 10 | Whether the same number can be recovered |
| KYC and activation feasibility | 10 | Whether the company can complete activation lawfully |
| Remote top-up and account management | 10 | Whether it can be maintained remotely |
| Number portability | 5 | Whether the number can be transferred if necessary |
| Customer support and documentation | 5 | Whether help is available when something fails |
| Annual maintenance cost | 5 | Total cost after the critical requirements are met |
| **Total** | **100** | |

For a core number, avoiding number loss is more important than saving a small amount each year.

### Physical SIM or eSIM?

Both can work.

Do not assume:

~~~text
Physical SIM = real number
eSIM = virtual number
~~~

A carrier eSIM can provide the same type of mobile number and operator service as a physical SIM.

**Physical SIM advantages:**

- Can be moved quickly to a backup phone;
- Does not depend on an eSIM profile stored on the device;
- Easier to diagnose in some device-failure scenarios;
- Straightforward for a dedicated company phone.

**Physical SIM disadvantages:**

- Can be physically lost;
- SIM tray or card can be damaged;
- SIM can age;
- Theft of the phone may also mean loss of the card.

**eSIM advantages:**

- No physical card to lose;
- No need to remove or insert a card;
- Convenient on phones that support multiple eSIMs;
- Some operators can reissue the profile remotely.

**eSIM disadvantages:**

- Moving to another phone depends on the operator’s process;
- QR codes may or may not be reusable;
- Reissue may require additional identity verification;
- The recovery process must be understood before the device fails.

The correct question is not “physical or eSIM?” It is:

> Which option, with this operator, makes it easier to recover the same number?

### How should the number’s country or region be selected?

A number’s country code should not be used to pretend that the company is located somewhere else.

For a global B2B business, prioritize operational sustainability—not whether a +44, +49, or +1 number looks more European or American.

Separate the roles:

~~~text
Brand Core Number
→ Security and recovery
→ Prioritize long-term control

Customer-facing Number
→ WhatsApp and public contact
→ Consider market expectations

Sales Number
→ Sales communication
→ Configure by employee role and market
~~~

This avoids forcing one number to handle account security, brand image, customer communication, and Sales prospecting at the same time.

### Regional evaluation example for businesses operating from mainland China

For a company whose team is based in mainland China, prioritize numbers that can be maintained legally and reliably from the actual operating location.

For some businesses in southern China, a native Hong Kong mobile number may be worth testing first. This is not a universal country ranking; other locations and business models may lead to a different result.

A practical screening order is:

1. A native mobile number that fits the operating location, can be maintained long term, and has a clear recovery path;
2. A US, UK, or other regional number whose roaming and inbound SMS have been verified at the actual operating location;
3. A target-market number required by a local entity, local employees, or customer-service needs.

Do not use data-only travel eSIMs, temporary numbers, public SMS receivers, or unverified phone-number add-ons as the core recovery number.

### When is a Hong Kong number worth evaluating?

For companies based in mainland China—especially in southern China—the potential advantages of a Hong Kong number are operational rather than cosmetic:

- It may be geographically closer for teams in southern China;
- It may be easier to handle certain issues in person;
- Chinese-language customer support may be available;
- Hong Kong has a defined regulatory framework;
- Prepaid SIMs are subject to real-name registration;
- Eligible identity documents can be used through the operator’s registration process;
- Multiple operators offer physical SIM and eSIM products;
- Cross-border and roaming products are common;
- Mainland China roaming is available on some plans;
- Top-up and renewal may be convenient.

Hong Kong’s Office of the Communications Authority (OFCA) requires real-name registration for prepaid SIMs. Users without a Hong Kong Identity Card follow the operator’s accepted identity-document process.

A clear registration process helps establish the relationship between the number, operator account, and registered holder.

### Hong Kong candidate pool

The following is not a permanent ranking. Recheck the exact plan and official policies before purchasing.

#### 1. SoSIM — a Hong Kong candidate for mainland-China operations

The research snapshot indicated that SoSIM supported:

- Physical SIM;
- eSIM;
- A native Hong Kong mobile number;
- Real-name registration;
- Overseas roaming;
- Inbound SMS while abroad;
- Voice and SMS;
- Online top-up;
- My Account / app management;
- Mobile number port-in.

The snapshot described the following validity rules:

- A new SIM commonly starts with a 120-day validity period;
- Some default bundles may have different validity periods;
- A HK$200–299.9 top-up may extend validity to 365 days;
- A top-up of HK$500 or more may extend validity to 730 days.

Its FAQ stated that roaming was available by default and SMS could be received after connecting to an overseas network. VoLTE settings may matter on 4G/5G roaming networks.

This can fit a model where the company owns the number, keeps it in a dedicated Brand Social Phone, uses it in mainland China mainly for verification, and performs scheduled maintenance.

SoSIM can be included in the first round of tests for a mainland-China business that needs a Hong Kong number. It is not a universal best choice and should not be bound to all core accounts before testing.

#### 2. Club Sim — an alternative candidate

The research snapshot described support for:

- Physical SIM;
- eSIM;
- App management;
- Mobile number port-in;
- VoLTE;
- VoWiFi;
- SIM replacement or eSIM QR re-download.

Its FAQ stated that a customer could retain a number by ordering another Service Pack within 365 days after the related service validity period ended.

Before purchase, verify the exact plan’s:

- Mainland China roaming;
- Inbound SMS;
- Roaming charges;
- Registration requirements;
- Physical SIM / eSIM replacement process;
- Service Pack validity.

It is a potential Hong Kong backup candidate, subject to plan-level testing.

#### 3. 3HK and other 3HK prepaid products

3HK offers multiple prepaid, travel, and DIY products. Validity and service capabilities differ between products.

Do not evaluate the brand name alone. Record the exact product, validity, roaming terms, and SMS capability.

#### 4. CMHK / CUniq and other Hong Kong operators

These may also be candidates. They offer local operator support, Chinese-language service, and various cross-border products.

However, validity, eSIM, roaming, top-up, and SMS rules vary by prepaid plan. The specific plan—not the operator brand—is the correct unit of comparison.

### UK numbers: useful candidates, but do not choose one only because it is cheap

The UK PAYG / prepaid market includes candidates such as:

- CTExcel UK;
- Vodafone PAYG;
- Three UK PAYG;
- Lyca;
- Lebara;
- CMLink UK;
- 1pMobile;
- VOXI.

Check three things carefully:

1. Number-validity rules differ substantially. Operators may define qualifying activity differently.
2. International roaming does not automatically mean that years of continuous use in mainland China are permitted.
3. A core number needs a recovery and portability plan. Do not build the entire account-recovery system around an irreplaceable SIM.

Third-party reports about inactivity periods are useful for discovering candidates, but the final rule must come from the operator’s current official terms.

For example, 1pMobile’s official terms updated on 2026-07-24 distinguished between customer cohorts:

~~~text
Customers joining from 2026-08-01
→ Spend/use at least £10 every 90 days

Customers joining from 2025-10-15 to 2026-07-31
→ £10 every 120 days

Earlier customers
→ A different rule
~~~

This illustrates why the purchase date and current terms matter.

### UK candidate pool

#### CTExcel UK — a UK number worth evaluating for mainland-China teams

CTExcel UK is not just an ordinary UK PAYG / MVNO candidate.

It is a UK mobile brand under China Telecom Europe and works with the EE network. Its product positioning includes UK–China cross-border communications, which differs from a conventional UK-local PAYG product designed mainly for residents who occasionally travel.

The research snapshot listed:

- A real UK mobile number;
- EE network partnership;
- Voice, SMS, and mobile data;
- eSIM options;
- One-SIM Multiple Numbers;
- A local number and a China number on the same SIM for relevant services;
- 24/7 English, Chinese, and Cantonese support;
- Payment options including Alipay, WeChat Pay, PayPal, UnionPay, Visa, and Mastercard;
- UK + Mainland China shared-data products;
- Products aimed at users and businesses with UK–China communication needs.

For a company maintaining a UK number from mainland China, the main question is not which SIM has the lowest annual holding cost. It is whether the company can control and recover the number from its real operating location.

**Inactivity rule in the research snapshot**

CTExcel UK’s FAQ stated that a service action was required at least once every 90 days to keep the number active.

Qualifying actions included:

- Call;
- SMS;
- Data;
- Top-up.

This is a more frequent maintenance cycle than the roughly six-month inactivity period described for giffgaff.

A company should set reminders well before the deadline—for example, a reminder every 60 days and a required action well before day 90. Do not wait until day 89 or 90.

**Why it may suit a mainland-China team**

Potential advantages include:

1. Chinese-language support can reduce the difficulty of troubleshooting and replacing a number.
2. Alipay, WeChat Pay, and UnionPay can make payment easier for a China-based team.
3. Its China Telecom background and cross-border product design may fit UK–China communication needs.
4. Shared UK–China products may suit cross-border operations better than a UK-local PAYG plan.
5. One-SIM Multiple Numbers can provide additional communication options.
6. The team may be able to handle top-up, account checks, and support without relying entirely on UK-local resources.

**Why it is not automatically the best choice**

Test:

- Whether roaming registration is stable at the company’s actual office;
- Whether LinkedIn, Meta, Google, TikTok, and Microsoft OTP messages arrive;
- Physical SIM / eSIM purchase, activation, and replacement;
- Whether the company can retain control of the operator account;
- Same-number replacement or eSIM reissue after loss;
- PAC port-out capability;
- Long-term roaming and fair-use restrictions for the exact plan;
- Whether the 90-day activity rule changes.

The accurate positioning is that CTExcel UK is one UK-number candidate for mainland-China businesses. If testing succeeds, it may become a Primary Brand Core Number or a high-priority Backup Recovery Number.

**CTExcel UK versus giffgaff**

| Dimension | CTExcel UK | giffgaff |
| --- | --- | --- |
| UK number | Yes | Yes |
| China cross-border positioning | Strong | Limited |
| Chinese-language support | Available, including 24/7 multilingual support | Not a core feature |
| China-related products | Multiple-number and shared-data options | Mainly standard international roaming |
| Common China payment methods | Alipay / WeChat / UnionPay and others | Primarily international payment methods |
| Network | EE partnership | O2 |
| Inactivity maintenance | At least one qualifying action every 90 days in the snapshot | Around six months of inactivity |
| Convenience for mainland-China teams | Potentially high | Medium |
| Lowest pure number-holding cost | Not necessarily | Potentially competitive |
| Recommended role | Candidate to test | Not the only Core number |

“Best giffgaff alternative” depends on the objective. CTExcel is not necessarily the cheapest. For a China-based team maintaining a real UK number, it may be a stronger operational candidate, subject to testing.

#### Three UK PAYG

Three’s official guidance in the snapshot stated that a PAYG number needed chargeable activity at least once every 180 days.

Chargeable activity could include:

- Top-up;
- Data Pack / Add-on purchase;
- Call;
- SMS;
- Mobile data use;
- Use of an existing paid allowance.

It is a mainstream UK PAYG candidate with a relatively clear rule. Still verify mainland China roaming, inbound SMS, permanent-roaming restrictions, remote top-up, and long-term use.

#### 1pMobile

Its advantages include public PAYG terms and a relatively transparent maintenance model.

However, the rule changed. For customers joining from 2026-08-01, the snapshot listed a requirement to spend or use at least £10 every 90 days.

It is a policy-transparent candidate, but the maintenance frequency may be relatively high.

#### CMLink UK Mobile Duck

The research snapshot listed:

- Contract-free service;
- UK number;
- Online top-up;
- Chinese, English, and Cantonese support;
- SIM delivery to Hong Kong;
- UK number porting;
- A product page stating that ID registration was not required;
- A 90-day period after a plan expires to top up or buy a new plan to keep the number active.

Be careful: roaming destinations differ between products. The Mobile Duck page listed the EU and Hong Kong, while mainland China appeared as an international-calling destination. Other CMLink products have mainland China roaming data.

Do not assume that all CMLink products support mainland China roaming. Check the exact plan.

#### Vodafone PAYG, Lyca, Lebara, and others

Keep them in the candidate pool, but do not treat third-party inactivity-day claims as final purchasing rules.

Check:

~~~text
Official Terms
→ Inactivity
→ Roaming in China
→ SMS
→ Top-up
→ KYC
→ Replacement
→ Port-out
~~~

#### giffgaff

The official guidance in the research snapshot stated that a number with six months of inactivity could be considered inactive and might be deactivated.

Public reports in 2026 also described mainland-China long-term users receiving deactivation notices.

For a company number that must remain in China for years, do not make giffgaff the only recovery number.

If the company already has an important giffgaff number:

- Do not wait until deactivation;
- Check port-out eligibility;
- Confirm alternative verification methods;
- Plan migration through the official process.

### US numbers: distinguish the product model

US candidates also have different maintenance models. Do not compare Ultra Mobile, Tello, Red Pocket, and Saily as if they were the same type of service.

#### Ultra Mobile PayGo

The research snapshot listed:

- US mobile number;
- International roaming;
- Voice;
- SMS;
- MMS;
- PayGo Wallet.

International roaming voice, SMS, and MMS were charged against the PayGo Wallet. PayGo did not include data roaming. Its roaming rate information included China voice and SMS charges.

The snapshot also stated that the account and number could be cancelled if no payment was made for 60 days after the last payment.

This is not a “buy once, send one SMS every six months, and keep it forever” model. It is closer to a low-cost US number that requires ongoing payment maintenance.

It is a candidate, but the recurring maintenance cost must be included.

#### Tello

Tello offers international roaming and Wi-Fi Calling & Text.

Its official information stated that Wi-Fi Calling can be used abroad to receive OTP and verification messages. However, enabling Wi-Fi Calling requires a US E911 Address.

A company without a genuine, legally usable US address should not make Wi-Fi Calling the default core design.

Evaluate International Roaming and Wi-Fi Calling separately, and confirm current mainland China coverage and costs.

#### Red Pocket

Some Red Pocket GSMA plans in the snapshot explicitly included:

- International roaming;
- China;
- SMS;
- Voice;
- Data;
- Physical SIM / eSIM.

The exact roaming allowance depends on the plan.

The product is closer to a conventional monthly or annual mobile plan. It may cost more than a minimal PAYG number, but a higher fixed cost can be worthwhile if it provides clearer rules, automatic renewal, and confirmed China roaming.

Do not evaluate the brand name alone. Confirm the GSMA plan and the exact allowances.

#### Saily Phone Number

In 2026, Saily offered a real US wireless phone-number add-on in addition to data-only travel eSIMs.

It supported SMS and voice and could receive some OTP / 2FA messages.

However, its OTP documentation only verified selected services, including Signal, Viber, WhatsApp, and Airbnb. This does not prove that every social platform or SaaS service will accept the number.

KYC also applies.

Treat it as a backup or special-purpose candidate until the company has verified its core-platform compatibility and recovery path.

### German numbers: only when there is a real business need

A German number may look more European, but that is not a valid reason to purchase it as a core number.

German prepaid activation has identity-verification requirements. Deutsche Telekom’s official process in the research snapshot accepted identity documents such as:

- German national ID;
- Passport;
- Residence permit.

The activation flow may require app-based or other identity verification.

A business purchase may also involve company registration information, corporate documents, an address, and authorization documents.

For a company operating mainly from mainland China without a German entity or local team, opening and maintaining a German number may be more complicated than maintaining a Hong Kong number.

A German number is more appropriate when there is German local business, a European entity, a local team, or a clear requirement for a +49 contact number.

Do not buy one merely to make a social platform think the account is in Germany.

### Candidate comparison: match the number to its role

> This table is a research snapshot dated **2026-08-18**, not a live verification as of 2026-11-10 and not a permanent ranking.

| Candidate | Type | Mainland-China maintenance | China inbound SMS path | Maintenance model | Potential role |
| --- | --- | --- | --- | --- | --- |
| SoSIM | Hong Kong prepaid, physical / eSIM | Strong in the snapshot | Official roaming SMS support | Top-up can extend validity, reportedly up to 730 days | Candidate for mainland-China businesses |
| Club Sim | Hong Kong prepaid, physical / eSIM | Strong in the snapshot | Verify the exact plan | New Service Pack within 365 days after service expiry | Hong Kong backup candidate |
| 3HK / CMHK | Hong Kong prepaid | Strong, plan-dependent | Verify the exact product | Product-specific | Candidate pool |
| CTExcel UK | UK MVNO / EE partner, physical / eSIM | High potential | Cross-border product design; OTP still requires testing | One qualifying Call / SMS / Data / Top-up every 90 days in the snapshot | UK Core candidate for mainland-China teams |
| Three UK PAYG | UK PAYG | Medium | Mainland roaming needs verification | Chargeable activity every 180 days | UK backup / special purpose |
| 1pMobile | UK PAYG | Medium | Needs verification | £10 every 90 days for new customers from August 2026 | UK backup |
| CMLink UK Mobile Duck | UK prepaid | Medium–high | China roaming needs plan-level verification | Renew or buy a new plan within 90 days | UK / China-related business candidate |
| giffgaff | UK PAYG | Not preferred as the only core number | Roaming available, but long-term overseas policy risk | Six-month inactivity risk | Not the only Core number |
| Ultra Mobile PayGo | US low-cost PayGo | Medium | China voice / SMS roaming listed | Ongoing payment | US Core / backup candidate |
| Tello | US MVNO | Medium | Roaming / Wi-Fi Calling | Ongoing plan maintenance | US backup candidate |
| Red Pocket GSMA | US monthly / annual plan | Medium–high | Some plans explicitly include China roaming | Monthly / annual plan | US Core candidate |
| Saily Phone Number | Travel eSIM + US number add-on | Depends on service model | Depends on the add-on | Subscription / product rules | Backup / special purpose |
| German prepaid | German native mobile number | Low–medium without a local presence | Operator-dependent | Local plan rules | Use when there is a German business need |

### Recommended number combination

Do not search for one universal “best SIM.” A more resilient setup is:

~~~text
Primary Core Number
+
Backup Recovery Number
~~~

**Primary Core Number**

Keep two possible routes for a mainland-China team rather than declaring one universal winner:

~~~text
Hong Kong Core Route
→ SoSIM: one candidate to test

UK Core Route
→ CTExcel UK: one candidate to test
~~~

If the company is in mainland China and values the maintenance convenience and longer validity extension of a Hong Kong number, SoSIM can be placed on the priority test list. The exact plan and real test results still decide.

If the company genuinely needs a UK mobile number and the team operates mainly from mainland China, CTExcel UK can be tested for its cross-border products, Chinese-language support, and payment options. The exact plan and recovery process still need verification.

The SoSIM route may offer:

- Easier in-person maintenance for teams close to Hong Kong;
- A native Hong Kong mobile number;
- Physical SIM and eSIM options;
- A real-name registration process;
- Official roaming SMS information;
- Clear validity-extension options in the snapshot;
- Possible 365- or 730-day validity extensions through larger top-ups;
- Online account management;
- A relatively understandable long-term maintenance model.

The CTExcel UK route may offer:

- A real UK mobile number;
- Products designed for UK–China communication;
- EE network partnership;
- 24/7 English, Chinese, and Cantonese support;
- Payment options familiar to China-based teams;
- Multiple-number and shared-data capabilities.

Its trade-off is the 90-day qualifying-activity requirement in the snapshot. Add that requirement to the company’s number-maintenance calendar.

**Backup Recovery Number**

Do not make the Primary and Backup fully dependent on the same operator and recovery path.

For example:

~~~text
Primary
→ SoSIM / Hong Kong Operator A

Backup
→ Hong Kong Operator B
~~~

Or, after testing:

~~~text
Primary
→ Hong Kong

Backup
→ United States
~~~

The purpose is not to pretend that the company is in two countries. It is to reduce dependence on one operator, one SIM, one number, or one country’s roaming policy.

**Customer-facing WhatsApp Number**

Do not force the Brand Core Number to serve as the public WhatsApp number.

If customers in a particular market expect a +1 or +44 contact number, the company can choose a separate customer-facing number.

Keep the responsibilities clear:

- Brand Core Number: security and recovery;
- Public WhatsApp Number: customer communication;
- Sales Number: individual Sales communication.

### SIM procurement SOP: never bind a new card to every core account immediately

#### Step 1: Define the role

Record:

~~~text
Purpose:
Brand Core / Backup / WhatsApp / Sales / Travel Data

Expected holding period:
3–5 years or longer / Temporary

Main operating location:
Actual company operating location

Long-term roaming:
Yes / No
~~~

#### Step 2: Create a candidate record

For each SIM, record:

~~~text
Operator
Exact product name
Country / region
MNO / MVNO
Physical SIM / eSIM
Number type
Voice support
SMS support
Roaming in the operating location
Inbound SMS in the operating location
Activation method
KYC requirements
Validity period
Inactivity rule
Top-up method
SIM replacement
eSIM reissue
Port-out
Customer support
Official terms URL
Verification date
~~~

Do not record only “3HK,” “Tello,” or “Vodafone.” Record the exact product.

#### Step 3: Screen against official sources

Industry reviews, community discussions, and third-party articles can help discover candidates, identify potential risks, and find common failure modes.

Final purchasing decisions should return to:

- Operator FAQ;
- Terms and Conditions;
- Roaming page;
- Prepaid expiry policy;
- KYC page.

Pay particular attention to number validity, roaming policy, and identity requirements.

#### Step 4: Buy one test SIM

Do not bind the most important accounts yet.

First complete:

- Activation;
- KYC;
- Operator app / portal login;
- Top-up;
- Roaming network registration;
- SMS;
- Voice, if required.

#### Step 5: Test at the actual operating location

On the dedicated Brand Social Phone:

~~~text
Power on
   ↓
Connect to the local roaming network
   ↓
Wait for stable registration
   ↓
Receive an ordinary SMS
   ↓
Test an operator-generated SMS
   ↓
Test necessary OTP messages
~~~

Record:

- Whether automatic network selection works;
- Whether manual network selection is needed;
- Whether VoLTE is required;
- Whether the phone reconnects after a restart;
- Whether Wi-Fi changes the result;
- Whether SMS still works with a low balance;
- Whether Data Roaming must be enabled;
- Whether the service still works after an operating-system update.

#### Step 6: Verify important platform OTP messages

During normal account registration or security setup, confirm the services the company actually uses:

- Google;
- Meta;
- Instagram;
- TikTok;
- LinkedIn;
- Microsoft;
- WhatsApp;
- Other critical SaaS services.

Do not repeatedly request OTPs in a short period. Confirm that normal business verification works.

#### Step 7: Test the maintenance action

This step is often overlooked.

If the operator requires one chargeable activity every 180 days, confirm exactly how the company can complete that activity from its operating location.

Do not wait until day 179 to investigate.

If the operator requires £10 every 90 days, confirm:

- Where to top up;
- Which payment methods work;
- Whether auto-renew is available;
- What happens if payment fails;
- How much grace time is available.

#### Step 8: Verify disaster recovery

The company does not need to lose the SIM to test the documentation.

Find and record the official procedure for:

~~~text
SIM lost
→ Replace SIM

Phone broken
→ Move physical SIM / reissue eSIM

Operator account inaccessible
→ Contact operator support

Operator exits the market
→ Port-out / number transfer
~~~

If the operator does not provide a clear recovery path, lower the candidate’s score.

#### Step 9: Bind core accounts only after acceptance

A sensible sequence is:

1. Secure the operator account;
2. Bind a small number of lower-risk company services;
3. Confirm that SMS continues to arrive;
4. Add core platforms gradually;
5. Configure an Authenticator or Passkey;
6. Save Recovery Codes.

Do not activate a new SIM and immediately bind it to Google, Meta, TikTok, LinkedIn, and every company SaaS account within ten minutes.

### Corporate SIM asset register

Record at least the following for every company SIM:

| Field | Example |
| --- | --- |
| Asset ID | SIM-BRAND-001 |
| Role | Brand Core Number |
| Phone Number | +852 ... |
| Country / Region | Hong Kong |
| Operator | SoSIM / ... |
| Product | Exact product name |
| SIM Type | Physical / eSIM |
| ICCID | ... |
| EID | Record for eSIM |
| Registered Owner | Authorized company representative |
| KYC Document | Document type only in the ordinary asset register |
| Activation Date | YYYY-MM-DD |
| Expiry Rule | Official rule summary |
| Next Maintenance Date | YYYY-MM-DD |
| Top-up Method | Portal / App |
| Payment Method | Company payment method |
| Account Email | Corporate email |
| Account Login | Reference in password manager |
| PIN / PUK | Store in password manager |
| Mainland Roaming | Supported / Needs verification |
| SMS Tested | Google / Meta / ... |
| Replacement Procedure | Official procedure |
| Port-out Procedure | PAC / MNP / ... |
| Bound Assets | Platforms linked to the number |
| Backup Route | Backup SIM / Recovery Codes |
| Policy Verified On | YYYY-MM-DD |

The ordinary asset register should be an index, not a spreadsheet full of plaintext secrets.

Passwords, PINs, PUKs, and Recovery Codes belong in the corporate password manager.

### Create a number-maintenance calendar

Do not depend on an employee remembering that a SIM may need an SMS or chargeable action every few months.

Record:

~~~text
Expiry Rule
    ↓
Next Required Action
    ↓
Calendar Reminder
~~~

Set reminders before the deadline, for example:

~~~text
30 days before
    ↓
7 days before
    ↓
Final reminder before expiry
~~~

Auto-renew can be enabled when supported, but it does not replace monitoring. Corporate cards expire, payment methods change, charges fail, and operators change plans.

### The SIM itself needs disaster recovery

A resilient number should be supported by:

~~~text
Brand Core Number
        │
        ├── Corporate Email
        ├── Authenticator / Passkey
        ├── Recovery Codes
        ├── Backup Admin
        └── Backup Recovery Number
~~~

Do not allow a lost SIM to make the entire brand account system unrecoverable.

### Which device should hold the overseas SIM?

The brand’s core overseas SIM should normally stay in the company-controlled Brand Social Phone.

Avoid moving it routinely between:

- The owner’s personal phone;
- A marketing employee’s phone;
- A Sales employee’s phone;
- A temporary spare phone.

The SIM, phone, and number should be recorded as company assets.

### How should an overseas number be used during account registration?

Do not assume that the phone number must be the primary identity.

A more resilient structure is:

~~~text
Corporate Email
= Primary Identity

Brand Core Number
= Verification / Recovery

Authenticator / Passkey
= 2FA

Recovery Codes
= Emergency Recovery
~~~

The number is important, but it should not be the only key.

### Which device should register official brand accounts?

There is no universal rule that every account must be registered on a phone or that every account must be registered on a computer.

Use the platform’s normal account structure within the Brand Environment.

The Brand Environment includes:

- Brand Publishing Workstation;
- Brand Social Phone;
- Corporate Email;
- Brand Core Number;
- Password Manager;
- Authenticator / Passkey;
- Recovery Codes.

After registration, both fixed devices can remain trusted brand devices where the platform allows it.

### Should the Brand SIM provide everyday mobile data?

Usually not.

Its main roles are:

- Number retention;
- SMS;
- Voice;
- Verification;
- Recovery;
- WhatsApp, if assigned that role.

The Brand Social Phone should normally use the company network for day-to-day social media access. This does not mean mobile data is forbidden when there is a real business need.

Do not create a complicated network setup just to make the SIM’s country appear to match the IP country.

### Sources and policy-verification rules

Overseas-number policies change frequently. Validity, roaming coverage, KYC, plan expiry, and replacement procedures must be rechecked.

Use this source hierarchy:

**Priority 1: Official operator information**

- Terms and Conditions;
- Prepaid / PAYG expiry policy;
- Roaming page;
- SMS / Voice roaming policy;
- KYC / registration policy;
- SIM replacement / eSIM reissue policy;
- Number-porting policy.

**Priority 2: Written confirmation from operator support**

If the official website does not clearly answer whether long-term SMS reception in mainland China is supported, or how to complete a maintenance action from abroad, request written confirmation through a support ticket, email, or chat. Save the response and verification date.

**Priority 3: Industry reviews and user experience**

Use reviews, forums, and user reports to discover new operators, identify common failures, and understand real roaming experiences. Do not use them as the only basis for purchasing a core corporate number.

Do not use:

- Fingerprint spoofing;
- GPS or location spoofing;
- Forced matching of the number’s country with a proxy country;
- Anti-detection environments intended to bypass platform security.

The operating principle remains:

> **Real corporate identity + company-controlled devices + a legitimate and stable network + normal platform permissions.**

Record every time-sensitive policy with:

~~~text
Official Source
+
Policy Item
+
Verified Date
+
Applicable Product / Plan
+
Internal Owner
~~~

This makes it possible to identify exactly which rules need rechecking when an operator changes its policy.

### Implementation sequence for a company

1. Select a native mobile number that fits the company’s actual operating location, purpose, and long-term maintenance capacity. For a mainland-China team with a genuine need for a Hong Kong number, a Hong Kong SIM can be included in the candidate pool; SoSIM is one product to test, not a universal recommendation.
2. Complete identity verification, activation, roaming, SMS, OTP, portal access, top-up, expiry, replacement, and port-out testing.
3. Purchase a Backup Recovery Number from a different operator after the Primary has passed testing.
4. Plan public WhatsApp and individual Sales numbers separately according to market and employee role.

Do not force the Brand Core Number to handle every business communication role.

### Policy-reference checklist

The following sources were used to build the 2026-08-18 research snapshot. Recheck them before purchase.

**Hong Kong**

- OFCA: prepaid SIM real-name registration;
- SoSIM: FAQ, real-name registration, top-up / auto-renewal, travel voice and SMS, eSIM / physical SIM;
- Club Sim: FAQ, eSIM, number retention, and service packs;
- 3HK / CMHK: verify the exact prepaid product.

**United Kingdom**

- Three UK: Pay As You Go support;
- 1pMobile: Terms and Conditions;
- CMLink UK: Mobile Duck;
- giffgaff: number deactivation and roaming policy;
- Vodafone / Lyca / Lebara: candidates requiring current official verification.

**United States**

- Ultra Mobile: PayGo and international roaming;
- Tello: international roaming and Wi-Fi Calling;
- Red Pocket: plans and international roaming;
- Saily: phone-number service, OTP / 2FA, and KYC.

**Germany**

- Deutsche Telekom: prepaid activation and identity verification.

**Third-party reference**

- AdsPower, “Giffgaff Alternatives: eSIM and Overseas SIM Options” (for candidate discovery and industry issues, not as the final authority for operator policy).

> **Maintenance requirement:** Review the official terms, roaming policies, validity rules, and SIM replacement / eSIM reissue procedures for core candidate numbers at least quarterly.

## 7. Platform Account Structure

### LinkedIn

A LinkedIn Company Page is not a separate company login account.

The normal structure is:

~~~text
Real LinkedIn Personal Profile
        ↓
LinkedIn Company Page
        ↓
Super Admin / Content Admin / Analyst
~~~

Do not create a fake personal profile such as:

~~~text
First Name: Company
Last Name: Admin
~~~

as a shared public login for the company.

A Company Page should be managed by real, authorized people. Avoid making one person the only administrator.

The Brand Publishing Workstation is the main environment for routine Company Page management.

The Brand Social Phone can support:

- LinkedIn app access;
- Login approvals;
- 2FA;
- Necessary mobile administration.

### Facebook

Manage Facebook business assets through real authorized people and the Meta Business Portfolio:

~~~text
Real authorized people
        ↓
Meta Business Portfolio
        ↓
Company Facebook Page
~~~

Do not use one shared Facebook password for the entire company.

Assign the appropriate roles through the platform’s permission system.

The Brand Publishing Workstation handles business administration. The Brand Social Phone can use Facebook and Meta Business Suite apps for login approvals and supporting tasks.

### Instagram

Treat the Instagram brand account as a company asset.

Use:

~~~text
Corporate Email
+
Company-controlled phone number
+
2FA
+
Recovery Codes
~~~

Then add the account to the Meta Business Portfolio.

The Instagram app can remain signed in on the Brand Social Phone. Content production and routine administration should remain centered on the Brand Publishing Workstation.

### TikTok

The TikTok Brand Account can be registered within the Brand Environment.

If the mobile registration flow is more convenient, use:

~~~text
Brand Social Phone
+
TikTok App
+
Corporate Email
~~~

After initial setup:

- Bind the company-controlled phone number where appropriate;
- Enable 2FA;
- Save recovery methods;
- Configure the company’s brand information;
- Choose a Business Account where it fits the business.

Both the Brand Publishing Workstation and Brand Social Phone can remain the fixed brand devices.

### YouTube

Use a company-controlled Google Account as the foundation.

~~~text
Corporate Google Account
        ↓
Company YouTube Channel
        ↓
Official permission system
        ↓
Authorized team members
~~~

The Brand Publishing Workstation is the main environment for:

- YouTube Studio;
- Video uploads;
- Channel management.

The Brand Social Phone supports:

- YouTube app access;
- Google login approvals;
- 2FA;
- Necessary mobile management.

### WhatsApp

WhatsApp differs from ordinary social media accounts because the phone number is a key part of the account identity.

Separate:

~~~text
Brand / Main Company Number
~~~

from:

~~~text
Sales Personal Business Number
~~~

Do not force all Sales customer conversations into the Brand Social Phone.

The main company number can handle official contact and brand inquiries. Sales prospecting and customer conversations should follow the individual Sales Environment.

---

## 8. Identity, Security, and Recovery

### Do not let one SIM or one phone become a single point of failure

Important company accounts should have several independent recovery paths:

~~~text
Corporate Email
+
Core Number
+
Brand Social Phone
+
Authenticator / Passkey
+
Recovery Codes
+
Backup Admin
+
Backup Number
~~~

The phone itself must not become a single point of failure.

If the Brand Social Phone is lost or damaged, the company should still be able to recover accounts through corporate email, the password manager, recovery codes, backup administrators, backup numbers, and the platform’s official recovery process.

### Authenticator

Enable an authenticator wherever supported.

Examples include:

- Google Authenticator;
- Microsoft Authenticator;
- Other TOTP-compatible authenticators.

The purpose is to retain another login path when the SIM cannot receive an SMS.

### Recovery Codes

Save Recovery Codes for every platform that provides them.

Store them in the corporate password management system.

Do not rely only on:

- Screenshots;
- An employee’s personal phone;
- A desktop folder on one person’s computer.

### Corporate password management

The company should use a centralized password manager for company-controlled credentials.

Store or reference:

- Brand account credentials;
- Corporate email;
- Important SaaS accounts;
- Recovery Codes;
- Network-service accounts;
- VPS / proxy credentials where applicable;
- Domain accounts;
- Important administrator accounts.

Keep sensitive credentials in the password manager rather than copying all secrets into an ordinary asset spreadsheet.

### How should Sales personal-account passwords be managed?

Separate:

> **Company-owned brand assets**

from:

> **An employee’s real personal platform identity.**

A Sales employee’s LinkedIn Personal Profile represents that individual. It should not become an account whose password is shared with the whole company.

A better arrangement is:

- The employee uses their own real profile;
- The company manages work email, assigned devices, and Company Page permissions;
- Official brand assets are administered through the platform’s role and permission system.

### Platform permissions are better than shared passwords

For example, a LinkedIn Company Page can use roles such as:

~~~text
Company Page

├── Super Admin
├── Content Admin
└── Analyst
~~~

Meta assets should use the Meta Business Portfolio / Business Manager permission system.

Avoid:

~~~text
One account
+
One password
+
Everyone logs in
~~~

### What happens when an employee leaves?

The company should be able to:

1. Recover the assigned work computer;
2. Recover the assigned work phone;
3. Revoke corporate email access;
4. Revoke CRM access;
5. Remove Meta business permissions;
6. Remove LinkedIn Company Page permissions;
7. Revoke password-manager access;
8. Transfer customer relationships and records;
9. Revoke other SaaS permissions.

> Brand assets should not leave with an employee.

---

## 9. Example Enterprise Configuration

### Example: a small team with one marketing owner and multiple Sales employees

The following example illustrates how to divide devices and permissions. Adjust the quantities to the company’s actual team size.

- Sales: according to the actual team size;
- Marketing / social media owner: one person, or more if the business requires it.

| Infrastructure | Example configuration |
| --- | --- |
| Brand Publishing Workstation | 1 |
| Brand Social Phone | 1 |
| Official brand accounts | Usually 1 per platform |
| Brand Core Number | 1 long-term number |
| Sales work computers | 1 per employee |
| Sales work phones | 1 per employee |
| Brand network | 1 stable company endpoint |
| Sales network | 1 stable corporate endpoint, region selected for the actual situation |
| Backup network | 1 |
| Corporate email | 1 per employee |
| Sales overseas numbers | Assigned by business role |
| Corporate backup numbers | 1–2 |
| Corporate password manager | 1 system |
| Authenticator / Passkey | Enabled for core accounts |
| Recovery Codes | Centrally stored |
| Fingerprint browser | Not part of the standard setup |
| Individual Sales residential IPs | Not part of the standard setup |

### Overall architecture

~~~text
                   Company Office / Headquarters
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
          Brand Environment                    Sales Team
                 │                                 │
          ┌──────┴──────┐                    Sales A / B / C
          │             │                         │
          ▼             ▼                         ▼
  Brand Publishing   Brand Social Phone     Sales Work Devices
   Workstation              │                         │
          │                 │                         │
          └────────┬────────┘                         │
                   ▼                                  ▼
          Brand Stable Endpoint A             Sales Endpoint B
                   │                                  │
                   ▼                                  ▼
           Official Brand Assets              Personal Workflows
                   │                                  │
       LinkedIn Company Page                 LinkedIn Personal
       Meta Business Portfolio               Email
       Facebook Page                          CRM
       Instagram                              WhatsApp
       YouTube                                Personal Content
       TikTok
                   │
                   ▼
         Corporate Identity Layer

         Corporate Email
         Overseas Numbers
         Password Manager
         Authenticator / Passkey
         Recovery Codes
         Admin Permissions
~~~

The Brand Environment should not be understood as one computer. It is a system consisting of:

~~~text
Brand Publishing Workstation
+
Brand Social Phone
+
Stable Network
+
Corporate Identity
+
Account Security and Recovery
~~~

---

## 10. Frequently Asked Questions

### Q1. Should there be only one official brand account per platform?

**Usually, yes.**

If the company operates one primary brand, it generally does not need an account matrix. Create separate accounts only when there is a genuine independent brand, market, business line, or dedicated operating team.

### Q2. Does the brand workstation need a fingerprint browser?

**Not by default.**

One brand with one official account per platform can normally use a standard browser and a consistent profile.

### Q3. Does Sales need a fingerprint browser?

**Not by default.**

A real employee, real personal account, and consistent work devices are normally sufficient.

### Q4. Does every Sales employee need an individual residential IP?

**Usually not.**

Employees at the same office can share a corporate endpoint when company policy, local law, and platform rules allow it. Isolation should be based on a genuine business or security requirement, not on creating artificial identities.

### Q5. Must Brand and Sales use IP addresses from the same country?

No.

For example:

~~~text
Brand → Region A
Sales → Region B
~~~

This can be reasonable when each environment has a legitimate, stable, and compliant network setup.

### Q6. Should the Sales team use one overseas endpoint?

Do not make Hong Kong the default for every company. It may be convenient for some mainland-China teams, especially in southern China, because of distance, latency, and maintenance. Other companies should choose based on their actual routes, regulations, platform accessibility, and provider conditions.

### Q7. Can Sales publish LinkedIn updates from a phone?

Yes.

Recommended division:

- Computer as the primary work environment;
- Phone as a supporting environment.

### Q8. Can the brand workstation publish Sales employees’ personal content?

**Not recommended.**

Sales Personal Profiles should be operated by the respective employees from their own assigned work devices.

### Q9. Can Sales A and Sales B share one corporate public IP?

Yes. Real employees from the same company and office can generally share a corporate endpoint when it complies with network-security policy, local law, and platform rules.

### Q10. Must a computer and phone use the same IP?

No.

A phone may use company Wi-Fi or mobile data. Stability matters more than forcing the two devices to have identical IP addresses.

### Q11. Can a VPS be used?

Yes, where appropriate.

A VPS can provide a stable corporate endpoint if the region, provider, legal requirements, platform accessibility, and maintenance process have been evaluated.

### Q12. When should a fingerprint browser be considered?

Only when there is a real need for:

- Multiple independent brands;
- Genuine account isolation;
- Test accounts;
- Separate country teams;
- A legitimate multi-account operating model.

### Q13. Should the company choose the cheapest overseas number?

No.

A more useful priority order is:

~~~text
Long-term stability
>
Verification compatibility
>
Account recovery
>
Operational convenience
>
Price
~~~

### Q14. What happens if the brand computer breaks?

The company should be able to rebuild the environment if:

- Passwords are backed up;
- 2FA has recovery methods;
- Recovery Codes are saved;
- Network settings are documented;
- Brand assets are stored in company cloud storage.

### Q15. Should the Brand Publishing Workstation use Windows or macOS?

Either is suitable.

Choose based on the company’s existing IT environment. A dedicated Mac is reasonable when it is easy to manage. Windows 11 Pro is equally suitable for a company with centralized Windows management.

This is not a platform risk-control requirement.

### Q16. Does the company need a dedicated social media phone?

It is recommended for a company that relies on several official brand accounts.

The Brand Social Phone handles:

- Official apps;
- Overseas SIM;
- SMS;
- 2FA;
- Passkeys;
- Login approvals;
- Emergency recovery;
- Mobile-only platform functions.

### Q17. Can the Brand Social Phone stay logged in to official social apps?

Yes.

That is one of its purposes. The important point is to keep it a stable company device rather than a phone constantly switching between unrelated networks, VPN locations, and employees.

### Q18. Must the Brand Workstation and Brand Phone use the same IP?

No.

If both devices are normally used in the office, connecting the phone to the same company Wi-Fi is often simpler. The principle is stability, not identical IP addresses.

### Q19. Should the phone’s GPS be disabled?

Disable unnecessary location access for apps that do not need it.

Do not spoof GPS, use fake locations, or manipulate device location to disguise an account.

### Q20. Where should the company’s overseas SIM stay?

Keep it in the company-controlled Brand Social Phone.

Avoid moving it repeatedly between employees’ personal phones.

### Q21. Should an account use a phone number or corporate email?

For most company-controlled accounts, prioritize a corporate email address that the company can retain long term. Add a company-controlled number as a verification and recovery route.

~~~text
Email
+
Phone
+
2FA
+
Recovery
~~~

Do not rely on a phone number alone.

### Q22. Must every official account be registered on a phone?

No.

Use the platform’s normal registration process within the Brand Environment. After registration, ensure that the account, email, number, 2FA, recovery methods, and administrator permissions remain under company control.

---

## 11. Implementation Principles

### Principle 1: Keep official brand accounts focused

> One primary brand should normally maintain one official account per platform.

### Principle 2: Centralize the Brand Environment

> Official brand accounts are administered through the Brand Publishing Workstation and the platform’s permission system.

### Principle 3: Keep Sales operations personal

> Each Sales employee uses their own real personal account and consistent work devices.

### Principle 4: Do not make fingerprint browsers the default

> If there is no genuine account-isolation requirement, do not add one.

### Principle 5: Use a company-managed Sales network

> Sales employees should use a stable corporate endpoint that has been evaluated for compliance, reliability, and maintenance.

### Principle 6: Prioritize IP stability

> Avoid unnecessary country changes and complicated identity simulation.

### Principle 7: Centralize content production

> Marketing provides shared topics, assets, and content frameworks.

### Principle 8: Separate publishing identities

> Brand publishes brand content; Sales employees publish their own professional content.

### Principle 9: Use company permissions

> Official platform roles are better than shared account passwords.

### Principle 10: Build security redundancy

> Use a SIM, Authenticator, Passkey, and Recovery Codes as complementary safeguards.

### Principle 11: Keep devices and credentials company-controlled

> The Brand Publishing Workstation, brand assets, and core credentials belong to the company.

### Principle 12: Keep the system simple

> Do not add a complex tool unless it solves a real problem.

### Principle 13: Use a two-device Brand Environment

> The Brand Environment consists of a Brand Publishing Workstation and a Brand Social Phone.

### Principle 14: Let the workstation lead

> Content production, business administration, and primary publishing happen mainly on the Brand Publishing Workstation.

### Principle 15: Let the phone support

> The Brand Social Phone handles mobile apps, SIM, 2FA, login approvals, and mobile-only capabilities.

### Principle 16: Treat phone numbers as assets

> An overseas number is part of the company’s digital identity infrastructure, not merely a disposable OTP tool.

### Principle 17: Never make the phone number the only recovery path

> Corporate email, Authenticator / Passkey, Recovery Codes, backup administrators, and backup numbers form the recovery system.

### Principle 18: Keep network behavior stable

> The Brand Workstation and Brand Phone do not need identical IP addresses, but avoid frequent, unnecessary network and country changes.

### Principle 19: Keep device location genuine

> Do not use GPS spoofing, fake locations, or fabricated device environments to bypass platform security.

### Principle 20: Make mobile devices company assets

> The Brand Social Phone, Brand SIM, and account-recovery capabilities should belong to the company, not to one employee.

---

## 12. The Desired End State

A mature overseas B2B social media infrastructure should make the following routine:

~~~text
New employee joins
→ No need to learn complicated proxies or fingerprint browsers

Sales starts work
→ Consistent computer + company-approved network

Sales publishes an update
→ Employee publishes from their own profile

Brand publishes content
→ Brand Publishing Workstation is the main environment

A mobile function is needed
→ Brand Social Phone

An SMS verification is needed
→ Company-controlled Brand SIM

A Sales employee leaves
→ Company permissions and customer records can be recovered

A marketing employee leaves
→ Brand Workstation, Brand Phone, SIM, and accounts remain with the company

Brand Phone is damaged
→ Recover through corporate email, Recovery Codes, backup administrators, and backup numbers

SIM stops working
→ Not every account becomes unrecoverable

Brand Workstation is damaged
→ Rebuild the environment

Network fails
→ Use a documented backup route

The company grows
→ Extend the architecture without redesigning the basics
~~~

The result should be an overseas B2B social media operating system with:

- A small and clear set of accounts;
- Clearly assigned computer and phone responsibilities;
- Company-controlled numbers;
- Stable networks;
- Simple employee workflows;
- Redundant recovery paths;
- Controllable company assets;
- Low long-term maintenance costs.

The Brand Environment should be defined as:

~~~text
Brand Environment
│
├── Brand Publishing Workstation
│
├── Brand Social Phone
│
├── Corporate Overseas SIM
│
├── Stable Network
│
├── Corporate Email
│
├── Password Manager
│
├── Authenticator / Passkey
│
├── Recovery Codes
│
└── Platform Admin Permissions
~~~

—not as one account, one password, one SIM, and an employee’s personal computer and phone.

That is what makes an enterprise social media infrastructure maintainable, recoverable, transferable, and scalable.

---

## References and Ongoing Verification

The operator references in this guide were used to build a research snapshot dated **2026-08-18**. For any purchase involving number retention, roaming, KYC, OTP, number recycling, or SIM replacement, use the operator’s official terms on the purchase date.

- CTExcel UK — official website, FAQ, and terms;
- SoSIM — official FAQ, SIM validity, and roaming information;
- 1pMobile — official Terms and Conditions;
- giffgaff — official help and number-deactivation policy;
- Saily — official Help Center, phone-number service, and OTP / 2FA information;
- AdsPower — “Giffgaff Alternatives: eSIM and Overseas SIM Options” (for candidate discovery and industry issues, not as the final authority for operator policies).

> **Maintenance requirement:** Review official Terms, roaming policies, number-validity rules, and SIM replacement / eSIM reissue procedures for core candidate numbers at least quarterly.