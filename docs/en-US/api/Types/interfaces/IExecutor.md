[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IExecutor

# Interface: IExecutor\<TArgs, TResult\>

Defined in: [src/lib/Types.ts:339](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L339)

The executor providing idempotency protection for operations.

## Type Parameters

### TArgs

`TArgs` *extends* `unknown`[]

### TResult

`TResult`

## Methods

### execute()

> **execute**(`key`, ...`args`): `Promise`\<`TResult`\>

Defined in: [src/lib/Types.ts:347](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L347)

Execute an operation with idempotency protection.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

##### args

...`TArgs`

The arguments to pass to the operation.

#### Returns

`Promise`\<`TResult`\>
