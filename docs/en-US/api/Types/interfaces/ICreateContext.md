[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / ICreateContext

# Interface: ICreateContext()\<TArgs\>

Defined in: [src/lib/Types.ts:282](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L282)

The function to create a context for the idempotency record.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

> **ICreateContext**(...`args`): [`IRecordContext`](../type-aliases/IRecordContext.md)

Defined in: [src/lib/Types.ts:289](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L289)

## Parameters

### args

...`TArgs`

The arguments to pass to the execution.

## Returns

[`IRecordContext`](../type-aliases/IRecordContext.md)
