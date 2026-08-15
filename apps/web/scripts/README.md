# Historical Invoice Client Extraction

This is a one-time, offline migration utility for populating the application with recurring clients from invoices created before the application was used. It reads legacy `.xlsx` files and never connects to PostgreSQL or creates clients.

From the repository root, run:

```text
pnpm --filter @decolonia/web invoice:extract -- ../../invoice-client-input ../../invoice-client-output
```

The command runs from `apps/web`, so the arguments above are relative to that package directory. The first argument is the input directory and the second is the output directory.

It creates:

- `clients.csv`: deduplicated candidates that have all required client fields and can be reviewed for the later client-creation script.
- `clients-review.csv`: candidates or workbooks requiring attention. Reasons include missing tax IDs, ambiguous types, unparsed addresses, and missing client blocks.

`clients.csv` columns are:

```text
name,type,street,city,postalCode,billingStreet,billingCity,billingPostalCode,taxId,phone,email,sourceFiles
```

Billing fields are always copied from the normalized work address because the historical invoices do not provide a separate billing address. Phone and email remain empty when they are not present. `sourceFiles` records the invoice workbooks contributing to each deduplicated client.

The review CSV retains normalized and original values plus `typeReason` and `reviewReasons`. Review and correct that file before implementing or running the separate client-creation migration. This extractor does not perform that creation step.

## Import Clients

After reviewing `clients.csv`, run the database importer from the repository root:

```text
pnpm --filter @decolonia/web clients:import -- ../../invoice-client-output/clients.csv
```

The importer is a dry run by default. It validates the CSV, fills missing billing fields from the work address, reports duplicate tax IDs, and performs no writes. To insert eligible clients, add `--write`:

```text
pnpm --filter @decolonia/web clients:import -- ../../invoice-client-output/clients.csv --write
```

`DATABASE_URL` may be exported in the environment or placed in the repository root `.env` file. The importer prefers the repository root `.env` over package-local `.env` files. It skips existing normalized tax IDs, never updates existing clients, and wraps new inserts in one transaction. It reads only `clients.csv`; it does not import `clients-review.csv`.