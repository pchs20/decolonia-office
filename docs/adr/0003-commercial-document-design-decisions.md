# ADR-0003: Commercial Document Design Decisions

**Date:** 2026-06-22
**Status:** Accepted
**Supersedes:** None

## Context

During implementation of the budget and invoices foundation, three architectural questions emerged:

1. Should JobItem be an entity or value object?
2. Should we use class table inheritance or concrete table inheritance for Budget/Invoice polymorphism?
3. What linting strategy should we use to prevent unused code?

## Decision

### 1. JobItem as Value Object (with Child Aggregate Pattern)

**Decision:** Treat JobItem as a **logically immutable value object**, part of the Budget/Invoice aggregate.

**Reasoning:**
- JobItems are **always accessed through their parent** (Budget/Invoice) - never queried independently
- JobItems have **no independent lifecycle** - created/updated/deleted only within parent aggregate context
- The `id` field is a **persistence implementation detail**, not business identity
- Keeps aggregate boundary clear: Budget/Invoice is the aggregate root, JobItem is a child part

**Implementation Details:**
- JobItem has an `id` and `commercialDocumentId` for persistence tracking
- Separate API endpoints for item operations (POST/PATCH/DELETE) still exist - these are part of the parent aggregate's API surface
- Never reference JobItem directly outside of Budget/Invoice context

**Trade-offs:**
- ✅ Clear aggregate boundaries
- ✅ Simpler invariant checking (all validation at parent level)
- ✅ Prevents accidental cross-document item references
- ❌ Cannot independently evolve JobItem lifecycle

**Future Evolution:**
If requirements change to allow:
- Referencing JobItems from other documents
- Independent item versioning
- Item-level audit trails

Then JobItem should be promoted to a true entity with independent lifecycle.

---

### 2. Concrete Table Inheritance (Not Class Table)

**Decision:** Use **concrete table inheritance** for Budget/Invoice polymorphism:
- `budgets` table with all columns (common + specific)
- `invoices` table with all columns (common + specific)

**Alternatives Considered:**
- **Class Table Inheritance**: Parent `commercial_documents` + child tables (requires JOINs)
- **Single Table Inheritance**: One table with discriminator column (many NULLs)

**Reasoning:**
- Query performance: Budget/Invoice queries are frequent, JOINs add unnecessary cost
- Type safety: Budget-specific fields (e.g., `deliveredAt`) are naturally nullable only in Budget table
- Constraint clarity: Column-level NOT NULL constraints express intent clearly
- Simpler repository implementations: No polymorphic query logic needed

**Trade-offs:**
- ✅ Excellent query performance
- ✅ Clear per-entity constraints
- ✅ Simpler repository code
- ❌ Field duplication between tables
- ❌ Schema evolution requires updating both tables

**Maintenance:**
If shared schema changes, update **both** `budgets` and `invoices` tables. Monitor for drift.

**When to Reconsider:**
- If Budget/Invoice share 80%+ of fields (current: ~85% overlap acceptable)
- If polymorphic "all documents" queries become common (current: none)
- If schema evolution becomes frequent (current: infrequent)

---

### 3. Linting Strategy: TypeScript Strict Mode + Compiler Flags

**Decision:** Enforce code quality via TypeScript compiler options. No additional linters required initially.

**Configuration Added to `tsconfig.base.json`:**
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

**What This Catches:**
- ✅ Unused local variables (prevents debug code left behind)
- ✅ Unused function parameters (catches dead code)
- ✅ Missing return statements (prevents type-related bugs)
- ✅ All `strict: true` checks (null checks, implicit any, etc.)

**What This Does NOT Catch:**
- ❌ Style consistency (semicolons, quotes, spacing)
- ❌ Import sorting
- ❌ Code complexity metrics
- ❌ Security issues

**Future Enhancement:**
Consider adding ESLint if:
- Team grows and needs style consistency
- CI/CD requires automated code review
- React-specific rules needed (hooks, accessibility)

Recommended config: `eslint-config-next` (includes best practices for Next.js)

---

## Architecture Summary

```
┌─────────────────────────────────────────────┐
│  JobItem (Value Object)                     │
│  - Part of Budget/Invoice aggregate        │
│  - Immutable within aggregate              │
│  - No independent lifecycle                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  CommercialDocument Hierarchy               │
│  - Concrete Table Inheritance              │
│  - budgets table: all Budget-specific cols │
│  - invoices table: all Invoice-specific  │
│  - NO parent table (simpler queries)       │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  Code Quality                              │
│  - TypeScript strict: Yes                  │
│  - noUnusedLocals: Yes                     │
│  - noUnusedParameters: Yes                 │
│  - ESLint: Not required (yet)              │
└─────────────────────────────────────────────┘
```

## Consequences

### Positive
- Clear domain boundaries (JobItem is clearly child aggregate)
- Query performance (no polymorphic JOINs)
- Type safety (specific NULL constraints per entity)
- Compiler catches unused code (prevents tech debt)

### Negative
- Field duplication in Budget/Invoice tables (acceptable cost for performance)
- Schema evolution requires dual updates (addressed by documentation)
- No style consistency enforcement (can add ESLint later)

## References

- [Domain-Driven Design: Aggregates - Martin Fowler](https://martinfowler.com/bliki/DDD_Aggregate.html)
- [Inheritance Strategies - eggplantsalad.com](https://eggplantsalad.com/erd/inheritance/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig#noUnusedLocals)
