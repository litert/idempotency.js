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

/**
 * The default serializer for all failure results, based on class `Error`.
 *
 * For all other errors not inheriting from `Error`, it will serialize them as
 * an `UnknownError` with a generic message.
 */
export class DefaultFailureSerializer implements dL.ISerializer<Error> {

    public serialize(e: Error): string {

        if (e instanceof Error) {

            return JSON.stringify({
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }

        return JSON.stringify({
            name: 'UnknownError',
            message: 'An unknown error occurred',
            stack: 'No stack available',
        });
    }

    public deserialize(data: string | Buffer): Error {

        const ret = JSON.parse(data.toString());

        const e = new Error(ret.message);
        e.name = ret.name;
        e.stack = ret.stack;

        return e;
    }
}
