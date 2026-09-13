# Spot

Hyperlocal intro service connecting women in Bangalore societies with vetted female trainers who train at their society gym. This repo holds the browse page and the project context.

## Quick start (in Claude Code)
1. Open this folder as a project.
2. Read `CLAUDE.md`, then `docs/PROJECT.md`, `docs/DECISIONS.md`, `docs/SPEC.md`.
3. Preview: open `site/index.html` in a browser. It shows sample trainers until you set a sheet URL.
4. Go live: follow `docs/DEPLOY.md`.

## Structure
- `site/index.html`, the browse page, and the only thing ever published to the live URL.
- `CLAUDE.md`, project rules for Claude Code.
- `docs/`, the idea, decisions, spec and deploy notes. Private, never published.
- `reference/`, the full operating workbook (`PT_Marketplace_Operating_Repository.xlsx`): trainer, society, customer, request, introduction, payment and followup tracking, plus form question banks and controlled lists. `docs/SPEC.md` explains every tab. Private, never published.
- `forms/`, Google Form specs to build by hand.
- `data/`, a sample CSV showing the expected `Trainer_Master` shape.

This repo stays private. The Trainer_Master tab in the operating workbook (phone numbers, full names, internal notes) is never published either, only a filtered `Trainer_Public_View` tab is. See `docs/SPEC.md`.

Style: no em dashes, sentence case, plain active voice.
