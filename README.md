# shake-video-element

[![NPM](https://nodei.co/npm/shake-video-element.png)](https://nodei.co/npm/shake-video-element/)

[![NPM version](https://img.shields.io/npm/v/shake-video-element.svg)](https://www.npmjs.com/package/shake-video-element)
[![Build Status](https://travis-ci.org/mastashake08/shake-video-element.svg?branch=master)](https://travis-ci.org/mastashake08/shake-video-element)
[![Coverage Status](https://coveralls.io/repos/github/mastashake08/shake-video-element/badge.svg?branch=master)](https://coveralls.io/github/mastashake08/shake-video-element?branch=master)

A web component for a more enhanced HTMLVideoElement

## Installation

Clone repository with Git:

```sh
git clone https://github.com/mastashake08/shake-video-element.git
cd shake-video-element
```

## Usage
<shake-video src=""/>

## Testing

Run tests:

```sh
npm test
```

Run tests in watch mode:

```sh
npm run test:watch
```

Run tests with coverage:

```sh
npm run test:coverage
```

View coverage in browser:

```sh
npm run test:coverage:report
open coverage/index.html
```

Lint files:

```sh
npm run lint
```

Fix lint errors:

```sh
npm run lint:fix
```

## Release

Only collaborators with credentials can release and publish:

```sh
npm run release
git push --follow-tags && npm publish
```

To see what files are going to be published, run the command:

```sh
npm pack --dry-run
# tar tvf $(npm pack)
```

## Support

- [Patreon](https://patreon.com/mastashake08)
- [Cash App](https://cash.me/$mastashake08)

## License

[MIT](https://github.com/mastashake08/shake-video-element/blob/master/LICENSE)
