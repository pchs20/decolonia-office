## ADDED Requirements

### Requirement: Centralized brand color constants
The system SHALL provide a `src/lib/brand-colors.ts` file that exports a `brandColors` object containing the canonical hex color values for each application section: `budgets` (blue), `invoices` (green), `clients` (amber), `settings` (slate), and `danger` (red). This file SHALL be the single source of truth for all section colors used across UI components and PDF generation.

#### Scenario: Brand colors file exports all section colors
- **WHEN** `brand-colors.ts` is imported
- **THEN** it SHALL export `brandColors.budgets.DEFAULT` as `#2563EB`, `brandColors.invoices.DEFAULT` as `#16A34A`, `brandColors.clients.DEFAULT` as `#F59E0B`, `brandColors.settings.DEFAULT` as `#475569`, and `brandColors.danger.DEFAULT` as `#EF4444`

---

### Requirement: Tailwind CSS custom properties for section colors
The system SHALL declare CSS custom properties for each section color inside an `@theme` block in `globals.css`. These custom properties SHALL map to the same hex values as `brand-colors.ts` and SHALL be usable as Tailwind utility classes (e.g., `bg-budgets`, `text-invoices`).

#### Scenario: Section color custom properties are available as Tailwind classes
- **WHEN** a component uses `bg-budgets` or `text-invoices` Tailwind classes
- **THEN** the browser SHALL apply the corresponding section hex color

---

### Requirement: PDF accent bars use brand colors
Each PDF template SHALL use the brand color for its document type as the accent bar color at the top of generated PDFs. Budget PDFs SHALL use the budget blue; invoice PDFs SHALL use the invoice green.

#### Scenario: Budget PDF renders a blue accent bar
- **WHEN** a budget PDF is generated
- **THEN** the top accent bar SHALL be filled with the budget blue color (`#2563EB`)

#### Scenario: Invoice PDF renders a green accent bar
- **WHEN** an invoice PDF is generated
- **THEN** the top accent bar SHALL be filled with the invoice green color (`#16A34A`)

---

### Requirement: Section "New" action buttons use brand colors
Each section's primary action button (e.g., "New Budget", "New Invoice", "New Client") SHALL use that section's canonical brand color as its background.

#### Scenario: Budgets "New" button uses budget blue
- **WHEN** the budgets list page is rendered
- **THEN** the primary "New" action button SHALL use `bg-budgets` (blue)

#### Scenario: Invoices "New" button uses invoice green
- **WHEN** the invoices list page is rendered
- **THEN** the primary "New" action button SHALL use `bg-invoices` (green)

#### Scenario: Clients "New" button uses client amber
- **WHEN** the clients list page is rendered
- **THEN** the primary "New" action button SHALL use `bg-clients` (amber), NOT green

#### Scenario: Settings active tabs use settings slate
- **WHEN** a settings sub-tab is active
- **THEN** the active tab indicator SHALL use `text-settings border-settings` (slate), NOT blue
