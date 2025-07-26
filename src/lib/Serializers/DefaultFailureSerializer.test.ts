import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { DefaultFailureSerializer } from './DefaultFailureSerializer';

NodeTest.describe('DefaultFailureSerializer', () => {

    const obj = new DefaultFailureSerializer();

    NodeTest.it('should serialize Error instances correctly', () => {

        const e1 = new Error('Test error');
        const s1 = obj.serialize(e1);
        const d1 = obj.deserialize(s1);

        NodeAssert.strictEqual(d1.name, 'Error');
        NodeAssert.strictEqual(d1.message, 'Test error');

        NodeAssert.deepStrictEqual(JSON.parse(s1), {
            name: 'Error',
            message: 'Test error',
            stack: d1.stack, // Stack trace will vary, so we check it separately
        });

        NodeAssert.ok(d1.stack);

        const e2 = new TypeError('this is a type error');
        const s2 = obj.serialize(e2);
        const d2 = obj.deserialize(s2);

        NodeAssert.strictEqual(d2.name, 'TypeError');
        NodeAssert.strictEqual(d2.message, 'this is a type error');

        NodeAssert.deepStrictEqual(JSON.parse(s2), {
            name: 'TypeError',
            message: 'this is a type error',
            stack: d2.stack, // Stack trace will vary, so we check it separately
        });

        NodeAssert.ok(d2.stack);
    });

    NodeTest.it('should serialize non-Error instances as UnknownError', () => {

        for (const badError of [
            0, 1, -1, 1.1,
            undefined, null, {}, [], '', 'string',
            BigInt(0), Symbol('123'), new Date(), new Map(), new Set(),
        ]) {

            const s3 = obj.serialize(badError as any);
            const d3 = obj.deserialize(s3);

            NodeAssert.strictEqual(d3.name, 'UnknownError');
            NodeAssert.strictEqual(d3.message, 'An unknown error occurred');
            NodeAssert.strictEqual(d3.stack, 'No stack available');

            NodeAssert.deepStrictEqual(JSON.parse(s3), {
                name: 'UnknownError',
                message: 'An unknown error occurred',
                stack: 'No stack available',
            });
        }
    });
});
