## ADDED Requirements

### Requirement: Localized commercial document titles fit on one line
The PDF document header SHALL render the localized budget and invoice title without splitting the title across lines or inserting a hyphen when the title is rendered with the supported locales.

#### Scenario: Spanish budget PDF header
- **WHEN** a budget PDF is rendered using the Spanish locale
- **THEN** the header displays `PRESUPUESTO` as one uninterrupted title line

#### Scenario: Spanish invoice PDF header
- **WHEN** an invoice PDF is rendered using the Spanish locale
- **THEN** the header displays `FACTURA` as one uninterrupted title line

#### Scenario: Catalan and English document headers
- **WHEN** a budget or invoice PDF is rendered using Catalan or English
- **THEN** the localized document title remains readable as a single uninterrupted line within the existing header area

### Requirement: Header layout remains stable after title adjustment
The PDF document header SHALL preserve the existing right alignment, document image placement, number metadata, date metadata, and shared behavior for both budget and invoice documents while preventing title wrapping.

#### Scenario: Budget and invoice share the corrected layout
- **WHEN** either document type is rendered after the title layout adjustment
- **THEN** its title, image, number, and date remain in the existing right-side header column without overlapping the issuer block or changing the document content order
