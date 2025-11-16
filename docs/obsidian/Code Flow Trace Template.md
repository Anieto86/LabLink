---
tags: [lablink, code-flow, trace]
created: {{date}}
type: flow-analysis
---

# 🔬 Flow Trace: {{feature-name}}

## 🎯 User Action
**What the user does**:
**Expected outcome**:

## 📍 Entry Point
**File**: `src/modules/{{module}}/{{module}}.router.ts`
**Route**: `{{method}} {{endpoint}}`
**Middleware**:

## 🔄 Data Flow Trace

### Step 1: Router Receives Request
```typescript
// Copy the actual route handler code here
router.post('/endpoint', async (req, res) => {
  // What happens here?
});
```

**My Understanding**:
**Questions**:

### Step 2: Service Processing
**File**: `src/modules/{{module}}/{{module}}.service.ts`
**Method**: `{{serviceMethod}}`

```typescript
// Copy the service method here
```

**Business Logic**:
**Validation Rules**:
**Questions**:

### Step 3: Repository Query
**File**: `src/modules/{{module}}/{{module}}.repo.ts`
**Method**: `{{repoMethod}}`

```typescript
// Copy the repository method here
```

**SQL Generated**:
**Database Impact**:
**Questions**:

### Step 4: Database Operation
**Table(s)**:
**Operation**: INSERT/SELECT/UPDATE/DELETE
**Indexes Used**:

## 🧪 Experiments I Can Try

### Modification Experiments
- [ ] What if I change the validation schema?
- [ ] What if I add a console.log at each step?
- [ ] What if I break the service call?
- [ ] What if I modify the SQL query?

### Testing Experiments
- [ ] Call this endpoint with curl
- [ ] Test with invalid data
- [ ] Test with missing fields
- [ ] Check database state before/after

## 🤔 Deep Questions

### Architecture Questions
- Why is this split across 3 files?
- What would happen if we combined them?
- How does this relate to other modules?

### Performance Questions
- How many database calls does this make?
- Could this be optimized?
- What happens under load?

### Security Questions
- What could go wrong here?
- How is data validated?
- Where could injection happen?

## 🔗 Related Concepts
- [[Authentication Flow]]
- [[Database Schema]]
- [[Error Handling Pattern]]
- [[Similar Features]]

## 💡 Key Insights
1.
2.
3.

## 🎯 Next to Explore
- [ ] Related feature:
- [ ] Similar pattern in:
- [ ] Dependency:
