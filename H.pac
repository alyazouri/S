// ==================== Bestv8 Ultra - Maximum Jordan Matchmaking ====================
// Version: Ultra v8.0
// Merged & Optimized from Bestv6 + Bestv4 + Advanced Logic
// Goal: Highest Jordan player ratio + Zero leaks + Lowest ping
// ============================================================

// ================= SOCKS PROXIES =================
var MATCH_JO      = "SOCKS 46.185.131.218:20001";   // Primary Match Proxy (Jordan)
var MATCH_JO2     = "SOCKS 46.185.131.218:20002";   // Secondary Match Proxy
var LOBBY_PROXY   = "SOCKS 212.35.66.45:8085";      // Lobby / Social / CDN
var BLOCK         = "SOCKS 127.0.0.1:9";
var DIRECT        = "DIRECT";

// ================= JORDAN MATCH IPV4 (Ultra Strict - Best Matchmaking) =================
var JORDAN_MATCH_IPV4 = [
    ["94.249.0.0",   "255.255.128.0"],   // Orange Core (Best)
    ["86.108.0.0",   "255.255.128.0"],   // Orange Backbone (Best)
    ["92.253.0.0",   "255.255.128.0"],   // Orange
    ["46.185.128.0", "255.255.128.0"],   // Orange ADSL
    ["149.200.128.0","255.255.128.0"],   // Orange ADSL
    ["176.29.0.0",   "255.255.0.0"],     // Umniah
    ["176.28.128.0", "255.255.128.0"],   // Zain
];

// ================= JORDAN WIDE IPV4 (Maximum Coverage) =================
var JORDAN_WIDE_IPV4 = [
    ["94.249.0.0",   "255.255.128.0"],
    ["86.108.0.0",   "255.255.128.0"],
    ["92.253.0.0",   "255.255.128.0"],
    ["46.185.128.0", "255.255.128.0"],
    ["149.200.128.0","255.255.128.0"],
    ["176.29.0.0",   "255.255.0.0"],
    ["176.28.128.0", "255.255.128.0"],
    ["37.202.64.0",  "255.255.192.0"],
    ["79.173.192.0", "255.255.192.0"],
    ["46.32.96.0",   "255.255.224.0"],
    ["46.248.192.0", "255.255.224.0"],
    ["95.172.192.0", "255.255.224.0"],
    ["109.107.224.0","255.255.224.0"],
    ["5.45.128.0",   "255.255.248.0"],
    ["37.123.128.0", "255.255.128.0"],
    ["87.236.232.0", "255.255.248.0"],
    ["176.241.0.0",  "255.255.0.0"],
    ["37.18.0.0",    "255.255.0.0"],
    ["82.212.64.0",  "255.255.192.0"],
    ["213.6.0.0",    "255.255.0.0"],
];

// ================= JORDAN IPV6 RANGES =================
var JORDAN_IPV6 = [
    ["2a02:248::",   "29"],   // Orange Jordan
    ["2a13:8d40::",  "29"],   // Zain Jordan
    ["2a03:6d00::",  "32"],   // Umniah
];

// ================= STRICT JORDAN ISP FILTER =================
function isJordanISP(ip) {
    if (ip.indexOf(":") > -1) {
        // IPv6
        for (var i = 0; i < JORDAN_IPV6.length; i++) {
            if (isInNet(ip, JORDAN_IPV6[i][0], JORDAN_IPV6[i][1])) return true;
        }
        return false;
    }

    // IPv4 - Ultra Strict
    return (
        isInNet(ip, "94.249.0.0",   "255.255.128.0") ||
        isInNet(ip, "86.108.0.0",   "255.255.128.0") ||
        isInNet(ip, "92.253.0.0",   "255.255.128.0") ||
        isInNet(ip, "46.185.128.0", "255.255.128.0") ||
        isInNet(ip, "149.200.128.0","255.255.128.0") ||
        isInNet(ip, "176.29.0.0",   "255.255.0.0") ||
        isInNet(ip, "176.28.128.0", "255.255.128.0") ||
        isInNet(ip, "37.202.64.0",  "255.255.192.0")
    );
}

// ================= ADVANCED SESSION SYSTEM =================
var SESSION = {
    matchNet: null,
    matchHost: null,
    matchTime: 0,
    dnsCache: {}
};

// ================= HELPERS =================
function norm(h) {
    var i = h.indexOf(":");
    return i > -1 ? h.substring(0, i) : h;
}

function isInList(ip, list) {
    for (var i = 0; i < list.length; i++) {
        if (isInNet(ip, list[i][0], list[i][1])) return true;
    }
    return false;
}

function isMatchPort(u) {
    var p = parseInt(u.split(':').pop());
    return (p >= 7000 && p <= 9500);
}

function isUDPFirst(u, h) {
    return isMatchPort(u) || /udp|realtime|tick|sync|frame|state|voice/i.test(u + h);
}

// ================= PUBG DOMAIN ALLOWLIST =================
function isPUBG(host) {
    return (
        shExpMatch(host, "*.pubgmobile.com") ||
        shExpMatch(host, "*.pubgmobile.net") ||
        shExpMatch(host, "*.igamecj.com") ||
        shExpMatch(host, "*.tencent.com") ||
        shExpMatch(host, "*.gcloudcs.com") ||
        shExpMatch(host, "*.qcloud.com") ||
        shExpMatch(host, "*.levelinfinite.com") ||
        shExpMatch(host, "*.krafton.com") ||
        shExpMatch(host, "*.amazonaws.com") ||
        shExpMatch(host, "*.cloudfront.net") ||
        shExpMatch(host, "*.akamaized.net") ||
        shExpMatch(host, "*.akamai.net")
    );
}

// ================= DETECTION (More Aggressive) =================
function isMatch(u, h) {
    return (
        isMatchPort(u) ||
        isUDPFirst(u, h) ||
        /match|battle|game|combat|room|server|logic|join|start/i.test(u + h) ||
        /classic|ranked|arena|tdm|payload|metro|zombie|wow|training|custom|event|team|squad|opponent|kill|death/i.test(u + h)
    );
}

function isLobby(u, h) {
    return /lobby|matchmaking|queue|dispatch|gateway|region|prepare|entry|home/i.test(u + h);
}

function isSocial(u, h) {
    return /friend|invite|squad|team|party|clan|presence|chat|voice|message/i.test(u + h);
}

function isCDN(u, h) {
    return /cdn|asset|resource|patch|update|download|media|pak|obb|config/i.test(u + h);
}

// ================= MAIN FUNCTION =================
function FindProxyForURL(url, host) {

    host = norm(host.toLowerCase());
    if (!isPUBG(host)) return BLOCK;

    var ip = resolvePinned(host);
    if (!ip || ip.indexOf(":") > -1) return BLOCK;

    // ===== STRICT JORDAN ONLY =====
    if (!isJordanISP(ip)) return BLOCK;

    // ===== MATCH (Ultra Strict Session) =====
    if (isMatch(url, host)) {

        if (!isInList(ip, JORDAN_MATCH_IPV4)) return BLOCK;

        var net24 = ip.split('.').slice(0, 3).join('.');

        // Reset session if too old (5 minutes)
        if (SESSION.matchTime > 0 && (Date.now() - SESSION.matchTime) > 300000) {
            SESSION.matchNet = null;
            SESSION.matchHost = null;
        }

        if (!SESSION.matchNet) {
            SESSION.matchNet = net24;
            SESSION.matchHost = host;
            SESSION.matchTime = Date.now();
            return MATCH_JO;
        }

        if (host !== SESSION.matchHost) return BLOCK;
        if (net24 !== SESSION.matchNet) return BLOCK;

        return MATCH_JO;
    }

    // ===== LOBBY (Reset Session) =====
    if (isLobby(url, host)) {
        SESSION.matchNet = null;
        SESSION.matchHost = null;
        SESSION.matchTime = 0;

        if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
        return LOBBY_PROXY;
    }

    // ===== SOCIAL / CDN =====
    if (isSocial(url, host) || isCDN(url, host)) {
        if (!isInList(ip, JORDAN_WIDE_IPV4)) return BLOCK;
        return LOBBY_PROXY;
    }

    return LOBBY_PROXY;
}
