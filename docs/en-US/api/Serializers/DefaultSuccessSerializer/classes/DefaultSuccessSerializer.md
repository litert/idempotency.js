[Documents for @litert/idempotency](../../../index.md) / [Serializers/DefaultSuccessSerializer](../index.md) / DefaultSuccessSerializer

# Class: DefaultSuccessSerializer

Defined in: [src/lib/Serializers/DefaultSuccessSerializer.ts:25](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultSuccessSerializer.ts#L25)

The default serializer for successful results, works with mainly primitive types.

It uses `JSON.stringify` and `JSON.parse` for objects, arrays, and other complex types.

## Implements

- [`ISerializer`](../../../Types/interfaces/ISerializer.md)\<`any`\>

## Constructors

### Constructor

> **new DefaultSuccessSerializer**(): `DefaultSuccessSerializer`

#### Returns

`DefaultSuccessSerializer`

## Methods

### deserialize()

> **deserialize**(`data`): `any`

Defined in: [src/lib/Serializers/DefaultSuccessSerializer.ts:50](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultSuccessSerializer.ts#L50)

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

Defined in: [src/lib/Serializers/DefaultSuccessSerializer.ts:27](https://github.com/litert/idempotency.js/blob/master/src/lib/Serializers/DefaultSuccessSerializer.ts#L27)

Serialize data to a string or Buffer.

#### Parameters

##### data

`unknown`

The data to serialize.

#### Returns

`string`

#### Implementation of

[`ISerializer`](../../../Types/interfaces/ISerializer.md).[`serialize`](../../../Types/interfaces/ISerializer.md#serialize)
