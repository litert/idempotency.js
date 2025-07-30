[Documents for @litert/idempotency](../../../index.md) / [Serializers/DefaultFailureSerializer](../index.md) / DefaultFailureSerializer

# Class: DefaultFailureSerializer

Defined in: [src/lib/Serializers/DefaultFailureSerializer.ts:25](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultFailureSerializer.ts#L25)

The default serializer for all failure results, based on class `Error`.

For all other errors not inheriting from `Error`, it will serialize them as
an `UnknownError` with a generic message.

## Implements

- [`ISerializer`](../../../Types/interfaces/ISerializer.md)\<`Error`\>

## Constructors

### Constructor

> **new DefaultFailureSerializer**(): `DefaultFailureSerializer`

#### Returns

`DefaultFailureSerializer`

## Methods

### deserialize()

> **deserialize**(`data`): `Error`

Defined in: [src/lib/Serializers/DefaultFailureSerializer.ts:45](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultFailureSerializer.ts#L45)

Deserialize data back to the original type.

#### Parameters

##### data

The serialized data to deserialize.

`string` | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`Error`

#### Implementation of

[`ISerializer`](../../../Types/interfaces/ISerializer.md).[`deserialize`](../../../Types/interfaces/ISerializer.md#deserialize)

***

### serialize()

> **serialize**(`e`): `string`

Defined in: [src/lib/Serializers/DefaultFailureSerializer.ts:27](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultFailureSerializer.ts#L27)

Serialize data to a string or Buffer.

#### Parameters

##### e

`Error`

#### Returns

`string`

#### Implementation of

[`ISerializer`](../../../Types/interfaces/ISerializer.md).[`serialize`](../../../Types/interfaces/ISerializer.md#serialize)
