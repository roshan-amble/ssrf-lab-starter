# Initial starter verification

These are recorded runs of this starter's workflow. They verify the included
sample and a deliberately unsafe replacement, not other applications.

The workflow uses the GitHub Action at
`ac0d4906592a5c41c27785b7a4327d449bc10da9`.

| Fetcher | Starter commit | Actions run | Node 22.23.3 | Node 24.22.0 |
| --- | --- | --- | --- | --- |
| Included `guarded-fetch@0.1.5` sample | `6689a83d1786f6a6530a397daba6de0008b06720` | [39525119477](https://github.com/roshan-amble/ssrf-lab-starter/actions/runs/39525119477) | Exit 0; 9 refusals; 0 internal hits | Exit 0; 9 refusals; 0 internal hits |
| Native fetch, deliberately unsafe | `5b34f58a9546ba9d918a1be290a91e3cdfdecc2d` | [39525269768](https://github.com/roshan-amble/ssrf-lab-starter/actions/runs/39525269768) | Exit 1; 8 reached; 8 internal hits | Exit 1; 8 reached; 8 internal hits |

The second run is **expected to fail**. Installation succeeded, the fetcher
check failed, and the workflow still uploaded its reports. Native fetch failed
one address form independently of an SSRF policy; universal unsafe reach is
not required or claimed.

Every run also returned HTTP 200 from the allowed entry with a counted entry
request, and its separate native-fetch controls reached the internal fixture
both directly and through a redirect (two counted hits).

Raw reports, retained byte-for-byte from the workflow artifacts:

- [Protected, Node 22](protected-node22.json)
- [Protected, Node 24](protected-node24.json)
- [Unsafe, Node 22](unsafe-node22.json)
- [Unsafe, Node 24](unsafe-node24.json)

The matching `*-stderr.txt` files are also retained. All four contain a runner
shell startup message about `PS1` being unset. The checks completed and emitted
the reports and exit codes above. The artifact ZIP hashes were checked against
GitHub's SHA-256 digests before extracting these files; IDs and digests are in
[provenance.json](provenance.json).

The unsafe code lives on the `verification/unsafe-fetcher` branch; the default
branch retains the protected sample. Coverage is seven direct-address cases
and two HTTP redirects. DNS rebinding, TLS and full application coverage are
outside this check.
