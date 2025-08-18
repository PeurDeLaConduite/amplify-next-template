import { afterAll, afterEach, beforeAll, expect } from "vitest";
import "whatwg-fetch";
import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
