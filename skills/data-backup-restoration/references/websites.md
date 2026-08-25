# Websites During the August 2026 Data Separation

Use this reference for every question involving Manus-built or Manus-hosted websites, WebDev projects, databases, website files, domains, downtime, SEO, or migration.

## Contents

1. [What is happening](#what-is-happening)
2. [What a Manus website consists of](#what-a-manus-website-consists-of)
3. [What the Task Data Backup contains](#what-the-task-data-backup-contains)
4. [Snapshot risk for websites with live users](#snapshot-risk-for-websites-with-live-users)
5. [What happens during the deletion period](#what-happens-during-the-deletion-period)
6. [Maintenance page and SEO treatment](#maintenance-page-and-seo-treatment)
7. [What happens to domains](#what-happens-to-domains)
8. [How to back up a website](#how-to-back-up-a-website)
9. [What restoration brings back](#what-restoration-brings-back)
10. [Migration and temporary DNS changes](#migration-and-temporary-dns-changes)

## What is happening

As part of Manus's transition to independent operations, in-scope data must be deleted for affected accounts. The deletion period runs from August 23, 2026 at 8:00 a.m. through August 25 at 7:59 a.m. Singapore Time. Restoration opens at 8:00 a.m. on August 25.

If an account is unaffected, its websites continue operating normally and no action is required.

For an affected Type A/B account, a website is in scope when its task was created or updated on or after December 29, 2025 at 12:00 a.m. Pacific Time. A website completed before the cutoff and never updated afterward remains outside the task-deletion scope. A Type C account and its associated data are fully deleted and must follow the account-and-task restoration process.

Treat the user's email and in-app notification as the source of truth for affected status and exact deletion scope.

## What a Manus website consists of

A Manus website may include:

1. **Website code and static files:** Source code, uploaded images, and uploaded files.
2. **Website database:** Each full-stack website has its own database. Member registrations, orders, and other application data may live there.
3. **Domains:** A default or custom `manus.space` address, a custom domain connected by the user, or a domain purchased through Manus and its DNS records.
4. **Manus-hosted capabilities:** Built-in AI/LLM features, file uploads, maps, and similar services provided by Manus.
5. **Scheduled tasks:** Cron jobs and other scheduled work configured for the website.
6. **Website login:** Visitor account and login functionality hosted by Manus.
7. **Secrets:** Secret keys and environment variables configured for the website.
8. **Integration settings:** Configurations for services such as Stripe, Shopify, Expo/EAS, and other third-party integrations.

## What the Task Data Backup contains

A Task Data Backup preserves the selected website task as it existed when exported, including:

- Website code and static files.
- Uploaded images and files.
- The website database and its contents.
- Website configuration, secrets, and environment variables.
- Third-party integration settings configured in the website.

A source-code download is not a substitute for a Task Data Backup. Code alone does not include the website database, uploaded files, or the Manus-hosted capabilities the website depends on.

Domains are account assets rather than ordinary source files. Their expected restoration behavior is covered under [What happens to domains](#what-happens-to-domains).

## Snapshot risk for websites with live users

Emphasize that every Task Data export is a fixed point-in-time snapshot. It contains the website and database state that existed when that export was generated; it does not keep syncing afterward.

This matters especially for a live website. Registrations, orders, form submissions, uploads, content changes, and any other database activity that occurs after an export are not present in that snapshot. Restoring only that older export returns the website to that older state.

For a website with live users, recommend regular Task Data exports during the backup window and one final fresh export as close to the backup deadline as practical. Do not imply that the first completed backup continues protecting later activity.

When a user creates several complete snapshots, keep every complete export set. Restoration accepts multiple backup packages and deduplicates and consolidates them. Because restoration can only be completed once, the user must upload all correct and current packages in that restoration step. Never mix or replace split parts between different export runs.

## What happens during the deletion period

For an affected website in scope:

- Website data is deleted, including its configuration and database contents.
- The website database is unavailable. Direct connections from outside Manus, such as analytics connections, do not work during this period.
- Manus-hosted website capabilities are offline, including built-in AI/LLM features, file uploads, and maps.
- Scheduled tasks do not run.
- Website login is unavailable.
- Visitors see the standardized maintenance page.
- The website remains unavailable until the user restores the relevant Task Data Backup. It does not return merely because the restoration portal opens.

## Maintenance page and SEO treatment

Visitors see a neutral, unbranded page with this message:

> This site is under maintenance.
>
> We apologize for the inconvenience and appreciate your patience. Please check back later.

Website paths return HTTP `503 Service Unavailable` with a `Retry-After` header. The exception is `/robots.txt`, which remains available with HTTP `200` and allows crawling.

This follows [Google Search Central's guidance for a temporary one-to-two-day outage](https://developers.google.com/search/docs/crawling-indexing/pause-online-business): use an informational `503` page with `Retry-After`, but do not return `503` for `robots.txt`. The treatment is intended to signal that the outage is temporary and reduce risk to already indexed pages. Do not guarantee that rankings, indexing, or crawl timing will be completely unaffected.

Do not advise users to change DNS solely for SEO reasons during this short outage.

## What happens to domains

- **Default `manus.space` address:** Restored with the website. After the backup is restored and the site is redeployed, the same address works again.
- **Custom `manus.space` subdomain:** Restored with the website.
- **Custom domain connected to Manus:** Expected to reconnect automatically. The binding is preserved and the deletion does not change the user's external DNS records. Ask the user to check the connection after restoration.
- **Domain purchased through Manus:** Remains the user's account asset and is not deregistered. Its domain and DNS information are retained with the account or Account Info Backup, as applicable.

After users restore their data, remind them to check that their custom domain points back to their Manus website. If it does not, they can open the WebDev panel and reconnect the custom domain under **Settings → Domains**.

## How to back up a website

Complete the backup before August 23 at 7:59 a.m. SGT at [manus.im/backup](https://manus.im/backup).

- All affected users must manually export a Task Data Backup containing every affected website task they want to preserve.
- Type C users must create the Account Info Backup first and then the Task Data Backup. Type A/B users do not need an Account Info Backup because their account remains.
- Task Data, including websites, is not backed up automatically.
- Every export is a point-in-time snapshot and does not sync later changes. If the website has live users or changes after export, recommend regular exports and a final fresh export before the deadline.
- Confirm that all backup packages exist in the chosen destination. Do not modify or rename them.
- Without a Task Data Backup, an affected website and its data cannot be restored after deletion.

Use either of these product flows:

1. **Full updated Task Data snapshot:** Open [manus.im/backup](https://manus.im/backup), then choose **Export task data → Export more → All tasks → All time → Start export**.
2. **Website-only snapshot:** Choose **Export task data → Export more → Custom export → Website tasks → All time → Start export**. **Base data** is included automatically.

Prefer the full **All tasks / All time** export when the user wants the broadest current backup. Use the website-only custom export when the user specifically wants to refresh website data without exporting every other task category again.

Use the [official backup guide](https://help.manus.im/en/articles/16147892-service-change-overview-how-to-back-up-your-data) for export destinations, package handling, team cases, Facebook-login requirements, and troubleshooting.

## What restoration brings back

Restoration opens August 25 at 8:00 a.m. SGT at [manus.im/backup](https://manus.im/backup).

- Type A/B users log in and restore Task Data.
- Type C users restore the account first, log in, and then restore Task Data.
- The restored website returns to the snapshot captured by the backup, including its code, files, database contents, secrets, and integration settings.
- The user does not need to recreate the database or run a migration.
- A website deployed before backup is redeployed automatically after restoration.
- A draft project that was never published remains a draft; Manus does not publish it on the user's behalf.
- The site returns when its Task Data Backup is restored, not automatically when the restoration period begins. Restoring promptly shortens the downtime.
- Manus-hosted capabilities, database connections, scheduled tasks, and website login become available again with the restored website.
- Third-party connectors are restored but must be manually re-enabled.
- Restoration can only be completed once. Confirm that all correct and current packages are present before proceeding.

Use the [official restoration guide](https://help.manus.im/en/articles/16147895-service-change-overview-how-to-restore-your-data) for the complete sequence, package consolidation, and account-matching requirements.

## Migration and temporary DNS changes

Restoring from a Task Data Backup is the most reliable path because the website database, files, configuration, domains, and Manus-hosted capabilities are rebuilt inside Manus.

Manus has no official method for migrating the complete service elsewhere for the roughly two-day deletion period. Strongly advise against transferring the deployment or domain ownership. An exported code copy alone does not contain the database, uploaded files, or the Manus-hosted capabilities the website uses.

Acknowledge the disruption and apologize. Recommend backing up, waiting for restoration to open, and restoring promptly. Let eligible affected users know that welcome-back rewards are available and link to [Welcome Back Bonus for Affected Users](https://help.manus.im/en/articles/16147914-service-change-overview-welcome-back-bonus-for-affected-users).

Do not proactively recommend DNS changes. If an affected user with a custom domain asks for an alternative, explain that they may temporarily point it to a simple externally hosted maintenance or status page while keeping the domain ownership and Manus deployment in place.

- **Domain purchased through Manus:** DNS records can be managed under **Settings → Deployments → Domains**. Make the change before the deletion period because affected users cannot access these settings during downtime.
- **Domain registered elsewhere and connected to Manus:** The user manages DNS through the existing registrar or DNS provider.
- **Manus-provided subdomain:** Its DNS cannot be pointed elsewhere. It uses the standard maintenance response during the outage.

After restoration, remind the user to check that the custom domain points back to the Manus website and reconnect it under **Settings → Domains** if needed.
