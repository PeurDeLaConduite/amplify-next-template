import "whatwg-fetch";
import { expect, afterAll, afterEach, beforeAll } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { setupServer } from "msw/node";

expect.extend(matchers);

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
