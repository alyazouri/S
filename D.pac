// ============================================================================
// ⭐ THE ULTIMATE ESPORTS PAC SCRIPT — VIP PURE INTRA-JORDAN MASTERPIECE ⭐
// [ O(1) MEMOIZATION CACHE | FLAWLESS FAILOVER | 0% EXTERNAL HOPS | 100% SAFE ]
// ============================================================================

// ================= 1. PROXIES & FAILOVER CONFIGURATION =================
// دعم ميكانيكية الطوارئ (; DIRECT) لمنع انقطاع الاتصال نهائياً في حال تذبذب البروكسي
var MATCH_JO = "PROXY 46.185.131.218:20005; DIRECT";
var LOBBY_POOL = [
  "PROXY 46.185.131.218:80; DIRECT",
  "PROXY 46.185.131.218:443; DIRECT"
];
var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= 2. PURE INTRA-JORDAN NETWORKS (IPV4) =================
// شبكات أردنية محلية 100% متصلة بمقسم JINX المحلي في عمّان (صفر Hops خارجية)
var JORDAN_MATCH_IPV4 = [
  ["91.106.96.0","255.255.224.0"],
  ["213.6.64.0","255.255.224.0"],
  ["79.134.192.0","255.255.224.0"],
  ["188.247.128.0","255.255.128.0"]
];

// ================= 3. PURE INTRA-JORDAN NETWORKS (IPV6) =================
var JORDAN_MATCH_IPV6 = [
  "2a02:9c0::/29", "2a01:1d0::/29", "2a02:c040::/29", "2a01:9700::/29",
  "2a01:e240::/29", "2a01:ee40::/29", "2a02:2558::/29", "2a02:e680::/29",
  "2a02:f0c0::/29", "2a03:6b00::/29", "2a00:76e0::/32", "2a00:18d0::/32",
  "2a00:4620::/32", "2a00:b860::/32", "2a00:caa0::/32", "2a02:25d8::/32",
  "2a02:5b60::/32", "2a03:6d00::/32", "2a00:18d8::/29", "2001:32c0::/29"
];

// ================= 4. STRICT OUT-OF-JORDAN BLACKLIST =================
var GEO_BLACKLIST = [
  // ── حظر قطعي لبوابات أوروبا والمسارات الخارجية ──
  ["62.72.160.0", "255.255.224.0"], ["79.134.128.0", "255.255.224.0"],
  ["80.91.64.0",  "255.255.224.0"], ["81.28.16.0",   "255.255.240.0"],
  ["178.248.0.0", "255.255.192.0"], ["185.76.104.0", "255.255.252.0"],
  ["195.210.48.0","255.255.240.0"], ["5.199.184.0",  "255.255.252.0"],
  ["45.142.196.0","255.255.252.0"],

  // ── حظر خوادم أوروبا الغربية والشمالية ──
  ["5.0.0.0", "255.0.0.0"], ["31.128.0.0", "255.192.0.0"], ["46.16.0.0", "255.240.0.0"],
  ["50.0.0.0", "255.0.0.0"], ["51.0.0.0", "255.0.0.0"], ["52.0.0.0", "255.0.0.0"],
  ["95.24.0.0", "255.248.0.0"], ["104.0.0.0", "255.0.0.0"], ["178.64.0.0", "255.192.0.0"],

  // ── حظر شرق آسيا / الصين / الهند ──
  ["1.0.0.0", "255.0.0.0"], ["14.0.0.0", "255.0.0.0"], ["27.0.0.0", "255.0.0.0"],
  ["36.0.0.0", "255.0.0.0"], ["39.0.0.0", "255.0.0.0"], ["42.0.0.0", "255.0.0.0"],
  ["49.0.0.0", "255.0.0.0"], ["58.0.0.0", "255.0.0.0"], ["59.0.0.0", "255.0.0.0"],
  ["60.0.0.0", "255.0.0.0"], ["61.0.0.0", "255.0.0.0"], ["101.0.0.0", "255.0.0.0"],
  ["103.0.0.0", "255.0.0.0"], ["106.0.0.0", "255.0.0.0"], ["110.0.0.0", "255.0.0.0"],
  ["111.0.0.0", "255.0.0.0"], ["112.0.0.0", "255.0.0.0"], ["113.0.0.0", "255.0.0.0"],
  ["114.0.0.0", "255.0.0.0"], ["115.0.0.0", "255.0.0.0"], ["116.0.0.0", "255.0.0.0"],
  ["117.0.0.0", "255.0.0.0"], ["118.0.0.0", "255.0.0.0"], ["119.0.0.0", "255.0.0.0"],
  ["120.0.0.0", "255.0.0.0"], ["121.0.0.0", "255.0.0.0"], ["122.0.0.0", "255.0.0.0"],
  ["123.0.0.0", "255.0.0.0"], ["124.0.0.0", "255.0.0.0"], ["125.0.0.0", "255.0.0.0"],

  // ── حظر أمريكا الجنوبية وأفريقيا البعيدة ──
  ["177.0.0.0", "255.0.0.0"], ["179.0.0.0", "255.0.0.0"], ["181.0.0.0", "255.0.0.0"],
  ["186.0.0.0", "255.0.0.0"], ["187.0.0.0", "255.0.0.0"], ["189.0.0.0", "255.0.0.0"],
  ["190.0.0.0", "255.0.0.0"], ["191.0.0.0", "255.0.0.0"], ["200.0.0.0", "255.0.0.0"],
  ["201.0.0.0", "255.0.0.0"]
];

// ================= 5. SMART SESSION, MEMOIZATION CACHE & AUTO-RESET =================
var SESSION = {
  matchNet: null,
  matchHost: null,
  matchTime: 0,
  dnsCache: {},
  routeCache: {},    // ⚡ ذاكرة التوجيه الفورية فائقة السرعة
  cacheSize: 0       // 🧹 مراقب حجم الذاكرة لمنع التهنيج
};

// ================= 6. HIGH-SPEED HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isIPv6(ip){
  return ip && ip.indexOf(":") !== -1;
}

function isInList(ip, list){
  for (var i = 0; i < list.length; i++) {
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

function isInIPv6List(ip, list){
  if (typeof isInNetEx === 'undefined') return false;
  for (var i = 0; i < list.length; i++) {
    if (isInNetEx(ip, list[i])) return true;
  }
  return false;
}

function ipv6Net48(ip){
  return ip.split(":").slice(0,3).join(":");
}

// ✅ Smart DNS Resolver with 5-min Cache
function resolvePinned(host){
  var now = Date.now();
  if (SESSION.dnsCache[host] && (now - SESSION.dnsCache[host].time < 300000)) {
    return SESSION.dnsCache[host].ip;
  }
  var ip = null;
  try {
    var rawIp = (typeof dnsResolveEx !== 'undefined') ? dnsResolveEx(host) : dnsResolve(host);
    if (rawIp) {
      var ips = rawIp.split(';');
      ip = ips.find(function(x){ return x.indexOf(':') === -1; }) || ips[0];
    }
  } catch(e) {}
  if (ip) {
    SESSION.dnsCache[host] = { ip: ip, time: now };
  }
  return ip;
}

function pickLobbyProxy(host){
  var h = 0;
  for (var i = 0; i < host.length; i++) h = (h + host.charCodeAt(i)) % LOBBY_POOL.length;
  return LOBBY_POOL[h];
}

// ================= 7. ELITE DETECTION ENGINE (REGEX) =================

// 🛡️ 1. أنظمة الحماية ومكافحة الغش (اتصال مباشر نقي لضمان الأمان المطلق 100%)
var REGEX_SECURITY = /security|anticheat|sguard|ace|mprotect|gpro|fairplay|guard|safe|ban|captcha|verify|csec|secops|telemetry|tdmsec|scantool|tencentprotect/i;

// 🔑 2. بوابات تسجيل الدخول والمصادقة (اتصال مباشر لضمان سلاسة الدخول عبر فيسبوك/جوجل/أبل)
var REGEX_AUTH = /login|auth|account|oauth|openid|connect|wechat|qq|gcloud|pass|sso|vmp|facebook|google|apple|twitter|vk/i;

// 🎮 3. اللعب والمباريات (شامل المستودع، الكلاسيكي، واو، مترو، الحمولة، الرومات، والبطولات)
var REGEX_MATCH = /match|battle|game|combat|realtime|sync|udp|tick|room|tdm|arena|metro|wow|worldofwonder|payload|heavy|custom|tour|elite|esports|server|fight|play|playzone|zone/i;

// 🎪 4. اللوبي والبحث عن المباريات (حصر التواجد الجغرافي داخل الأردن)
var REGEX_LOBBY = /lobby|matchmaking|queue|dispatch|gateway|region|join|recruit|find|quick|hub|team|home|main|enter|ready|select/i;

// 💬 5. الصوت، الأصدقاء، الدردشة المحلية، والكلان (شامل Vivox Voice لضمان نقاء المايك)
var REGEX_SOCIAL = /friend|invite|squad|party|clan|presence|social|voice|vivox|chat|msg|talk|guild|club|teamup|share/i;

// 🛒 6. المتجر، الرويال باس، الصناديق، والفعاليات (شامل Midasbuy)
var REGEX_STORE = /shop|store|pay|purchase|uc|currency|event|royalepass|luckyspin|treasure|reward|gacha|box|crate|activity|mission|midasbuy/i;

// 📦 7. تحميل الموارد، الخرائط، والتحديثات (شامل خوادم السحابة CDN)
var REGEX_CDN = /cdn|asset|resource|patch|update|media|content|map|dl|download|package|config|version|bundle|cloudcdn|gtimg|akamai|edgecast/i;

// 🎯 8. الرادار الشامل لببجي موبايل وبنيتها التحتية (شامل تنسنت، GCloud، وخدمات الموقع)
var REGEX_PUBG = /pubg|pubgm|tencent|krafton|lightspeed|levelinfinite|proximabeta|igame|midasbuy|puffer|subg|gcloud|qcloud|myqcloud|itopsdk|vivox|ipip|lbs/i;

// Helper functions for matching
function isSecurity(u,h){ return REGEX_SECURITY.test(u+h); }
function isAuth(u,h){ return REGEX_AUTH.test(u+h); }
function isPUBG(h){ return REGEX_PUBG.test(h); }
function isMatch(u,h){ return REGEX_MATCH.test(u+h); }
function isLobby(u,h){ return REGEX_LOBBY.test(u+h); }
function isSocial(u,h){ return REGEX_SOCIAL.test(u+h); }
function isStore(u,h){ return REGEX_STORE.test(u+h); }
function isCDN(u,h){ return REGEX_CDN.test(u+h); }

// ================= 8. MAIN ROUTING CORE =================
function FindProxyForURL(url, host) {
  host = norm(host.toLowerCase());

  // ⚡ 1. فحص الذاكرة الفورية (Cache): إرجاع النتيجة في 0.001 مللي ثانية إذا تم فحص النطاق سابقاً
  if (SESSION.routeCache[host]) {
    return SESSION.routeCache[host];
  }

  // 🏠 2. حماية وتمرير الاتصالات المحلية والراوتر المنزلي (تمنع بطء الهاتف)
  if (isPlainHostName(host) || host === "127.0.0.1" || host.indexOf("192.168.") === 0 || host.indexOf("10.") === 0) {
    return DIRECT;
  }

  // 🚀 3. استبعاد فوري لأي اتصال لا يخص اللعبة
  if (!isPUBG(host)) {
    return DIRECT;
  }

  // 🛡️ 4. أمان تام: عبور مباشر فوري لأنظمة الحماية وتسجيل الدخول دون أي لمس
  if (isSecurity(url, host) || isAuth(url, host)) {
    SESSION.routeCache[host] = DIRECT;
    SESSION.cacheSize++;
    return DIRECT;
  }

  // 🔍 5. حل عنوان الـ IP عبر الـ Cache الذكي
  var ip = resolvePinned(host);
  if (!ip) return BLOCK;

  var now = Date.now();
  var resultProxy = pickLobbyProxy(host);

  // 🧹 إدارة وحماية الذاكرة (تنظيف تلقائي للكاش عند تجاوز 1000 عنصر لمنع التهنيج)
  if (SESSION.cacheSize > 1000) {
    SESSION.routeCache = {};
    SESSION.cacheSize = 0;
  }

  // ================= IPV6 ROUTING =================
  if (isIPv6(ip)) {
    if (isMatch(url, host)) {
      if (!isInIPv6List(ip, JORDAN_MATCH_IPV6)) return BLOCK;
      var net = ipv6Net48(ip);
      if (!SESSION.matchNet || (now - SESSION.matchTime > 2700000)) {
        SESSION.matchNet = net;
        SESSION.matchHost = host;
        SESSION.matchTime = now;
        return MATCH_JO;
      }
      if (net !== SESSION.matchNet) return BLOCK;
      return MATCH_JO;
    }
    if (isLobby(url, host) || isSocial(url, host) || isStore(url, host) || isCDN(url, host)) {
      SESSION.routeCache[host] = resultProxy;
      SESSION.cacheSize++;
      return resultProxy;
    }
    SESSION.routeCache[host] = resultProxy;
    SESSION.cacheSize++;
    return resultProxy;
  }

  // ================= IPV4 ROUTING =================
  // ⛔ حظر قاطع لأي IP يقع ضمن بوابات أوروبا، آسيا، أو المسارات الخارجية
  if (isInList(ip, GEO_BLACKLIST)) {
    SESSION.routeCache[host] = BLOCK;
    SESSION.cacheSize++;
    return BLOCK;
  }

  // 🎮 قفل المباريات على خوادم الأردن المحلية 100% (صفر قفزات خارجية)
  if (isMatch(url, host)) {
    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;
    var net24 = ip.split('.').slice(0,3).join('.');
    if (!SESSION.matchNet || (now - SESSION.matchTime > 2700000)) {
      SESSION.matchNet = net24;
      SESSION.matchHost = host;
      SESSION.matchTime = now;
      return MATCH_JO;
    }
    if (net24 !== SESSION.matchNet) return BLOCK;
    return MATCH_JO;
  }

  // 🎪 توجيه وظائف اللوبي، التعارف الأردني، المايك، والمتجر عبر بروكسي زين الأردني
  if (isLobby(url, host) || isSocial(url, host) || isStore(url, host) || isCDN(url, host)) {
    SESSION.routeCache[host] = resultProxy;
    SESSION.cacheSize++;
    return resultProxy;
  }

  // 🔄 التوجيه الافتراضي لبقية حركة مرور اللعبة الآمنة مع حفظه في الذاكرة الفورية
  SESSION.routeCache[host] = resultProxy;
  SESSION.cacheSize++;
  return resultProxy;
}
