[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IExecutorOptions

# Interface: IExecutorOptions\<TArgs, TResult, TError\>

Defined in: [src/lib/Types.ts:295](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L295)

The options for the executors with idempotency protection.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TResult

`TResult`

### TError

`TError` = `Error`

## Properties

### beforeWaiting?

> `optional` **beforeWaiting**: [`IExecutionBeforeWaitCallback`](IExecutionBeforeWaitCallback.md)\<`TArgs`, `TResult`, `TError`\>

Defined in: [src/lib/Types.ts:333](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L333)

An optional function to be called before waiting for an idempotency record to complete.

This is especially useful when the operation is already in progress, and you want to perform
some actions (e.g. check if the args are the same as the previous call) before waiting.

#### Default

```ts
() => {} // do nothing by default
```

***

### createContext?

> `optional` **createContext**: [`ICreateContext`](ICreateContext.md)\<`TArgs`\>

Defined in: [src/lib/Types.ts:323](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L323)

An optional function to create a context for the idempotency record.

#### Default

```ts
() => ({})
```

***

### isFailureStorable?

> `optional` **isFailureStorable**: [`ICheckFailureStorable`](../type-aliases/ICheckFailureStorable.md)\<`TError`\>

Defined in: [src/lib/Types.ts:316](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L316)

An optional function to determine if a failure result should be stored.

#### Param

The result of the operation, which can be either a successful result or an error.

#### Returns

`true` if the failure result should be stored, `false` otherwise.

#### Default

```ts
() => true // Store all failure results by default
```

***

### manager

> **manager**: [`IManager`](IManager.md)\<`TResult`, `TError`\>

Defined in: [src/lib/Types.ts:300](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L300)

The storage adapter for managing idempotency records

***

### operation

> **operation**: [`IOperationCallback`](../type-aliases/IOperationCallback.md)\<`TArgs`, `TResult`\>

Defined in: [src/lib/Types.ts:305](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L305)

The actual operation to be executed with idempotency protection
