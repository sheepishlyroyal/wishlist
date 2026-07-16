# Wishlist

Static site on GitHub Pages. No backend at all — sync is done entirely through a
public Google Form + its linked Google Sheet, used as an append-only event log.

Every add/remove is one Form submission (`action`, `item id`, `name`, `note`, `link`).
The page reads the whole log via the Sheet's public JSON feed and replays it
(`add` inserts, `remove` deletes by id) to get the current list. No API key, no
service account, no server, nothing that can expire or get auto-revoked.

## Setup (one-time, ~5 min)

1. Go to **forms.google.com** → create a blank form (name doesn't matter, e.g. "Wishlist Sync").
2. Add 5 **Short answer** questions, in this exact order, none marked required:
   `Action`, `Item ID`, `Name`, `Note`, `Link`.
3. Settings (gear icon) → Responses → make sure **"Restrict to users in your
   organization"** and **"Collect email addresses"** are both **off**, so anonymous
   visitors can submit.
4. Responses tab → click the green Sheets icon → **Create a new spreadsheet**.
5. Top-right ⋮ menu → **Get pre-filled link**. Type a distinct dummy value into each
   field (e.g. `ACTIONVAL`, `IDVAL`, `NAMEVAL`, `NOTEVAL`, `LINKVAL`) → **Get link** →
   copy it. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.111=ACTIONVAL&entry.222=IDVAL&entry.333=NAMEVAL&entry.444=NOTEVAL&entry.555=LINKVAL
   ```
   - The `FORM_ID` is the string between `/d/e/` and `/viewform`.
   - Match each `entry.NNNNN=` number to the dummy value next to it — that tells you
     which entry ID belongs to which field.
6. Open the linked spreadsheet → **Share** → change general access to
   **"Anyone with the link" → Viewer**.
   - The `SHEET_ID` is the string between `/d/` and `/edit` in the sheet's URL.
   - Note the response tab's name (bottom tab, usually `Form Responses 1`).
7. Fill all of that into `config.js`:
   ```js
   window.WISHLIST_CONFIG = {
     FORM_ID: "1FAIpQLSc...",
     ENTRY_ACTION: "111",
     ENTRY_ITEM_ID: "222",
     ENTRY_NAME: "333",
     ENTRY_NOTE: "444",
     ENTRY_LINK: "555",
     SHEET_ID: "your-sheet-id",
     SHEET_TAB: "Form Responses 1",
     ADMIN_PASSWORD: "cam1",
   };
   ```
8. Commit and push — GitHub Pages redeploys automatically.

## Notes

- `ADMIN_PASSWORD` is checked entirely client-side (visible in the public source) —
  it's just a friction gate, not real access control, per the "doesn't need to be
  secure" call.
- Admin login persists in `localStorage`, so you won't be re-prompted on future visits
  in the same browser.
- The event log only grows (Sheet rows are never edited/deleted by the site), so a
  long-lived wishlist with lots of churn will accumulate rows — harmless, just
  slightly more to fetch/replay over time.
- Live at: https://sheepishlyroyal.github.io/wishlist/
