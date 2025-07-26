import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { DefaultSuccessSerializer } from './DefaultSuccessSerializer';

NodeTest.describe('DefaultSuccessSerializer', () => {

    const obj = new DefaultSuccessSerializer();

    NodeTest.it('should serialize "undefined" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(undefined), 'undefined:');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(undefined)), undefined);
    });

    NodeTest.it('should serialize "bigint" correctly', () => {

        const bigIntValue = BigInt('12345678901234567890231592134912319283219381');
        const serialized = obj.serialize(bigIntValue);
        const deserialized = obj.deserialize(serialized);

        NodeAssert.strictEqual(serialized, `bigint:${bigIntValue.toString()}`);
        NodeAssert.strictEqual(deserialized, bigIntValue);
    });

    NodeTest.it('should serialize "boolean" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(true), 'boolean:true');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(true)), true);

        NodeAssert.strictEqual(obj.serialize(false), 'boolean:false');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(false)), false);
    });

    NodeTest.it('should serialize "number" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(42), 'number:42');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(42)), 42);

        NodeAssert.strictEqual(obj.serialize(-3.14), 'number:-3.14');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(-3.14)), -3.14);

        NodeAssert.strictEqual(obj.serialize(0), 'number:0');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(0)), 0);

        NodeAssert.strictEqual(obj.serialize(1), 'number:1');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(1)), 1);

        NodeAssert.strictEqual(obj.serialize(Infinity), 'number:Infinity');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(Infinity)), Infinity);

        NodeAssert.strictEqual(obj.serialize(-Infinity), 'number:-Infinity');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(-Infinity)), -Infinity);

        NodeAssert.strictEqual(obj.serialize(NaN), 'number:NaN');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(NaN)), NaN);
    });

    NodeTest.it('should serialize "string" correctly', () => {

        NodeAssert.strictEqual(obj.serialize('Hello, World!'), 'string:Hello, World!');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize('Hello, World!')), 'Hello, World!');

        NodeAssert.strictEqual(obj.serialize(''), 'string:');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize('')), '');
    });

    NodeTest.it('should serialize "Date" correctly', () => {

        const date = new Date(12345678);
        const serialized = obj.serialize(date);
        const deserialized = obj.deserialize(serialized);

        NodeAssert.strictEqual(serialized, `date:12345678`);
        NodeAssert.strictEqual(deserialized.getTime(), date.getTime());
    });

    NodeTest.it('should serialize "Buffer" correctly', () => {

        const buffer = Buffer.from('Hello, Buffer!');
        const serialized = obj.serialize(buffer);
        const deserialized = obj.deserialize(serialized);

        NodeAssert.strictEqual(serialized, `buf:${buffer.toString('base64')}`);
        NodeAssert.deepStrictEqual(deserialized, buffer);
    });

    NodeTest.it('should serialize "object" correctly', () => {

        const objData = { key: 'value', nested: { a: 1, b: 2 } };
        const serialized = obj.serialize(objData);
        const deserialized = obj.deserialize(serialized);

        NodeAssert.strictEqual(serialized, `json:${JSON.stringify(objData)}`);
        NodeAssert.deepStrictEqual(deserialized, objData);

        for (const v of [null, {}, []]) {
            const serialized = obj.serialize(v);
            const deserialized = obj.deserialize(serialized);

            NodeAssert.strictEqual(serialized, `json:${JSON.stringify(v)}`);
            NodeAssert.deepStrictEqual(deserialized, v);
        }
    });

    NodeTest.it('should serialize "null" correctly', () => {

        NodeAssert.strictEqual(obj.serialize(null), 'json:null');
        NodeAssert.strictEqual(obj.deserialize(obj.serialize(null)), null);
    });

    NodeTest.it('should throw on serializing values of unsupported types', () => {

        for (const badValue of [
            Symbol('test'), () => {},
        ]) {
            NodeAssert.throws(() => {
                obj.serialize(badValue);
            }, {
                name: 'serialization_failed',
                context: {
                    type: typeof badValue,
                }
            });
        }
    });

    NodeTest.it('should deserialize Buffer as string', () => {

        const buffer = Buffer.from('number:12345');

        NodeAssert.strictEqual(obj.deserialize(buffer), 12345);
    });

    NodeTest.it('should throw on deserializing invalid data', () => {

        for (const invalidData of [
            'invalid data',
            'undefined',
            'bigint:',
            'boolean:',
            'number:',
            'date:',
            'json:',
            'json:{',
            'json:.',
            'unknown-type:123'
        ]) {
            NodeAssert.throws(() => {
                obj.deserialize(invalidData);
            }, {
                name: 'serialization_failed',
            }, `Deserializing data "${invalidData}" should throw an error`);
        }
    });

});
