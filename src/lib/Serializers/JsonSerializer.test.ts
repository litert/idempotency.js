import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { JsonSerializer } from './JsonSerializer';

NodeTest.describe('JsonSerializer', () => {

    const obj = new JsonSerializer();

    NodeTest.it('should serialize "boolean" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(true), 'true');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(true)), true);

        NodeAssert.strictEqual(obj.serialize(false), 'false');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(false)), false);
    });

    NodeTest.it('should serialize "number" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(42), '42');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(42)), 42);

        NodeAssert.strictEqual(obj.serialize(-3.14), '-3.14');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(-3.14)), -3.14);

        NodeAssert.strictEqual(obj.serialize(0), '0');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(0)), 0);
    });

    NodeTest.it('should serialize "string" correctly', () => {

        NodeAssert.strictEqual(obj.serialize('Hello, World!'), '"Hello, World!"');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize('Hello, World!')), 'Hello, World!');

        NodeAssert.strictEqual(obj.serialize(''), '""');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize('')), '');
    });

    NodeTest.it('should serialize "object" correctly', () => {

        const objData = { key: 'value', nested: { a: 1, b: 2 } };
        const serialized = obj.serialize(objData);
        const deserialized = obj.deserialize(serialized);

        NodeAssert.strictEqual(serialized, JSON.stringify(objData));
        NodeAssert.deepStrictEqual(deserialized, objData);

        for (const v of [null, {}, []]) {
            const serialized = obj.serialize(v);
            const deserialized = obj.deserialize(serialized);

            NodeAssert.strictEqual(serialized, JSON.stringify(v));
            NodeAssert.deepStrictEqual(deserialized, v);
        }
    });

    NodeTest.it('should serialize "null" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(null), 'null');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(null)), null);
    });

    NodeTest.it('should throw on serializing values of unsupported types', () => {

        for (const badValue of [
            BigInt(123),
        ]) {
            NodeAssert.throws(() => {
                obj.serialize(badValue);
            }, {
                name: 'serialization_failed',
            });
        }
    });

    NodeTest.it('should throw on deserializing invalid data', () => {

        for (const invalidData of [
            '"1', '1"', '1a', '',
            '{', '}', '[', ']',
            '{"a":1,}', '[1,]'
        ]) {
            NodeAssert.throws(() => {
                obj.deserialize(invalidData);
            }, {
                name: 'serialization_failed',
            }, `Deserializing data "${invalidData}" should throw an error`);
        }
    });

});
