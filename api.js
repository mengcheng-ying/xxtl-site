/* ==========================================================================
   api.js —— API 桩层（演示用，内部返回 mock）
   约定：函数签名 / 延迟 / 返回结构均按真实后端接口设计，
        后续只需替换函数体为 fetch(...)，调用方无需改动。
   每个函数上方注明：方法 + 路径 + 请求/响应结构
   ========================================================================== */
(function () {
  'use strict';

  function delay(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  var ok = function (data) { return { code: 0, msg: 'success', data: data }; };
  var fail = function (code, msg) { return { code: code, msg: msg, data: null }; };

  /* GET /api/news?type=&page=&pageSize=
     resp: { code:0, data:{ list:[NewsItem], total:number, page, pageSize } } */
  async function fetchNews(opt) {
    opt = opt || {};
    var page = opt.page || 1, pageSize = opt.pageSize || 6, type = opt.type || '全部';
    await delay(520); // TODO: replace with fetch('/api/news?...')
    var list = DB.news.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    if (type !== '全部') list = list.filter(function (n) { return n.type === type; });
    return ok({ list: list.slice((page - 1) * pageSize, page * pageSize), total: list.length, page: page, pageSize: pageSize });
  }

  /* GET /api/news/:id  resp: { code:0, data:NewsItem } */
  async function fetchNewsDetail(id) {
    await delay(360); // TODO: replace with fetch('/api/news/' + id)
    var item = DB.news.find(function (n) { return n.id === id; });
    return item ? ok(item) : fail(1404, '公告不存在或已下线');
  }

  /* GET /api/activities?status=  resp: { code:0, data:[Activity] } */
  async function fetchActivities(status) {
    await delay(420); // TODO: replace with fetch('/api/activities?status=' + status)
    var list = DB.activities;
    if (status && status !== '全部') {
      list = status === '已结束'
        ? list.filter(function (a) { return a.status === '已结束'; })
        : list.filter(function (a) { return a.status !== '已结束'; });
    }
    return ok(list);
  }

  /* GET /api/gift/welfare  resp: { code:0, data:[Welfare & {status}] }
     领取状态本地持久化，正式接入后由服务端返回 */
  async function fetchWelfare() {
    await delay(480); // TODO: replace with fetch('/api/gift/welfare')
    var done = JSON.parse(localStorage.getItem('tl_welfare') || '[]');
    var list = DB.gifts.welfare.map(function (w) {
      return Object.assign({}, w, { status: done.indexOf(w.id) >= 0 ? '已领取' : '可领取' });
    });
    return ok(list);
  }

  /* POST /api/gift/claim  body:{ id }  resp:{ code:0, data:{ id, reward } } */
  async function claimWelfare(id) {
    await delay(560); // TODO: replace with fetch('/api/gift/claim', { method:'POST', body })
    var done = JSON.parse(localStorage.getItem('tl_welfare') || '[]');
    if (done.indexOf(id) >= 0) return fail(1409, '该福利已领取，请勿重复操作');
    var w = DB.gifts.welfare.find(function (x) { return x.id === id; });
    if (!w) return fail(1404, '福利不存在');
    done.push(id);
    localStorage.setItem('tl_welfare', JSON.stringify(done));
    return ok({ id: id, reward: w.reward });
  }

  /* POST /api/gift/redeem  body:{ code }  resp:{ code:0, data:{ name, items[], expire } }
     错误码：1101 空 / 1102 格式错误 / 1103 兑换码无效 / 1104 已使用 */
  async function redeemGift(rawCode) {
    await delay(680); // TODO: replace with fetch('/api/gift/redeem', { method:'POST', body })
    var code = String(rawCode || '').trim().toUpperCase();
    if (!code) return fail(1101, '请输入兑换码');
    if (!/^[A-Z0-9]{6,12}$/.test(code)) return fail(1102, '兑换码格式不正确，应为 6–12 位字母或数字');
    var g = DB.gifts.codes[code];
    if (!g) return fail(1103, '兑换码无效，请核对后重新输入');
    var used = JSON.parse(localStorage.getItem('tl_gift_used') || '[]');
    if (used.indexOf(code) >= 0) return fail(1104, '该兑换码已被使用');
    used.push(code);
    localStorage.setItem('tl_gift_used', JSON.stringify(used));
    return ok({ code: code, name: g.name, items: g.items, expire: g.expire });
  }

  /* GET /api/servers  resp:{ code:0, data:[Server] } */
  async function fetchServers() {
    await delay(400); // TODO: replace with fetch('/api/servers')
    return ok(DB.servers);
  }

  window.API = {
    fetchNews: fetchNews, fetchNewsDetail: fetchNewsDetail,
    fetchActivities: fetchActivities,
    fetchWelfare: fetchWelfare, claimWelfare: claimWelfare, redeemGift: redeemGift,
    fetchServers: fetchServers,
    delay: delay
  };
})();
