# Wishlist

Static site on GitHub Pages, synced through Firebase Firestore (project `wishlist-sync-1365`).
No server of any kind — the page talks to Firestore directly over its client SDK, in
real time (every open tab updates instantly when the data changes anywhere else).

Firestore rules are wide open (`allow read, write: if true`) — anyone with the site
URL can read or write the `items` collection directly. That's intentional: this isn't
meant to be a secure app, just a convenient shared list. The admin password gate on
the page is a client-side-only UI convenience (persisted in `localStorage`), not real
access control.

## What's in `config.js`

The Firebase Web SDK config (`apiKey`, `projectId`, etc.) is not a secret — Firebase
access control is enforced by the Firestore rules above, not by hiding these values.
Safe to have in a public repo as-is.

## Data model

Each wishlist item is a Firestore document in the `items` collection:

```
{ name, note, link, nodes: [{ name, link, position }], createdAtMs, createdAt }
```

`nodes` power the "best case scenario ↔ still really good scenario" slider — each
node is an alternative option (name + optional link) placed at `position` (0–100)
along that spectrum. Admin can add as many as they want and drag them into place;
they render as clickable markers on the public page too.

## Managing the Firebase project

- Console: https://console.firebase.google.com/project/wishlist-sync-1365/overview
- Firestore data: https://console.firebase.google.com/project/wishlist-sync-1365/firestore/databases/-default-/data
- To tighten the rules later, edit `firestore.rules` in a `firebase init firestore`
  directory pointed at this project and `firebase deploy --only firestore:rules`.

## Hosting

GitHub Pages, deployed from the `main` branch root. Live at:
https://sheepishlyroyal.github.io/wishlist/

Any push to `main` redeploys automatically (may take a minute to show up).
