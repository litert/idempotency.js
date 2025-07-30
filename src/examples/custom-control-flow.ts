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


const storage = new LibIdempotency.IdempotencyMemoryStorageAdapter(3600_000);

const manager = new LibIdempotency.IdempotencyManager({
    storageAdapter: storage,
    // successSerializer: new LibIdempotency.DefaultSuccessSerializer(),
    // failureSerializer: new LibIdempotency.DefaultFailureSerializer(),
});

async function request(key: string, v: number): Promise<number> {

    // try to get the idempotency record by the key, if the record exists,
    // it means the operation has been started or completed before.
    const record = await manager.get(key);

    if (record) {

        switch (record.status) {
            case LibIdempotency.EStatus.SUCCESS:
                // The operation has been executed successfully, return the result.
                return (record.result as any).v;

            case LibIdempotency.EStatus.FAILED:
                // The operation has been executed with failure, throw the error.
                throw record.result;

            case LibIdempotency.EStatus.PENDING:
                // The operation is still pending, you can wait for it to complete.
                // Or you can throw an error to indicate that the operation is still pending.
                throw new Error("The operation is still pending.");
        }
    }

    // If no record found, initiate a new one.
    await manager.initiate(key);

    // Execute the operation and save the result.
    const result = { v: v * 10 };

    await manager.success(key, result);

    return result.v;
}

async function main() {
    console.log(await request('key1', 1));
    console.log(await request('key1', 2));
    console.log(await request('key1', 3));
}

main().catch(console.error);
