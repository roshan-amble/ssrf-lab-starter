// Deliberately unsafe verification branch. This workflow is expected to fail.
export const name = 'native fetch: expected regression failure'
export const fetchUrl = (url, { signal }) => fetch(url, { signal })
