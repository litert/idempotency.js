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

import type * as dL from '../Types';
import * as eL from '../Errors';

/**
 * The default serializer for successful results, works with mainly primitive types.
 *
 * It uses `JSON.stringify` and `JSON.parse` for objects, arrays, and other complex types.
 */
export class DefaultSuccessSerializer implements dL.ISerializer<any> {

    public serialize(data: unknown): string {
        switch (typeof data) {
            case 'undefined':
                return 'undefined:';
            case 'bigint':
                return `bigint:${data}`;
            case 'boolean':
            case 'number':
            case 'string':
                return `${typeof data}:${data}`;
            case 'object':
                if (data instanceof Date) {
                    return `date:${data.getTime()}`;
                }
                if (data instanceof Buffer) {
                    return `buf:${data.toString('base64')}`;
                }
                return `json:${JSON.stringify(data)}`;
            default:
                throw new eL.E_SERIALIZATION_FAILED({ type: typeof data });
        }
    }

    public deserialize(data: string | Buffer): any {

        const d = data instanceof Buffer ? data.toString() : data as string;

        switch (d) {
            case 'json:null': return null;
            case 'json:{}': return {};
            case 'json:[]': return [];
            case 'string:': return '';
            case 'number:0': return 0;
            case 'number:1': return 1;
            case 'boolean:true': return true;
            case 'boolean:false': return false;
            case 'undefined:': return undefined;
        }

        const colonIndex = d.indexOf(':');

        if (colonIndex === -1) {

            throw new eL.E_SERIALIZATION_FAILED({ type: 'unknown' });
        }

        const dataType = d.slice(0, colonIndex);

        switch (dataType) {
            case 'bigint':
                if (colonIndex + 1 >= d.length) {
                    throw new eL.E_SERIALIZATION_FAILED({ type: 'bigint', reason: 'missing_value' });
                }
                return BigInt(d.slice(colonIndex + 1));
            case 'number':
                if (colonIndex + 1 >= d.length) {
                    throw new eL.E_SERIALIZATION_FAILED({ type: 'number', reason: 'missing_value' });
                }
                return Number(d.slice(colonIndex + 1));
            case 'string':
                return d.slice(colonIndex + 1);
            case 'date':
                if (colonIndex + 1 >= d.length) {
                    throw new eL.E_SERIALIZATION_FAILED({ type: 'date', reason: 'missing_value' });
                }
                return new Date(parseInt(d.slice(colonIndex + 1)));
            case 'buf':
                return Buffer.from(d.slice(colonIndex + 1), 'base64');
            case 'json':

                if (colonIndex + 1 >= d.length) {

                    throw new eL.E_SERIALIZATION_FAILED({ type: 'json', reason: 'missing_value' });
                }

                try {
                    return JSON.parse(d.slice(colonIndex + 1));
                }
                catch (error) {

                    throw new eL.E_SERIALIZATION_FAILED({ type: 'json', reason: 'invalid_json' }, error);
                }
            default:
                throw new eL.E_SERIALIZATION_FAILED({ type: dataType });
        }
    }
}
