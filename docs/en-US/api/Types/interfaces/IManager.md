[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IManager

# Interface: IManager\<TData, TError\>

Defined in: [src/lib/Types.ts:199](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L199)

The manager interface for idempotency records.

## Type Parameters

### TData

`TData`

### TError

`TError` = `Error`

## Methods

### fail()

> **fail**(`key`, `error`): `Promise`\<`void`\>

Defined in: [src/lib/Types.ts:237](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L237)

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

***

### get()

> **get**(`key`): `Promise`\<`null` \| [`IRecord`](IRecord.md)\<`TData`, `TError`\>\>

Defined in: [src/lib/Types.ts:208](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L208)

Retrieve an idempotency record by its key.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

#### Returns

`Promise`\<`null` \| [`IRecord`](IRecord.md)\<`TData`, `TError`\>\>

A promise that resolves to the idempotency record, or null if it does not exist.

***

### initiate()

> **initiate**(`key`, `context?`): `Promise`\<`boolean`\>

Defined in: [src/lib/Types.ts:219](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L219)

Initiate a new idempotency record.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

##### context?

[`IRecordContext`](../type-aliases/IRecordContext.md)

Optional context for the record, which can be used to store
               additional information about the operation.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the record was created, false if it already exists.

***

### success()

> **success**(`key`, `result`): `Promise`\<`void`\>

Defined in: [src/lib/Types.ts:228](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L228)

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

***

### wait()

> **wait**(`key`): `Promise`\<`TData`\>

Defined in: [src/lib/Types.ts:249](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L249)

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
