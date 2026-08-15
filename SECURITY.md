# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems. Report privately through GitHub:
repository **Security** tab → **Report a vulnerability**. We aim to acknowledge reports within a
few business days.

## Scope

This repository is a **white-label landing kit**. It stores no data of its own; a deploy may talk
to the backend it is configured for (live identity, opening hours, pricing) or serve committed
static data only. Legal documents are local Markdown rendered by Astro.

When reporting, never paste secrets (for example the value of `API_AUTH_TOKEN`).

## Supported versions

Security fixes target the `main` branch. There are no long-term support branches.
