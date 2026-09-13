# Spot

Hyperlocal introduction and matching service connecting people with the personal trainers who fit their needs. Today's wedge is women in Bangalore societies finding vetted female trainers who train at their society gym; see `docs/PROJECT.md` for why this is a sequencing choice, not a permanent scope. This repo holds the browse page and the project context.

## Quick start (in Claude Code)
1. Open this folder as a project.
2. Read `CLAUDE.md`, then `docs/PROJECT.md`, `docs/DECISIONS.md`, `docs/SPEC.md`.
3. Preview: open `site/index.html` in a browser. It shows sample trainers until you set a sheet URL.
4. Go live: follow `docs/DEPLOY.md`.

## Structure
- `site/index.html`, the browse page, and the only thing ever published to the live URL.
- `CLAUDE.md`, project rules for Claude Code.
- `docs/`, the idea, decisions, spec and deploy notes. Private, never published.
- `reference/`, a downloaded snapshot of the live operating workbook (`PT_Marketplace_Operating_Repository.xlsx`): trainer, society, customer, request, introduction, payment and followup tracking, plus form question banks and controlled lists. Documentation only, not the live sheet. `docs/SPEC.md` explains every tab. Private, never published.
- `forms/`, Google Form specs to build by hand.
- `data/`, a sample CSV showing the expected `Trainer_Master` shape.

This repo stays private. The operating workbook, where `Trainer_Master` lives (phone numbers, full names, internal notes), is never published either. The browse page reads from a completely separate, hand-maintained Google Sheet with no formula link to the workbook, holding only public-safe fields. See `docs/SPEC.md`.

Style: no em dashes, sentence case, plain active voice.
