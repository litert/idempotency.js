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

type IErrorContext = Record<string, any>;

/**
 * The error class for IdempotencyClient.
 */
export abstract class IdempotencyError extends Error {

    public constructor(
        /**
         * The name of the error.
         */
        name: string,
        /**
         * The message of the error.
         */
        message: string,
        /**
         * The context of the error, which can be used to store additional information.
         */
        public readonly context: IErrorContext,
        /**
         * The metadata of the error.
         */
        public readonly origin: unknown
    ) {

        super(message);
        this.name = name;
    }
}

export const E_STORAGE_FAILED = class extends IdempotencyError {

    public constructor(
        context: IErrorContext = {},
        origin: unknown = null,
    ) {
        super(
            'storage_failed',
            'Failed to perform storage operation.',
            context,
            origin,
        );
    }
};

export const E_OPERATION_PROCESSING = class extends IdempotencyError {

    public constructor(
        context: IErrorContext = {},
        origin: unknown = null,
    ) {
        super(
            'operation_processing',
            'The idempotent operation is currently being processed.',
            context,
            origin,
        );
    }
};

export const E_SERIALIZATION_FAILED = class extends IdempotencyError {

    public constructor(
        context: IErrorContext = {},
        origin: unknown = null,
    ) {
        super(
            'serialization_failed',
            'Can not perform (de)serialization on the data.',
            context,
            origin,
        );
    }
};
