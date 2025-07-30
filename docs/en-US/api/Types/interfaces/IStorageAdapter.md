[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IStorageAdapter

# Interface: IStorageAdapter

Defined in: [src/lib/Types.ts:29](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L29)

The adapter interface for storage operations.

Remember that this interface does not requires the deletion of records, as
the logics of cleaning up old records is up to the implementation of the
storage adapter.

## Methods

### create()

> **create**(`data`): `Promise`\<`boolean`\>

Defined in: [src/lib/Types.ts:42](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L42)

Create a new idempotency record in the storage.

This method must be atomic, and it should not allow overwriting an
existing record.

#### Parameters

##### data

[`IStoredRecord`](../type-aliases/IStoredRecord.md)

The idempotency record to create.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the record was created
         successfully, false if it already exists.

***

### get()

> **get**(`key`): `Promise`\<`null` \| [`IStoredRecord`](../type-aliases/IStoredRecord.md)\>

Defined in: [src/lib/Types.ts:49](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L49)

Retrieve an idempotency record by its key from the storage.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

#### Returns

`Promise`\<`null` \| [`IStoredRecord`](../type-aliases/IStoredRecord.md)\>

***

### update()

> **update**(`data`): `Promise`\<`void`\>

Defined in: [src/lib/Types.ts:57](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L57)

Update the idempotency record in the storage, from PENDING to SUCCESS or
FAILED.

#### Parameters

##### data

`Omit`\<[`IStoredRecord`](../type-aliases/IStoredRecord.md), `"context"`\>

The idempotency record to update.

#### Returns

`Promise`\<`void`\>
