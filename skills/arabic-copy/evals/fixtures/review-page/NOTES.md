# What the code actually does

- `ExportPipeline` runs **seven** checks. Confirmed.
- Append-only on `ledger_entries` is enforced in **three** places:
  1. no route or controller offers an edit or a delete
  2. `LedgerEntry::updating` and `::deleting` throw
  3. database triggers reject UPDATE and DELETE
- `composer.json` requires `"php": "^8.3"`; the Dockerfile runs `php:8.4-fpm-alpine`.
- `laravel/framework` is pinned at `^12.0`.
