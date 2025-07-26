import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import { IdempotencyMemoryStorageAdapter } from './MemoryStorageAdapter';
import { EStatus } from './Types';

NodeTest.describe('MemoryStorageAdapter', async () => {

    await NodeTest.it('Method "get" should only return the value if it exists', async () => {

        const store = new IdempotencyMemoryStorageAdapter(60000);

        NodeAssert.strictEqual(await store.get('hello-world'), null);

        await store.create({ key: 'hello-world', status: EStatus.PENDING });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
        });
    });

    await NodeTest.it('Method "get" should return null if a record exists but expired', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
        });

        ctx.mock.timers.tick(1000);

        NodeAssert.strictEqual(await store.get('hello-world'), null);
    });

    await NodeTest.it('Method "create" should return true if a new record created', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);
    });

    await NodeTest.it('Method "create" should return false if a record already exists', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);
        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), false);
    });

    await NodeTest.it('Method "create" should return true if a record exists but expired', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);

        ctx.mock.timers.tick(1000);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);
    });

    await NodeTest.it('Method "update" should update the record', async () => {

        const store = new IdempotencyMemoryStorageAdapter(1000);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);

        await store.update({ key: 'hello-world', status: EStatus.SUCCESS, result: 'Hello, World!' });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.SUCCESS,
            result: 'Hello, World!',
        });

        await store.update({ key: 'hello-world', status: EStatus.FAILED, result: 'Error occurred' });

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.FAILED,
            result: 'Error occurred',
        });
    });

    await NodeTest.it('Method "gc" should remove expired records', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const store = new IdempotencyMemoryStorageAdapter(100);

        NodeAssert.strictEqual(await store.create({ key: 'hello-world', status: EStatus.PENDING }), true);

        NodeAssert.deepStrictEqual(await store.get('hello-world'), {
            key: 'hello-world',
            status: EStatus.PENDING,
            result: undefined,
        });

        ctx.mock.timers.tick(1000);

        store.gc();

        NodeAssert.strictEqual(await store.get('hello-world'), null);
    });
});
