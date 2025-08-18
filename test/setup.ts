import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import "whatwg-fetch";

(globalThis as any).expect = expect;
await import("@testing-library/jest-dom");

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
