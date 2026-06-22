# oriz-india-holidays-api

India public holidays per year + state. Yearly snapshot from gazette + [Nager.Date](https://date.nager.at). PWA-installable docs.

## Endpoints

Served from `https://holidays.api.oriz.in` (GitHub Pages):

- `GET /data/latest.json` &mdash; current year's holidays
- `GET /data/holidays-YYYY.json` &mdash; specific year (e.g. `holidays-2026.json`)

### Response shape

```json
{
  "source": "https://date.nager.at/api/v3/PublicHolidays",
  "year": 2026,
  "fetchedAt": "2026-06-22T00:00:00.000Z",
  "count": 15,
  "holidays": [
    {
      "date": "2026-01-26",
      "name": "Republic Day",
      "localName": "Republic Day",
      "type": "Public",
      "states": null
    }
  ]
}
```

## Schedule

Refreshed yearly on **Jan 5 06:30 IST** via GitHub Actions (`.github/workflows/scrape.yml`). Manual refresh: `gh workflow run scrape.yml`.

## Credits

- Holiday data: [date.nager.at](https://date.nager.at) (public-data API, CC-BY)
- Authoritative reference: Government of India gazette notifications

## Local dev

```bash
npm run scrape   # writes data/holidays-YYYY.json + data/latest.json
```

## License

MIT &copy; 2026 Chirag Singhal.
