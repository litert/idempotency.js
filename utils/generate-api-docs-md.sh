#!/usr/bin/env bash
SCRIPT_ROOT=$(cd $(dirname $0); pwd)

cd $SCRIPT_ROOT/..

API_DOC_OUTPUT_DIR=docs/en-US/api
SRC_DIR=src/lib

rm -rf $API_DOC_OUTPUT_DIR

npx typedoc \
    --exclude "**/*+(index|.test).ts" \
    --out api \
    --readme none \
    --name "Documents for @litert/idempotency" \
    --plugin typedoc-plugin-markdown \
    --plugin typedoc-vitepress-theme \
    --sourceLinkTemplate "https://github.com/litert/idempotency.js/blob/master/{path}#L{line}" \
    $SRC_DIR/Errors.ts \
    $SRC_DIR/Types.ts \
    $SRC_DIR/Manager.ts \
    $SRC_DIR/Executor.ts \
    $SRC_DIR/Serializers/DefaultFailureSerializer.ts \
    $SRC_DIR/Serializers/DefaultSuccessSerializer.ts \
    $SRC_DIR/Serializers/JsonSerializer.ts \
    $SRC_DIR/MemoryStorageAdapter.ts

mv api $API_DOC_OUTPUT_DIR
