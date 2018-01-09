# AnyCache

[![CI](https://img.shields.io/travis/zhang740/any-cache.svg?style=flat-square)](https://travis-ci.org/zhang740/any-cache)
[![Coverage](https://img.shields.io/coveralls/zhang740/any-cache.svg?style=flat-square)](https://coveralls.io/github/zhang740/any-cache)
[![Version](https://img.shields.io/npm/v/any-cache.svg?style=flat-square)](https://www.npmjs.com/package/any-cache)
[![License](https://img.shields.io/npm/l/any-cache.svg?style=flat-square)](https://github.com/zhang740/any-cache/blob/master/LICENSE)

Function level cache library.

## Install
```shell
npm i any-cache --save
```

## Example

### a simple example
```ts
  class TestCls {
    @helper.cache('text')
    async text(t: string) { return t; }

    @helper.cacheEvict('text')
    async evictText(t: string) { return t; }

    @helper.cache((desc: string) => `desc_${desc}`)
    async desc(desc: string, sub: string = '') { return desc + sub; }

    @helper.cacheEvict((desc: string) => `desc_${desc}`)
    async evictDesc(desc: string) { }
  }
```

#### [See the test case for details.](https://github.com/zhang740/any-cache/tree/master/test)
