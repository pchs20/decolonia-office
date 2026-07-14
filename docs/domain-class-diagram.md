# Domain Class Diagram

This document captures the complete current + planned domain model for the platform.

- Current entities come from the implemented profile and commercial-document model.
- Planned notes are retained only where explicitly not yet implemented.

## UML Class Diagram

```mermaid
classDiagram
  class Address {
    +string street
    +string city
    +string postalCode
  }

  class Profile {
    <<current>>
    +string id
    +string name
    +string taxId
    +string? phone
    +string? email
    +bool isActive
    +Date createdAt
    +Date updatedAt
    +Address workAddress
    +Address billingAddress
  }

  class Client {
    <<current>>
    +ClientType type
  }

  class Worker {
    <<current>>
    +string? bankAccount
  }

  class CommercialDocument {
    <<current>>
    +string id
    +string number
    +string clientId
    +ClientSnapshot clientSnapshot
    +string workerId
    +WorkerSnapshot workerSnapshot
    +string? notes
    +TaxSnapshot? taxSnapshot
    +PricingMode pricingMode
    +decimal? manualSubtotalAmount
    +decimal subtotalAmount
    +decimal taxAmount
    +decimal totalAmount
    +Date createdAt
    +Date updatedAt
  }

  class Budget {
    <<current>>
    +Date? deliveredAt
  }

  class Invoice {
    <<current>>
    +Date? issuedAt
    +string? sourceBudgetId
  }

  class JobItem {
    <<current value>>
    +string id
    +string commercialDocumentId
    +int position
    +string title
    +string? description
    +decimal? quantity
    +decimal? unitPrice
    +decimal? totalPrice
  }

  class WorkTemplate {
    <<current>>
    +string id
    +string title
    +string? description
    +decimal? defaultUnitPrice
    +bool isActive
    +Date createdAt
    +Date updatedAt
  }

  class Tax {
    <<current>>
    +string id
    +string name
    +decimal rate
    +TaxBehavior behavior
    +bool isActive
    +Date createdAt
    +Date updatedAt
  }

  class TaxSnapshot {
    <<current value>>
    +string name
    +decimal rate
    +TaxBehavior behavior
  }

  class ClientSnapshot {
    <<current value>>
    +string name
    +string taxId
    +string? phone
    +string? email
    +Address workAddress
    +Address billingAddress
  }

  class WorkerSnapshot {
    <<current value>>
    +string name
    +string taxId
    +string? phone
    +string? email
    +string? bankAccount
    +Address workAddress
    +Address billingAddress
  }

  class DocumentSequence {
    <<current>>
    +string id
    +DocumentType documentType
    +int? scopeYear
    +int nextNumber
    +Date updatedAt
  }

  class PricingMode {
    <<enum>>
    computed
    manual-subtotal
  }

  class ClientType {
    <<enum>>
    individual
    company
  }

  class DocumentType {
    <<enum>>
    budget
    invoice
  }

  class TaxBehavior {
    <<enum>>
    added
  }

  Profile <|-- Client
  Profile <|-- Worker
  Profile "1" o-- "1" Address : workAddress
  Profile "1" o-- "1" Address : billingAddress

  CommercialDocument <|-- Budget
  CommercialDocument <|-- Invoice

  CommercialDocument "1" o-- "1" ClientSnapshot
  CommercialDocument "1" o-- "1" WorkerSnapshot
  CommercialDocument "1" o-- "0..1" TaxSnapshot
  CommercialDocument "*" --> "1" Client : clientId
  CommercialDocument "*" --> "1" Worker : workerId

  CommercialDocument "1" *-- "0..*" JobItem

  Invoice "*" --> "0..1" Budget : sourceBudgetId (optional)
```

## Notes

- `CommercialDocument` is a domain abstraction decision, not necessarily a physical base table in this phase.
- **Snapshot classes** (`ClientSnapshot`, `WorkerSnapshot`, `TaxSnapshot`) are value objects embedded directly in budget/invoice documents as flat fields.
  - They preserve historical correctness: data materialized at document creation time remains unchanged even if source definitions later change.
  - In persistence, snapshots are stored as flat columns or document-owned sub-rows, not as independent reusable tables.
- `WorkTemplate` is part of the document catalog for reuse, but line items do not maintain references to templates (materialized content only).
- `TaxBehavior` is currently `added` only in this phase and can be extended later.
