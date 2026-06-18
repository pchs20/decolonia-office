## Context

Client location data is currently modeled with a single `address` text field and optional `billing_address`. In the web list view, city is derived by splitting address text, which is fragile and locale-dependent. The change must preserve existing client records while introducing explicit work and billing address fields across backend, frontend, API contracts, and documentation.

Current in-force ADRs reviewed:
- `docs/adr/0001-adopt-bootstrap-monorepo-stack.md` (accepted, not superseded)

This design stays consistent with ADR-0001 by keeping the monorepo TypeScript architecture, Next.js frontend integration, and PostgreSQL data model evolution through migrations.

## Architecture Diagrams

No additional C4 diagram is required for this change because no new container/component boundaries are introduced. The change is a schema and contract evolution within existing client-management components.

## Goals / Non-Goals

**Goals:**
- Introduce explicit client fields: `street`, `city`, `postalCode`, `billingStreet`, `billingCity`, and `billingPostalCode`.
- Keep API and UI behavior coherent with canonical glossary terms.
- Keep rollout focused on new writes, without requiring data backfill for existing rows.
- Avoid data loss and provide rollback-safe deployment sequencing.
- Ensure forms collect explicit work and billing values, with no inference from composed address text.

**Non-Goals:**
- Geocoding, address normalization, or country-specific validation rules beyond current scope.
- New search endpoints or analytics features beyond compatibility updates.

## Decisions

1. Persist work and billing address components as dedicated columns in `clients`.
- Rationale: Removes parsing ambiguity and supports reliable filtering/reporting later.
- Alternative considered: Keep free-text address and parse on read. Rejected due to brittle parsing and inconsistent user input.

2. Introduce `street`, `city`, `postal_code`, `billing_street`, `billing_city`, and `billing_postal_code` in persistence while exposing camelCase names in API DTOs.
- Rationale: Keeps SQL naming conventions and current API style consistent.
- Alternative considered: Keep `address` column name and add only city/postal columns. Rejected to avoid semantic drift between old and new meanings.

3. Represent addresses in domain code as value objects (`workAddress`, `billingAddress`) mapped to flat persistence columns.
- Rationale: Keeps business concepts explicit in code without introducing a separate address table or ORM relation complexity.
- Alternative considered: Keep flat fields only in all layers. Rejected because it weakens domain clarity and encourages duplicated address logic.

4. Use an additive, forward-only migration for schema changes and application writes.
- Rationale: The system is not live, so backfill complexity adds no practical value.
- Alternative considered: Add backfill for legacy rows. Rejected as unnecessary scope and risk.

5. Keep billing fallback behavior unchanged semantically (billing defaults to work) but implement it using structured billing fields.
- Rationale: Preserves user experience while eliminating free-text ambiguity.
- Alternative considered: Require billing fields always and remove fallback. Rejected due to unnecessary friction in common same-as-work cases.

6. Keep dedicated work and billing inputs visible in forms, while same-as-work copies work values into billing fields at write time.
- Rationale: Keeps entered values explicit and avoids hidden inference while preserving fast data entry.
- Alternative considered: Hide billing fields behind the toggle and infer values. Rejected because it obscures resulting data.

## Risks / Trade-offs

- [Contract drift] Backend and web server adapters may diverge if updated in different commits. -> Mitigation: update DTO/types/OpenAPI/contracts in the same implementation phase.
- [UX confusion] Users may not understand postal code requirements. -> Mitigation: explicit form labels and validation messages.
- [Temporary duplication] During migration both old and new fields may coexist in code paths. -> Mitigation: staged tasks with explicit cleanup checkpoint.

## Migration Plan

1. Add new database columns (`street`, `city`, `postal_code`, `billing_street`, `billing_city`, `billing_postal_code`) with temporary nullability where needed for safe rollout.
2. Update backend entity, DTO validation, and service logic to read/write new structured fields.
3. Update web API adapters, types, forms, detail/list views, and OpenAPI docs.
4. Tighten validation and nullability rules once all write paths use new fields.
5. Remove legacy free-text address assumptions from backend and UI paths.

Rollback strategy:
- If deployment fails before step 4, keep serving from previous app version while retaining additive columns.
- Avoid dropping legacy fields/assumptions until post-validation release confirms correctness.

## Open Questions

- Should postal code validation be country-agnostic (length/range only) or strictly Spain-first in this iteration?
- Should migrated records with unknown city/postal code be blocked from edit-save until completed, or allowed to persist with warnings?
