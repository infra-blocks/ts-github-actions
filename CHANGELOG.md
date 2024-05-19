# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.5] - 2024-05-19

### Changed

- Migrated to the [infra-blocks](https://github.com/infra-blocks) organization.

## [0.3.4] - 2024-04-21

### Added

- This changelog!

## [0.3.3] - 2024-04-13

### Added

- `package.json` search keywords.

## [0.3.2] - 2024-04-08

### Added

- `package.json` repository URL.

## [0.3.1] - 2024-04-07

### Changed

- Split the `README.md` file into `README.md` and `CONTIBUTING.md`.

## [0.3.0] - 2024-02-24

### Added

- CJS compatible build output with package exports.

## [0.2.1] - 2024-01-21

### Fixed

- Context printing on debug now works properly.

## [0.2.0] - 2024-01-11

### Added

- `getInput` now returned `undefined` on empty strings. This is to workaround the fact that
GitHub Actions runtime sets empty strings as the default value for inputs, which doesn't play well with validation.

## [0.1.0] - 2024-01-11

### Added

- First iteration of the library. Exported utility functions include:
    - `getInput`, `getInputs`
    - `parseOutpus`
    - `runActionHandler`

[0.3.5]: https://github.com/infra-blocks/ts-github-actions/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/infra-blocks/ts-github-actions/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/infra-blocks/ts-github-actions/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/infra-blocks/ts-github-actions/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/infra-blocks/ts-github-actions/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/infra-blocks/ts-github-actions/compare/v0.2.1...v0.3.0
[0.2.1]: https://github.com/infra-blocks/ts-github-actions/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/infra-blocks/ts-github-actions/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/infra-blocks/ts-github-actions/releases/tag/v0.1.0
