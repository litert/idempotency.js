import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { IdempotencyMemoryStorageAdapter } from './MemoryStorageAdapter';
import { EStatus } from './Types';

NodeTest.describe('MemoryStorageAdapter', async () => {

    await NodeTest.it('Method "get" should only return the value if it exists', async () => {

        const store = new IdempotencyMemoryStorageAdapter(60000);

        NodeAssert.strictEqual(await store.get('hello-world'), null);

        await store.create({ key: 'hello-world', status: EStatus.PENDING, context: { a: 123 } });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
            context: { a: 123 },
        });
    });

    await NodeTest.it('Method "get" should return null if a record exists but expired', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: { a: 123 } }),
            true,
        );

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
            context: { a: 123 },
        });

        ctx.mock.timers.tick(1000);

        NodeAssert.strictEqual(await store.get('hello-world'), null);
    });

    await NodeTest.it('Method "create" should return true if a new record created', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );
    });

    await NodeTest.it('Method "create" should return false if a record already exists', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );
        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            false
        );
    });

    await NodeTest.it('Method "create" should return true if a record exists but expired', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );

        ctx.mock.timers.tick(1000);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );
    });

    await NodeTest.it('Method "update" should update the record', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );

        await store.update({ key: 'hello-world', status: EStatus.SUCCESS, result: 'Hello, World!' });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.SUCCESS,
            result: 'Hello, World!',
            context: {},
        });

        await store.update({ key: 'hello-world', status: EStatus.FAILED, result: 'Error occurred' });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.FAILED,
            result: 'Error occurred',
            context: {},
        });
    });

    await NodeTest.it('Method "gc" should remove expired records', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(
            await store.create({ key: 'hello-world', status: EStatus.PENDING, context: {} }),
            true
        );

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
            context: {},
        });

        ctx.mock.timers.tick(1000);

        store.gc();

        NodeAssert.strictEqual(await store.get('hello-world'), null);
    });
});
