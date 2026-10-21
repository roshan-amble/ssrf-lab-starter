import { createGuardedDispatcher, guardedFetch, GuardedFetchError } from 'guarded-fetch'

// This is a working sample. To test an application, import its actual fetcher
// and use its normal policy and configuration here.
const dispatcher = createGuardedDispatcher()
export const name = 'starter: guarded-fetch 0.1.5'

export function fetchUrl(url, { signal, timeoutMs }) {
  return guardedFetch(url, { signal, timeoutMs, dispatcher, opaqueErrors: true })
}

// Map only an explicit address-policy refusal from the fetcher under test.
// Network errors, timeouts, DNS errors and HTTP status codes are not evidence
// that an SSRF policy refused the request.
export function classifyRefusal(error) {
  if (!(error instanceof GuardedFetchError)) return undefined
  if (['hostname_unsafe', 'host_not_allowed', 'redirect_to_unsafe_host'].includes(error.code)) {
    return 'forbidden-address'
  }
  return undefined
}

// Release the sample's connection pool after the checks finish.
// Adapt or remove this when using a different application's fetcher.
export async function close() {
  await dispatcher.destroy()
}
