---
name: running-tests
description: Has information about how to test this web app, should be used when requested or in a Test Driven Development cycle.
---

# Web Application Testing with Cypress and Vitest

- The tests are core part of the development of this app.
- The tests integration level goes from coarse to granular.
- Coarse tests are the ones that integrate as much functionality as possible and those are usually written in cypress. 
- Granular tests are the ones that test one or more components working together and those are usually written using vitest.

### How to run Coarse specs:

The coarse tests in this app are built in cypress.

1. To run them against a prod like version of the app first build the app with:

```bash
npm run build
```

2. then run the cypress specs:

```bash
npm run test:e2e
```

3. A successful run should have this in the output:

```bash
All specs passed!
```

### How to run Granular specs:

1. To run the more granular specs use:

```bash
npx vitest --run
```

2. A successful run should look somewhat like this:

```bash
Test Files  3 passed (3)
Tests  20 passed | 1 skipped (21)
```

## Best practices

- Use data-testid attributes for dynamic content in coarse tests
- Mock and stub only when absolutely necessary, if we can use the real integration we should use it