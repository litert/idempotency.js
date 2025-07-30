[Documents for @litert/idempotency](../../index.md) / [MemoryStorageAdapter](../index.md) / IdempotencyMemoryStorageAdapter

# Class: IdempotencyMemoryStorageAdapter

Defined in: [src/lib/MemoryStorageAdapter.ts:39](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L39)

A simple in-memory storage adapter for idempotent records.

This adapter stores records in memory and supports the TTL (Time To Live)
feature, but it does not persist data across application restarts.

It is only for testing and development purposes.
For production use, consider using a persistent storage solution, like
Redis or a database (MongoDB, MySQL, PgSQL, or others).

However, if you insist on using this in production, please ensure that
you have sufficient memory and that the application is designed to handle
potential data loss on restarts. Besides, you must create a timer to
periodically call the `gc` method to clean up expired records.

## Implements

- [`IStorageAdapter`](../../Types/interfaces/IStorageAdapter.md)

## Constructors

### Constructor

> **new IdempotencyMemoryStorageAdapter**(`ttlMs`): `IdempotencyMemoryStorageAdapter`

Defined in: [src/lib/MemoryStorageAdapter.ts:45](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L45)

#### Parameters

##### ttlMs

`number`

#### Returns

`IdempotencyMemoryStorageAdapter`

## Methods

### create()

> **create**(`data`): `Promise`\<`boolean`\>

Defined in: [src/lib/MemoryStorageAdapter.ts:50](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L50)

Create a new idempotency record in the storage.

This method must be atomic, and it should not allow overwriting an
existing record.

#### Parameters

##### data

[`IStoredRecord`](../../Types/type-aliases/IStoredRecord.md)

The idempotency record to create.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to true if the record was created
         successfully, false if it already exists.

#### Implementation of

[`IStorageAdapter`](../../Types/interfaces/IStorageAdapter.md).[`create`](../../Types/interfaces/IStorageAdapter.md#create)

***

### gc()

> **gc**(): `void`

Defined in: [src/lib/MemoryStorageAdapter.ts:104](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L104)

Clean up expired records.

#### Returns

`void`

***

### get()

> **get**(`key`): `Promise`\<`null` \| [`IStoredRecord`](../../Types/type-aliases/IStoredRecord.md)\>

Defined in: [src/lib/MemoryStorageAdapter.ts:65](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L65)

Retrieve an idempotency record by its key from the storage.

#### Parameters

##### key

`string`

The unique key for this operation, used to ensure idempotency.

#### Returns

`Promise`\<`null` \| [`IStoredRecord`](../../Types/type-aliases/IStoredRecord.md)\>

#### Implementation of

[`IStorageAdapter`](../../Types/interfaces/IStorageAdapter.md).[`get`](../../Types/interfaces/IStorageAdapter.md#get)

***

### update()

> **update**(`data`): `Promise`\<`void`\>

Defined in: [src/lib/MemoryStorageAdapter.ts:88](https://github.com/litert/idempotency.js/blob/master/src/lib/MemoryStorageAdapter.ts#L88)

Update the idempotency record in the storage, from PENDING to SUCCESS or
FAILED.

#### Parameters

##### data

`Omit`\<[`IStoredRecord`](../../Types/type-aliases/IStoredRecord.md), `"context"`\>

The idempotency record to update.

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`IStorageAdapter`](../../Types/interfaces/IStorageAdapter.md).[`update`](../../Types/interfaces/IStorageAdapter.md#update)
