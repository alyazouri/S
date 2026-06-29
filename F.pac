// ============================================================================
// ⭐ VIP PURE JORDAN ESPORTS PAC SCRIPT — IPV4 ONLY EDITION ⭐
// [ 0% IPV6 | 100% JORDAN ROUTING | LOW LATENCY PRIORITY ]
// ============================================================================

// ================= PROXIES =================
var MATCH_JO = "PROXY 212.35.66.45:20005; DIRECT";
var LOBBY_POOL = [
  "PROXY 212.35.66.45:80; DIRECT",
  "PROXY 212.35.66.45:443; DIRECT"
];
var BLOCK  = "PROXY 127.0.0.1:9";
var DIRECT = "DIRECT";

// ================= PURE JORDAN IPV4 NETWORKS =================
var JORDAN_MATCH_IPV4 = [
  ["46.185.128.0",  "255.255.128.0"],   // Orange Fiber Core
  ["92.253.0.0",    "255.255.128.0"],   // Residential FTTH
  ["94.249.0.0",    "255.255.128.0"],   // Home Broadband
  ["176.29.0.0",    "255.255.0.0"],     // Zain Core
  ["46.18.0.0",     "255.255.128.0"],   // Zain Fiber/FWA
  ["178.20.128.0",  "255.255.128.0"],   // Zain Residential
  ["5.21.0.0",      "255.255.128.0"],   // Orange/JTG mix
  ["31.9.0.0",      "255.255.0.0"],     // Umniah Core
  ["82.212.0.0",    "255.255.0.0"],     // Umniah Broadband
  ["62.135.0.0",    "255.255.0.0"]      // Telecom Backbone
];

// ================= GEO BLACKLIST =================
var GEO_BLACKLIST = [
  ["5.0.0.0", "255.0.0.0"], ["31.128.0.0", "255.192.0.0"],
  ["50.0.0.0", "255.0.0.0"], ["51.0.0.0", "255.0.0.0"],
  ["52.0.0.0", "255.0.0.0"], ["104.0.0.0", "255.0.0.0"],
  ["178.64.0.0", "255.192.0.0"], ["185.0.0.0", "255.0.0.0"]
];

// ================= SESSION CACHE =================
var SESSION = {
  dnsCache: {},
  routeCache: {},
  cacheSize: 0,
  matchNet: null,
  matchTime: 0
};

// ================= HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0, i) : h;
}

function isIPv6(ip){
  return false; // 🚫 IPv6 COMPLETELY DISABLED
}

function isInList(ip, list){
  for (var i = 0; i < list.length; i++) {
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

// ================= DNS =================
function resolvePinned(host){
  var now = Date.now();
  if (SESSION.dnsCache[host] && (now - SESSION.dnsCache[host].time < 300000)) {
    return SESSION.dnsCache[host].ip;
  }

  var ip = null;
  try {
    var raw = dnsResolve(host);
    if (raw) ip = raw.split(';')[0];
  } catch(e){}

  if (ip) SESSION.dnsCache[host] = { ip: ip, time: now };
  return ip;
}

// ================= ROUTING =================
function pickLobbyProxy(host){
  var h = 0;
  for (var i = 0; i < host.length; i++) {
    h = (h + host.charCodeAt(i)) % LOBBY_POOL.length;
  }
  return LOBBY_POOL[h];
}

// ================= REGEX =================
var REGEX_MATCH = /match|game|room|battle|arena|tdm|esports|server|play/i;
var REGEX_LOBBY = /lobby|matchmaking|queue|join|hub/i;
var REGEX_SOCIAL = /voice|chat|friend|clan|team/i;
var REGEX_STORE = /shop|store|uc|event|reward/i;
var REGEX_CDN = /cdn|asset|update|patch|map/i;
var REGEX_PUBG = /pubg|tencent|krafton|proximabeta|gcloud/i;

function isPUBG(h){ return REGEX_PUBG.test(h); }
function isMatch(u,h){ return REGEX_MATCH.test(u+h); }
function isLobby(u,h){ return REGEX_LOBBY.test(u+h); }
function isSocial(u,h){ return REGEX_SOCIAL.test(u+h); }
function isStore(u,h){ return REGEX_STORE.test(u+h); }
function isCDN(u,h){ return REGEX_CDN.test(u+h); }

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  if (SESSION.routeCache[host]) {
    return SESSION.routeCache[host];
  }

  if (isPlainHostName(host) || host.indexOf("127.0.0.1") === 0 ||
      host.indexOf("192.168.") === 0 || host.indexOf("10.") === 0) {
    return DIRECT;
  }

  if (!isPUBG(host)) return DIRECT;

  var ip = resolvePinned(host);
  if (!ip) return BLOCK;

  if (isInList(ip, GEO_BLACKLIST)) {
    return BLOCK;
  }

  var proxy = pickLobbyProxy(host);

  if (isMatch(url, host)) {
    if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

    var net = ip.split('.').slice(0,3).join('.');
    if (!SESSION.matchNet || Date.now() - SESSION.matchTime > 2700000) {
      SESSION.matchNet = net;
      SESSION.matchTime = Date.now();
      return MATCH_JO;
    }

    if (net !== SESSION.matchNet) return BLOCK;
    return MATCH_JO;
  }

  if (isLobby(url, host) || isSocial(url, host) ||
      isStore(url, host) || isCDN(url, host)) {
    SESSION.routeCache[host] = proxy;
    return proxy;
  }

  SESSION.routeCache[host] = proxy;
  return proxy;
}
