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

async function main() {

    const storage = new LibIdempotency.IdempotencyMemoryStorageAdapter(3600_000);

    const manager = new LibIdempotency.IdempotencyManager<{ v: number; }>({
        storageAdapter: storage,
        // successSerializer: new LibIdempotency.DefaultSuccessSerializer(),
        // failureSerializer: new LibIdempotency.DefaultFailureSerializer(),
    });

    let execs = 0;

    const executor = new LibIdempotency.IdempotencyExecutor<[{ val: number; }], { v: number; }>({
        manager,
        operation: async (data) => {

            // do something with the data
            console.log('Processing data:', data);
            execs++;
            return { v: data.val * 10 };
        }
    });

    console.log(await executor.execute('key1', { val: 1 }));
    console.log(await executor.execute('key1', { val: 2 }));
    console.log(await executor.execute('key2', { val: 3 }));

    console.log(`The operation has been executed ${execs} times.`);
}

main().catch(console.error);
