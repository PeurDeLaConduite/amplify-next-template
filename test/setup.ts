import { expect, beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import "whatwg-fetch";
declare global {
    var expect: (typeof import("vitest"))["expect"];
}

globalThis.expect = expect;
import "@testing-library/jest-dom";

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
