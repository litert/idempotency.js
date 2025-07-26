import * as NodeTest from 'node:test';
import * as NodeAssert from 'node:assert';
import * as NodeTimers from 'node:timers/promises';
import { IdempotencyManager } from './Manager';
import { IdempotencyExecutor } from './Executor';
import { IdempotencyMemoryStorageAdapter } from './MemoryStorageAdapter';
import { EStatus } from './Types';

NodeTest.describe('IdempotencyExecutor', async () => {

    await NodeTest.it('Success result should be cached until expired', async (ctx) => {

        const storage = new IdempotencyMemoryStorageAdapter(20);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
            waitCallback: async (key, mgr) => {
                while (true) {

                    const ret = await mgr.get(key);

                    await NodeTimers.setTimeout(1);

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

        const fn = IdempotencyExecutor.wrap({
            manager: mgr,
            operation: async (data: number) => {
                await NodeTimers.setTimeout(10);
                return data * 2;
            },
        });

        await (async () => {

            NodeAssert.equal(await fn('key-1', 21), 42);
            NodeAssert.equal(await fn('key-1', 122), 42);

            NodeAssert.deepStrictEqual(
                await Promise.all([
                    fn('key-2', 234),
                    fn('key-2', 123),
                    (async () => {
                        await NodeTimers.setTimeout(1);
                        return fn('key-2', 123)
                    })(),
                ]),
                [468, 468, 468]
            )
        })();

        await NodeTimers.setTimeout(50);

        NodeAssert.equal(await fn('key-1', 7), 14);

        await (async () => {

            NodeAssert.equal(await fn('key-2', 234), 468);
            NodeAssert.equal(await fn('key-3', 233), 466);
        })();
    });

    await NodeTest.it('Failure result should be cached until expired', async (ctx) => {

        const storage = new IdempotencyMemoryStorageAdapter(10);

        const mgr = new IdempotencyManager<number, string>({
            storageAdapter: storage,
        });

        const fn = IdempotencyExecutor.wrap({
            manager: mgr,
            operation: async (data: number) => {
                throw new Error(`Failed with data: ${data}`);
            },
        });

        await (async () => {

            let cases = 0;
            let errors = 0;

            try {
                cases++;
                await fn('key-1', 21);
            }
            catch (error) {
                errors++;
                NodeAssert.ok(error instanceof Error);
                NodeAssert.strictEqual(error.message, 'Failed with data: 21');
            }

            try {
                cases++;
                await fn('key-1', 123);
            }
            catch (error) {
                errors++;
                NodeAssert.ok(error instanceof Error);
                NodeAssert.strictEqual(error.message, 'Failed with data: 21');
            }

            NodeAssert.strictEqual(cases, 2);
            NodeAssert.strictEqual(errors, 2);

            await NodeTimers.setTimeout(20);

            try {
                cases++;
                await fn('key-1', 7);
            }
            catch (error) {
                errors++;
                NodeAssert.ok(error instanceof Error);
                NodeAssert.strictEqual(error.message, 'Failed with data: 7');
            }

            NodeAssert.strictEqual(cases, 3);
            NodeAssert.strictEqual(errors, 3);

        })();
    });
});
