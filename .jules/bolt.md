## 2024-05-18 - [O(N) Array Reversals in Renders]
**Learning:** `[...array].reverse().find()` unnecessarily duplicates the entire array on every single render, allocating `O(N)` memory and executing `O(N)` operations just to reverse it before iterating.
**Action:** Replace it with `Array.prototype.findLast()` to achieve the exact same result with `O(1)` memory allocation and no initial array traversal.
