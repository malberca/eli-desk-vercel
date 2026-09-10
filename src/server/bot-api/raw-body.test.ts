import { MAX_BOT_API_BODY_BYTES, RawBodyError, readBoundedRawBody } from "./raw-body";
import assert from "node:assert/strict";
import { test } from "node:test";

function requestFromStream(stream: ReadableStream<Uint8Array>, headers: Record<string, string> = {}) {
  return new Request("https://eli.test/api/integrations/n8n/v1/tickets.create", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: stream,
    duplex: "half",
  } as RequestInit & { duplex: "half" });
}

test("preserves exact streamed bytes and reads the body once", async () => {
  const expected = new TextEncoder().encode('{"description":"á\\n"}');
  let pulls = 0;
  const request = requestFromStream(
    new ReadableStream({
      start(controller) {
        controller.enqueue(expected.slice(0, 4));
        controller.enqueue(expected.slice(4));
        controller.close();
      },
      pull() {
        pulls += 1;
      },
    }),
  );
  const actual = await readBoundedRawBody(request);
  assert.deepEqual(actual, expected);
  assert.ok(pulls >= 0);
});

test("rejects a declared body over the limit before opening the stream", async () => {
  let opened = false;
  const request = {
    method: "POST",
    headers: new Headers({ "content-type": "application/json", "content-length": String(MAX_BOT_API_BODY_BYTES + 1) }),
    body: {
      getReader() {
        opened = true;
        throw new Error("must not open");
      },
    },
  } as unknown as Request;
  await assert.rejects(readBoundedRawBody(request), (error: unknown) => {
    assert.ok(error instanceof RawBodyError);
    assert.equal(error.code, "payload_too_large");
    return true;
  });
  assert.equal(opened, false);
});

test("rejects a streamed body that crosses the limit", async () => {
  const request = requestFromStream(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(MAX_BOT_API_BODY_BYTES));
        controller.enqueue(new Uint8Array(1));
      },
    }),
  );
  await assert.rejects(readBoundedRawBody(request), (error: unknown) => {
    assert.ok(error instanceof RawBodyError);
    assert.equal(error.code, "payload_too_large");
    return true;
  });
});

test("rejects unsupported method and content type before reading", async () => {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.error(new Error("must not read"));
    },
  });
  await assert.rejects(
    readBoundedRawBody({ method: "GET", headers: new Headers(), body: stream } as unknown as Request),
    (error: unknown) => error instanceof RawBodyError && error.code === "unsupported_method",
  );
  await assert.rejects(
    readBoundedRawBody(requestFromStream(new ReadableStream(), { "content-type": "text/plain" })),
    (error: unknown) => error instanceof RawBodyError && error.code === "unsupported_content_type",
  );
});

test("fails closed when the stream exceeds the read timeout", async () => {
  const request = requestFromStream(
    new ReadableStream({
      pull() {
        return new Promise<void>(() => undefined);
      },
    }),
  );
  await assert.rejects(readBoundedRawBody(request, { timeoutMs: 10 }), (error: unknown) => {
    assert.ok(error instanceof RawBodyError);
    assert.equal(error.code, "request_timeout");
    return true;
  });
});

test("returns at timeout when reader cancellation never settles", async () => {
  const request = {
    method: "POST",
    headers: new Headers({ "content-type": "application/json" }),
    body: {
      getReader() {
        return {
          read: () => new Promise<never>(() => undefined),
          cancel: () => new Promise<never>(() => undefined),
        };
      },
    },
  } as unknown as Request;
  const started = Date.now();
  await assert.rejects(readBoundedRawBody(request, { timeoutMs: 10 }), (error: unknown) => {
    assert.ok(error instanceof RawBodyError);
    assert.equal(error.code, "request_timeout");
    return true;
  });
  assert.ok(Date.now() - started < 500);
});
