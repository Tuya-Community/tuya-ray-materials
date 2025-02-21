# Changelog

All notable changes will be recorded in this file.

## [0.0.12] - 2025-02-11

### Fixed

- Fixed the occasional issue where the map could not be updated

## [2024-01-10]

### Added

- Support dynamically showing/hiding paths through `pathVisible`

### Fixed

- Fixed the issue of 'function is not defined' error occurring occasionally on some Android phones
- Fixed an occasional issue on iOS15 where the map could not be loaded
- Fixed the occasional issue where P2P could not connect after switching from the background to the foreground on mobile devices.
- Fixed the method of obtaining the URL using the **Use Map** directive

## [2024-12-10]

### Added

- Add IconFont component

### Fixed

- Fixed an issue where the Dynamic component might not update the real-time map.

## [2024-11-22]

### Added

- Added manual control page
- Added video monitoring page
- Added AI object recognition feature
- Added room cleaning order feature
- Added cleaning preference settings page
- Added floor material settings feature
- Updated **@ray-js/robot-map-component** to **v0.0.18**, supporting configurable WebView map container size & position, fixed some issues.
- Updated **@ray-js/robot-protocol** to **v0.9.2**, adding support for `Virtual Wall Settings 0x48/49`, `No-go Zone Settings 0x1a/1b`, `Do Not Disturb Time Settings 0x32/33`, `Floor Material Settings 0x52/0x53` protocol, fixed some issues.

### Changed

- Replaced map loading animation
- Unified and configurable map background color

### Fixed

- Fixed the issue where protocol version v0 maps could not display properly
- Fixed the issue where lz4 compressed paths could not display properly

## [2024-11-12]

### Fixed

- Fixed the issue where opening the room naming popup caused map gestures to become unresponsive

## [2024-11-11]

### Added

- Added scheduling page
- Added do not disturb mode page
- Added room editing page
- Added cleaning record page
- Added voice package page
- Added support for IDE map debugging feature

### Fixed

- Fixed the alignment issue between rjs maps and WebView maps
- Fixed some known issues

### Changed

- Refactored some existing pages and components
