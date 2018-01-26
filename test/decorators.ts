import test from 'ava';
import { CacheManager, CacheConfig, Decorators, getDecorators } from '../lib';

function wait(time: number) {
  const tick = +new Date;
  while (true) {
    if (+new Date - tick > time) break;
  }
}

test('base test', async t => {
  const helper = getDecorators();

  class TestCls {
    @helper.cachePut('text')
    async text(t: string) { return t; }

    @helper.cacheEvict('text')
    async evictText(t: string) { return t; }

    @helper.cachePut((desc: string) => `desc_${desc}`)
    async desc(desc: string, sub: string = '') { return desc + sub; }

    @helper.cacheEvict((desc: string) => `desc_${desc}`)
    async evictDesc(desc: string) { }
  }

  const test = new TestCls;
  t.true(await test.text('abc') === 'abc');
  t.true(await test.text('ccc') === 'abc');
  await test.evictText('abc');
  t.true(await test.text('ccc') === 'ccc');


  t.true(await test.desc('test') === 'test');
  t.true(await test.desc('test', 'ext') === 'test');
  await test.evictDesc('test');
  t.true(await test.desc('test', 'ext') === 'testext');
});

test('no evict when error', async t => {
  const cacheManager = new CacheManager;
  const helper = new Decorators(undefined, cacheManager);

  class TestCls {
    @helper.cachePut((a: number) => `desc_${a}`)
    async desc(a: number, desc: string) { return desc; }

    @helper.cacheEvict((a: number) => `desc_${a}`)
    async deleteErr(a: number) { throw new Error; }
  }

  const test = new TestCls;

  t.true(await test.desc(1, 'xxxx') === 'xxxx');
  t.throws(test.deleteErr(1));
  t.true(await test.desc(1, 'yyyy') === 'xxxx');
});

test('comine', async t => {
  const cacheManager = new CacheManager;
  const helper = getDecorators(undefined, cacheManager);

  class TestCls {
    @helper.cachePut('info1')
    async info1(t: string) { return t; }

    @helper.cachePut('info2')
    async info2(t: string) { return t; }

    @helper.cacheEvict(['info1', () => 'info2'])
    async delete() { }
  }

  const test = new TestCls;
  t.true(await test.info1('test1') === 'test1');
  t.true(await test.info2('test2') === 'test2');
  t.true(await test.info1('xxx') === 'test1');
  t.true(await test.info2('xxx') === 'test2');

  await test.delete();
  t.true(await test.info1('xxx') === 'xxx');
  t.true(await test.info2('xxx') === 'xxx');
});
