# Historical Invoice Client Extraction

## Purpose

Provide a repeatable, offline migration utility that extracts recurring clients from legacy invoice workbooks created before the application was used. The utility produces reviewed CSV data without modifying source workbooks or the application database.

## Requirements

### Requirement: Read legacy invoice workbooks

The extraction utility SHALL read every `.xlsx` file in a caller-supplied input directory and inspect the workbook's invoice sheet without modifying the source files.

#### Scenario: Process the supplied invoice directory
- **WHEN** the utility is run against a directory containing the historical invoice workbooks
- **THEN** it processes every `.xlsx` file and records the source filename for each extracted candidate

#### Scenario: Workbook has no recognizable client block
- **WHEN** a workbook contains no supported client labels
- **THEN** the utility excludes it from import-ready output and records the filename and failure reason in the review report

### Requirement: Extract and normalize client fields

The utility SHALL extract client name, street, city, postal code, and tax ID from supported labeled fields and SHALL normalize whitespace and field-specific formatting while preserving source provenance.

#### Scenario: Extract a standard invoice client block
- **WHEN** a sheet contains `Nombre`, `Dirección`, `Ciudad`, and `CIF.` or `V.A.T.` labels with adjacent values
- **THEN** the output contains the corresponding flat client fields and the source filename

#### Scenario: Split an embedded postal code
- **WHEN** the city value contains a five-digit postal code, including forms such as `C.P 08340`
- **THEN** the utility places the code in `postalCode` and removes the postal-code marker and code from `city`

#### Scenario: Normalize tax-ID presentation
- **WHEN** a tax ID contains spaces, punctuation, or inconsistent casing
- **THEN** the utility produces a trimmed normalized `taxId` for matching and output while retaining the original source value for review

### Requirement: Deduplicate recurring clients

The utility SHALL emit at most one candidate per client identity and SHALL retain all source invoice filenames contributing to that candidate.

#### Scenario: Repeated client across invoices
- **WHEN** multiple invoices contain the same normalized tax ID
- **THEN** the utility emits one client candidate with the contributing invoice filenames combined in deterministic order

#### Scenario: Client has no tax ID
- **WHEN** a client has no tax ID in its invoice
- **THEN** the utility uses a conservative normalized name-and-address identity fallback and marks the candidate for review

### Requirement: Classify candidates for later client creation

The utility SHALL provide a `type` candidate of `individual` or `company` and SHALL mark classifications that cannot be determined confidently for human review.

#### Scenario: Recognizable company name
- **WHEN** the client name contains a supported organization indicator such as `S.L.`, `S.L.U.`, `C.B.`, `Fundació`, or `Comunitat`
- **THEN** the candidate is classified as `company` with an inference reason

#### Scenario: Recognizable personal client
- **WHEN** the client name does not contain a supported organization indicator and matches the personal-name pattern
- **THEN** the candidate is classified as `individual` with an inference reason

#### Scenario: Ambiguous classification
- **WHEN** the utility cannot confidently classify the client
- **THEN** it includes the candidate in the review report and does not mark it import-ready

### Requirement: Produce reviewable CSV artifacts

The utility SHALL produce a UTF-8 CSV of deduplicated client candidates aligned with the client creation contract and a companion UTF-8 review report for candidates with missing or ambiguous required data.

#### Scenario: Import-ready candidate output
- **WHEN** a candidate has name, type, street, city, postal code, and tax ID
- **THEN** it appears once in `clients.csv` with billing street, city, and postal code copied from the work address, and empty phone and email fields when those values were not present in the source

#### Scenario: Missing required data
- **WHEN** a candidate lacks a tax ID, address component, or confident type
- **THEN** it is identified in `clients-review.csv` with a stable reason and its source invoice filenames

#### Scenario: Deterministic rerun
- **WHEN** the utility is run twice against the same unchanged input directory
- **THEN** it produces equivalent CSV contents and ordering
