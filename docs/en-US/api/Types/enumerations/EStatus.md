[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / EStatus

# Enumeration: EStatus

Defined in: [src/lib/Types.ts:63](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L63)

The status of an idempotency record.

## Enumeration Members

### FAILED

> **FAILED**: `2`

Defined in: [src/lib/Types.ts:78](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L78)

The operation failed, and the failure result is available.

***

### PENDING

> **PENDING**: `0`

Defined in: [src/lib/Types.ts:68](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L68)

The operation is still pending, and the result is not yet available.

***

### SUCCESS

> **SUCCESS**: `1`

Defined in: [src/lib/Types.ts:73](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L73)

The operation was successful, and the success result is available.
