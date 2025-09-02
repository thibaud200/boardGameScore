// Types pour vitest-fetch-mock
import 'vitest-fetch-mock'

declare global {
  // Override the global fetch type to include mock methods
  var fetch: {
    (input: RequestInfo | URL, init?: RequestInit): Promise<Response>
    (input: string | Request | URL, init?: RequestInit): Promise<Response>
    mockResponse: (body: string, init?: ResponseInit) => typeof fetch
    mockResponseOnce: (body: string, init?: ResponseInit) => typeof fetch
    mockReject: (error: Error) => typeof fetch
    mockRejectOnce: (error: Error) => typeof fetch
    resetMocks: () => typeof fetch
  } & {
    toHaveBeenCalledTimes: (times: number) => void
  }
}
