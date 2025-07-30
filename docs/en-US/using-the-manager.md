# Using the manager

The executor simplified the usage of the idempotency manager by providing a
simple interface for idempotency control. It seals the complete flow of
idempotency control.
However, if you wanna implement your own idempotency control logic, you can use the
`IdempotencyManager` class directly.

This guide provides a simple example of how to use the `IdempotencyManager` class.

Let's start from creating an instance of the `IdempotencyManager` class.

```ts
import * as LibIdempotency from "@litert/idempotency";

const storage = new LibIdempotency.IdempotencyMemoryStorageAdapter(3600_000);

const manager = new LibIdempotency.IdempotencyManager({
    storageAdapter: storage,
    // successSerializer: new LibIdempotency.DefaultSuccessSerializer(),
    // failureSerializer: new LibIdempotency.DefaultFailureSerializer(),
});
```

And then you can use the `manager` to manage the idempotent records of the operations.

The first of the control flow is to check if the operation has been executed before.
You can use the `get` method to check if the operation has been executed before.

```ts
// try to get the idempotency record by the key, if the record exists,
// it means the operation has been started or completed before.
const record = await manager.get(key);

if (record) {

    // It's recommended to check if the arguments of the operation are the same as the previous execution.
    // You could save the arguments to the context of the idempotency record when initiating the operation,
    // and then compare the arguments here.

    switch (record.status) {
        case LibIdempotency.EStatus.SUCCESS:
            // The operation has been executed successfully, return the result.
            return record.result;

        case LibIdempotency.EStatus.FAILED:
            // The operation has been executed with failure, throw the error.
            throw record.result;

        case LibIdempotency.EStatus.PENDING:
            // The operation is still pending, you can wait for it to complete.
            // Or you can throw an error to indicate that the operation is still pending.
            throw new Error("The operation is still pending.");
    }
}
```

If the operation is not executed yet, you can try to execute it.
To make the execution idempotent, you need to initiate the operation first,
by calling the manager's `initiate` method to create a new idempotency record.

Note that the `initiate` method will return `true` if the operation is initiated successfully,
or `false` if the operation is already initiated by another request,
which means you should not execute the operation again.
In this case, you can wait for the operation to complete (or simply throw an error).

```ts
if (!await manager.initiate(key)) {

    while (true) {

        const record = await manager.get(key);

        if (record) {

            switch (record.status) {
                case LibIdempotency.EStatus.SUCCESS:
                    return record.result;

                case LibIdempotency.EStatus.FAILED:
                    throw record.result;

                case LibIdempotency.EStatus.PENDING:
                    // Wait for a while before checking again.
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    continue;
            }
        }

        // If no record found, break the loop.
        // This means something went wrong, you can throw an error.
        throw new Error("The operation timed out");
    }
}
```

Now, it's time to execute the operation, because current fiber is the one who initiated the idempotency record, and deserves to execute the operation.

Just execute the operation as you normally do, and then save the result to the idempotency record using the `success` or `fail` method.

```ts
try {

    // do the operation here
    const result = await doOperation();

    // save the success result to the idempotency record.
    await manager.success(key, result);

    return result;
}
catch (error) {

    // If the operation failed, you can call the `failure` method to mark the operation as failed.
    await manager.fail(key, error);
    throw error;
}
```

Now, the operation is idempotent.

Click here to see the full example code: [custom-control-flow.ts](../../src/examples/custom-control-flow.ts).
