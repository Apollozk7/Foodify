## 2026-04-03 - Prevent Array Cloning on Frequent Re-renders
**Learning:** In controlled inputs like chat interfaces, recalculating derived state with `[...arr].reverse().find()` causes unnecessary array clones on every keystroke, hurting performance. TypeScript's `findLast` is available due to `esnext` lib configuration.
**Action:** Use `findLast()` or `findLastIndex()` wrapped in `useMemo` to find the last element matching a condition efficiently without array cloning and unnecessary re-computations.
