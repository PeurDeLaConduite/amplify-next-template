import { Amplify } from "aws-amplify";
import { beforeAll, afterEach, afterAll } from "vitest";
import { setupServer } from "msw/node";
import outputs from "@/amplify_outputs.json";
import "@testing-library/jest-dom/vitest";
import "whatwg-fetch";

export const server = setupServer();

beforeAll(() => {
    Amplify.configure(outputs);
    server.listen();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
