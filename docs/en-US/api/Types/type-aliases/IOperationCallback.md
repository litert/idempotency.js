[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IOperationCallback

# Type Alias: IOperationCallback()\<TArgs, TResult\>

> **IOperationCallback**\<`TArgs`, `TResult`\> = (...`args`) => `Promise`\<`TResult`\> \| `TResult`

Defined in: [src/lib/Types.ts:255](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L255)

The signature of the operation callback needs to be wrapped by the executor.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TResult

`TResult`

## Parameters

### args

...`TArgs`

## Returns

`Promise`\<`TResult`\> \| `TResult`
