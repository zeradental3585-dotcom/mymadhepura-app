# myMadhepura.com

Madhepura's local business directory. Next.js (App Router) + Tailwind CSS,
deployed on Vercel. Listing data is read from a published Google Sheet CSV
(falls back to a local snapshot in `src/data/listings.csv` if unset).

## Development

```bash
npm install
npm run dev
```

## Environment variables

See `.env.example`. Set these in Vercel project settings:

- `SHEET_CSV_URL` — published CSV link for the Listings tab of the Google Sheet
- `NEXT_PUBLIC_ADD_LISTING_FORM_URL` — Google Form link for new business submissions

## Deploy

Push to `main` — Vercel auto-deploys. Domain DNS is managed through Hostinger,
pointed at Vercel.

## Data refresh

New business submissions land in the Sheet's "Submissions" tab via the Google
Form. Review and copy approved rows into the "Listings" tab; the site
revalidates listing data automatically (hourly) or on the next deploy.

---
Designed and developed by [Zera Technologies](https://zeratech.io/).
