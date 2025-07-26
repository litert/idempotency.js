/**
 * Copyright 2025 Angus.Fenying <fenying@litert.org>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as LibIdempotency from '../lib';
import * as NodeTimers from 'node:timers/promises';

async function createOrder(data: unknown) {

    await NodeTimers.setTimeout(1000); // Simulate a delay
    console.log('Order created:', data);
    return { orderId: '12345', status: 'created', r: Math.random().toString() };
}

async function main() {

    const idemMgr = new LibIdempotency.IdempotencyManager({
        storageAdapter: new LibIdempotency.IdempotencyMemoryStorageAdapter(2000),
        waitCallback: async (key, mgr) => {

            while (true) {

                const ret = await mgr.get(key);

                await NodeTimers.setTimeout(50);

                switch (ret?.status) {
                    case LibIdempotency.EStatus.SUCCESS:
                        return ret.result;
                    case LibIdempotency.EStatus.FAILED:
                        throw ret.result;
                    default:
                }
            }
        }
    });

    const fnCreateOrder = new LibIdempotency.IdempotencyExecutor({
        manager: idemMgr,
        operation: createOrder,
    });

    const results = await Promise.all([
        fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 }),
        fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 }),
        fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 }),
    ]);
    // const result = await fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 });

    console.log('Operation result:', results);
    console.log('Operation result:', await fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 }));

    await NodeTimers.setTimeout(1000); // Wait for a while to see the results    

    console.log('Final operation result:', await fnCreateOrder.execute('order-123', { item: 'book', quantity: 1 }));
}

main().catch(console.error);
