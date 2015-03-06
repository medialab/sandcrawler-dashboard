# sandcrawler-dashboard

A handy terminal dashboard displaying advanced information about one of your [sandcrawler](http://medialab.github.io/sandcrawler/) spiders.

## Installation

You can install **sandcrawler-dashboard** through npm:

```bash
npm install sandcrawler-dashboard
```

## Usage

```js
var sandcrawler = require('sandcrawler'),
    dashboard = require('sandcrawler-dashboard');

var spider = sandcrawler.spider('MyFancySpider')
  .use(dashboard())
  .url('http://nicesite.org')
  .scraper(function($, done) {
    done(null, $('title').text());
  })
  .run();
```

## Options

* **logger** *?object*: Any options to pass to the `sandcrawler-logger` used by the dashboard internally. Possible options can be found [here](https://github.com/Yomguithereal/sandcrawler-logger#options).

*Example*

```js
var sandcrawler = require('sandcrawler'),
    logger = require('sandcrawler-logger');

var spider = sandcrawler.spider('MyFancySpider')
  .use(dashboard({logger: {color: 'red'}}));
```

## License

MIT
