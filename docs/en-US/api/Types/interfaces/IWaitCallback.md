[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IWaitCallback

# Interface: IWaitCallback()\<TData, TError\>

Defined in: [src/lib/Types.ts:146](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L146)

The signature of the callbacks used to wait for the completion of an operation.

## Type Parameters

### TData

`TData`

### TError

`TError`

> **IWaitCallback**(`key`, `manager`): `Promise`\<`TData`\>

Defined in: [src/lib/Types.ts:157](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L157)

The signature of the callbacks used to wait for the completion of an operation.

## Parameters

### key

`string`

The unique key for this operation, used to ensure idempotency.

### manager

[`IManager`](IManager.md)\<`TData`, `TError`\>

The manager object used to manage idempotency records.

## Returns

`Promise`\<`TData`\>

A promise that resolves to the completed idempotency record.
