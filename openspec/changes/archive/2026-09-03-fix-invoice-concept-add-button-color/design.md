## Context

The invoice form's item-add button currently uses `bg-invoices`, while the reported UI shows it as budget blue. The budget form already uses `bg-budgets` for its corresponding action. The existing brand color system defines invoices as green (`#16A34A`) and budgets as blue (`#2563EB`). This is a presentation-only correction within the web application; no API, domain, persistence, or deployment boundary is involved.

## Architecture Diagrams

Not needed. The change is limited to existing presentation components and does not alter system boundaries or data flow.

## Goals / Non-Goals

**Goals:**

- Ensure the invoice form's add-item/concept action renders with the invoice green brand color.
- Preserve the budget form's budget blue action styling.
- Add or update focused UI coverage so the section-specific classes do not regress.

**Non-Goals:**

- Changing the brand color values or shared color definitions.
- Changing button behavior, text, layout, accessibility, or item-management logic.
- Refactoring the shared `JobItemForm` component.

## Decisions

- Keep styling in the document-specific form components, because each form owns the section context and the budget form already demonstrates the intended class usage.
- Use the existing `bg-invoices` and `hover:bg-invoices/90` utilities for invoice actions rather than introducing a new color token or shared prop. This keeps the fix minimal and aligns with the current brand-color contract.
- Verify both invoice and budget class assignments. The main alternative, introducing a generalized section-color abstraction, adds complexity without benefit for a one-line styling correction.

## Risks / Trade-offs

- [Risk] A future refactor could accidentally replace the section-specific utility with a generic button style. → Mitigation: add a focused regression assertion for invoice and budget item-add actions.
- [Trade-off] The duplicated class strings remain in the two form components. → This is acceptable because the components have distinct section semantics and the existing codebase already follows this pattern.
