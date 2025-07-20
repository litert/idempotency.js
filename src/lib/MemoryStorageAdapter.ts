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

import type * as dL from './Types';

interface IRecordInfo extends dL.IStoredRecord {

    validUntil: number;
}

/**
 * A simple in-memory storage adapter for idempotent records.
 *
 * This adapter stores records in memory and supports the TTL (Time To Live)
 * feature, but it does not persist data across application restarts.
 * It is suitable for testing and development purposes.
 * For production use, consider using a persistent storage solution, like
 * Redis or a database (MongoDB, MySQL, PgSQL, or others).
 */
export class IdempotencyMemoryStorageAdapter implements dL.IStorageAdapter {

    private readonly _records: Record<string, IRecordInfo> = {};

    private readonly _ttlMs: number;

    public constructor(ttlMs: number = 60000) {

        this._ttlMs = ttlMs;
    }

    public create(data: dL.IStoredRecord): Promise<boolean> {

        if (this._records[data.key]) {
            return Promise.resolve(false); // Record already exists
        }

        this._records[data.key] = {
            ...data,
            validUntil: Date.now() + this._ttlMs,
        };
        return Promise.resolve(true);
    }

    public get(key: string): Promise<dL.IStoredRecord | null> {

        const record = this._records[key];

        if (!record) {

            return Promise.resolve(null);
        }

        if (record.validUntil < Date.now()) {

            delete this._records[key];
            return Promise.resolve(null);
        }

        return Promise.resolve({
            'key': record.key,
            'status': record.status,
            'result': record.result,
        });
    }

    public update(data: dL.IStoredRecord): Promise<void> {

        const record = this._records[data.key];

        if (!record) {

            return Promise.resolve();
        }

        if (record.validUntil < Date.now()) {

            delete this._records[data.key];
            return Promise.resolve();
        }

        // Update the record with new data
        this._records[data.key] = {
            ...record,
            'status': data.status,
            'result': data.result,
        };

        return Promise.resolve();
    }

    /**
     * Clean up expired records.
     */
    public gc(): void {

        const now = Date.now();

        for (const key in this._records) {

            if (this._records[key].validUntil < now) {

                delete this._records[key];
            }
        }
    }
}
