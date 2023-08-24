# Changelog

## [Unreleased]

### Added

- Added `COLOR` property to iCalendar object and VEVENT component

### Fixed

- Fixed lint errors

### Updated

- Updated Node version in workflows
- Updated named imports for `RRule` dependency

### Security

- Updated dependencies
- Added dependabot.yml with `assignees` and `target-branch`

## [1.4.0] - 2021-11-12

### Added

- Added xProps to VCALENDAR component
- Added refreshInterval to VCALENDAR component from [@ccoenen](https://github.com/ccoenen)

## [1.1.0] - 2020-11-05

### Added

- Added FreeBusy component, property and period parser/formatter
- Added Timezone component

### Updated

- Readme with timezone component documentation

## [1.0.1] - 2020-09-11

- Removed moment.js completely

## [1.0.0] - 2020-09-10

- Added citation for regex from Ruby iCalendar library
- Added rfc link to readme
- Updated dtStamp as optional, current UTC time used when not set
- Added schedule status event parameter, dquote parsing
- Updated delegatedTo/From parsing to remove 'mailto:'
- Updated datetime to expect iCalendar formatted strings

## [0.4.0] - 2020-05-07

### Added

- Added github actions workflows for testing and publishing

### Removed

- Removed travis ci

### Fixed

- Fixed newlines and escape chars formatting and parsing
- Fixed event start to support ComplexDate

## [0.3.2] - 2020-04-21

### Fixed

- Fixed null string formatting

## [0.2.3] - 2020-03-23

### Fixed

- Incorrect attribute name for RRule when parsing

## [0.2.1] - 2020-03-23

### Fixed

- Return RRule when parsing iCal data

## [0.1.0] - 2020-02-04

### Added

- This Changelog

### Changed

- xProps names are now upper cased + tests
