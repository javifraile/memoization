# Memoization

A general introduction into memoization: https://en.wikipedia.org/wiki/Memoization

A memoization implementation in Javascript. It stores into an object as a cache the result of a function in order to avoid the recalculation just reading into the cache.

The key of each result will be the first argument of the function or if provided, the result of the resolver using the same args.

If provided a natural number as a timeout, it will erase it after time exceeds so it will be calculated again.