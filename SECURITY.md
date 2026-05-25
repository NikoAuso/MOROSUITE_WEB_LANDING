# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Report vulnerabilities privately through GitHub: open the repository's **Security** tab →
**Report a vulnerability**. We aim to acknowledge reports within a few business days.

## Scope

This repository is a **white-label site template**. It stores no data of its own and talks only to the backend you
configure for dynamic content (site identity, opening hours, pricing). Legal documents are local Markdown under
`src/content/legal/` and are rendered by Astro.

When reporting, never paste secrets (for example the value of `API_AUTH_TOKEN`).

## Supported versions

Security fixes target the `main` branch. There are no long-term support branches.
