---
title: "Paid Advertising From Scratch: A Practical Guide to Media Buying, Ad Data & Major Platforms"
date: 2026-11-19 15:10:00 +0800
lang: en
description: "A beginner's guide to paid ads, covering pricing models, campaign metrics, search and feed ads, ad networks, DSPs, major platforms and channel selection."
translation_url: /blog/paid-advertising-guide/
---

> **The Bottom Line:** Paid advertising is fundamentally about buying opportunities to reach users from traffic platforms (such as Google, TikTok, Facebook, and news websites), and then converting that attention into customers or orders through ad creatives, landing pages, and follow-up sales.
>
> However, keep in mind: **buying impressions or clicks does not equal buying closed sales.** Final performance also depends on whether your audience targeting is accurate, whether your product fits the market, whether your page persuades visitors, and whether conversion data is tracked properly.

---

## 1. Understanding How Ads Charge You (6 Common Pricing & Settlement Models)

If you look at advertising like running an offline business, platforms or publishers generally charge you in 6 common ways. They are roughly ordered by the user journey—from seeing an ad to completing a purchase.

One clarification upfront: different platforms define bidding methods, optimization goals, and actual billable events differently. The concepts below represent common industry models and do not mean every platform offers every option.

* **CPT / CPD (Cost Per Time / Cost Per Day):** Renting a billboard. The advertiser buys a fixed ad placement or time slot in advance, rather than settling based on actual clicks or orders. Common for website homepage banners, mobile app splash screens, special campaign placements, or video platform homepage brand takeovers. Publishers may refer to this as CPT, CPD, or fixed rate-card pricing—always confirm placement location, duration, traffic guarantees, and rotation rules before buying.
* **CPM (Cost Per Mille):** Flyer printing costs. Fees are calculated per **1,000 impressions** (*mille* is Latin for thousand) at an agreed rate. Costs accrue even if users do not click or buy. Commonly used for brand awareness, product launches, and expanding reach. Note that standard impressions and **Viewable Impressions** are measured differently.
* **CPV (Cost Per View):** Pay-per-watch. Used primarily for video ads—a billable view is counted only when a viewer meets the platform's valid view threshold or engages with the ad according to platform rules. Specific thresholds depend on the platform and ad format: for example, YouTube defines views differently across different video formats, and TikTok has its own view and interaction rules. "Watching for 30 seconds" is not a universal standard across all platforms.
* **CPC (Cost Per Click):** A store-entry fee per visitor. Displaying the ad typically does not generate a CPC charge on its own; you are billed only when a user clicks the ad. Search ads on Google, Microsoft, and Baidu—as well as many native content recommendation ads and marketplace keyword ads—commonly use CPC pricing. Click-based advertising is also broadly referred to as **PPC (Pay Per Click)**.
* **CPA (Cost Per Action / Acquisition):** Measure the cost of a defined action. This is where misunderstandings happen most often: CPA is first and foremost a cost metric for a designated action, and platforms frequently use it as an optimization goal or target bid—it does **not** mean every platform waits until a user completes an action before charging you. Only specific ad products that explicitly offer "pay for conversions" actually bill on conversion events. Many ad accounts set a target CPA while still being billed per click or per impression, with the system automatically adjusting bids to aim for that target cost. Measuring lead-form or phone-inquiry costs is commonly called **CPL (Cost Per Lead)**; measuring app-install costs is commonly called **CPI (Cost Per Install)**.
* **CPS (Cost Per Sale):** Pure sales commission. After a promoter or affiliate partner brings in a valid order, the merchant pays a commission based on actual sales revenue or agreed terms. Common in TikTok Shop creator affiliates, Amazon Associates, affiliate networks, and cashback partnerships. While it does not require buying large volumes of upfront impressions like traditional ads, it is not completely cost-free: network service fees, commissions, returns, invalid orders, and creative production must all be factored into your accounting.

### Breaking Down the Three "CPM Brothers"

Modern social and short-video ad managers frequently display **CPM, oCPM, and eCPM**. They look similar, but each serves a distinct role.

| Concept | What It Is | Plain-English Meaning | Who Operates It? |
| :--- | :--- | :--- | :--- |
| **CPM** | **Impression-Based Bidding / Pricing** | You tell the platform: "I am willing to pay X amount per 1,000 impressions." Delivery focuses primarily on impressions and reach goals. | Advertiser sets bid or budget; platform enters auctions |
| **oCPM** | **Optimized Cost Per Mille Bidding** | On platforms supporting oCPM, you ask the system to find people more likely to complete a specific action. The algorithm uses user signals to adjust bids automatically, while billing is still typically calculated per impression rather than waiting for each sale. | Advertiser sets goal or target bid; platform algorithm optimizes automatically |
| **eCPM** | **Effective Cost / Revenue Per Mille Metric** | Converts costs or revenues from different pricing models into a unified "money per 1,000 impressions" figure to compare placement or traffic efficiency. It is a calculated metric, not a billing button advertisers select. | Calculated automatically by the system from actual data |

> **A simplified example:** If a CPC ad costs $1 per click with a 2% click-through rate, its equivalent eCPM is roughly $20 (`$1 × 2% × 1,000`). Another ad with a lower cost per click might not end up with a lower effective cost per thousand impressions if its click-through rate is also very low.
>
> Keep in mind this is a simplified illustration. Real-world ad auctions also weigh ad quality, estimated action rates, audience competition, placements, and platform rules—so you cannot assume "whoever has the highest eCPM automatically wins the ad slot."

**Note:** Search and native ad platforms also commonly feature **oCPC (Optimized Cost Per Click)**. It generally means the system automatically adjusts click bids based on conversion goals, while actual billing may still occur per click. Exact definitions, optimization objectives, and settlement rules for oCPC and oCPM depend on each platform's documentation.

---

## 2. How to Read Ad Dashboards & Website Analytics Reports

When opening any ad platform dashboard (such as Google Ads, Meta Ads Manager, TikTok Ads Manager, or native ad networks), the dozens of columns become much easier to read when ordered by the user journey from seeing an ad to purchasing.

### 1. Core Ad Dashboard Metrics (In User-Journey Order)

* **IMP / Impressions:** Total number of times the platform records your ad as displayed. One person seeing the ad 3 times normally generates 3 impressions, which is not the same as unique **Reach**. Platforms may differ in when they log an impression and how they define a **Viewable Impression**.
* **Clicks:** Number of times users clicked your ad. Clicks do not always equal website sessions recorded by your analytics: users may close the page immediately after an accidental click, or network delays, redirects, and tracking-script issues may cause discrepancies between ad clicks and site visits.
* **CTR (Click-Through Rate):** `Clicks ÷ IMP × 100%`. Measures an ad's ability to earn clicks and helps evaluate whether your image, video, headline, value proposition, and audience align. If 1,000 impressions generate only 2 clicks, CTR is 0.2%. That warrants reviewing your creative and targeting, though a single metric alone does not prove a creative is broken.
* **CPC (Average Cost Per Click):** `Cost ÷ Clicks`. Average amount spent per ad click. Improving CTR can sometimes improve ad quality and auction efficiency, but CPC is also shaped by competition, ad quality, audience, placement, and bidding strategy—so higher CTR does not automatically guarantee lower CPC.
* **Cost / Spend:** Ad fees accrued during the selected period. Be careful to distinguish between dashboard spend figures, actual account charges, and invoice amounts. Tax treatment varies by country, business entity, and platform—dashboard `Cost` may exclude taxes that are added at billing or invoicing, so do not apply one platform's tax handling to all accounts.
* **CV / Conversions:** Number of times users completed your defined target action after clicking or viewing an ad (such as placing an order, submitting a form, signing up, or installing an app). Conversion counts depend on event setup, attribution windows, and deduplication rules, and may not match back-end order counts one-to-one.
* **CVR (Conversion Rate):** In this simplified funnel, calculated as `CV ÷ Clicks × 100%` to measure post-click conversion performance. Different platforms may use impressions, clicks, landing-page views, or other denominators—always verify the definition before comparing reports.
* **CPA (Cost Per Action / Acquisition):** `Cost ÷ CV`, the average ad spend required to generate one target conversion. Mathematically, it can also be expressed as `CPC ÷ CVR` (when using consistent click denominators). Raising landing-page `CVR` from 1% to 3% cuts acquisition cost by two-thirds even if `CPC` stays flat.
* **Revenue:** Total gross order value attributed to your ad campaigns.
* **AOV / ARPO (Average Order Value):** `Revenue ÷ Number of Orders`. Average revenue per order (modern e-commerce uses AOV; older reports sometimes write ARPO).
* **ROAS vs. ROI (Return Metrics):**
  * **ROAS (Return on Ad Spend):** `Revenue ÷ Cost`. The standard top-line return metric in ad dashboards. Spending $100 on ads to generate $350 in order value gives a ROAS of **3.5** (or 350%). **ROAS measures gross sales revenue only and does not deduct product costs or shipping.**
  * **ROI (Return on Investment):** Net profit return after deducting product costs (COGS), shipping, taxes, and ad spend. If your product has a 50% gross margin, a ROAS of 2.0 means gross profit equals ad spend before other operating costs. It does not necessarily mean the business has broken even. You still need to account for shipping, taxes, payment fees, returns, and other expenses to calculate your actual break-even ROAS.
* **Frequency:** `IMP ÷ Reach`. Average number of times each unique person has seen your ad. A rising frequency can indicate audience fatigue, but there is no universal warning threshold for every industry or ad format. Check it alongside changes in CTR, CPA, conversion rate, audience size, and campaign duration before deciding to refresh creatives.
* **KPI (Key Performance Indicator):** The target benchmark used to judge whether a campaign succeeds (e.g., keeping CPA under $15 or maintaining ROAS above 3.0).

### 2. Website Traffic Basics (Evaluating Landing Page Engagement)

Once ads bring visitors onto your site, three foundational web analytics metrics measure site engagement:

* **PV (Page View):** Total number of pages loaded. If one visitor refreshes a page 5 times or views 5 different pages, PV equals **5**.
* **UV (Unique Visitor):** The number of visitors a measurement system identifies as unique within a selected reporting period. Identification commonly relies on cookies, device identifiers, or login information, so UV is not an exact count of real-world individuals. The same person may be counted more than once when switching devices or browsers, or after clearing cookies.
* **Visit / Session:** A period of interaction with your website, as defined by the analytics tool. For example, someone visits in the morning, views 3 pages, and leaves (1 Session and 3 PVs), then returns that evening (potentially a second Session). Session timeout and restart rules depend on the analytics platform. A high number of Sessions with only 1 PV per Session may indicate that visitors are not exploring further, but this is not automatically a poor experience—a visitor who lands on a useful article, reads it, and leaves may already have achieved their goal.

### 3. Three-Step Troubleshooting Rule of Thumb (What to Fix When Numbers Look Bad)

* **Low or Zero Impressions (IMP):** Check whether the budget or bid is too low, whether location, schedule, or audience targeting is too restrictive, and whether the ad, campaign, and account have passed review and are eligible to deliver.
* **Impressions Without Clicks (Low CTR):** Your image, opening 3 seconds of video, or headline is failing to hook the audience—test new creatives instead of blindly raising bids.
* **Clicks Without Conversions (Low CVR):** The ad is generating clicks, but the issue may be in the post-click experience, traffic quality, or conversion tracking. Check page speed, message consistency between the ad and landing page, product information, pricing, reviews and trust signals, calls to action, form length, and whether the visitors match your target audience. Also verify that conversion tracking is working correctly.

---

## 3. Clarifying Four Easily Confused Concepts: SEM, In-Feed Ads, Ad Networks & DSPs

Beginners often mistake these four terms for parallel ad types, when they actually describe **four different dimensions of digital advertising**—much like dining out: **"which restaurant you choose (SEM)," "how the dish is plated (In-Feed)," "pre-packed combo meals from a central kitchen (Ad Network)," and "an automated smart-ordering system (DSP)."**

| Dimension | SEM (Search Engine Marketing) | In-Feed Ads | Ad Network | DSP (Demand-Side Platform) |
| :--- | :--- | :--- | :--- | :--- |
| **One-Sentence Essence** | **Search marketing** within search engines | **Ads integrated into content feeds, with clear sponsored labels** | **Traffic wholesaler** aggregating websites and apps | **Programmatic buying system using available audience and contextual signals** |
| **Classification Angle** | By **traffic entry point** | By **ad display format** | By **inventory aggregation model** | By **programmatic buying tech** |
| **Where Ads Appear** | Search engines | Inside social, short-video, and news feeds | Partner websites and apps | Ad inventory available through connected exchanges and media partners |
| **How It Finds Users** | **Keywords** (active user search) | **Platform algorithms** (in-app behavior and available signals) | **Site-category bundles** (buying site packages) | **Audience signals, contextual data, and identifiers permitted by the platform** |
| **Representative Platforms** | Google Ads, Bing, Baidu | Meta, TikTok, Douyin, Xiaohongshu | Google GDN, Pangolin, Youlianghui | The Trade Desk, Criteo, Google DV360 |

* **SEM (Search Engine Marketing):** Marketing conducted through search engines such as Google, Bing, and Baidu. In a broad definition, it includes both **paid search ads (PPC)** and organic **SEO (Search Engine Optimization)**. In day-to-day campaign management, SEM often refers specifically to paid search. In this guide, when comparing paid media channels, SEM primarily refers to paid search. Its core logic is "users actively searching for solutions."
* **In-Feed Ads:** An ad format placed within content streams on social apps, short-video feeds, or news portals (including social feeds like Meta/TikTok and news recommendation widgets like popIn/Taboola). The layout may fit the surrounding content, but the placement should still be clearly identified as advertising or sponsored content. Its core logic is "ads reaching users and generating interest."
* **Ad Network:** An intermediary platform that aggregates ad inventory from multiple independent websites, blogs, and mobile apps, packaging it by category, placement, or audience for advertisers (such as Google Display Network, Pangolin, and Youlianghui; native platforms like popIn, Dable, and Taboola focus on content-recommendation inventory).
* **DSP (Demand-Side Platform):** A system advertisers use to buy ad inventory programmatically (for example, through platforms such as The Trade Desk and DV360). A DSP can connect to ad exchanges, supply-side platforms (SSPs), and media inventory. When an ad opportunity becomes available, it evaluates the bid, available audience signals, page context, and other permitted information before participating in the auction. A DSP does not automatically recognize the same person everywhere online: cross-site and cross-app identification is subject to browser restrictions, device-identifier policies, user consent, and privacy regulations. Some campaigns rely more heavily on first-party data or contextual targeting.

> **A Real-Life Scenario Connecting All Four:**
> 1. You want a home espresso machine, so you search "best home espresso machine" on Google and click the top sponsored brand link—that is **SEM (Search Ads)**.
> 2. You leave without buying. That evening while scrolling Instagram or TikTok, a review video of that same espresso machine appears between regular posts—that is an **In-Feed Ad**.
> 3. You still hold off. The next day, you open a free mobile game or local news site and see a banner ad at the bottom—that ad slot comes from an **Ad Network**.
> 4. If the campaign can use permitted audience signals to determine that you may be interested in the espresso machine, a DSP can participate in the auction for that ad placement and help deliver a relevant reminder. The system may use first-party data, contextual information, or other permitted identifiers; it is not guaranteed to recognize the same person across every website or app.

---

## 4. Six Major Ad Types, Pricing Models & Playbooks

Based on user browsing behavior, mainstream paid advertising breaks down into 6 core channels:

### 1. Search Ads (Common Pricing: CPC, with Conversion-Goal Bidding Support)
* **How You Pay:** Cost Per Click (CPC). Appearing on the search results page is free; you pay only when a user clicks through to your site. Modern platforms also allow conversion-target bidding (such as tCPA / tROAS / oCPC) where the system adjusts click bids automatically.
* **Channel Dynamics:** Active intent ("people looking for solutions"). Users type specific queries into a search box, often revealing a clear need or product interest.
* **Typical Platforms:** Google Search, Microsoft Ads (Bing), Yahoo Search, Baidu, 360 Search, Sogou.
* **Operational Playbook:**
  * **Segment Keywords by Intent:** Split campaigns into **Brand Keywords** (low-cost defense against competitors bidding on your name), **Core Category Terms** (primary volume drivers), and **Long-Tail Problem/Comparison Terms** (e.g., "how to choose X" or "A vs. B," which may be useful because they express more specific needs, although their conversion performance still depends on the actual search intent).
  * **Broad Match + Smart Bidding:** Broad Match can help discover relevant searches beyond the exact keywords you entered. Test it with Target CPA (tCPA) or other automated bidding only when conversion tracking is reliable and the account has enough useful conversion data. New accounts or campaigns with limited data should not copy this setup blindly.
  * **Negative Keyword Reviews:** Review Search Terms reports regularly and exclude irrelevant queries (such as "free," "repair," "used," or "jobs") that do not match your business. Check more frequently during the early stage of a campaign, then adjust the review schedule as the account stabilizes.
  * **Maximize Ad Assets:** Populate sitelinks, callouts, structured snippets, pricing, phone numbers, and image extensions to expand screen coverage.

### 2. Native Content Recommendation Ads (Common Pricing: CPC; CPM Also Supported on Some Platforms)
* **How You Pay:** Primarily CPC—you pay nothing until a reader clicks your article card (some platforms also support CPM or oCPC).
* **Channel Dynamics:** Readers may encounter sponsored recommendations while browsing news or other content. These placements often use a layout that fits the surrounding content, but the advertising or sponsored nature should remain clear. They can be useful when a product benefits from explanation, comparison, or an informative introduction.
* **Typical Platforms:** popIn, Dable, LINE TODAY native placements (Asia-Pacific/Chinese markets); Taboola, Outbrain, MGID, Revcontent (Global/Western markets).
* **Operational Playbook:**
  * **Choose the Landing Page Based on Decision Complexity:** If a product requires explanation, comparison, or trust-building, send visitors to a content-led landing page (pre-lander) before directing them to a product page or inquiry form. If the user's intent is already clear, a direct product page may work better. A pre-lander is an option, not a mandatory step for every campaign.
  * **Creative That Fits the Placement:** Use authentic in-context photos, product close-ups, or silent looping GIFs where appropriate. Headlines can create curiosity, but they should accurately represent the landing-page content and must not disguise the ad as independent editorial reporting.
  * **Publisher / Site Optimization:** Traffic may come from many partner websites. Review site- and placement-level reports regularly, and use visit quality, conversion quality, CPA, and signs of invalid traffic to identify weak placements. Exclude poor-quality sites and adjust bids or budgets for stronger placements where the platform allows it.

### 3. Social & Short-Video In-Feed Ads (Common Pricing: oCPM / CPM / CPC / CPV)
* **How You Pay:** The billing method depends on the platform, campaign objective, and ad format. Brand-awareness campaigns commonly use CPM; conversion, lead-generation, or app-install campaigns may use oCPM; click-focused campaigns may use CPC; and video-view campaigns may use CPV. These are common patterns, not universal rules for every social platform.
* **Channel Dynamics:** Passive discovery ("products finding people"). Users are often browsing content rather than actively searching for a product. Relevant images, videos, and messages can introduce a product, generate interest, and sometimes create purchase intent.
* **Typical Platforms:** Meta (Facebook / Instagram), TikTok Ads, YouTube Shorts, Snapchat, Pinterest, X (Twitter); Douyin/Ocean Engine, Tencent Ads (WeChat Moments/Channels), Xiaohongshu, Kuaishou.
* **Operational Playbook:**
  * **Keep the Account Structure Clear:** Avoid splitting budgets across too many narrowly defined audiences and ad groups. Broad Targeting or automated campaigns (such as Meta Advantage+ sales campaigns or TikTok Smart+) can be tested, but the right level of targeting depends on the product, market, budget, and historical data. Not every account should remove all targeting controls.
  * **Win the First 3 Seconds (The Hook):** Social feeds burn through creatives quickly. Open every video with a sharp pain point, counterintuitive claim, or dramatic before-and-after contrast to stop the scroll.
  * **Configure Server-Side Tracking (CAPI / Events API):** For website conversion campaigns, server-side event reporting can supplement browser-based tracking. Set up event deduplication, consent management, and privacy compliance correctly. Server-side tracking can help reduce measurement gaps, but it cannot guarantee that every conversion will be captured or replace accurate event definitions.

### 4. Shopping & E-Commerce Marketplace Ads (Common Pricing: CPC, with Automated Bidding Options)
* **How You Pay:** Taobao Zhitongche, Amazon Sponsored Products, and Google Shopping commonly use CPC pricing. Some platforms also offer automated bidding that optimizes for conversions or conversion value. **An automated target such as tROAS is not itself a billing method, and it should not be treated as synonymous with oCPM.** Google Performance Max can use different billing events depending on where the ad appears: Search and Shopping placements are generally charged by clicks, while some YouTube in-stream formats may be charged by impressions.
* **Channel Dynamics:** Shelf comparison ("ready to compare and buy"). Ads display product images, prices, star ratings, and promo badges directly to shoppers comparing options.
* **Typical Platforms:** Google Shopping (and PMax), Meta Dynamic Product Ads (DPA), Criteo; marketplace tools like Amazon Sponsored Products, Shopee Keyword Ads, Taobao Zhitongche, Pinduoduo Search.
* **Operational Playbook:**
  * **Optimize Your Product Feed:** Product titles, brands, model numbers, attributes, and images help platforms understand and match products to relevant searches and shoppers. Put important product information where users can easily recognize it, use clear and accurate main images, and avoid stuffing titles with unrelated keywords.
  * **Segment Bids by Profit Margin:** Group SKUs into high-margin bestsellers, traffic drivers, and clearance items, giving high-margin products looser ROAS targets to scale aggressively.
  * **Dynamic Retargeting:** Where supported and permitted, show relevant product ads to visitors who viewed an item or added it to their cart without completing checkout. Apply the required consent and privacy controls, and manage frequency so reminders do not become intrusive.

### 5. Display / Banner Ads (Common Pricing: CPM / CPC)
* **How You Pay:** CPM or CPC for banner images placed in website headers, sidebars, and mobile app screens.
* **Channel Dynamics:** Display ads can expand brand reach and reach new audiences, as well as support retargeting. For retargeting, they can remind previous visitors to return and continue evaluating a product or complete a purchase. The performance of cold audiences varies by offer, audience, placement, and campaign objective, so it should be measured rather than assumed.
* **Typical Platforms:** Google Display Network (GDN), The Trade Desk (TTD), Criteo, Baidu Baiyi, Tencent Youlianghui, Pangolin.
* **Operational Playbook:**
  * **Use Retargeting Where It Makes Sense:** If the budget is limited, start by testing audiences who visited your site, viewed products, or abandoned carts, then evaluate incremental conversions. Display campaigns can also be used to reach new audiences, but assess their audience quality and acquisition cost separately.
  * **Review Low-Quality Placements:** Check website, app, and placement reports. Exclude inventory that is clearly irrelevant, has unusually high accidental-click rates, or does not fit the brand. Whether to exclude gaming or children's apps should depend on the target audience, campaign objective, and actual placement quality—not an automatic blanket rule.
  * **Manage Impression Frequency:** Where the platform supports frequency caps, limit repeated exposure over a suitable period. Set the cap based on audience size, campaign duration, and performance data rather than applying one fixed number to every campaign.

### 6. Affiliate Marketing & Creator Commission Ads (Common Settlement: CPS / CPA / CPI)
* **How You Pay:** Performance-based commissions—CPS as a share of completed sales, or CPA/CPI for verified actions such as leads or installs. This can reduce the need to buy large volumes of media upfront, but merchants still need to account for commissions, platform fees, returns, invalid orders, and creative production.
* **Channel Dynamics:** Performance-based distribution ("pay after a qualifying result"). You list products and commission terms on a network, allowing review publishers, coupon sites, and creators to decide whether the offer fits their audiences. The model can reduce upfront media-buying risk, but it does not eliminate business costs or attribution risks.
* **Typical Platforms:** Impact, CJ Affiliate, ShareASale, Rakuten Advertising, ClickBank; creator programs like TikTok Shop Affiliate, Amazon Associates, YouTube Shopping Affiliate, Douyin Affiliate.
* **Operational Playbook:**
  * **Design Tiered Commission Incentives:** Act like a channel partnership manager—offer a base commission (e.g., 15%), volume bonuses (20% above a monthly threshold), and exclusive creator discount codes to win top placement.
  * **Provide Ready-to-Use Creative Kits:** Upload proven high-converting images, comparison charts, and video scripts to the affiliate portal to lower creator friction.
  * **Audit Attribution Against Fraud:** Monitor click-to-conversion timestamps and reject commissions from rogue browser extensions that inject hidden cookies at checkout to hijack organic sales.

---

## 5. Quick-Pick Matrix: Choosing Channels for a New Project

Use this table whenever launching a new product or business line to select your starting channel:

| Your Product / Business Scenario | Best Pricing Model | Priority Platforms | #1 Key to Success |
| :--- | :--- | :--- | :--- |
| **Clear problem/solution; customers actively search online** | **CPC** (Search) | Google Search, Bing, Baidu | Keyword intent precision + daily negative keywords |
| **Novel, visual, impulse-buy consumer product** | **oCPM** (In-Feed) | Meta (FB/IG), TikTok, Douyin, Xiaohongshu | Strong 3-second video hooks + fast creative testing |
| **Higher ticket, health/beauty/functional item needing explanation** | **CPC / CPM** (Native) | Dable, popIn, Taboola, Outbrain | Credible explanatory content + clear ad labeling + landing-page fit |
| **Standard retail SKU competing on price and product photo** | **CPC / automated conversion-value bidding** (Shopping) | Google Shopping (PMax), Amazon, Shopee | Accurate product feed + margin-based bidding + order conversion |
| **High website traffic with heavy cart abandonment** | **CPC / CPM / platform-supported conversion optimization** (Retargeting) | Google GDN, Criteo, Meta Dynamic Ads | Audience quality + frequency management + incremental results |
| **Product with proven demand, ready to scale through partners** | **CPS / CPA** (Affiliate) | TikTok Shop Affiliate, Impact, ShareASale | Sustainable commissions + useful creative assets + reliable attribution |

---

## References & Official Documentation

Use official platform documentation to verify current billing events, bidding strategies, view thresholds, and attribution rules. Advertising products change over time, so always check the rules for your target market, account type, and campaign format.

- [Google Ads: About cost-per-view (CPV) bidding](https://support.google.com/google-ads/answer/2382888)
- [Google Ads: About bidding](https://support.google.com/google-ads/answer/2472725)
- [Google Ads: How Performance Max costs are calculated](https://support.google.com/google-ads/answer/15899323)
- [TikTok Ads Manager: Bidding methods](https://ads.tiktok.com/resources/help/article/bidding-methods)
- [Taboola Publisher Help: Sponsored content policies](https://pubhelp.taboola.com/hc/en-us/articles/1500012249782-How-is-Taboola-following-Google-s-Sponsored-Content-Policies)