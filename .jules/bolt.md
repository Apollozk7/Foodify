## 2024-05-24 - Avoid O(N) memory allocation in React Renders
**Learning:** React components that render frequently should avoid creating new arrays for calculations (like `[...array].reverse()`). Instead, leveraging native browser capabilities like `Array.prototype.findLast()` provides a zero-allocation backward search that improves memory usage and CPU cycles during renders.
**Action:** Use `findLast` or `findLastIndex` over manual `reverse().find()` in array traversals.
