# UltraVisit Administration Features — Full Documentation

> **Last Updated:** April 10, 2026
> **Scope:** User Roles, Tenant Registry, Tenant Provisioning, Tenant Super Admin, Hierarchy Templates, Global Roles & Permissions, ZTS Audit Console, Error Logs

---

## Table of Contents

1. [User Roles & User Management](#1-user-roles--user-management)
2. [Tenant Registry](#2-tenant-registry)
3. [Tenant Provisioning](#3-tenant-provisioning)
4. [Tenant Super Admin Management](#4-tenant-super-admin-management)
5. [Hierarchy Templates (Node Types)](#5-hierarchy-templates-node-types)
6. [Global Roles & Permissions](#6-global-roles--permissions)
7. [ZTS Audit Console](#7-zts-audit-console)
8. [Error Logs](#8-error-logs)

---

## 1. User Roles & User Management

### Overview

User Management is a tabbed interface with three sections: **User List**, **Add New User**, and **Approval Queue**. It supports full CRUD for users within a tenant and integrates with the roles/permissions and organization hierarchy systems.

### Key Files

| Layer | File |
|-------|------|
| Frontend Router | `src/components/admin/user-management/UserManagementRouter.tsx` |
| User List | `src/components/admin/user-management/UserList.tsx` |
| Add User Wizard | `src/components/admin/user-management/ManualAddUserFlow.tsx` |
| Approval Queue | `src/components/admin/user-management/ApprovalQueue.tsx` |
| Step: Access Type | `src/components/admin/user-management/steps/AccessTypeStep.tsx` |
| Step: Confirmation | `src/components/admin/user-management/steps/Confirmation.tsx` |
| Backend: User Routes | `server/src/modules/administration/routes/admin/users.ts` |
| Backend: User Model | `server/src/modules/administration/models/user_administration.ts` |
| Backend: Invitation Routes | `server/src/modules/administration/routes/invitations.ts` |
| Backend: Invitation Model | `server/src/modules/administration/models/invitation_administration.ts` |
| API Client | `src/services/api/admin.ts` |

### Access Types

Users are classified into two primary access types, which determine how their access is scoped:

| Access Type | Description | Scope Mechanism |
|-------------|-------------|-----------------|
| `tenant_admin` | Full tenant-level access | Module-level role assignments. Gets access to all tenant modules. |
| `organization_user` | Scoped to specific organization nodes | Node-based bindings via `UserRoleBinding`. Access limited to assigned nodes and their descendants. |

### User Creation Flow

```
1. Admin opens "Add New User" tab
2. Fills in user details (name, email, phone)
3. Selects Access Type (tenant_admin or organization_user)
4. For organization_user: selects organization node(s) and role(s)
5. For tenant_admin: assigns module-level roles
6. Confirmation step shows summary with access type badge and bindings
7. On submit:
   a. POST /api/platform/admin/users → creates user (status: pending_activation)
   b. POST /api/platform/bindings → creates scoped node bindings (for org users)
   c. POST /api/platform/admin/users/:id/roles → assigns roles
   d. Invitation email sent with secure token + temporary password
```

### User Lifecycle States

```
pending_activation → active (after invitation acceptance + MFA enrollment)
active → suspended (admin action)
active → deleted (soft delete)
suspended → active (reactivation)
```

### Invitation Flow

```
1. System generates invitation with:
   - Secure token (hashed and stored)
   - Temporary password (bcrypt hashed, cost factor 12)
   - 7-day expiration
2. Email sent via sendInvitationEmail()
3. User visits signup screen with token
4. GET /api/auth/invitations/verify?token=xxx → validates token
5. POST /api/auth/invitations/accept → accepts with:
   - New password (must meet policy)
   - MFA method selection
6. User status transitions to active on first login
```

### User List Features

- Paginated list of all users in tenant
- Search by name/email
- Status filter (active, pending, suspended)
- Actions per user: view details, resend invitation, view audit, view permissions, view hierarchy, delete
- Cross-tab navigation to audit and permissions screens

### Backend User Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/users` | Tenant Admin | List users (paginated, filterable) |
| POST | `/api/platform/admin/users` | Tenant Admin | Create user |
| GET | `/api/platform/admin/users/:id` | Tenant Admin | Get user details |
| PUT | `/api/platform/admin/users/:id` | Tenant Admin | Update user |
| DELETE | `/api/platform/admin/users/:id` | Tenant Admin | Soft-delete user |
| POST | `/api/platform/admin/users/:id/roles` | Tenant Admin | Assign role to user |
| DELETE | `/api/platform/admin/users/:id/roles/:roleId` | Tenant Admin | Remove role from user |
| POST | `/api/platform/admin/users/:id/resend-invitation` | Tenant Admin | Resend invitation email |

### Business Rules

- Invitation token is hashed before storage (never stored in plaintext)
- Passwords hashed with bcrypt (cost factor ≥ 12)
- Temporary passwords expire after 30 days
- Password history is tracked to prevent reuse
- MFA enrollment is required during invitation acceptance
- Missing role bindings are reconciled on user creation (backward-compat fix)
- Tenant Admin users get access to ALL modules the tenant has subscribed to

---

## 2. Tenant Registry

### Overview

The Tenant Registry is the centralized management screen for all tenants in the platform. It is a **Super Admin-only** page that provides a full view of every tenant's lifecycle, from creation through provisioning to active operation.

### Key Files

| Layer | File |
|-------|------|
| Frontend Screen | `src/components/admin/screens/tenant-registry.tsx` |
| Registry Table | `src/components/admin/components/tenant-registry-table.tsx` |
| Manage Tenant Drawer | `src/components/admin/components/manage-tenant-drawer.tsx` |
| Invite Admin Drawer | `src/components/admin/components/invite-initial-tenant-admin-drawer.tsx` |
| Types | `src/components/admin/types/tenant.ts` |
| Backend Routes | `server/src/modules/administration/routes/admin/tenants.ts` |
| Backend Model | `server/src/modules/administration/models/tenant_administration.ts` |
| API Client | `src/services/api/admin.ts` (tenants section) |
| Router Guard | `src/components/admin/AdministrationRouter.tsx` (SuperAdminGuard) |

### Tenant Lifecycle State Machine

The tenant uses a **dual-state model**:

#### Setup Status (onboarding progression)

```
provisioned → invited → admin_verified → provisioning → active
```

| Status | Description |
|--------|-------------|
| `provisioned` | Tenant record created, no admin invited yet (UI: "No Admin Invited") |
| `invited` | Initial super admin has been invited |
| `admin_verified` | Super admin has accepted invitation and verified |
| `provisioning` | Database and infrastructure being set up |
| `active` | Fully operational |

#### Operational Status (runtime lifecycle)

```
trial → active → suspended → inactive (soft-deleted)
```

| Status | Description |
|--------|-------------|
| `trial` | New tenant in trial period |
| `active` | Fully active and operational |
| `suspended` | Temporarily disabled (with reason/notes) |
| `inactive` | Soft-deleted / archived |

### Registry Table

**Columns:**
- Tenant Name
- Setup Status (color-coded badge)
- Region
- Database / Cluster
- Modules Enabled
- Tenant Super Admins
- Created Date
- Actions

**Filters:**
- Search by tenant name
- Filter by setup status
- Filter by region
- Sort by created date or setup status (asc/desc)

**Row Actions (context-sensitive):**

| Tenant Status | Available Actions |
|---------------|-------------------|
| No Admin Invited | Invite Admin |
| Invited / Admin Verified / Provisioning | Continue Provisioning, View Invitation |
| Active | Switch to Tenant, Manage Tenant, Manage Super Admins, Suspend, Archive, Delete |
| Suspended | Reactivate, View Details |
| Archived / Cancelled | Read-only audit/detail view |

### Manage Tenant Drawer

Editable sections:
1. **Overview:** Tenant name, status (Active/Trial/Suspended/Archived), region, environment
2. **Configuration:** Module toggles, feature flag toggles

Read-only section:
- **Security & ZTS:** ZTS status, database name, cluster name

Save returns partial tenant update: `{ name, status, region, environment, modules, featureFlags }`.

### Tenant Creation

Frontend (via registry):
1. Admin clicks "Create Tenant"
2. Fills: tenant name, region, admin first/last name, admin email, optional phone
3. On submit:
   a. `adminApi.tenants.create()` → creates tenant
   b. `adminApi.tenantSuperAdmins.invite()` → invites initial super admin

Backend validation:
- Required: `name`
- Valid type: `enterprise | health_system | practice | organization`
- Unique tenant name enforced
- Modules normalized to canonical enum
- Creates with `status: trial`, `setup_status: provisioned`

### Backend Tenant Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/tenants` | Tenant Admin+ | List tenants (Super Admin sees all, Tenant Admin sees own) |
| POST | `/api/platform/admin/tenants` | Super Admin | Create tenant |
| GET | `/api/platform/admin/tenants/:id` | Tenant Admin+ | Get tenant details |
| PUT/PATCH | `/api/platform/admin/tenants/:id` | Tenant Admin+ | Update tenant (scope-limited for Tenant Admin) |
| POST | `/api/platform/admin/tenants/:id/provision` | Super Admin | Provision tenant infrastructure |
| DELETE | `/api/platform/admin/tenants/:id` | Super Admin | Delete tenant (cascade cleanup) |
| GET | `/api/platform/admin/tenants/:id/stats` | Tenant Admin+ | Tenant statistics |

### Tenant Model Schema

```typescript
// Key fields from tenant_administration.ts
{
  id: string;                    // UUID
  name: string;                  // Tenant display name
  type: 'enterprise' | 'health_system' | 'practice' | 'organization';
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  setup_status: 'provisioned' | 'invited' | 'admin_verified' | 'provisioning' | 'active';
  modules: string[];             // Enabled modules (emr, rpm, billing_rcm, etc.)
  infrastructure: {
    database_name: string;
    cluster_name: string;
    isolation_mode: 'shared' | 'dedicated_database' | 'dedicated_cluster';
    database_provisioned: boolean;
    database_provisioned_at: Date;
    region: string;
    backup_enabled: boolean;
    encryption_at_rest: boolean;
  };
  super_admins: [{               // Embedded super admin assignments
    id: string;
    name: string;
    email: string;
    status: string;
    assigned_date: Date;
    // + suspension/revocation/reinstate metadata
  }];
  uv_tenant_id: string;          // Self-referencing tenant ID
  meta: BaseMetadata;            // created_at, modified_at, status, etc.
}
```

### Available Modules

```
emr, care_management, patient_engagement, patient_hub,
clinical_programs, rpm, population_health, billing_rcm,
light_rcm, administration
```

---

## 3. Tenant Provisioning

### Overview

The Tenant Provisioning Wizard is a 6-step guided process for configuring and activating a tenant's infrastructure, modules, compliance settings, and initial super admin. It supports both **direct provisioning** (new tenant from scratch) and **registry-mode provisioning** (continuing an existing invited tenant).

### Key Files

| Layer | File |
|-------|------|
| Frontend Wizard | `src/components/admin/components/tenant-provisioning-wizard.tsx` |
| Backend Provision Endpoint | `server/src/modules/administration/routes/admin/tenants.ts` (POST /:id/provision) |
| API Client | `src/services/api/admin.ts` (tenants.provision) |

### Provisioning Wizard Steps

#### Step 1: Tenant Identity

| Field | Description | Validation |
|-------|-------------|------------|
| Tenant Name | Display name | Required |
| Tenant Slug | URL-safe identifier | Required, lowercase/numbers/hyphens only |
| Region | Geographic region | Required |
| Environment | prod / staging / dev | Display |
| Hierarchy Template | Organizational template to apply | Required |
| Setup Status | Current lifecycle status | Display only |

In registry mode, identity fields are **locked** (verified from invitation).

#### Step 2: Infrastructure & Isolation

| Field | Description | Editable |
|-------|-------------|----------|
| MongoDB Model | Database model type | Locked |
| Cluster Assignment | Target cluster | Locked |
| Region | Deployment region | Locked |
| Isolation Mode | shared / dedicated_database / dedicated_cluster | Locked |
| Environment | prod / staging / dev | Locked |
| Timezone | Tenant default timezone | Editable |
| Locale | Tenant default locale | Editable |

> ⚠️ **Irreversibility Warning:** Infrastructure settings cannot be changed after provisioning.

#### Step 3: Enabled Modules

- Select from core and optional modules
- **Required modules** (always on): `emr`, `administration`
- In registry mode, required modules are locked
- Optional modules toggleable: `rpm`, `billing_rcm`, `patient_engagement`, etc.

#### Step 4: Compliance, ZTS & Data Governance

All read-only mandatory controls:
- ✅ Multi-Factor Authentication (MFA) — Always On
- ✅ Role-Based Access Control (RBAC) — Always On
- ✅ Immutable Audit Logging — Always On
- ✅ Encryption at Rest — Always On
- ✅ Zero Trust Security (ZTS) — Always On

Additional governance and support guardrail information blocks.

#### Step 5: Initial Super Admin Assignment

| Mode | Behavior |
|------|----------|
| Registry Mode | Uses the verified/invited admin. Must be accepted/verified. |
| Direct Mode | Must select at least one internal owner (multi-select). |

#### Step 6: Confirm & Provision

- Full review summary of all previous steps
- **Irreversibility warning** with confirmation checkbox
- Provision button enabled only when confirmed and validated

### Provisioning Backend Behavior

```
POST /api/platform/admin/tenants/:tenantId/provision
```

1. Idempotency check: if already provisioned (`status: active` + `database_provisioned: true`), return success
2. Calls `provisionTenantDatabase()` — creates MongoDB database for tenant
3. On success, updates tenant:
   - `status` → `active`
   - `setup_status` → `active`
   - `infrastructure.database_name` → populated
   - `infrastructure.cluster_name` → populated
   - `infrastructure.isolation_mode` → set
   - `infrastructure.database_provisioned` → `true`
   - `infrastructure.database_provisioned_at` → timestamp
   - `infrastructure.backup_enabled` → `true`
   - `infrastructure.encryption_at_rest` → `true`
4. Audit log: `tenant.provision`

### Incremental Save

For existing tenants, each wizard step is **persisted incrementally** via `PATCH /api/platform/admin/tenants/:id`. The final provision call only triggers infrastructure creation.

---

## 4. Tenant Super Admin Management

### Overview

The Tenant Super Admin screen provides Super Admins with centralized management of all tenant super admin assignments across the platform. It supports inviting, assigning, rotating, suspending, revoking, and setting primary super admins.

### Key Files

| Layer | File |
|-------|------|
| Frontend Screen | `src/components/admin/screens/tenant-super-admins.tsx` |
| Table Component | `src/components/admin/components/tenant-super-admins-table.tsx` |
| Details Drawer | `src/components/admin/components/super-admin-details-drawer.tsx` |
| Management Drawer | `src/components/admin/components/tenant-super-admins-management-drawer.tsx` |
| Assignment Panel | `src/components/admin/components/tenant-super-admin-assignment-panel.tsx` |
| Set Primary Panel | `src/components/admin/components/set-primary-super-admin-panel.tsx` |
| Rotate Panel | `src/components/admin/components/rotate-super-admin-panel.tsx` |
| Suspend Panel | `src/components/admin/components/suspend-super-admin-panel.tsx` |
| Revoke Panel | `src/components/admin/components/revoke-super-admin-panel.tsx` |
| Assign Drawer | `src/components/admin/components/assign-super-admin-drawer.tsx` |
| Delegated Session Modal | `src/components/admin/components/delegated-session-modal.tsx` |
| Backend Routes | `server/src/modules/administration/routes/admin/tenantSuperAdmins.ts` |
| API Client | `src/services/api/admin.ts` (tenantSuperAdmins section) |

### Super Admin Table

Displays all tenant super admin assignments across all tenants.

**Columns:**
- Admin Name
- Email
- Tenant Name
- Tenant Region
- Tenant Status
- Admin Status (Active, Pending, Suspended, Revoked)
- MFA Status (Enabled / Required)
- Primary (badge for primary admin)
- Assigned Date
- Actions

### Available Actions

| Action | Description |
|--------|-------------|
| **View Details** | Opens details drawer with full admin info |
| **Set as Primary** | Designates admin as the primary super admin for their tenant |
| **Rotate** | Replaces this admin with a new super admin (rotation workflow) |
| **Suspend** | Temporarily suspends admin access (requires reason) |
| **Revoke** | Permanently revokes admin access |
| **Assign Additional** | Assigns a new additional super admin to a tenant |
| **Invite** | Invites a new super admin via email |
| **View Audit Events** | Navigates to ZTS Audit Console filtered by this admin |
| **Delegated Access** | Start a delegated session to access the admin's tenant |

### Invite Super Admin Flow (Backend)

```
POST /api/platform/admin/tenant-super-admins/invite
```

1. Validates required fields: `tenantId`, `email`, `name_first`, `name_last`
2. Finds or creates the "Tenant Admin" role (platform-level, cross-module)
3. Checks for existing pending invitation → rejects duplicates (409)
4. Checks for existing active super admin assignment → rejects duplicates (409)
5. If user doesn't exist:
   a. Creates user with `pending_activation` status
   b. Generates temporary password (bcrypt hashed)
   c. Creates invitation record with hashed token (7-day expiry)
   d. Sends invitation email with token + temporary password
6. If user exists but not active:
   a. Reuses existing user, creates new invitation
7. Updates the tenant's `super_admins` embedded array
8. Creates user role assignment for "Tenant Admin"
9. Creates user role binding with full tenant scope

### Primary Super Admin Convention

The **first active** admin in the `super_admins` array is considered the **primary super admin**. The "Set as Primary" action reorders the array.

### Backend Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/tenant-super-admins` | Super Admin | List all super admin assignments |
| POST | `/api/platform/admin/tenant-super-admins/invite` | Super Admin | Invite a new tenant super admin |
| POST | `/api/platform/admin/tenant-super-admins/assign` | Super Admin | Assign existing user as super admin |
| DELETE | `/api/platform/admin/tenant-super-admins/:id` | Super Admin | Remove super admin assignment |

---

## 5. Hierarchy Templates (Node Types)

### Overview

Hierarchy Templates define the **organizational structure templates** (node types) that can be used when building a tenant's organization hierarchy. They define what types of organizational units are available (e.g., Enterprise, Region, Organization, Practice, Department) and their allowed parent-child relationships.

The page has **two tabs**: a **Node Types Table** for managing node type definitions in a table view, and a **Hierarchy Visualization** that shows the actual organization hierarchy tree with real nodes.

### Key Files

| Layer | File |
|-------|------|
| Frontend Screen | `src/components/admin/screens/hierarchy-templates.tsx` |
| Node Types Table | `src/components/admin/components/node-types-table.tsx` |
| Node Type Drawer | `src/components/admin/components/node-type-drawer.tsx` |
| Node Type Confirm Modal | `src/components/admin/components/node-type-confirmation-modal.tsx` |
| Organization Node Drawer | `src/components/admin/components/organization-node-drawer.tsx` |
| Capability Settings Drawer | `src/components/admin/components/capability-settings-drawer.tsx` |
| Types | `src/components/admin/types/node-types.ts` |
| Backend: Node Types Route | `server/src/modules/administration/routes/admin/nodeTypes.ts` |
| Backend: Org Nodes Route | `server/src/modules/administration/routes/admin/organizationNodes.ts` |
| Backend: Hierarchy Utils | `server/src/modules/administration/utils/hierarchyUtils.ts` |
| Backend: Capability Resolver | `server/src/modules/administration/services/capabilityResolver.ts` |
| API Client | `src/services/api/admin.ts` (nodeTypes + organizationNodes) |

### Node Type Definition

```typescript
interface NodeType {
  id: string;
  name: string;              // e.g., "Enterprise", "Region", "Practice"
  description: string;
  slug: string;              // URL-safe identifier
  icon?: string;
  color?: string;
  allowedParents: string[];  // Node type slugs this can be a child of
  allowedChildren: string[]; // Node type slugs that can be children of this
  maxChildren?: number;
  requiredFields: string[];
  optionalFields: string[];
  isRootLevel: boolean;      // Can be a root node
  sortOrder: number;
  status: 'Active' | 'Disabled';
  createdDate: string;
  lastModified: string;
}
```

### Node Type Examples

| Node Type | Parent Types | Description |
|-----------|--------------|-------------|
| Enterprise | (root) | Top-level organizational entity |
| Region | Enterprise | Geographic grouping |
| Organization / Clinic | Region, Enterprise | Healthcare facility |
| Department / Group | Organization | Sub-unit within a facility |
| Practice / Facility | Organization, Department | Medical practice |

### Hierarchy Visualization

The visualization tab shows a **live tree view** of the actual organization hierarchy for a selected tenant:

- Tree nodes are expandable/collapsible
- Each node shows: name, code, type icon, status badge, capability badges (Clinical/Billing)
- Module badges shown per node
- Hover actions: Add Child, Promote, View, Edit, Delete

### Capabilities System

Organization nodes have **capability states** that determine what workflows are available:

| Capability | States | Inheritance |
|------------|--------|-------------|
| `clinical_capability` | `enabled` / `disabled` / `inherit` | Inherits from parent if set to `inherit` |
| `billing_capability` | `enabled` / `disabled` / `inherit` | Inherits from parent if set to `inherit` |

The `capabilityResolver` service resolves effective capabilities by walking up the hierarchy tree.

### Organization Node CRUD

**Backend endpoints:**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/platform/admin/organization-nodes` | List nodes (filterable by tenant, parent, type, status) |
| POST | `/api/platform/admin/organization-nodes` | Create node |
| GET | `/api/platform/admin/organization-nodes/:id` | Get node details |
| PUT | `/api/platform/admin/organization-nodes/:id` | Update node |
| DELETE | `/api/platform/admin/organization-nodes/:id` | Soft-delete node |
| POST | `/api/platform/admin/organization-nodes/:id/restore` | Re-enable node |
| GET | `/api/platform/admin/organization-nodes/tree/:tenantId` | Get full hierarchy tree |
| PATCH | `/api/platform/admin/organization-nodes/:id/capabilities` | Update capability states |
| GET | `/api/platform/admin/organization-nodes/capabilities/:tenantId` | Resolve all capabilities |

### Hierarchy Management Features

- **Add Child Node:** Creates a new node under a selected parent
- **Edit Node:** Update name, code, modules, capabilities
- **Delete Node:** Soft-deletes node (and updates closure table)
- **Promote Node Type:** Request or execute promotion of a node's type in the hierarchy
- **Capability Settings:** Drawer for configuring clinical/billing capability states
- **Module Assignment:** Per-node module enablement with optional inheritance

### Closure Table

The system uses a **closure table** pattern for hierarchy traversal:
- `addNodeToClosure()` — adds ancestor-descendant relationships
- `removeNodeFromClosure()` — cleans up relationships on delete
- `moveNodeInClosure()` — updates relationships when reparenting

---

## 6. Global Roles & Permissions

### Overview

The Global Roles & Permissions page is a **tabbed interface** for managing the platform's role and permission catalog. It supports creating, editing, cloning, enabling/disabling both roles and permissions. This page is accessible to both Super Admins and Tenant Admins (with tenant-scoped visibility).

### Key Files

| Layer | File |
|-------|------|
| Frontend Screen | `src/components/admin/screens/global-roles-permissions.tsx` |
| Permissions Table | `src/components/admin/components/permissions-table.tsx` |
| Roles Table | `src/components/admin/components/roles-table.tsx` |
| Permission Drawer | `src/components/admin/components/permission-drawer.tsx` |
| Role Drawer | `src/components/admin/components/role-drawer.tsx` |
| Confirmation Modals | `src/components/admin/components/permission-confirmation-modal.tsx`, `role-confirmation-modal.tsx` |
| Types | `src/components/admin/types/permissions-roles.ts` |
| Backend: Roles Routes | `server/src/modules/administration/routes/admin/roles.ts` |
| Backend: Permissions Routes | `server/src/modules/administration/routes/admin/permissions.ts` |
| Backend: Permission Registry | `server/src/modules/administration/permissions/registry.ts` |
| Backend: Role Model | `server/src/modules/administration/models/role_administration.ts` |
| Backend: Permission Model | `server/src/modules/administration/models/permission_administration.ts` |
| Backend: RolePermission Model | `server/src/modules/administration/models/role_permission_administration.ts` |
| API Client | `src/services/api/admin.ts` (roles + permissions sections) |

### Permissions Tab

#### What is a Permission?

A permission defines **what action** can be performed on **what resource** and at **what scope**:

```typescript
{
  id: string;           // e.g., "patient.read"
  name: string;         // Human-readable name
  permissionKey: string; // Same as id
  resource: string;     // e.g., "patient", "role", "tenant"
  action: string;       // e.g., "read", "write", "delete", "manage"
  scope: string;        // "platform" | "tenant" | "organization"
  module: string | null; // Module this permission belongs to (null = platform-wide)
  status: 'Active' | 'Disabled';
}
```

#### Permission Sources

Permissions come from two sources:
1. **Static Registry** (`permissions/registry.ts`) — built-in permissions defined in code
2. **Database** (`PermissionPlatform` collection) — dynamically created or seeded permissions

When no permissions exist in the database, the system auto-seeds from the registry.

#### Tenant Admin Filtering

- **Super Admin:** Sees ALL permissions for ALL modules
- **Tenant Admin:** Sees only permissions for modules their tenant has access to (plus platform-wide permissions with no module)

#### Permission Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/permissions` | Tenant Admin+ | List permissions (filterable by search, scope, module, status) |
| POST | `/api/platform/admin/permissions` | Super Admin | Create permission |
| GET | `/api/platform/admin/permissions/:id` | Tenant Admin+ | Get permission details |
| PUT | `/api/platform/admin/permissions/:id` | Super Admin | Update permission |
| DELETE | `/api/platform/admin/permissions/:id` | Super Admin | Disable permission |
| POST | `/api/platform/admin/permissions/:id/restore` | Super Admin | Re-enable permission |

### Roles Tab

#### What is a Role?

A role groups permissions together and can be assigned to users. Roles are module-scoped and tenant-scoped:

```typescript
{
  id: string;                      // e.g., "role-1234-xxx"
  name: string;                    // "Clinical Staff", "Billing Admin"
  description: string;
  uv_tenant_id: string;            // Tenant ID or "platform" for global roles
  module_id: string | null;        // Primary module (e.g., "emr", "rpm")
  modules: string[];               // All modules this role grants access to
  role_type: string;               // "Admin" | "Clinical" | "Operational"
  applicable_node_types: string[]; // Node types where this role can be assigned
  permissions: string[];           // Array of permission IDs
  is_template: boolean;            // Platform template role
  is_default: boolean;
  tenant_editable: boolean;        // Can tenants modify this role
  allow_cloning: boolean;
  display_order: number;
  // Provider Classification
  provider_classification: 'non_clinical' | 'clinical' | 'physician' | 'nurse';
  requires_provider_profile: boolean;
  can_sign_notes: boolean;
  has_schedule: boolean;
  // Scope Rules
  default_scope_assignment: 'Node and Descendants' | 'Node Only';
  allow_scope_override: boolean;
}
```

#### Role Types

| Type | Description |
|------|-------------|
| **Platform Role** | `uv_tenant_id: 'platform'`. Available to all tenants. Created by Super Admin. |
| **Template Role** | `is_template: true`. Base role that can be cloned by tenants. |
| **Tenant Role** | `uv_tenant_id: <tenant_id>`. Custom role created by a Tenant Admin. |

#### Role Visibility

- **Super Admin:** Sees all roles (platform + all tenants)
- **Tenant Admin:** Sees their tenant's roles + platform "Tenant Admin" role only. **Cannot** see "Super Admin" role.

#### Role CRUD Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/roles` | Tenant Admin+ | List roles (tenant-scoped) |
| POST | `/api/platform/admin/roles` | Tenant Admin+ | Create role |
| GET | `/api/platform/admin/roles/:id` | Tenant Admin+ | Get role with permissions and user count |
| PUT | `/api/platform/admin/roles/:id` | Tenant Admin+ | Update role (provider classification change blocked if in use) |
| DELETE | `/api/platform/admin/roles/:id` | Tenant Admin+ | Delete role (blocked if assigned to users) |
| GET | `/api/platform/admin/roles/templates/list` | Tenant Admin+ | Get role templates |
| GET | `/api/platform/admin/roles/by-module` | Tenant Admin+ | Get roles filtered by module(s) |
| GET | `/api/platform/admin/roles/assignable` | Tenant Admin+ | Get roles assignable at a specific node |
| POST | `/api/platform/admin/roles/validate-delegation` | Tenant Admin+ | Validate a delegation request |

#### Role Creation Flow

```
1. Admin opens "Create Role" drawer
2. Fills name, description, role type
3. Selects modules this role grants access to
4. Selects applicable node types (where role can be assigned in hierarchy)
5. Optionally selects a template to inherit permissions from
6. Checks/unchecks individual permissions
7. Configures provider classification if applicable
8. On save:
   a. Validates unique name within tenant
   b. Validates all permission IDs (registry + database)
   c. Creates role document
   d. Creates role-permission mapping documents
   e. Audit log: role.create
```

#### Delegation Service Integration

Roles have a built-in delegation system:
- `getAssignableRoles()` — determines which roles a user can assign at a given node
- `validateDelegation()` — validates that a role assignment is allowed (prevents privilege escalation)
- Delegatable roles must match the target node type

---

## 7. ZTS Audit Console

### Overview

The **ZTS (Zero Trust Security) Audit Console** is the platform's security monitoring and audit trail interface. It has **three tabs**: Audit Events, Delegated Access (Super Admin only), and Security Posture. A green "Zero Trust Security Enabled" banner is always displayed.

### Key Files

| Layer | File |
|-------|------|
| Frontend Screen | `src/components/admin/screens/zts-audit-console.tsx` |
| Audit Events Table | `src/components/admin/components/audit-events-table.tsx` |
| Delegated Access Table | `src/components/admin/components/delegated-access-table.tsx` |
| Security Posture | `src/components/admin/components/security-posture.tsx` |
| Audit Event Drawer | `src/components/admin/components/audit-event-drawer.tsx` |
| Session Drawers | `src/components/admin/components/delegated-session-drawer.tsx`, `start-session-drawer.tsx`, `end-session-modal.tsx` |
| Provider Credential Drawer | `src/components/admin/components/provider-credential-drawer.tsx` |
| Types | `src/components/admin/types/audit-zts.ts` |
| Backend: Audit Routes | `server/src/modules/administration/routes/admin/audit.ts` |
| Backend: Security Metrics | `server/src/modules/administration/routes/admin/securityMetrics.ts` |
| Backend: Delegated Sessions | `server/src/modules/administration/routes/admin/delegatedSessions.ts` |
| Backend: Audit Event Model | `server/src/modules/administration/models/audit_event_administration.ts` |
| Backend: Audit Log Model | `server/src/modules/administration/models/audit_log_administration.ts` |

### Tab 1: Audit Events

#### What Gets Audited

Every **write operation** (create, update, delete) and security-relevant action is recorded:

- User creation, updates, deletion
- Role assignments and removals
- Tenant CRUD operations
- Login/logout events
- Password changes
- Delegated session start/end
- Permission changes
- Organization node changes

#### Noise Filtering

The following are automatically excluded from the default view:
- **Resource types:** patient, clinical_note, prescription, vitals, lab_result
- **Action types:** patient.view, patient.checkin, patient.checkout, patient.list, system.heartbeat, system.ping, session.refresh, token.refresh

Admins can explicitly query for filtered resource types if needed.

#### Audit Event Schema

```typescript
{
  id: string;
  timestamp: string;              // Formatted datetime
  actorType: string;              // "Super Admin" | "Tenant Admin" | "Staff (User)"
  actorIdentity: string;          // User ID
  actorName: string;              // Resolved user name
  actorEmail: string;
  tenantId: string;
  tenantName: string;             // Resolved tenant name
  actionType: string;             // e.g., "user.create", "role.update"
  resourceType: string;           // e.g., "user", "role", "tenant"
  resourceIdentifier: string;     // Target resource ID
  outcome: 'Success' | 'Failure';
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  auditChainHash: string;         // SHA-256 hash for tamper detection
  authenticationMethod: string;
  mfaStatus: string;
  originIp: string;
  payload: object;                // Full event details
  beforeValue: any;               // State before change
  afterValue: any;                // State after change
  sessionId: string | null;
  isDelegated: boolean;           // Was this done via delegation/impersonation
  userAgent: string;
}
```

#### Filtering

- **Actor Identity:** Click on any actor to filter by that user
- **Tenant:** Click on tenant name to filter
- **Outcome:** Filter by Success/Failure
- **Risk Level:** Filter by Low/Medium/High/Critical
- **Date Range:** From/To date filters
- **Search:** Free-text search across action, resource, target ID, actor ID

#### Tenant Scoping

- **Super Admin:** Sees audit events across all tenants (can filter by tenant)
- **Tenant Admin:** Automatically scoped to their own tenant only (banner displayed)

#### Auto-Refresh

Audit events are automatically refreshed when the audit tab is activated.

### Tab 2: Delegated Access (Super Admin Only)

Manages delegated sessions — where a Super Admin temporarily accesses a tenant's data.

**Features:**
- Table of all delegated sessions (active, expired, ended)
- **Start Delegated Session:** Select tenant, provide reason, set duration (minutes)
- **End Session:** End an active session early
- **View Details:** Full session information drawer
- **View Audit Events:** Navigate to audit tab filtered by session

**Session Flow:**
```
1. Super Admin clicks "Start Delegated Session"
2. Selects target tenant from available list
3. Provides reason for access
4. Sets duration (in minutes)
5. Session created → frontend injects x-delegated-tenant-id header
6. All subsequent API calls route to target tenant
7. Session auto-expires after duration or manually ended
8. All actions during session are audited with isDelegated flag
```

### Tab 3: Security Posture

Dashboard-style view of overall security health:
- Security metrics and scores
- Navigate to audit events by risk level
- Navigate to delegated sessions by status
- Provider credential monitoring

### Audit Backend Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/platform/admin/audit` | Tenant Admin+ | List audit events (paginated, filterable) |
| GET | `/api/platform/admin/audit/stats` | Tenant Admin+ | Audit statistics (totals, last 24h/7d/30d, failed, high-risk, top actions) |
| GET | `/api/platform/admin/audit/:eventId` | Tenant Admin+ | Get single event details |
| GET | `/api/platform/admin/audit/export` | Tenant Admin+ | Export audit log (CSV/JSON) |

### Audit Statistics

```typescript
{
  total: number;              // All-time total events
  last24Hours: number;        // Events in last 24 hours
  last7Days: number;          // Events in last 7 days
  last30Days: number;         // Events in last 30 days
  failedEvents: number;       // Total failed events
  highRiskEvents: number;     // Events with risk_level high or critical
  topActions: [{              // Top 10 most frequent actions (30 days)
    action: string;
    count: number;
  }]
}
```

### Two Audit Collections

| Collection | Purpose |
|------------|---------|
| `AuditEventPlatform` | Admin actions (delegated sessions, user management, role changes, etc.) — queried by the ZTS console |
| `AuditLogPlatform` | PHI access logs (automatic logging via middleware) — separate collection for compliance |

---

## 8. Error Logs

### Overview

The Error Logs page provides a centralized view of application errors and warnings. It supports filtering, resolving errors, configuring email alert recipients, and viewing error details including stack traces and metadata.

### Key Files

| Layer | File |
|-------|------|
| Frontend Component | `src/components/admin/ErrorLogs.tsx` |
| Error Logger Service | `src/lib/api/error-logger.ts` |
| Error Codes | `src/lib/constants/error-codes.ts` |
| AppError Utility | `src/lib/utils/AppError.ts` |
| Backend: Alert Routes | `server/src/routes/alerts.ts` (mounted at `/api/alerts`) |

### Error Log Schema

```typescript
interface ErrorLog {
  _id: string;                    // MongoDB document ID
  name: string;                   // Error name/title
  code?: string;                  // MethodError enum code
  severity: 'error' | 'warning';
  timestamp: string;
  status: 'unresolved' | 'resolved';
  message: string;
  metadata?: {
    statusCode?: number;          // HTTP status code
    error?: string;               // Error type
    message?: string;             // Detailed message
    [key: string]: any;           // Additional context
  };
}
```

### UI Features

#### Tabs
- **All:** Shows all error logs
- **Unresolved:** Only unresolved errors
- **Resolved:** Only resolved errors

#### Filters
- **Error Code:** Dropdown of available MethodError codes (auto-discovered from loaded logs)
- **Date Range:** Calendar picker for from/to dates
- **Status Code Filter:** Filter by HTTP status code

#### Per-Error Actions
- **Resolve:** Mark an error as resolved (with confirmation dialog)
- **Details:** Expandable section showing full metadata JSON
- **Copy JSON:** Copy error details to clipboard

#### Email Alert Management
- **Notifications Dialog:** Add/remove email recipients for critical error alerts
- Recipients receive automatic notifications when critical errors occur

#### Pagination
- 10 items per page
- Client-side pagination with filtered result set

### Error Logger Service

The `ErrorLoggerService` is a singleton that provides:

```typescript
class ErrorLoggerService {
  getLogs(status, statusCode?, errorCode?)  // Fetch logs from /api/alerts/logs
  getAlertEmails()                          // Get alert email recipients
  addAlertEmail(email)                      // Add email recipient
  removeAlertEmail(email)                   // Remove email recipient
  logAppError(error: AppError, severity)    // Log an AppError instance
  logError(name, severity, payload)         // Log a generic error
  resolveLog(logId)                         // Mark log as resolved
}
```

### Error Logging Integration

Errors can be logged from anywhere in the frontend:

```typescript
// Using AppError class (preferred)
import { AppError } from '@/lib/utils/AppError';
const error = new AppError('Failed to fetch patients', {
  code: MethodError.FETCH_FAILED,
  statusCode: 500,
  metadata: { endpoint: '/api/patients' }
});
ErrorLogger.logAppError(error);

// Using direct logging
ErrorLogger.logError('API Error', 'error', {
  message: 'Request failed',
  statusCode: 500
});
```

### Simulate Error

A "Simulate Error" button is available for testing, which creates a manual test error entry.

### Real-Time Updates

The component listens for `error-logs-updated` custom events on the window object, enabling real-time updates when new errors are logged elsewhere in the application.

---

## Cross-Feature Architecture Notes

### Access Control Hierarchy

```
Super Admin (platform-wide)
  └── Tenant Admin (tenant-scoped)
       └── Organization User (node-scoped via bindings)
```

### Middleware Stack

All admin routes pass through:
1. `devAuthBypass` — development-only auth bypass
2. `authenticate` — JWT token validation
3. `requireTenantAdmin` / `requireSuperAdmin` — role-based access control
4. `enforceTenantIsolation` — ensures tenant boundary enforcement
5. `tenantDb` — resolves and connects to tenant-specific database

### Request Headers

| Header | Purpose |
|--------|---------|
| `Authorization: Bearer <token>` | JWT authentication |
| `x-delegated-tenant-id` | Delegated session tenant targeting |
| `x-node-id` | Organization node context for scoped operations |

### Audit Trail Coverage

Every write operation across all admin features creates an audit log entry containing:
- Actor (who), action (what), target (which resource), outcome (success/failure)
- IP address, user agent, timestamp
- Before/after values for change tracking
- Risk level classification
- SHA-256 hash for tamper detection
