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

import { DefaultFailureSerializer } from './Serializers/DefaultFailureSerializer';
import { DefaultSuccessSerializer } from './Serializers/DefaultSuccessSerializer';
import * as dL from './Types';
import * as eL from './Errors';

export const DEFAULT_WAIT_CALLBACK: dL.IWaitCallback<any, any> = (key) => {

    return Promise.reject(new eL.E_OPERATION_PROCESSING({ key }));
};

/**
 * The manager of idempotency records, responsible for creating, retrieving, and updating records.
 */
export class IdempotencyManager<TData, TError = Error> implements dL.IManager<TData, TError> {

    private readonly _waitCallback: dL.IWaitCallback<TData, TError>;

    private readonly _successSerializer: dL.ISerializer<TData>;

    private readonly _failureSerializer: dL.ISerializer<TError>;

    private readonly _storageAdapter: dL.IStorageAdapter;

    public constructor(options: dL.IManagerOptions<TData, TError>) {

        this._storageAdapter = options.storageAdapter;
        this._successSerializer = options.successSerializer ?? new DefaultSuccessSerializer();
        this._failureSerializer = options.failureSerializer ?? new DefaultFailureSerializer() as dL.ISerializer<TError>;
        this._waitCallback = options.waitCallback ?? DEFAULT_WAIT_CALLBACK;
    }

    public async get(key: string): Promise<dL.IRecord<TData, TError> | null> {

        try {

            const ret = await this._storageAdapter.get(key);

            switch (ret?.status) {
                case dL.EStatus.SUCCESS:
                    return {
                        key: ret.key,
                        status: dL.EStatus.SUCCESS,
                        result: this._successSerializer.deserialize(ret.result!)
                    } as dL.IRecord<TData, TError>;
                case dL.EStatus.FAILED:
                    return {
                        key: ret.key,
                        status: dL.EStatus.FAILED,
                        result: this._failureSerializer.deserialize(ret.result!)
                    } as dL.IRecord<TData, TError>;
                case dL.EStatus.PENDING:
                    return {
                        key: ret.key,
                        status: dL.EStatus.PENDING
                    } as dL.IRecord<TData, TError>;
                default:
                    return null;
            }
        }
        catch (error) {

            throw new eL.E_STORAGE_FAILED({ key }, error);
        }
    }

    public async initiate(key: string): Promise<boolean> {

        try {

            return await this._storageAdapter.create({
                key: key,
                status: dL.EStatus.PENDING,
            });
        }
        catch (error) {

            throw new eL.E_STORAGE_FAILED({ key }, error);
        }
    }

    public async success(key: string, result: TData): Promise<void> {

        try {

            const serializedResult = this._successSerializer.serialize(result);

            await this._storageAdapter.update({
                key,
                status: dL.EStatus.SUCCESS,
                result: serializedResult
            });
        }
        catch (e) {

            throw new eL.E_STORAGE_FAILED({ key }, e);
        }
    }

    public async fail(key: string, error: TError): Promise<void> {

        try {

            const serializedError = this._failureSerializer.serialize(error);

            await this._storageAdapter.update({
                key,
                status: dL.EStatus.FAILED,
                result: serializedError
            });
        }
        catch (e) {

            throw new eL.E_STORAGE_FAILED({ key }, e);
        }
    }

    public wait(key: string): Promise<TData> {

        return this._waitCallback(key, this);
    }
}
