import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import "@testing-library/jest-dom/vitest";
import "whatwg-fetch";

export const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
