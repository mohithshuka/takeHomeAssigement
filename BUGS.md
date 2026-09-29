# Bug Report

## Bug #1 — Incorrect pagination offset

### Location

`src/services/taskService.js`

### Description

The `GET /tasks` endpoint calculates the pagination offset incorrectly.

The current implementation uses:

```javascript
const offset = page * limit;