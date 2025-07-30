[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IExecutionBeforeWaitCallback

# Interface: IExecutionBeforeWaitCallback()\<TArgs, TResult, TError\>

Defined in: [src/lib/Types.ts:266](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L266)

The hook callback for executors, which will be executed before waiting for
the operation to complete, when an idempotency record is pending.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TResult

`TResult`

### TError

`TError`

> **IExecutionBeforeWaitCallback**(`record`, ...`args`): `void`

Defined in: [src/lib/Types.ts:273](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L273)

## Parameters

### record

[`IRecord`](IRecord.md)\<`TResult`, `TError`\>

The idempotency record, or `null` if no such a record of the key exists.

### args

...`TArgs`

The arguments to pass to the execution.

## Returns

`void`
