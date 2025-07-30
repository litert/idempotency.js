[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IManagerOptions

# Interface: IManagerOptions\<TData, TError\>

Defined in: [src/lib/Types.ts:166](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L166)

The options for the idempotency manager.

## Type Parameters

### TData

`TData`

### TError

`TError` = `Error`

## Properties

### failureSerializer?

> `optional` **failureSerializer**: [`ISerializer`](ISerializer.md)\<`TError`\>

Defined in: [src/lib/Types.ts:185](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L185)

Serializer for failure results.

#### Default

```ts
DefaultFailureSerializer
```

***

### storageAdapter

> **storageAdapter**: [`IStorageAdapter`](IStorageAdapter.md)

Defined in: [src/lib/Types.ts:171](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L171)

The adapter used for storage operations

***

### successSerializer?

> `optional` **successSerializer**: [`ISerializer`](ISerializer.md)\<`TData`\>

Defined in: [src/lib/Types.ts:178](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L178)

Serializer for successful results.

#### Default

```ts
DefaultSuccessSerializer
```

***

### waitCallback?

> `optional` **waitCallback**: [`IWaitCallback`](IWaitCallback.md)\<`TData`, `TError`\>

Defined in: [src/lib/Types.ts:193](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L193)

The callback to wait for the completion of an operation, if an idempotency record is pending.

You can implement this to handle cases where you want to create a custom waiting mechanism.
Or just throw an error if you do not want to wait, enforcing the requester to retry.
