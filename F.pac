// ============================================================================
// ⭐ MIDDLE EAST LOCKED PAC — JORDAN OPTIMIZED ESPORTS ROUTING ⭐
// [ NO EU ROUTES | NO ASIA ROUTES | HIGH ARAB PLAYER POOL PRIORITY ]
// ============================================================================

var MATCH_JO = "PROXY 212.35.66.45:20005; DIRECT";
var LOBBY = "PROXY 212.35.66.45:443; DIRECT";
var DIRECT = "DIRECT";
var BLOCK = "PROXY 127.0.0.1:9";

// ================= JORDAN + ME REGION CORE NETWORKS =================
var ME_CORE_IPV4 = [
  ["5.21.0.0",      "255.255.128.0"],   // Orange Jordan
  ["31.9.0.0",      "255.255.0.0"],     // Umniah
  ["37.202.64.0",   "255.255.192.0"],   // JTG / Orange FTTH
  ["46.18.0.0",     "255.255.128.0"],   // Zain
  ["46.185.128.0",  "255.255.128.0"],   // Orange Fiber
  ["62.135.0.0",    "255.255.0.0"],     // Telecom backbone
  ["82.212.0.0",    "255.255.0.0"],     // Umniah
  ["94.249.128.0",  "255.255.128.0"],   // Residential ME pool
  ["176.29.0.0",    "255.255.0.0"],     // Zain core
  ["178.20.128.0",  "255.255.128.0"],   // Zain residential
  ["188.247.0.0",   "255.255.0.0"]      // Orange backbone
];

// ================= STRICT NON-ME BLOCKLIST =================
var BLOCK_REGIONS = [
  ["5.0.0.0", "255.0.0.0"],     // EU partial / misc
  ["31.128.0.0", "255.192.0.0"],
  ["50.0.0.0", "255.0.0.0"],
  ["51.0.0.0", "255.0.0.0"],
  ["52.0.0.0", "255.0.0.0"],     // AWS EU/US
  ["104.0.0.0", "255.0.0.0"],    // Cloudflare US
  ["129.0.0.0", "255.0.0.0"],    // EU mixed
  ["149.0.0.0", "255.0.0.0"],
  ["151.0.0.0", "255.0.0.0"],
  ["185.0.0.0", "255.0.0.0"],    // Europe hosting
  ["188.0.0.0", "255.0.0.0"]
];

// ================= MATCH / GAME DETECTION =================
var REGEX_GAME = /pubg|tencent|krafton|proximabeta|match|game|battle|room|arena|tdm|esports/i;
var REGEX_LIVE = /lobby|matchmaking|queue|join|server|play/i;
var REGEX_SOCIAL = /voice|chat|friend|clan|team/i;
var REGEX_CDN = /cdn|asset|update|patch|map/i;

// ================= HELPERS =================
function norm(h){
  var i = h.indexOf(":");
  return i > -1 ? h.substring(0,i) : h;
}

function isInList(ip, list){
  for (var i=0;i<list.length;i++){
    if (isInNet(ip, list[i][0], list[i][1])) return true;
  }
  return false;
}

function resolve(host){
  try {
    return dnsResolve(host);
  } catch(e){
    return null;
  }
}

function pickProxy(host){
  return (host.length % 2 === 0) ? MATCH_JO : LOBBY;
}

// ================= MAIN =================
function FindProxyForURL(url, host) {

  host = norm(host.toLowerCase());

  if (isPlainHostName(host) ||
      host.indexOf("127.0.0.1") === 0 ||
      host.indexOf("192.168.") === 0 ||
      host.indexOf("10.") === 0) {
    return DIRECT;
  }

  if (!REGEX_GAME.test(host)) {
    return DIRECT;
  }

  var ip = resolve(host);
  if (!ip) return BLOCK;

  // 🚫 BLOCK ALL NON MIDDLE EAST ROUTES
  if (isInList(ip, BLOCK_REGIONS)) {
    return BLOCK;
  }

  // 🎯 FORCE MIDDLE EAST MATCH POOL
  if (REGEX_GAME.test(host)) {
    if (!isInList(ip, ME_CORE_IPV4)) {
      return BLOCK; // يمنع EU / Asia routing
    }
    return MATCH_JO;
  }

  // 🎮 lobby / social / cdn
  if (REGEX_LIVE.test(host) || REGEX_SOCIAL.test(host) || REGEX_CDN.test(host)) {
    return LOBBY;
  }

  return MATCH_JO;
}
