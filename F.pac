function FindProxyForURL(url, host) {
  var PROXY_HOST = "212.35.66.45";

  var PORTS = {
    GAME: [443, 8443, 20005],
    SOCIAL: [10001, 10010],
    UPDATES: [80, 443, 8443],
    CDN: [80, 443]
  };

  var PORT_WEIGHTS = {
    GAME: [6, 3, 5],
    SOCIAL: [3, 2],
    UPDATES: [5, 3, 2],
    CDN: [3, 2]
  };

  var BLOCK_REPLY = "PROXY 0.0.0.0:0";
  var STICKY_SALT = "PUBG_STICKY";
  var STICKY_TTL_MINUTES = 10;
  var DST_RESOLVE_TTL_MS = 15000;

  var now = new Date().getTime();
  var root = (typeof globalThis !== "undefined" ? globalThis : this);

  if (!root._PAC_CACHE) root._PAC_CACHE = {};
  var CACHE = root._PAC_CACHE;
  if (!CACHE.DST_RESOLVE_CACHE) CACHE.DST_RESOLVE_CACHE = {};
  if (!CACHE._PORT_STICKY) CACHE._PORT_STICKY = {};

  var DOMAINS = {
    GAME: [
      "*.pubgmobile.com",
      "*.pubgmobile.net",
      "*.proximabeta.com",
      "*.igamecj.com",
      "*.gpubgm.com",
      "*.qq.com",
      "*.gcloud.qq.com",
      "*.tencentgames.com"
    ],
    SOCIAL: [
      "match.igamecj.com",
      "match.proximabeta.com",
      "teamfinder.igamecj.com",
      "teamfinder.proximabeta.com",
      "*.social.pubgmobile.com",
      "*.clan.pubgmobile.com"
    ],
    UPDATES: [
      "cdn.pubgmobile.com",
      "updates.pubgmobile.com",
      "patch.igamecj.com",
      "hotfix.proximabeta.com",
      "dlied1.qq.com",
      "dlied2.qq.com"
    ],
    CDN: [
      "cdn.igamecj.com",
      "cdn.proximabeta.com",
      "cdn.tencentgames.com",
      "*.qcloudcdn.com",
      "*.cloudfront.net",
      "*.edgesuite.net"
    ]
  };

  var URL_PATTERNS = {
    GAME: [
      "*/account/*",
      "*/login*",
      "*/client/version*",
      "*/status/heartbeat*",
      "*/presence/*",
      "*/friends/*",

      "*/matchmaking/*",
      "*/mms/*",
      "*/game/start*",
      "*/game/join*",
      "*/battle/*",
      "*/report/battle*",
      "*/room/*",
      "*/customroom/*",
      "*/session/*",
      "*/token/*",
      "*/server/list*",
      "*/startgame*",

      "*/arena/*",
      "*/tdm/*",
      "*/payload/*",
      "*/metro/*",
      "*/infected/*",
      "*/miramar/*",
      "*/erangel/*",
      "*/livik/*",
      "*/nusa/*",
      "*/wow/*",
      "*/worldofwonder/*"
    ],
    SOCIAL: [
      "*/teamfinder/*",
      "*/clan/*",
      "*/social/*",
      "*/search/*",
      "*/recruit/*"
    ],
    UPDATES: [
      "*/patch*",
      "*/hotfix*",
      "*/update*",
      "*/download*",
      "*/assets/*",
      "*/assetbundle*",
      "*/obb*"
    ],
    CDN: [
      "*/cdn/*",
      "*/static/*",
      "*/image/*",
      "*/media/*",
      "*/video/*",
      "*/res/*",
      "*/pkg/*"
    ]
  };

  function hostMatchesAnyDomain(h, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(h, patterns[i])) return true;
      var p = patterns[i].replace(/^\*\./, ".");
      if (h.slice(-p.length) === p) return true;
    }
    return false;
  }

  function pathMatches(u, patterns) {
    for (var i = 0; i < patterns.length; i++) {
      if (shExpMatch(u, patterns[i])) return true;
    }
    return false;
  }

  function weightedPick(ports, weights) {
    var sum = 0;
    for (var i = 0; i < ports.length; i++) sum += (weights[i] || 1);
    var r = Math.floor(Math.random() * sum) + 1;
    var acc = 0;
    for (var k = 0; k < ports.length; k++) {
      acc += (weights[k] || 1);
      if (r <= acc) return ports[k];
    }
    return ports[0];
  }

  function proxyForCategory(cat) {
    var key = STICKY_SALT + "_PORT_" + cat;
    var ttl = STICKY_TTL_MINUTES * 60 * 1000;
    var e = CACHE._PORT_STICKY[key];
    if (e && (now - e.t) < ttl) return "PROXY " + PROXY_HOST + ":" + e.p;

    var p = weightedPick(PORTS[cat], PORT_WEIGHTS[cat]);
    CACHE._PORT_STICKY[key] = { p: p, t: now };
    return "PROXY " + PROXY_HOST + ":" + p;
  }

  for (var cat in URL_PATTERNS) {
    if (pathMatches(url, URL_PATTERNS[cat])) {
      return proxyForCategory(cat);
    }
  }

  for (var c in DOMAINS) {
    if (hostMatchesAnyDomain(host, DOMAINS[c])) {
      return proxyForCategory(c);
    }
  }

  return "DIRECT";
}
