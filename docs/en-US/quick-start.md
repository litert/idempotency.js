# Quick Start

This guide will help you quickly set up and start using the library.

## Concepts

The library provides a way to handle idempotency in your applications, ensuring
that operations can be safely retried without unintended side effects.
It is particularly useful in scenarios like API requests where you want to
avoid duplicate processing.

In this library, to achieve idempotency, you need to use these key components:

- Storage Adapter

    To achieve idempotency, the simplest way is to store the operation results
    in a storage system, associated with the keys passed by the client.
    That's why a storage adapter is required, you can implement your own
    storage adapter to store the results in any storage system you prefer,
    such as a database, cache, or even in-memory storage.

- Serializer

    To store the operation results into a persistent storage, the results must
    be serialized into a binary/string format. And of course, the serialized
    results must be deserialized back to the original format when retrieving
    them.

- Manager

    An idempotency manager is responsible for coordinating the storage adapter
    and serializer, providing a simple interface to manage the idempotent records
    of the operations.

- Executor

    An executor is a wrapper for a kind of operation that you want to make
    idempotent.

## Installation

To install the library, use npm:

```bash
npm install @litert/idempotency
```

## Use the executor

Here is a simple example to get you started, let's start from importing the library:

```ts
import * as LibIdempotency from '@litert/idempotency';
```

Next, you need to create a storage adapter.
In this library, a built-in in-memory storage adapter is provided.

```ts
// create a storage adapter with a 1 hour expiration time
const storage = new LibIdempotency.IdempotencyMemoryStorageAdapter(3600_000);
```

Then, you need to create an idempotency record manager,
which will use the storage adapter and the default serializers.

```ts
const manager = new LibIdempotency.IdempotencyManager({
    storageAdapter: storage,
    // successSerializer: new LibIdempotency.DefaultSuccessSerializer(),
    // failureSerializer: new LibIdempotency.DefaultFailureSerializer(),
});
```

Well, now the manager is ready to use, but to make it simple, we will try
using the executor firstly.

```ts
let execs = 0;
const executor = new LibIdempotency.IdempotencyExecutor<{ val: number; }>({
    manager,
    operation: async (data) => {

        // do something with the data
        console.log('Processing data:', data);
        execs++;
        return { success: true, result: data.val * 10 };
    }
});
```

Now we have an executor that can process data with idempotency.

```ts
console.log(await executor.execute('key1', { val: 123 }));
console.log(await executor.execute('key1', { val: 123 }));
console.log(await executor.execute('key1', { val: 123 }));

console.log(`The operation has been executed ${execs} times.`);
```

Let's run the code, you will see the output like this:

```
Processing data: { val: 123 }
{ v: 1230 }
{ v: 1230 }
{ v: 1230 }
The operation has been executed 1 times.
```

So, we can see that the operation is executed only once,
and the result is cached for subsequent calls with the same key and data.

Click here to see the full example code: [basic-control-flow.ts](../../src/examples/basic-control-flow.ts).
