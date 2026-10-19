/* ==========================================================================
   app.js —— 共用运行时（每页无条件加载，index 之前）
   职责：① 注入冻结的 App Shell（顶部导航 / 页脚 / 返回顶部）
        ② 内联 Lucide 图标系统（零外部依赖，禁 emoji）
        ③ 通用交互：tabs / 折叠 / 弹窗 / toast / 倒计时 / 数字滚动 / 揭示动画
        ④ 二维码图形（SVG 绘制，示意用，非真实可扫）
   注意：本文件由设计契约冻结，任何页面都不得改动其输出结构。
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- ① 图标库（Lucide 路径，内联 SVG） ---------- */
  var ICONS = {
    'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    'book-open': '<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
    'swords': '<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="21" y2="19"/><line x1="5" y1="14" x2="9" y2="18"/><line x1="7" y1="17" x2="4" y2="20"/><line x1="3" y1="19" x2="5" y2="21"/>',
    'sword': '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="M13 19l6-6"/><path d="M16 16l4 4"/><path d="M19 21l2-2"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
    'newspaper': '<path d="M15 18h-5"/><path d="M18 14h-8"/><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 18h-6"/>',
    'sparkles': '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14A2 2 0 0 0 15.5 9.94l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/>',
    'ticket': '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
    'zap': '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    'menu': '<line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    'play': '<polygon points="6 3 20 12 6 21 6 3"/>',
    'qr-code': '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/>',
    'smartphone': '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    'monitor': '<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
    'apple': '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    'calendar': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    'gift': '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    'user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    'check-circle': '<path d="M21.8 10A10 10 0 1 1 17 3.34"/><path d="m9 11 3 3L22 4"/>',
    'alert-triangle': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'copy': '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'star': '<path d="M11.5 2.3a.53.53 0 0 1 .95 0l2.31 4.68a2.12 2.12 0 0 0 1.6 1.16l5.16.76a.53.53 0 0 1 .3.9l-3.74 3.64a2.12 2.12 0 0 0-.61 1.88l.88 5.14a.53.53 0 0 1-.77.56l-4.62-2.43a2.12 2.12 0 0 0-1.97 0L6.4 21.01a.53.53 0 0 1-.77-.56l.88-5.14a2.12 2.12 0 0 0-.61-1.88L2.16 9.79a.53.53 0 0 1 .29-.9l5.17-.76a2.12 2.12 0 0 0 1.6-1.16z"/>',
    'snowflake': '<line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="m20 16-4-4 4-4"/><path d="m4 8 4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    'crown': '<path d="M11.56 3.27a.5.5 0 0 1 .88 0l2.95 5.6a1 1 0 0 0 1.52.3l4.27-3.67a.5.5 0 0 1 .8.52l-2.84 10.24a1 1 0 0 1-.95.74H5.81a1 1 0 0 1-.96-.74L2.02 6.02a.5.5 0 0 1 .8-.52l4.28 3.67a1 1 0 0 0 1.51-.3z"/><path d="M5 21h14"/>',
    'gem': '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
    'server': '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
    'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    'scroll': '<path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    'scale': '<path d="m16 16 3-8 3 8a5 5 0 0 1-6 0z"/><path d="m2 16 3-8 3 8a5 5 0 0 1-6 0z"/><line x1="7" y1="21" x2="17" y2="21"/><path d="M12 3v18"/><line x1="3" y1="8" x2="21" y2="8"/>',
    'map-pin': '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    'headset': '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    'video': '<path d="m16 13 5.22 3.49a1 1 0 0 0 1.78-.79V8.3a1 1 0 0 0-1.78-.79L16 11"/><rect width="14" height="12" x="2" y="6" rx="2"/>',
    'refresh': '<path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64L3 16"/><path d="M3 21v-5h5"/>',
    'external-link': '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'square-plus': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M8 12h8"/><path d="M12 8v8"/>',
    'clipboard-list': '<rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
    'box': '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    'circle-dot': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
    'trending-up': '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'
  };

  function icon(name, size, cls) {
    var p = ICONS[name] || ICONS['circle-dot'];
    return '<svg class="ic ' + (cls || '') + '" width="' + (size || 20) + '" height="' + (size || 20) +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------- ② 冻结的 App Shell ---------- */
  var NAV = [
    { label: '首页', icon: 'home', href: 'index.html', key: 'home' },
    { label: '游戏介绍', icon: 'book-open', href: 'game.html', key: 'game' },
    { label: '职业介绍', icon: 'swords', href: 'classes.html', key: 'classes' },
    { label: '下载中心', icon: 'download', href: 'download.html', key: 'download' },
    { label: '新闻公告', icon: 'newspaper', href: 'news.html', key: 'news' },
    { label: '活动专区', icon: 'sparkles', href: 'activity.html', key: 'activity' },
    { label: '礼包码', icon: 'ticket', href: 'gift.html', key: 'gift' }
  ];
  var ALIAS = { 'news-detail': 'news' }; // 详情页归属「新闻公告」

  function logoMark() { return '<span class="logo-mark"><img src="assets/logo.png" alt="小小屠龙" width="38" height="38"></span>'; }

  function navLinkHTML(it, drawer) {
    return '<a class="nav-link" href="' + it.href + '" data-nav="' + it.key + '">' +
      icon(it.icon, 16) + '<span>' + it.label + '</span></a>';
  }

  function renderHeader() {
    var host = document.getElementById('siteHeader');
    if (!host) return;
    host.innerHTML =
      '<div class="container nav-wrap">' +
        '<a class="brand" href="index.html">' + logoMark() +
          '<span class="logo-text"><b>小小屠龙</b><span>冰雪复古</span></span></a>' +
        '<nav class="nav-links" aria-label="主导航">' +
          NAV.map(function (it) { return navLinkHTML(it); }).join('') +
          '<a class="btn btn-gold nav-cta" href="download.html">' + icon('zap', 16) + '<span>立即下载</span></a>' +
        '</nav>' +
        '<button class="nav-toggle" id="navToggle" aria-label="打开菜单" aria-expanded="false">' + icon('menu', 22) + '</button>' +
      '</div>';

    /* 抽屉必须挂在 body 下：.site-header 的 backdrop-filter 会使其成为
       position:fixed 后代的包含块，导致抽屉尺寸按 header 计算（移动端会塌成一条）。
       先清掉所有可能存在的旧抽屉（页面被保存成 DOM 快照时会留下副本）。 */
    document.querySelectorAll('.nav-drawer').forEach(function (n) { n.parentNode.removeChild(n); });
    var drawer = document.createElement('div');
    drawer.className = 'nav-drawer';
    drawer.id = 'navDrawer';
    drawer.innerHTML =
      '<button class="drawer-close" id="drawerClose" aria-label="关闭菜单">' + icon('x', 20) + '</button>' +
      NAV.map(function (it) { return navLinkHTML(it, true); }).join('') +
      '<a class="btn btn-gold btn-lg" style="margin-top:20px" href="download.html">' + icon('zap', 18) + '<span>立即下载</span></a>';
    document.body.appendChild(drawer);

    markActive();
  }

  function renderFooter() {
    var host = document.getElementById('siteFooter');
    if (!host) return;
    var games = NAV.slice(1, 4).concat([{ label: '新闻公告', href: 'news.html' }, { label: '活动专区', href: 'activity.html' }, { label: '礼包码', href: 'gift.html' }]);
    var helps = [
      { label: '常见问题', href: 'download.html#faq' },
      { label: '客服中心', href: 'legal.html#service' },
      { label: '用户协议', href: 'legal.html#terms' },
      { label: '隐私政策', href: 'legal.html#privacy' },
      { label: '未成年人保护', href: 'legal.html#minor' },
      { label: '防沉迷说明', href: 'legal.html#antigame' }
    ];
    host.innerHTML =
      '<div class="container">' +
        '<div class="footer-grid">' +
          '<div class="footer-col foot-brand">' +
            '<a class="brand" href="index.html">' + logoMark() +
              '<span class="logo-text"><b>小小屠龙</b><span>冰雪复古</span></span></a>' +
            '<p>冰封王座之上，屠龙者的传说仍在继续。1.76 复古内核，冰雪新篇，手机端与 PC 端数据互通。</p>' +
            '<div class="foot-social">' +
              '<a href="#" title="抖音" aria-label="抖音">' + icon('video', 18) + '</a>' +
              '<a href="#" title="微信公众号" aria-label="微信公众号">' + icon('message-circle', 18) + '</a>' +
              '<a href="#" title="玩家 QQ 群" aria-label="玩家 QQ 群">' + icon('users', 18) + '</a>' +
              '<a href="#" title="玩家论坛" aria-label="玩家论坛">' + icon('external-link', 18) + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-col"><h4>游戏</h4><div class="foot-links">' +
            games.map(function (g) { return '<a href="' + g.href + '">' + g.label + '</a>'; }).join('') +
          '</div></div>' +
          '<div class="footer-col"><h4>玩家服务</h4><div class="foot-links">' +
            helps.map(function (g) { return '<a href="' + g.href + '">' + g.label + '</a>'; }).join('') +
          '</div></div>' +
          '<div class="footer-col"><h4>联系我们</h4><div class="foot-links">' +
            '<span>客服邮箱：yxwl3672@163.com</span>' +
          '</div></div>' +
        '</div>' +
        '<div class="compliance">' +
          '<div class="row">' +
            '<span><strong>适龄提示：</strong>16+，适合 16 周岁以上用户</span>' +
          '</div>' +
          '<p class="warn-text">抵制不良游戏，拒绝盗版游戏。注意自我保护，谨防受骗上当。适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</p>' +
          '<p>本游戏设有防沉迷系统，未满 18 周岁用户每日 22:00 至次日 08:00 无法登录，法定节假日每日累计游戏时长不超过 3 小时，其他时间不超过 1.5 小时。</p>' +
          '<div class="copyright">' +
            '<span>© 2026 小小屠龙 · 冰雪复古 官方站</span>' +
            '<span>页面图文素材为演示用临时视觉，正式上线前需替换为官方素材</span>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function markActive() {
    var page = document.body.dataset.page || 'home';
    var key = ALIAS[page] || page;
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('data-nav') === key);
    });
  }

  function renderToTop() {
    var t = document.getElementById('toTop');
    if (!t) return;
    t.innerHTML = icon('arrow-up', 20);
    t.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
    window.addEventListener('scroll', function () {
      t.classList.toggle('show', window.scrollY > 520);
    }, { passive: true });
  }

  /* ---------- ③ 二维码图形（SVG 绘制 · 示意用，不可扫描） ---------- */
  function qrSVG(seed, px) {
    var n = 25, cell = (px || 160) / n, fill = '#0B1220', dots = '';
    function inFinder(r, c) {
      var zones = [[0, 0], [0, n - 7], [n - 7, 0]];
      return zones.some(function (z) {
        return r >= z[0] && r < z[0] + 7 && c >= z[1] && c < z[1] + 7;
      });
    }
    var s = seed || 20261016;
    function rnd(i) { var x = Math.sin(s + i * 12.9898) * 43758.5453; return x - Math.floor(x); }
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        if (inFinder(r, c)) continue;
        if (rnd(r * n + c) > 0.52) dots += '<rect x="' + (c * cell).toFixed(1) + '" y="' + (r * cell).toFixed(1) + '" width="' + cell.toFixed(1) + '" height="' + cell.toFixed(1) + '"/>';
      }
    }
    function finder(r, c) {
      return '<rect x="' + (c * cell) + '" y="' + (r * cell) + '" width="' + (7 * cell) + '" height="' + (7 * cell) + '" rx="' + (cell) + '"/>' +
        '<rect x="' + ((c + 1) * cell) + '" y="' + ((r + 1) * cell) + '" width="' + (5 * cell) + '" height="' + (5 * cell) + '" rx="' + (cell * .6) + '" fill="#fff"/>' +
        '<rect x="' + ((c + 2) * cell) + '" y="' + ((r + 2) * cell) + '" width="' + (3 * cell) + '" height="' + (3 * cell) + '" rx="' + (cell * .4) + '"/>';
    }
    return '<svg width="100%" height="100%" viewBox="0 0 ' + (n * cell) + ' ' + (n * cell) + '" fill="' + fill + '" role="img" aria-label="官网二维码（示意）">' +
      '<rect width="100%" height="100%" fill="#fff"/>' + dots +
      finder(0, 0) + finder(0, n - 7) + finder(n - 7, 0) + '</svg>';
  }

  function hydrateQR(root) {
    (root || document).querySelectorAll('[data-qr]').forEach(function (el) {
      if (el.dataset.qrDone) return;
      el.dataset.qrDone = '1';
      el.insertAdjacentHTML('afterbegin', qrSVG(parseInt(el.dataset.qr, 10) || 0, 160));
    });
  }

  /* ---------- ④ 通用交互 ---------- */
  function toast(msg, type) {
    var box = document.getElementById('toastBox');
    if (!box) { box = document.createElement('div'); box.id = 'toastBox'; document.body.appendChild(box); }
    var el = document.createElement('div');
    el.className = 'toast ' + (type || '');
    el.innerHTML = icon(type === 'err' ? 'alert-triangle' : 'check-circle', 16) + '<span>' + msg + '</span>';
    box.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 320); }, 2200);
  }

  function openModal(id) {
    var m = document.getElementById(id);
    if (!m) return;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(m) {
    (m || document.querySelector('.modal.is-open')) && (m || document.querySelector('.modal.is-open')).classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function countdown(el) {
    var target = new Date(el.dataset.countdown).getTime();
    var units = [['天', 864e5], ['时', 36e5], ['分', 6e4], ['秒', 1e3]];
    function tick() {
      var diff = Math.max(0, target - Date.now());
      el.innerHTML = units.map(function (u) {
        var v = Math.floor(diff / u[1]); diff -= v * u[1];
        return '<div><b>' + String(v).padStart(2, '0') + '</b><span>' + u[0] + '</span></div>';
      }).join('');
    }
    tick();
    clearInterval(el._timer);
    el._timer = setInterval(tick, 1000);
  }

  function countUp(el) {
    var end = parseFloat(el.dataset.countup) || 0;
    var suffix = el.dataset.suffix || '';
    var dec = (el.dataset.dec | 0);
    var t0 = null, dur = 1400;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * eased).toFixed(dec) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function bindGlobal() {
    // 抽屉（真正的开/关切换 + aria 同步）
    var toggle = document.getElementById('navToggle');
    var drawer = document.getElementById('navDrawer');
    function setDrawer(open) {
      if (!drawer) return;
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (toggle) {
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
      }
    }
    if (toggle && drawer) {
      toggle.addEventListener('click', function () {
        setDrawer(!drawer.classList.contains('is-open'));
      });
    }
    if (drawer) {
      var close = document.getElementById('drawerClose');
      if (close) close.addEventListener('click', function () { setDrawer(false); });
      drawer.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setDrawer(false); });
      });
    }

    // 事件委托
    document.addEventListener('click', function (e) {
      var t;
      // 弹窗
      if ((t = e.target.closest('[data-modal-open]'))) { e.preventDefault(); openModal(t.dataset.modalOpen); return; }
      if (e.target.classList.contains('modal-mask') || (t = e.target.closest('[data-modal-close]'))) {
        closeModal(t ? t.closest('.modal') : null); return;
      }
      // tabs
      if ((t = e.target.closest('.tab'))) {
        var wrap = t.closest('[data-tabs]');
        if (wrap) {
          wrap.querySelectorAll('.tab').forEach(function (b) { b.classList.toggle('is-active', b === t); });
          var box = document.getElementById(wrap.dataset.tabs);
          if (box) {
            box.querySelectorAll('.tab-panel').forEach(function (p) {
              p.classList.toggle('is-active', p.dataset.panel === t.dataset.tab);
            });
          }
        }
        return;
      }
      // 折叠
      if ((t = e.target.closest('.acc-head'))) {
        var item = t.closest('.acc-item');
        var group = t.closest('.accordion');
        if (group && !group.dataset.multi) {
          group.querySelectorAll('.acc-item').forEach(function (i) { if (i !== item) i.classList.remove('is-open'); });
        }
        item.classList.toggle('is-open');
        return;
      }
      // 复制
      if ((t = e.target.closest('[data-copy]'))) {
        var val = t.dataset.copy || (t.parentElement.querySelector('input') || {}).value || '';
        copyText(val);
        toast('已复制：' + val, 'ok');
        return;
      }
      // 占位链接
      if ((t = e.target.closest('a[href="#"]')) && !t.dataset.keepDefault) {
        e.preventDefault(); toast('演示原型：该外链待接入真实地址');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeModal(); setDrawer(false); }
    });

    bindCounters();
  }

  function bindCounters(root) {
    var scope = root || document;
    scope.querySelectorAll('[data-countdown]').forEach(function (el) {
      if (el._bound) return; el._bound = 1; countdown(el);
    });
    var io2 = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); }
      });
    }, { threshold: .4 });
    scope.querySelectorAll('[data-countup]').forEach(function (el) {
      if (el._bound) return; el._bound = 1; io2.observe(el);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).catch(function () {}); return; }
    var ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    ta.remove();
  }

  function reveal(root) {
    var els = (root || document).querySelectorAll('.reveal:not(.is-in)');
    if (!els.length) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el, i) {
      if (el._bound) return; el._bound = 1;
      if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', Math.min(i % 4, 3) * 90 + 'ms');
      io.observe(el);
    });
  }

  /* 页面脚本动态渲染内容后调用：重新绑定图标 / 二维码 / 倒计时 / 数字 / 揭示动画 */
  function initDynamic(root) {
    root = root || document;
    hydrate(root);
    bindCounters(root);
    reveal(root);
  }

  /* [data-icon] 约定：图标「前置插入」到元素内容之前，元素内原有文字/子元素保留 */
  function hydrate(root) {
    (root || document).querySelectorAll('[data-icon]').forEach(function (el) {
      if (el.dataset.iconDone) return;
      el.dataset.iconDone = '1';
      var size = parseInt(el.dataset.iconSize || 20, 10);
      el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon, size, el.dataset.iconClass || ''));
    });
    hydrateQR(root);
  }

  /* ---------- ⑤ 工具 ---------- */
  function fmtDate(d) { // "2026-10-16" → {y:'2026',m:'10',d:'16',ym:'2026.10'}
    var p = String(d).split('-');
    return { y: p[0], m: p[1], d: p[2], ym: p[0] + '.' + p[1] };
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

  window.App = { icon: icon, toast: toast, openModal: openModal, closeModal: closeModal, qr: qrSVG, hydrate: hydrate, initDynamic: initDynamic, fmtDate: fmtDate, esc: esc, countdown: countdown, countUp: countUp };

  /* ---------- 启动 ---------- */
  renderHeader();
  renderFooter();
  renderToTop();
  hydrate();
  bindGlobal();
  reveal();
})();
