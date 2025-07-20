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

import * as NodeTimers from 'node:timers/promises';
import * as dL from './Types';
import * as eL from './Errors';

/**
 * The options for the default wait callback.
 */
export interface IDefaultWaitCallbackOptions {

    /**
     * The total timeout for waiting for an idempotency record to complete.
     */
    timeoutMs: number;

    /**
     * The interval in milliseconds to retry checking the status of the idempotency record.
     */
    retryIntervalMs: number;
}

/**
 * Create a default wait callback for idempotent operations.
 *
 * @param options   The options for the wait callback, including timeout and retry interval.
 *
 * @returns  A function that can be used to wait for the completion of an idempotent operation.
 */
export function createDefaultWaitCallback<TData, TError = Error>(
    options: IDefaultWaitCallbackOptions
): dL.IWaitCallback<TData, TError> {

    return async (read, key): Promise<TData> => {

        const sig = AbortSignal.timeout(options.timeoutMs);

        while (!sig.aborted) {

            let record: dL.IRecord<TData, TError> | null = null;

            try {

                record = await read();

            }
            catch (error) {

                throw new eL.E_STORAGE_FAILED({ key }, error);
            }

            if (!record) {

                throw new eL.E_OPERATION_EXPIRED({ key });
            }

            switch (record.status) {
                case dL.EStatus.SUCCESS:
                    return record.result as TData;

                case dL.EStatus.FAILED:
                    throw record.result as TError;

                case dL.EStatus.PENDING:

                    try {

                        await NodeTimers.setTimeout(options.retryIntervalMs, { signal: sig });
                    }
                    catch {

                        throw new eL.E_WAIT_TIMEOUT({ key }, sig.reason);
                    }
            }
        }

        throw new eL.E_WAIT_TIMEOUT({ key }, sig.reason);
    };
}
