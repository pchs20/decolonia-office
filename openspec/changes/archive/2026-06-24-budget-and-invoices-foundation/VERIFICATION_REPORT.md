# Verification Report: budget-and-invoices-foundation

## Summary

| Dimension | Status |
|---|---|
| Completeness | 144/144 tasks complete, 29 requirements identified |
| Correctness | 29/29 requirements show implementation evidence; 64 scenarios reviewed |
| Coherence | Mostly aligned with design, 1 warning |

Verification scope used all available artifacts from this change: proposal, design, specs, ADR references, and tasks.

## CRITICAL

- None.

## WARNING

1. Scenario coverage is broad in tasks, but automated coverage appears primarily unit-level.
   - Evidence: tasks claim end-to-end verification in [openspec/changes/budget-and-invoices-foundation/tasks.md](openspec/changes/budget-and-invoices-foundation/tasks.md#L148) and [openspec/changes/budget-and-invoices-foundation/tasks.md](openspec/changes/budget-and-invoices-foundation/tasks.md#L151), while current automated tests are use-case unit tests in [apps/web/src/application/use-cases/__tests__/budget-use-cases.test.ts](apps/web/src/application/use-cases/__tests__/budget-use-cases.test.ts#L12) and [apps/web/src/application/use-cases/__tests__/invoice-use-cases.test.ts](apps/web/src/application/use-cases/__tests__/invoice-use-cases.test.ts#L12).
   - Why it matters: high-value cross-layer scenarios (API plus persistence plus routing) may regress without dedicated integration or e2e coverage.
   - Recommendation: add at least one integration flow per critical scenario group (budget lifecycle, invoice lifecycle with source budget, and sequence adjustment behavior).

## SUGGESTION

1. Keep explicit traceability between spec requirements and implementation evidence.
   - Evidence: the change has 29 requirements across [openspec/changes/budget-and-invoices-foundation/specs/budget-management/spec.md](openspec/changes/budget-and-invoices-foundation/specs/budget-management/spec.md), [openspec/changes/budget-and-invoices-foundation/specs/invoice-management/spec.md](openspec/changes/budget-and-invoices-foundation/specs/invoice-management/spec.md), [openspec/changes/budget-and-invoices-foundation/specs/commercial-document-catalog-and-settings/spec.md](openspec/changes/budget-and-invoices-foundation/specs/commercial-document-catalog-and-settings/spec.md), and [openspec/changes/budget-and-invoices-foundation/specs/app-navigation-shell/spec.md](openspec/changes/budget-and-invoices-foundation/specs/app-navigation-shell/spec.md).
   - Recommendation: maintain a compact requirement-to-file mapping table in this report (or in tasks.md) during future iterations to make archive checks faster and less ambiguous.

## Completeness Notes

- Tasks are now fully checked, including reconciliation of the duplicated Section 9 checklist in [openspec/changes/budget-and-invoices-foundation/tasks.md](openspec/changes/budget-and-invoices-foundation/tasks.md#L164).
- OpenAPI contract evidence is present for budgets, invoices, pricing mode, manual subtotal, clients/workers search, sequence settings, and catalog endpoints in [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L748), [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1006), and [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1523).

## Correctness Notes

- Requirement intent for numbering, snapshots, job items, and catalog/settings is represented in application orchestration at [apps/web/src/application/use-cases/commercial-documents/commercial-documents-service.ts](apps/web/src/application/use-cases/commercial-documents/commercial-documents-service.ts#L296).
- Route-level validation and error handling are present in representative handlers such as [apps/web/app/api/budgets/route.ts](apps/web/app/api/budgets/route.ts#L140), [apps/web/app/api/invoices/route.ts](apps/web/app/api/invoices/route.ts#L142), and [apps/web/app/api/commercial-document-settings/sequences/route.ts](apps/web/app/api/commercial-document-settings/sequences/route.ts#L34).
- Core API surfaces required by specs are represented in contract paths for budgets/invoices/items/catalog/settings in [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L747), [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1005), and [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1522).
- Archive endpoint contract/runtime alignment is now consistent at `204` for taxes and work templates in [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1372), [apps/web/src/api/openapi/openapi.ts](apps/web/src/api/openapi/openapi.ts#L1491), [apps/web/app/api/taxes/[id]/archive/route.ts](apps/web/app/api/taxes/[id]/archive/route.ts#L17), and [apps/web/app/api/work-templates/[id]/route.ts](apps/web/app/api/work-templates/[id]/route.ts#L59).

## Coherence Notes

- Layering and flat transport patterns remain consistent with ADR expectations, based on route-to-use-case-to-repository structure and mapper-based response shaping.
- Navigation-shell requirements are represented in app shell links for budgets, invoices, and settings in [apps/web/src/presentation/components/AppShell.tsx](apps/web/src/presentation/components/AppShell.tsx#L28).

## Final Assessment

No critical issues found. 1 warning(s) should be addressed before archive for stronger operational confidence, but the change is verification-ready with noted improvements.
