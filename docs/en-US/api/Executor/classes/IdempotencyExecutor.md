[Documents for @litert/idempotency](../../index.md) / [Executor](../index.md) / IdempotencyExecutor

# Class: IdempotencyExecutor\<TArgs, TResult, TError\>

Defined in: [src/lib/Executor.ts:27](https://github.com/litert/idempotency.js/blob/master/src/lib/Executor.ts#L27)

The executor for a kind of idempotent operation.
It wraps the operation and manages the idempotency records.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TResult

`TResult`

### TError

`TError` = `Error`

## Implements

- [`IExecutor`](../../Types/interfaces/IExecutor.md)\<`TArgs`, `TResult`\>

## Constructors

### Constructor

> **new IdempotencyExecutor**\<`TArgs`, `TResult`, `TError`\>(`options`): `IdempotencyExecutor`\<`TArgs`, `TResult`, `TError`\>

Defined in: [src/lib/Executor.ts:43](https://github.com/litert/idempotency.js/blob/master/src/lib/Executor.ts#L43)

#### Parameters

##### options

[`IExecutorOptions`](../../Types/interfaces/IExecutorOptions.md)\<`TArgs`, `TResult`, `TError`\>

#### Returns

`IdempotencyExecutor`\<`TArgs`, `TResult`, `TError`\>

## Methods

### execute()

> **execute**(`key`, ...`args`): `Promise`\<`TResult`\>

Defined in: [src/lib/Executor.ts:55](https://github.com/litert/idempotency.js/blob/master/src/lib/Executor.ts#L55)

Execute an operation with full idempotency protection.
Users only need to call this method - all complexity is handled internally.

#### Parameters

##### key

`string`

##### args

...`TArgs`

#### Returns

`Promise`\<`TResult`\>

#### Implementation of

[`IExecutor`](../../Types/interfaces/IExecutor.md).[`execute`](../../Types/interfaces/IExecutor.md#execute)

***

### wrap()

> `static` **wrap**\<`TArgs`, `TResult`, `TError`\>(`options`): (`key`, ...`args`) => `Promise`\<`TResult`\>

Defined in: [src/lib/Executor.ts:107](https://github.com/litert/idempotency.js/blob/master/src/lib/Executor.ts#L107)

#### Type Parameters

##### TArgs

`TArgs` *extends* `unknown`[]

##### TResult

`TResult`

##### TError

`TError` = `Error`

#### Parameters

##### options

[`IExecutorOptions`](../../Types/interfaces/IExecutorOptions.md)\<`TArgs`, `TResult`, `TError`\>

#### Returns

> (`key`, ...`args`): `Promise`\<`TResult`\>

##### Parameters

###### key

`string`

###### args

...`TArgs`

##### Returns

`Promise`\<`TResult`\>
