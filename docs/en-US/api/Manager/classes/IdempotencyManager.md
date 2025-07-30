[Documents for @litert/idempotency](../../index.md) / [Manager](../index.md) / IdempotencyManager

# Class: IdempotencyManager\<TData, TError\>

Defined in: [src/lib/Manager.ts:30](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L30)

The manager of idempotency records, responsible for creating, retrieving, and updating records.

## Type Parameters

### TData

`TData`

### TError

`TError` = `Error`

## Implements

- [`IManager`](../../Types/interfaces/IManager.md)\<`TData`, `TError`\>

## Constructors

### Constructor

> **new IdempotencyManager**\<`TData`, `TError`\>(`options`): `IdempotencyManager`\<`TData`, `TError`\>

Defined in: [src/lib/Manager.ts:40](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L40)

#### Parameters

##### options

[`IManagerOptions`](../../Types/interfaces/IManagerOptions.md)\<`TData`, `TError`\>

#### Returns

`IdempotencyManager`\<`TData`, `TError`\>

## Methods

### fail()

> **fail**(`key`, `error`): `Promise`\<`void`\>

Defined in: [src/lib/Manager.ts:119](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L119)

When an operation fails, this method should be called to mark the operation as failed,
and save the error into the idempotency record.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

##### error

`TError`

The error that caused the operation to fail.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IManager`](../../Types/interfaces/IManager.md).[`fail`](../../Types/interfaces/IManager.md#fail)

***

### get()

> **get**(`key`): `Promise`\<`null` \| [`IRecord`](../../Types/interfaces/IRecord.md)\<`TData`, `TError`\>\>

Defined in: [src/lib/Manager.ts:48](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L48)

Retrieve an idempotency record by its key.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

#### Returns

`Promise`\<`null` \| [`IRecord`](../../Types/interfaces/IRecord.md)\<`TData`, `TError`\>\>

A promise that resolves to the idempotency record, or null if it does not exist.

#### Implementation of

[`IManager`](../../Types/interfaces/IManager.md).[`get`](../../Types/interfaces/IManager.md#get)

***

### initiate()

> **initiate**(`key`, `context`): `Promise`\<`boolean`\>

Defined in: [src/lib/Manager.ts:85](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L85)

Initiate a new idempotency record.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

##### context

[`IRecordContext`](../../Types/type-aliases/IRecordContext.md) = `{}`

Optional context for the record, which can be used to store
               additional information about the operation.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the record was created, false if it already exists.

#### Implementation of

[`IManager`](../../Types/interfaces/IManager.md).[`initiate`](../../Types/interfaces/IManager.md#initiate)

***

### success()

> **success**(`key`, `result`): `Promise`\<`void`\>

Defined in: [src/lib/Manager.ts:101](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L101)

When an operation is successful, this method should be called to mark the operation as successful,
and save the result of the operation into the idempotency record.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

##### result

`TData`

The result of the successful operation.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IManager`](../../Types/interfaces/IManager.md).[`success`](../../Types/interfaces/IManager.md#success)

***

### wait()

> **wait**(`key`): `Promise`\<`TData`\>

Defined in: [src/lib/Manager.ts:137](https://github.com/litert/idempotency.js/blob/master/src/lib/Manager.ts#L137)

Wait for an idempotency record to complete.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

#### Returns

`Promise`\<`TData`\>

A promise that resolves to the completed result of the operation.

#### Throws

If the operation does not complete within the specified timeout.

#### Throws

If there is a failure in the storage operation.

#### Implementation of

[`IManager`](../../Types/interfaces/IManager.md).[`wait`](../../Types/interfaces/IManager.md#wait)
