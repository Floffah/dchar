import { mock } from "bun:test";

export const mockLog = mock((...args: any[]) => args.join("\t"));
