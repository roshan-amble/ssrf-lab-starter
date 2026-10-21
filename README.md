# ssrf-lab starter

**Try an SSRF regression check in your own GitHub repository.**

This small starter runs a working Node.js fetcher against local fixtures with
[ssrf-lab](https://github.com/roshan-amble/ssrf-lab). The destination counts
requests independently, so a client error cannot hide a request that arrived.

## Try the sample

1. Click **[Use this template](https://github.com/roshan-amble/ssrf-lab-starter/generate)**
   and create a repository in your account. The files are copied; you do not
   need the harness repository or any credentials, API keys or secrets.
2. Open **Actions → SSRF check** in **your copy**. If a run has not started,
   click **Run workflow → Run workflow** on the default branch. GitHub may ask
   you to enable Actions first.
3. Open the run and a **Node 22** or **Node 24** job. Expand **Test your fetcher**
   or read the run summary. Download the matching `ssrf-report-node…` artifact
   for the JSON report and error log.

The sample uses `guarded-fetch@0.1.5`. Expected on each runtime:

| Check | Expected result |
| --- | --- |
| Seven direct-address cases and two redirects | 9 explicit refusals, 0 internal requests |
| Allowed entry request | Succeeds and returns the fixture's real response |
| Deliberately unsafe native-fetch controls | 2 measured internal requests, as expected |

The unsafe controls belong to the test harness and establish that the fixture
can detect requests. Their hits are reported separately from the sample's hits.
A successful sample run demonstrates the setup with this pinned package.

[See the recorded passing run and deliberately failing regression](verification/README.md),
including the raw JSON reports from both Node versions.

## Test your application

Edit **[fetcher.mjs](fetcher.mjs)** to import and call your application's real
fetch function with its usual configuration. It must return a real
fetch-compatible `Response` and honor the supplied abort signal or a finite
timeout. Keep your application's address and redirect policy intact.

The starter exports four things:

| Export | What to adapt |
| --- | --- |
| `fetchUrl(url, { signal, timeoutMs })` | Call the same fetcher your application uses. Required. |
| `classifyRefusal(error)` | Return `forbidden-address` only for the application's explicit address-policy error. Optional; unknown errors do not pass the check. |
| `close()` | Release any connection pools or other resources. Optional. |
| `name` | A label for the report. Optional. |

Remove the sample's imports, dispatcher and cleanup when they do not apply.
Install your application's dependencies and commit its lockfile. If the code
needs a build or install scripts, adjust the **Install your fetcher** step and
add the normal application build before **Test your fetcher**.

Push your change and open its Actions run. This starts testing your code only
after `fetcher.mjs` actually calls your application. The
[full module guide](https://github.com/roshan-amble/ssrf-lab/blob/ac0d4906592a5c41c27785b7a4327d449bc10da9/examples/custom-fetcher/README.md)
covers other return types and setup requirements.

To put the check in an existing repository, copy `fetcher.mjs` and
[the workflow](.github/workflows/ssrf-check.yml), install/build the application's
dependencies, and update the module path if you move the file.

## Read a failed run

| Exit code | Meaning | Next step |
| --- | --- | --- |
| `0` | All nine selected cases produced explicit refusals without an internal hit | Review the scope below. |
| `1` | At least one request reached the internal service | Inspect the per-case `internalHits` in `report.json`. |
| `2` | Setup, control or coverage failure | Inspect `errors.txt` and `report.json`; a network failure alone does not establish a block. |

Installation or build failures happen before the check and may have no report.
The workflow preserves reports from checks that fail.

## Scope

The check runs on disposable GitHub-hosted Ubuntu runners in a Linux network
namespace with only loopback enabled. It tests seven direct-address cases and
two HTTP redirects, with an allowed-request control and independent destination
counters. It requires Node.js 22.19+; the workflow checks Node 22 and 24.

It does not assess DNS rebinding, TLS, arbitrary private-network destinations,
cross-origin credential handling or body/timeout policy. Fetchers that require
HTTPS, external initialization or a hostname allowlist may not fit these
fixtures. Keep those policies intact. A passing run is bounded regression
evidence, not a security certification.

## Tell us how setup went

[Leave setup feedback](https://github.com/roshan-amble/ssrf-lab-starter/issues/new?template=setup-feedback.yml):
did you run the sample, connect your own fetcher, or get stuck? A run link and
the step that was confusing are useful. Feedback is optional; the starter
does not send usage telemetry.

The harness, comparisons and development live in
**[ssrf-lab](https://github.com/roshan-amble/ssrf-lab)**.
Star that repository to follow the project. This starter is MIT-licensed.
