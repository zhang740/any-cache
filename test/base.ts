import test from 'ava';
import { CacheManager } from '../lib';
import { CacheConfig } from '../lib/CacheManager';

function wait(time: number) {
  const tick = +new Date;
  while (true) {
    if (+new Date - tick > time) break;
  }
}

test('base test', async t => {
  const cacheManager = new CacheManager();
  t.falsy(await cacheManager.get('test'));
  t.false(await cacheManager.has('test'));

  await cacheManager.put('test', 123123, new CacheConfig);
  t.true(await cacheManager.get('test') === 123123);
  t.true(await cacheManager.has('test'));

  await cacheManager.delete('test');
  t.falsy(await cacheManager.get('test'));
});


test('expire time', async t => {
  const cacheManager = new CacheManager();
  const config: CacheConfig = {
    ...new CacheConfig,
    expiredTime: 0.2,
  };
  await cacheManager.put('test', 123123, config);
  wait(100);
  t.true(await cacheManager.get('test') === 123123);
  wait(200);
  t.falsy(await cacheManager.get('test'));
  t.false(await cacheManager.has('test'));
});
