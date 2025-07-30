[Documents for @litert/idempotency](../../../index.md) / [Serializers/JsonSerializer](../index.md) / JsonSerializer

# Class: JsonSerializer

Defined in: [src/lib/Serializers/JsonSerializer.ts:23](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/JsonSerializer.ts#L23)

The serializer for successful results, using `JSON.stringify` and `JSON.parse`.

## Implements

- [`ISerializer`](../../../Types/interfaces/ISerializer.md)\<`any`\>

## Constructors

### Constructor

> **new JsonSerializer**(): `JsonSerializer`

#### Returns

`JsonSerializer`

## Methods

### deserialize()

> **deserialize**(`data`): `any`

Defined in: [src/lib/Serializers/JsonSerializer.ts:36](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/JsonSerializer.ts#L36)

Deserialize data back to the original type.

#### Parameters

##### data

The serialized data to deserialize.

`string` | `Buffer`\<`ArrayBufferLike`\>

#### Returns

`any`

#### Implementation of

[`ISerializer`](../../../Types/interfaces/ISerializer.md).[`deserialize`](../../../Types/interfaces/ISerializer.md#deserialize)

***

### serialize()

> **serialize**(`data`): `string`

Defined in: [src/lib/Serializers/JsonSerializer.ts:25](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/JsonSerializer.ts#L25)

Serialize data to a string or Buffer.

#### Parameters

##### data

`unknown`

The data to serialize.

#### Returns

`string`

#### Implementation of

[`ISerializer`](../../../Types/interfaces/ISerializer.md).[`serialize`](../../../Types/interfaces/ISerializer.md#serialize)
