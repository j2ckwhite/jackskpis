# jackskpis — public Pulse dashboard

Read-only mirror of the RoleMade Pulse KPI dashboard, hosted publicly (via Vercel) so family can check in
on the numbers without needing edit access or a login.

This repo is separate from the private business workspace on purpose — it only ever contains one static
HTML file with a data snapshot baked in. It does not auto-update; you refresh it every few days by hand.

## One-time setup (already done)

- Repo created and pushed: https://github.com/j2ckwhite/jackskpis
- Connect it to Vercel once: go to https://vercel.com/new, "Import" this GitHub repo, accept the defaults
  (framework preset "Other", no build command needed — it's a single static `index.html`), deploy.
  After that, every `git push` to this repo auto-deploys.

## Updating the numbers (every few days)

1. Open your local dashboard (`output/dashboards/rolemade-kpi/index.html`) in a browser.
2. Click **Backup** in the header — downloads `pulse-kpi-backup-YYYY-MM-DD.json`.
3. Run the publish script from this folder:
   ```
   node publish.js path/to/pulse-kpi-backup-YYYY-MM-DD.json
   ```
   This bakes that data into `index.html` here as a read-only snapshot (no Add/Edit/Delete/Import
   buttons — just the numbers and charts) and stamps the "Data as of" date shown in the header.
4. Review the file, then commit and push:
   ```
   git add index.html
   git commit -m "update: YYYY-MM-DD"
   git push
   ```
   Vercel picks up the push automatically and the public link updates within a minute or two.

Or — simpler — just hand Claude the downloaded backup JSON and ask it to publish and push. It'll run
the same three steps above.

## Notes

- The public link has no login. Anyone with the URL can see it. Client names and real revenue figures
  are included as-is (confirmed fine for this use case).
- Editing the public copy in a visitor's browser (there isn't an edit UI, but just in case) never touches
  your real data — it's a separate file with its own local state, not connected to your working dashboard.
