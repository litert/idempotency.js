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
 * The serializer for successful results, using `JSON.stringify` and `JSON.parse`.
 */
export class JsonSerializer implements dL.ISerializer<any> {

    public serialize(data: unknown): string {

        try {
            return JSON.stringify(data);
        }
        catch (e) {

            throw new eL.E_SERIALIZATION_FAILED({ type: typeof data }, e);
        }
    }

    public deserialize(data: string | Buffer): any {

        try {
            return JSON.parse(data as string); // Convert Buffer to string explicitly is unnecessary here
        }
        catch (e) {

            throw new eL.E_SERIALIZATION_FAILED({}, e);
        }
    }
}
