[Documents for @litert/idempotency](../../index.md) / [Types](../index.md) / IRecordContext

# Type Alias: IRecordContext

> **IRecordContext** = `Record`\<`string`, `unknown`\>

Defined in: [src/lib/Types.ts:88](https://github.com/litert/idempotency.js/blob/master/src/lib/Types.ts#L88)

The context of an idempotency record, which can be used to store additional
information about the operation.

This is a flexible object that can contain any additional data related to the
operation, such as timestamps, user IDs, or any other relevant information.
