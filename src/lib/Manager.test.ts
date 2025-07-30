import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as NodeTimers from 'node:timers/promises';
import { IdempotencyManager } from './Manager';
import * as eL from './Errors';
import { EStatus, ISerializer } from './Types';
import { IdempotencyMemoryStorageAdapter } from './MemoryStorageAdapter';
import { DefaultSuccessSerializer } from './Serializers/DefaultSuccessSerializer';
import { DefaultFailureSerializer } from './Serializers/DefaultFailureSerializer';

const failureSerializer: ISerializer<string> = {
    serialize: (data: string) => data,
    deserialize: (data: string) => data,
};

const successSerializer: ISerializer<number> = {
    serialize: (data: number) => data.toString(),
    deserialize: (data: string) => parseFloat(data),
};

NodeTest.describe('IdempotencyManager', async () => {

    await NodeTest.it('Method "initiate" should work correctly ', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(1000);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';
        const key2 = 'test-key-2';

        NodeAssert.strictEqual(await mgr.initiate(key), true);
        NodeAssert.strictEqual(await mgr.initiate(key), false);

        NodeAssert.strictEqual(await mgr.initiate(key2), true);
        NodeAssert.strictEqual(await mgr.initiate(key2), false);

        NodeAssert.deepStrictEqual(await mgr.get(key), {
            key: key,
            status: EStatus.PENDING,
            context: {},
        });

        NodeAssert.deepStrictEqual(await mgr.get(key2), {
            key: key2,
            status: EStatus.PENDING,
            context: {},
        });
    });

    await NodeTest.it('Method "get" should return null if no such key', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(1000);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';
        const key2 = 'test-key-2';

        NodeAssert.strictEqual(await mgr.get(key), null);
        NodeAssert.strictEqual(await mgr.get(key2), null);
    });

    await NodeTest.it('Method "fail" should work correctly ', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(1000);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';
        const key2 = 'test-key-2';

        NodeAssert.strictEqual(await mgr.initiate(key), true);
        NodeAssert.strictEqual(await mgr.initiate(key), false);

        NodeAssert.strictEqual(await mgr.initiate(key2), true);
        NodeAssert.strictEqual(await mgr.initiate(key2), false);

        await mgr.fail(key, '123');

        NodeAssert.deepStrictEqual(await mgr.get(key), {
            key: key,
            status: EStatus.FAILED,
            result: '123',
            context: {},
        });

        await mgr.fail(key2, '2');

        NodeAssert.deepStrictEqual(await mgr.get(key2), {
            key: key2,
            status: EStatus.FAILED,
            result: '2',
            context: {},
        });
    });

    await NodeTest.it('Method "success" should work correctly ', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(1000);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';
        const key2 = 'test-key-2';

        NodeAssert.strictEqual(await mgr.initiate(key), true);
        NodeAssert.strictEqual(await mgr.initiate(key), false);

        NodeAssert.strictEqual(await mgr.initiate(key2), true);
        NodeAssert.strictEqual(await mgr.initiate(key2), false);

        await mgr.success(key, 1234);

        NodeAssert.deepStrictEqual(await mgr.get(key), {
            key: key,
            status: EStatus.SUCCESS,
            result: 1234,
            context: {},
        });

        await mgr.success(key2, 2333);

        NodeAssert.deepStrictEqual(await mgr.get(key2), {
            key: key2,
            status: EStatus.SUCCESS,
            result: 2333,
            context: {},
        });
    });

    await NodeTest.it('E_OPERATION_PROCESSING should be thrown if wait for pending record by default', async (ctx) => {

        ctx.mock.timers.enable({ apis: ['Date', 'setTimeout'] });

        const storage = new IdempotencyMemoryStorageAdapter(100);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';

        await mgr.initiate(key);

        const waits = Promise.allSettled([
            mgr.wait(key),
            (async () => {
                await NodeTimers.setTimeout(10);
                mgr.success(key, 1234);
            })(),
        ]);

        ctx.mock.timers.tick(1000);

        const [result] = await waits;

        NodeAssert.ok(result.status === 'rejected');
        NodeAssert.ok(result.reason instanceof eL.E_OPERATION_PROCESSING);
    });

    await NodeTest.it('custom waitCallback should work', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(100);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
            waitCallback: async (key, mgr) => {
                while (true) {

                    const ret = await mgr.get(key);

                    await NodeTimers.setTimeout(10);

                    switch (ret?.status) {
                        case EStatus.SUCCESS:
                            return ret.result as number;
                        case EStatus.FAILED:
                            throw ret.result;
                        default:
                            continue;
                    }
                }
            }
        });

        const key = 'test-key';
        const key2 = 'test-key-2';

        await mgr.initiate(key);

        await Promise.allSettled([
            (async () => {

                NodeAssert.ok(await mgr.wait(key) === 1234);
            })(),
            (async () => {
                await NodeTimers.setTimeout(10);
                mgr.success(key, 1234);
            })(),
        ]);

        await Promise.allSettled([
            (async () => {

                try {
                    await mgr.wait(key2);
                }
                catch (error) {
                    NodeAssert.ok(error === '1234');
                }
            })(),
            (async () => {
                await NodeTimers.setTimeout(10);
                mgr.fail(key2, '1234');
            })(),
        ]);
    });

    await NodeTest.it('The default serializer should be used by default', async () => {

        const storage = new IdempotencyMemoryStorageAdapter(100);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
        });

        NodeAssert.ok((mgr as any)._successSerializer instanceof DefaultSuccessSerializer);
        NodeAssert.ok((mgr as any)._failureSerializer instanceof DefaultFailureSerializer);
    });

    await NodeTest.it('E_STORAGE_FAILED should be thrown if failed to read/write storage', async () => {

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: {
                'create': () => Promise.reject(new Error('Storage error')),
                'get': () => Promise.reject(new Error('Storage error')),
                'update': () => Promise.reject(new Error('Storage error')),
            },
            successSerializer: successSerializer,
            failureSerializer: failureSerializer,
        });

        const key = 'test-key';

        let cases: number = 0;
        let errors: number = 0;

        try {

            cases++;
            await mgr.initiate(key);
        }
        catch (error) {

            errors++;
            NodeAssert.ok(error instanceof eL.E_STORAGE_FAILED);
        }

        try {

            cases++;
            await mgr.get(key);
        }
        catch (error) {

            errors++;
            NodeAssert.ok(error instanceof eL.E_STORAGE_FAILED);
        }

        try {

            cases++;
            await mgr.success(key, 1234);
        }
        catch (error) {

            errors++;
            NodeAssert.ok(error instanceof eL.E_STORAGE_FAILED);
        }

        try {

            cases++;
            await mgr.fail(key, '123');
        }
        catch (error) {

            errors++;
            NodeAssert.ok(error instanceof eL.E_STORAGE_FAILED);
        }

        NodeAssert.strictEqual(cases > 0, true);
        NodeAssert.strictEqual(cases, errors);
    });
});
