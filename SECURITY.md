# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately through GitHub: open the repository's **Security** tab →
**Report a vulnerability**. We aim to acknowledge reports within a few business days.

## Scope

This repository is a **white-label site template**. It stores no data of its own and talks only to the backend you
configure. Note one intentional **trust boundary**: legal document bodies (`LegalPayload.body`) are rendered from
Markdown to HTML **without sanitization** (`src/lib/markdown.ts`) — serve those documents only from trusted internal
authors, or add a sanitizer before changing the contract. See `README.md` / `CLAUDE.md` for details.

When reporting, never paste secrets (for example the value of `API_AUTH_TOKEN`).

## Supported versions

Security fixes target the `main` branch. There are no long-term support branches.
