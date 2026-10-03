# 0005. Allow Non-Unique Commercial Document Identifiers

- Status: accepted
- Date: 2026-10-03

## Context

Budgets and invoices currently use a user-facing `number` value that is automatically allocated and protected by a per-table database uniqueness constraint. The internal UUID already uniquely identifies each document, while users may need to reuse an external reference or correct an identifier during document creation or editing. The product requirement is to preserve automatic numbering as the default but permit explicitly confirmed duplicate user-facing identifiers.

## Decision

Treat the commercial document identifier as a validated, user-facing text reference rather than a database identity. Remove the database uniqueness constraints from budget and invoice identifier columns. Preserve UUID uniqueness and use same-type duplicate detection to warn users before an unconfirmed create or update; explicit confirmation permits the duplicate.

Automatic sequences remain independent from custom identifiers and continue to provide the default identifier when users do not override it.

## Consequences

- Users can preserve external references and intentionally reuse identifiers.
- The UUID remains the reliable identity for routes, synchronization, and relationships.
- Lists, warnings, and exports must provide enough context to distinguish documents that share an identifier.
- Database duplicate checks become advisory rather than constraint enforcement.
- The uniqueness migration is difficult to roll back after duplicate data is created.
- Export filenames must include a stable document-specific suffix to prevent duplicate or sanitized paths from colliding.
