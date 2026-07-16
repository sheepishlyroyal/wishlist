# Wishlist

Static site, Google Sheets backend via Apps Script, hosted on Cloudflare Pages from a private repo.

## 1. Backend — Google Sheet + Apps Script

1. Create a new Google Sheet (any name).
2. Extensions → Apps Script.
3. Delete the default `Code.gs` contents, paste in `apps-script.gs` from this repo.
4. In the function dropdown at the top, select `setAdminPassword`, click Run. Grant the
   permissions it asks for. This stores your admin password in Script Properties — edit
   the password in that function before running if you don't want `cam1`.
   (You can delete the function afterwards, the password stays stored.)
5. Deploy → New deployment → gear icon → type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Click Deploy, authorize again if prompted, copy the **Web app URL** (ends in `/exec`).

## 2. Frontend config

Open `config.js` and replace the placeholder with your Web app URL:

```js
window.WISHLIST_API_URL = "https://script.google.com/macros/s/XXXXX/exec";
```

## 3. Deploy to Cloudflare Pages (from a private repo, free)

1. Push this repo to GitHub (private is fine).
2. In the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git.
3. Authorize Cloudflare's GitHub App and grant it access to this repo (private repos work
   on the free plan — no GitHub Pro needed).
4. Framework preset: **None**. Build command: (leave blank). Build output directory: `/`.
5. Deploy. Cloudflare gives you a `*.pages.dev` URL immediately; add a custom domain
   under the project's "Custom domains" tab if you want one.

Every push to the connected branch auto-redeploys.

## Notes

- The admin password is checked server-side on every add/remove call (Apps Script
  verifies against Script Properties) — not just a client-side gate.
- Items live in a sheet tab called `Items`, created automatically on first request.
- To change the password later, re-run `setAdminPassword` with a new value (or edit the
  Script Property `ADMIN_PASSWORD` directly under Project Settings in the Apps Script editor).
