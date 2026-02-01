# Solution Navigator - AI Agent Instructions

## Project Overview

**Solution Navigator** is a Vue 3 + Vite task management app where users organize hierarchical "nodes" (tasks/ideas). Each node can contain child nodes, be searched, and track metadata like creation time and pomodoro counts.

### Architecture

- **Frontend**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia (composition-style stores with `defineStore()`)
- **UI Components**: PrimeVue 4 (Card, Button, InputText, Textarea, ScrollPanel, etc.)
- **Routing**: Vue Router 5 with lazy-loaded views
- **Testing**: Vitest (unit) + Cypress (e2e)
- **Build**: Vite 7
- **Persistence**: Pinia plugin persists store state to localStorage automatically

## Key Data Structures

### Node Model

Stored in `NodeStore`, each node has:
```javascript
{
  uuid,           // Unique identifier (generated with uuid/v4)
  title,          // User editable text
  content,        // Markdown content, rendered with markdown-it
  resolved,       // Boolean flag
  childNodes,     // Array of child node UUIDs
  parentNode,     // UUID of parent (null for root nodes)
  pomodoroCount,  // Numeric counter
  createdAt,      // ISO timestamp
  updatedAt,      // ISO timestamp (refreshed on any node change)
}
```

### Store Patterns

- **State**: Use `ref()` for reactive data (e.g., `ref([])` for nodes array)
- **Getters**: Use `computed()` that filter/transform state
- **Actions**: Direct mutations of refs; always return values when needed
- **Composition API Style**: All stores use `defineStore('StoreName', () => { ... })`

Example from `NodeStore`:
```javascript
const nodes = ref([])
const nodesList = computed(() => {
  // Filter by search query, sort by updatedAt descending
})
const addNode = ({ title, content, ... } = {}) => {
  // Generate UUID, create node, push to refs, return UUID
}
```

## Component Patterns

### Script Setup Usage

All `.vue` files use `<script setup>`:
- Import dependencies and child components at the top
- Access store via `useNodeStore()`
- Use `storeToRefs()` to destructure reactive refs from store (preserves reactivity)
- Define props and emits as functions: `defineProps()`, `defineEmits()`
- Use `watch()` from Vue for reactive updates

### Example (from `NodeShow.vue`):
```vue
<script setup>
import { useNodeStore } from '@/stores/NodeStore'
import { storeToRefs } from 'pinia'

const store = useNodeStore()
const { nodesList } = storeToRefs(store)
const { findNode, refreshUpdatedAt } = store

// Props are required to be reactive-reactive
const props = defineProps({ nodeUuid: String })
const emit = defineEmits(['delete', 'nodeNotFound'])
</script>
```

### Layout Structure

- **App.vue**: Minimal router outlet wrapper
- **HomeIndex.vue** + **NodeShow.vue**: Parent/child route layout
- **NodesArbor.vue**: Side panel displaying node list with search filtering
- **ChildNode.vue**: Recursive component for nested node trees

## Developer Workflows

```bash
nvm use # Use Node.js version from .nvmrc
```

### Development
```bash
npm run dev          # Hot-reload server on :5173
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

### Testing
```bash
npm run test:unit              # Run Vitest (specs/ directory)
npm run test:e2e:dev           # Cypress against dev server (interactive)
npm run test:e2e               # Cypress against production build
npm run lint                   # ESLint check
npm run format                 # Prettier auto-format src/
```

### Test Patterns

**Vitest** (`specs/`):
- Use `createTestingPinia()` from `@pinia/testing` to isolate store state
- Call `setActivePinia()` before each test
- Initialize pinia with `initialState` to seed data
- Test actions with `stubActions: false` to verify mutations

Example from `NodeStore.spec.js`:
```javascript
function setupPinia(nodes = []) {
  setActivePinia(createTestingPinia({
    initialState: { NodeStore: { nodes, searchQuery: '' } },
    createSpy: vi.fn,
    stubActions: false
  }))
}
```

**Cypress** (`cypress/`):
- Target elements via `data-test-*` attributes (e.g., `data-test-node-item`)
- Use real events via `cypress-real-events` plugin
- Test against dev server for rapid iteration (`test:e2e:dev`)

## Project Conventions

### File Organization
- **`src/stores/`**: Pinia stores with composition API syntax
- **`src/views/`**: Route components (lazy-loaded)
- **`src/components/`**: Reusable UI components
- **`src/router/`**: Vue Router configuration with lazy loading for views
- **`specs/`**: Unit tests (mirrors `src/` structure)
- **`cypress/`**: E2E tests and fixtures

### Naming & Aliases
- Use `@/` alias for absolute imports from `src/` (configured in Vite)
- Node identifier: always `uuid` (not `id`)
- Boolean flags: `resolved` (not `isResolved` or `complete`)

### Code Style
- **ESLint + Prettier**: Configured with Vue 3, Cypress, and Prettier compatibility rules
- **Indentation**: Prettier handles it (2 spaces)
- **Markdown**: Content rendered with `markdown-it` library with HTML, linkify, and typographer options enabled

### State Consistency
The store includes `enforceNodeTreeConsistency()` action that:
- Removes broken references (orphaned childNode UUIDs)
- Nullifies invalid parentNode references
- Call before critical operations to prevent data corruption

### Recursive Patterns
- `getRootNode(uuid)`: Recursively finds the top-level parent of any node
- `deleteNode(uuid)`: Recursively deletes node and all descendants
- Avoid stack overflow: nodes are stored flat in `nodes.value` array, not nested objects

## Integration Points

### External Dependencies
- **markdown-it**: Render node content as HTML
- **@primevue/themes**: Aura theme used globally
- **ConfirmationService**: PrimeVue service for confirmations (initialized in `main.js`)
- **pinia-plugin-persistedstate**: Auto-syncs store to localStorage

### Cross-Component Communication
- Store as single source of truth (no prop drilling beyond 1-2 levels)
- Use `storeToRefs()` to subscribe to store changes reactively
- Emit events for user actions (delete, expand) to parent views

## Common Tasks

### Adding a New Node Property
1. Update `addNode()` default params in `NodeStore.js`
2. Update node creation logic to initialize the property
3. Add test case in `specs/stores/NodeStore.spec.js`
4. Update components that display or edit nodes

### Creating a New View
1. Add route in `src/router/index.js` (use lazy loading: `() => import('@/views/...')`)
2. Create component in `src/views/`
3. Use `<script setup>` with store access via `useNodeStore()`
4. Add E2E test in `cypress/e2e/`

### Debugging Store State
- Pinia DevTools available in browser (shows all state mutations)
- Use `pinia-plugin-persistedstate` to inspect localStorage
- Watch computed getters in browser DevTools to verify filter logic
