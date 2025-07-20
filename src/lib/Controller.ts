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

import * as dL from './Types';

/**
 * The controller for each type of idempotent operation.
 * It wraps the operation and manages the idempotency records.
 */
export class IdempotencyController<
    TArgs extends unknown[],
    TResult,
    TError = Error
> implements dL.IController<TArgs, TResult> {

    private readonly _callback: dL.IOperationCallback<TArgs, TResult>;

    private readonly _manager: dL.IManager<TResult, TError>;

    public constructor(options: dL.IControllerOptions<TArgs, TResult, TError>) {
        this._manager = options.manager;
        this._callback = options.operation;
    }

    /**
     * Execute an operation with full idempotency protection.
     * Users only need to call this method - all complexity is handled internally.
     */
    public async execute(key: string, ...args: TArgs): Promise<TResult> {

        // Check if the operation is already in progress
        const existingRecord = await this._manager.get(key);

        if (existingRecord) {

            switch (existingRecord.status) {
                case dL.EStatus.SUCCESS:
                    return existingRecord.result as TResult;
                case dL.EStatus.FAILED:
                    throw existingRecord.result as TError;
                case dL.EStatus.PENDING:
                    // Wait for the operation to complete
                    return this._manager.wait(key);
            }
        }

        // Create a new idempotency record
        if (!await this._manager.initiate(key)) {

            // if the record already exists, wait for it to complete
            return this._manager.wait(key);
        }

        try {
            // Execute the operation
            const result = await this._callback(...args);
            // Mark the operation as successful
            await this._manager.success(key, result);
            return result;
        }
        catch (error) {
            // Mark the operation as failed
            await this._manager.fail(key, error as TError);
            throw error;
        }
    }
}
