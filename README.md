# mttle

Hyperlocal introduction and matching service connecting people with the personal trainers who fit their needs. Today's wedge is women in Bangalore societies finding vetted female trainers who train at their society gym, a sequencing choice, not a permanent scope. This repo holds the browse page; the project's business and technical context live in local-only files, not in this repo.

## Quick start (in Claude Code)
1. Open this folder as a project.
2. Read `CLAUDE.md`. It points to two local-only playbook files in the sibling `playbook/` folder (next to this repo, not inside it) with the full product and technical context; if you don't have them, ask the founder.
3. Preview: open `site/index.html` in a browser. It shows an empty "no trainers listed yet" state until you set a sheet URL, never placeholder data.
4. Go live and branch/deploy workflow: see `CLAUDE.md` and the local deployment playbook.

## Structure
- `site/index.html`, the browse page, and the only thing ever published to the live URL.
- `CLAUDE.md`, project rules for Claude Code.
- No `docs/` folder in this repo. The platform playbook, deployment playbook and running to-do list live in a sibling `playbook/` folder next to this repo, never committed anywhere.
- `forms/`, Google Form specs to build by hand.
- `data/`, a sample CSV showing the expected shape of the public feed sheet.

This repo stays private. The operating workbook, where `Trainer_Master` lives (phone numbers, full names, internal notes), is never published either. The browse page reads from a completely separate, hand-maintained Google Sheet with no formula link to the workbook, holding only public-safe fields.

Style: no em dashes, sentence case, plain active voice.
