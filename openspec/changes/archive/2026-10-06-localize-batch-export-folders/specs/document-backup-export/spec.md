## MODIFIED Requirements

### Requirement: ZIP mirrors the cloud folder organization
The system SHALL organize ZIP entries using the same logical structure as the persistent cloud destination:

```text
<workbook>.xlsx
Presupuestos/<year>/<quarter>/<budget-pdf>
Facturas/<year>/<quarter>/<invoice-pdf>
```

Quarter folders SHALL use `Q1`, `Q2`, `Q3`, and `Q4`, with each quarter representing three calendar months. The workbook tabs SHALL remain named `Clients`, `Budgets`, and `Invoices`.

#### Scenario: Backup places PDFs by year and quarter
- **WHEN** a budget or invoice PDF is added to the archive
- **THEN** its path contains `Presupuestos` for budgets or `Facturas` for invoices, its selected year, and its `Q1` through `Q4` quarter folder

#### Scenario: Backup uses deterministic document paths
- **WHEN** the same current database state is exported more than once
- **THEN** equivalent documents use the same Spanish relative archive paths and filenames, apart from the archive's timestamped outer filename

#### Scenario: Workbook is at the archive root
- **WHEN** a backup archive is generated
- **THEN** the workbook is stored at the ZIP root as `Decolonia-data.xlsx`, not inside a `Data` subfolder, and its tabs remain named `Clients`, `Budgets`, and `Invoices`
