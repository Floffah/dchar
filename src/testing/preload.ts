import { beforeAll } from "bun:test";

import { mockLog } from "@/testing/mocks";

beforeAll(() => {
    console.info = mockLog;
    console.debug = mockLog;
});
