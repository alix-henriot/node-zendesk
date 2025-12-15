# Testing Guide for Zendesk Tickets Merge API

## Overview
This guide explains the test file I created for the updated `merge()` method in the Tickets client.

## Testing Framework
The project uses:
- **Vitest**: A fast unit test framework (similar to Jest)
- **Nock**: A library for mocking HTTP requests/responses

## Test File Location
`/test/tickets-merge.test.js`

## Understanding the Tests

### Test Structure
Each test follows this pattern:

```javascript
it('should [describe what the test does]', async () => {
  const {nockDone} = await nockBack('fixture-file-name.json');
  
  // Your test code here
  const result = await client.tickets.merge(mergeData);
  
  // Assertions to verify results
  expect(result).toBeDefined();
  expect(result.id).toBeDefined();
  
  // Tell nock we're done recording/playing back
  nockDone();
});
```

### The Tests Included

#### 1. **Merge with Full Comments** (`tickets_merge_with_comments.json`)
```javascript
const mergeData = {
  ids: [123, 456, 789],
  target_comment: 'Merging tickets 456 and 789 into this ticket',
  source_comment: 'This ticket has been merged',
  target_comment_is_public: false,
  source_comment_is_public: false,
};
```
**What it tests:** Merging multiple tickets with all optional parameters

#### 2. **Merge with Minimal Data** (`tickets_merge_minimal.json`)
```javascript
const mergeData = {
  ids: [111, 222, 333],
};
```
**What it tests:** Merging works with only the required `ids` parameter

#### 3. **Merge with Target Comment Only** (`tickets_merge_target_comment_only.json`)
```javascript
const mergeData = {
  ids: [100, 200],
  target_comment: 'These tickets were merged',
};
```
**What it tests:** Merging with selective optional parameters

#### 4. **Merge with Public Comments** (`tickets_merge_public_comments.json`)
```javascript
const mergeData = {
  ids: [50, 60, 70],
  target_comment: 'Public merge notification',
  source_comment: 'This ticket was merged',
  target_comment_is_public: true,
  source_comment_is_public: true,
};
```
**What it tests:** Merging with public comment flags enabled

## How to Run Tests

### Option 1: Run All Tests
```bash
npm test
```

### Option 2: Run Only Merge Tests
```bash
npm test -- test/tickets-merge.test.js
```

### Option 3: Run Tests with Coverage
```bash
npm run test:coverage
```

### Option 4: Run Tests in Watch Mode (for development)
```bash
npx vitest test/tickets-merge.test.js
```

## Understanding Nock Fixtures

When tests run in `record` mode (first time), nock captures the HTTP requests and responses and saves them to JSON files in `/test/fixtures/`.

These files look like:
```json
{
  "scope": "https://yoursubdomain.zendesk.com",
  "method": "POST",
  "path": "/api/v2/tickets/merge",
  "body": {...},
  "status": 200,
  "response": {...}
}
```

In subsequent runs, nock plays back these recorded responses instead of making real API calls.

## Key Assertions Explained

```javascript
// Check that the result exists
expect(mergedTicket).toBeDefined();

// Check that the merged ticket has an ID
expect(mergedTicket.id).toBeDefined();

// Check that the ID is a number
expect(typeof mergedTicket.id).toBe('number');
```

## When to Add New Tests

Add a new test whenever you want to verify:
- A different set of parameters
- Error handling scenarios
- Edge cases (empty arrays, null values, etc.)

Example template for a new test:

```javascript
it('should [describe scenario]', async () => {
  const {nockDone} = await nockBack('tickets_merge_scenario.json');
  
  const mergeData = {
    ids: [1, 2, 3],
    // Add parameters you want to test
  };

  const {result: mergedTicket} = await client.tickets.merge(mergeData);
  
  // Add assertions for what you expect
  expect(mergedTicket.id).toBeDefined();
  
  nockDone();
});
```

## Troubleshooting

### Error: "vitest: command not found"
**Solution:** Run `npm install` in the project root to install dependencies

### Tests fail with "ENOENT" for fixture files
**Solution:** First run will create fixture files. Make sure the directory `/test/fixtures/` exists.

### Tests timeout
**Solution:** Increase timeout in vitest config or check API connectivity

## Best Practices for Testing

1. **One thing per test** - Each test should verify one specific behavior
2. **Clear test names** - Use descriptive names starting with "should"
3. **Arrange-Act-Assert** - Structure: setup data → call function → verify results
4. **Use fixtures** - Let nock record real responses so tests are reliable
5. **Test edge cases** - Include tests for minimal data, full data, error scenarios

## Next Steps

1. Run: `npm test -- test/tickets-merge.test.js`
2. Check the `/test/fixtures/` folder for generated fixture files
3. Review the fixture files to understand what the API actually returned
4. Add more tests for error cases (invalid inputs, API errors, etc.)
