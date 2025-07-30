[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / ISerializer

# Interface: ISerializer\<T\>

Defined in: [src/lib/Types.ts:126](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L126)

The serializer interface for idempotency results, whatever it is a success or failure.

## Type Parameters

### T

`T`

## Methods

### deserialize()

> **deserialize**(`data`): `T`

Defined in: [src/lib/Types.ts:140](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L140)

Deserialize data back to the original type.

#### Parameters

##### data

The serialized data to deserialize.

`string` | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`T`

***

### serialize()

> **serialize**(`data`): `string` \| `Buffer`\<`ArrayBufferLike`\>

Defined in: [src/lib/Types.ts:133](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L133)

Serialize data to a string or Buffer.

#### Parameters

##### data

`T`

The data to serialize.

#### Returns

`string` \| `Buffer`\<`ArrayBufferLike`\>
