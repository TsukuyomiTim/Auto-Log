// ==UserScript==
// @name         Unified Pay Login Panel
// @namespace    unified-pay-login
// @version      2.0.6
// @description  Фиксированная панель аккаунтов: Paycos / HighHelp / WilsonPay. Выход + вход по клику.
// @author       unified
// @match        https://core.paycos.com/*
// @match        https://dashboard.highhelp.io/*
// @match        https://merchant.pspxyz.xyz/*
// @match        https://merchant.wilsonpay.solutions/*
// @downloadURL  https://raw.githubusercontent.com/TsukuyomiTim/Auto-Log/main/Unified-Pay-Login.user.js
// @updateURL    https://raw.githubusercontent.com/TsukuyomiTim/Auto-Log/main/Unified-Pay-Login.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_cookie
// @run-at       document-idle
// ==/UserScript==

(function () {
  "use strict";

  if (window.__unifiedPayLoginLoaded) return;
  window.__unifiedPayLoginLoaded = true;

  // Порядок: CAT, Gama, Daddy, Mers, Kent, R7, Kometa, Arkada, Motor, Atom
  const ACCOUNTS = {
    paycos: [
      { name: "CAT", login: "support_cat@gmali.com", password: "catcasino176574" },
      { name: "Gama", login: "support_gama@gmail.com", password: "gamacasino176574" },
      { name: "Daddy", login: "support_daddy@gmail.com", password: "daddycasino176574" },
      { name: "Mers", login: "support_mers_new@gmail.com", password: "Qwerty123" },
      { name: "Kent", login: "support_kent@gmail.com", password: "kentcasino176574" },
      { name: "R7", login: "support_r7@gmail.com", password: "r7176574" },
      { name: "Kometa", login: "support_kometa@gmail.com", password: "kometa12345" },
      { name: "Arkada", login: "support_arcada@gmali.com", password: "Qwerty123" }
    ],
    highhelp: [
      { name: "CAT", email: "mark.at@velvix.org", password: "PaymentCis", totpSecret: "OQUQQ4XP53HIJOGKSMT77WVD3AYJP5Y6" },
      { name: "Gama", email: "andrii.len@velvix.org", password: "PaymentCis", totpSecret: "BATVT2TWCUUJ7M5WMFFOWCEUSTAFPGPX" },
      { name: "Daddy", email: "nazim.ib@visiongridcore.com", password: "xK0-3o83W_4mx", totpSecret: "JWUQS6JEATKJTNRNRX24E2JDDOSDVEPD" },
      { name: "Mers", email: "Dmitry.Vas@velvix.org", password: "PaymentCis", totpSecret: "BQ26ZVEIP6ISEGBK4FIIY4PZIWEAWBGN" },
      { name: "Kent", email: "Yevhen.Kh@velvix.org", password: "Yevhen.Kh@velvix.org223b", totpSecret: "VWIZX6HKB6ORPEYFWOWKMGJGVDY6O3VX" },
      { name: "R7", email: "Lada.Ko@velvix.org", password: "PaymentCis", totpSecret: "PYP63DBVUUTTTXKMT4KBAXY3YRENVJRL" },
      { name: "Kometa", email: "vladymyr.ts@visiongridcore.com", password: "xK0-3o83W_4mx", totpSecret: "3LPFPOT74VWMIEMQ5BXB5GGCY4WHKPVE" },
      { name: "Arkada", email: "viacheslav.pr@visiongridcore.com", password: "G7v#pL9@xR2q", totpSecret: "3TJPMEJGV5ODCO7INQO43IHK5Z5CKWD7" },
      { name: "Motor", email: "parviz.genji@velvix.org", password: "PaymentCisMotor", totpSecret: "55JPQBOGDVDMGAQWTVCQHJ5H6EUKSVOA" },
      { name: "Atom", email: "turgut.benjamin@velvix.org", password: "NPZ2EQsX3QWUt2H", totpSecret: "5QWN2Z2IAZ3MAWBA2KP6R25D227MKLV2" }
    ],
    wilsonpay: [
      { name: "CAT", username: "Cat_payment", password: "SmLNc8SiApUaE8u!", totpSecret: "6FHFBYHWSHRI52KHPYAKXW6BXLHGQ2SZ" },
      { name: "Gama", username: "Gama_payment", password: "SmLNc8SiApUaE8u!!", totpSecret: "OHSH52NLMHCQD5LSHYEU2MDHLZTRPFT3" },
      { name: "Daddy", username: "Daddy_payment", password: "SmLNc8SiApUaE8u!1", totpSecret: "COWMDUGM5D6IALLZ5LPKQ3GXXXFI2EC3" },
      { name: "Mers", username: "Mers_payment", password: "SmLNc8SiApUaE8u!3", totpSecret: "LC3SSNYCCPDKOSDLIAVI3FIO7ZKN6DFL" },
      { name: "Kent", username: "Kent_payment", password: "SmLNc8SiApUaE8u!6", totpSecret: "NPMIP4MO5IY66WBJRNDISY6GQALS34XR" },
      { name: "R7", username: "R7_payment", password: "SmLNc8SiApUaE8u!2", totpSecret: "7N3Z3HLDMIPFG7W2WRQZIZ7ML2WAVW3D" },
      { name: "Kometa", username: "Kometa_payment", password: "SmLNc8SiApUaE8u!4", totpSecret: "GSTJI7VIKSCG4VKJZJWOVJAZUX5OTL3N" },
      { name: "Arkada", username: "Arkada_payment", password: "SmLNc8SiApUaE8u!5", totpSecret: "3SSVSPZ4KBONI4OOC7D4MYF2P7ILHPYW" },
      { name: "Motor", username: "Motor_payment", password: "SmLNc8SiApUaE8u!8", totpSecret: "UNZCQ5NLGDC7BXC7UWTITDALHDT5DNJ4" },
      { name: "Atom", username: "Atom_payment", password: "SmLNc8SiApUaE8u!7", totpSecret: "HSIV2XSHP745IWFDBWK55A4O3E3CDWKF" }
    ]
  };

  const LOGIN_URLS = {
    paycos: "https://core.paycos.com/support/auth/login",
    highhelp: "https://dashboard.highhelp.io/auth/login",
    wilsonpay: "https://merchant.pspxyz.xyz/login"
  };

  const HOME_URLS = {
    paycos: "https://core.paycos.com/",
    highhelp: "https://dashboard.highhelp.io/",
    wilsonpay: "https://merchant.pspxyz.xyz/"
  };

  function getSite() {
    const host = location.hostname;
    if (host.includes("paycos.com")) return "paycos";
    if (host.includes("highhelp.io")) return "highhelp";
    if (host.includes("pspxyz.xyz") || host.includes("wilsonpay.solutions")) return "wilsonpay";
    return null;
  }

  function isOnLoginPage(site) {
    const path = (location.pathname || "").toLowerCase();
    if (site === "paycos") {
      return path.includes("/support/auth/login") || !!document.querySelector("#signin_email, #signin_password");
    }
    if (site === "highhelp") {
      const onAuthPath = path.includes("/auth/login") || path.includes("/login");
      const hasLoginForm =
        !!document.querySelector("input[type='password']") &&
        !!document.querySelector("input[type='email'], input[name='email']");
      return onAuthPath || hasLoginForm;
    }
    if (site === "wilsonpay") {
      return path.includes("/login") ||
        (!!document.querySelector("input[type='password']") &&
          !!document.querySelector("input:not([type='password']):not([type='hidden'])"));
    }
    return false;
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function setNativeValue(el, value) {
    if (!el) return;
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, "value");
    if (desc && desc.set) desc.set.call(el, value);
    else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function isVisible(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      style.visibility !== "hidden" &&
      style.display !== "none" &&
      style.opacity !== "0"
    );
  }

  function waitForElement(selector, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const tick = () => {
        const el = document.querySelector(selector);
        if (el && isVisible(el)) {
          resolve(el);
          return;
        }
        if (Date.now() - start > timeout) {
          reject(new Error("Timeout: " + selector));
          return;
        }
        setTimeout(tick, 200);
      };
      tick();
    });
  }

  // ===== TOTP =====
  function base32ToBytes(base32) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let bits = "";
    base32 = (base32 || "").replace(/=+$/, "").toUpperCase();
    for (let i = 0; i < base32.length; i++) {
      const val = chars.indexOf(base32.charAt(i));
      if (val === -1) continue;
      bits += val.toString(2).padStart(5, "0");
    }
    const bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
      bytes.push(parseInt(bits.slice(i, i + 8), 2));
    }
    return new Uint8Array(bytes);
  }

  async function hmacSha1(keyBytes, msgBytes) {
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"]
    );
    const sig = await crypto.subtle.sign("HMAC", cryptoKey, msgBytes);
    return new Uint8Array(sig);
  }

  function intToBytes(counter) {
    const b = new Uint8Array(8);
    let x = BigInt(counter);
    for (let i = 7; i >= 0; i--) {
      b[i] = Number(x & 0xffn);
      x >>= 8n;
    }
    return b;
  }

  async function generateTOTP(secret, step = 30, digits = 6, waitFresh = true) {
    if (!secret) return "";
    if (waitFresh) {
      const epoch = Math.floor(Date.now() / 1000);
      const remaining = step - (epoch % step);
      // Ждём только если осталось < 3 сек (не 5) — меньше задержка при переключении
      if (remaining < 3) await sleep((remaining + 1) * 1000);
    }
    const key = base32ToBytes(secret);
    const counter = Math.floor(Date.now() / 1000 / step);
    const hash = await hmacSha1(key, intToBytes(counter));
    const offset = hash[hash.length - 1] & 0x0f;
    const binCode =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);
    return String(binCode % 10 ** digits).padStart(digits, "0");
  }

  // Быстрый опрос OTP-полей (без долгого waitForElement)
  function waitOtpInputs(timeout = 8000) {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        const inputs = findOtpInputs();
        if (inputs.length >= 6) {
          resolve(inputs);
          return;
        }
        if (Date.now() - start > timeout) {
          resolve([]);
          return;
        }
        setTimeout(check, 100);
      };
      check();
    });
  }

  // Поколение логина: старые async-логины (Arkada) отменяются, если выбран CAT
  let loginGen = 0;
  function nextLoginGen() {
    loginGen += 1;
    try {
      GM_setValue("__unified_gen", loginGen);
    } catch (e) {}
    return loginGen;
  }
  function isCurrentGen(gen) {
    let stored = null;
    try {
      stored = GM_getValue("__unified_gen", null);
    } catch (e) {}
    if (stored != null) return Number(stored) === Number(gen);
    return Number(gen) === Number(loginGen);
  }

  // ===== Pending via GM storage (survives navigation) =====
  function urlHasUnified() {
    try {
      if (new URLSearchParams(location.search).get("unified")) return true;
    } catch (e) {}
    if (location.hash && /[#&]unified=/i.test(location.hash)) return true;
    return false;
  }

  function setUnifiedOnUrl(name) {
    try {
      const u = new URL(location.href);
      u.searchParams.set("unified", name);
      u.hash = "";
      history.replaceState(null, "", u.pathname + u.search);
    } catch (e) {}
  }

  function savePending(site, account) {
    const gen = nextLoginGen();
    const data = { site, name: account.name, ts: Date.now(), gen };
    try {
      GM_setValue("__unified_pending", JSON.stringify(data));
      GM_setValue("__unified_target", account.name);
    } catch (e) {
      try {
        localStorage.setItem("__unified_pending", JSON.stringify(data));
        localStorage.setItem("__unified_target", account.name);
      } catch (e2) {}
    }
    setUnifiedOnUrl(account.name);
    return data;
  }

  function loadPendingFromUrl() {
    try {
      const q = new URLSearchParams(location.search).get("unified");
      if (q) return { site: getSite(), name: decodeURIComponent(q), ts: Date.now() };
    } catch (e) {}
    const m = (location.hash || "").match(/#unified=([^&]+)/);
    if (m) return { site: getSite(), name: decodeURIComponent(m[1]), ts: Date.now() };
    return null;
  }

  function loadPending() {
    const fromUrl = loadPendingFromUrl();
    if (fromUrl) return fromUrl;
    return null;
  }

  function clearPending() {
    try {
      GM_deleteValue("__unified_pending");
      GM_deleteValue("__unified_target");
    } catch (e) {}
    try {
      localStorage.removeItem("__unified_pending");
      localStorage.removeItem("__unified_target");
    } catch (e) {}
  }

  function getIntendedName() {
    try {
      const q = new URLSearchParams(location.search).get("unified");
      if (q) return decodeURIComponent(q);
    } catch (e) {}
    const m = (location.hash || "").match(/#unified=([^&]+)/);
    if (m) return decodeURIComponent(m[1]);
    return null;
  }

  function clearAuthStorage() {
    const authKeyRe = /token|auth|session|jwt|access|refresh|user|login|credential|oidc|keycloak|sb-|supabase|persist|redux/i;
    try {
      const toRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && authKeyRe.test(k) && k !== "__unified_pending") toRemove.push(k);
      }
      toRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
    try {
      const toRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && authKeyRe.test(k)) toRemove.push(k);
      }
      toRemove.forEach((k) => sessionStorage.removeItem(k));
    } catch (e) {}
  }

  // Cookies via GM_cookie (Tampermonkey)
  function clearDomainCookiesGM(domain) {
    return new Promise((resolve) => {
      if (typeof GM_cookie === "undefined" || !GM_cookie.list) {
        resolve({ ok: false, reason: "no GM_cookie" });
        return;
      }
      try {
        GM_cookie.list({ domain }, (cookies, error) => {
          if (error || !cookies) {
            resolve({ ok: false, error });
            return;
          }
          let left = cookies.length;
          if (left === 0) {
            resolve({ ok: true, cleared: 0 });
            return;
          }
          let cleared = 0;
          cookies.forEach((c) => {
            GM_cookie.delete({ name: c.name, domain: c.domain, path: c.path || "/" }, () => {
              cleared++;
              left--;
              if (left === 0) resolve({ ok: true, cleared });
            });
          });
        });
      } catch (e) {
        resolve({ ok: false, error: String(e) });
      }
    });
  }

  function findAndClickLogout() {
    const re = /^(logout|log\s*out|sign\s*out|выйти|выход|signout|log off)$/i;
    const candidates = [
      ...document.querySelectorAll("a, button, [role='button'], [role='menuitem']")
    ];
    for (const el of candidates) {
      if (!isVisible(el)) continue;
      const text = (
        el.innerText ||
        el.textContent ||
        el.getAttribute("aria-label") ||
        el.title ||
        ""
      ).trim();
      if (text.length > 0 && text.length < 20 && re.test(text)) {
        el.click();
        return true;
      }
      if (el.href && /logout|signout|sign-out|log-out/i.test(el.href) && !/kass|касс/i.test(el.href)) {
        el.click();
        return true;
      }
    }
    return false;
  }

  async function performLogout(site) {
    findAndClickLogout();
    await sleep(400);
    clearAuthStorage();

    if (site === "highhelp") {
      await clearDomainCookiesGM(".highhelp.io");
      await clearDomainCookiesGM("dashboard.highhelp.io");
      await clearDomainCookiesGM("highhelp.io");
    } else if (site === "wilsonpay") {
      await clearDomainCookiesGM(".pspxyz.xyz");
      await clearDomainCookiesGM("merchant.pspxyz.xyz");
      await clearDomainCookiesGM(".wilsonpay.solutions");
      await clearDomainCookiesGM("merchant.wilsonpay.solutions");
    } else if (site === "paycos") {
      await clearDomainCookiesGM(".paycos.com");
      await clearDomainCookiesGM("core.paycos.com");
    }

    // document.cookie non-HttpOnly
    try {
      const cookies = document.cookie.split(";");
      for (const c of cookies) {
        const name = c.split("=")[0].trim();
        if (!name) continue;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie =
          name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + location.hostname;
        document.cookie =
          name +
          "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." +
          location.hostname.replace(/^www\./, "");
      }
    } catch (e) {}

    if (site === "paycos") {
      window.location.href = "/support/auth/logout";
      setTimeout(() => {
        if (!location.pathname.toLowerCase().includes("/auth/login")) {
          window.location.href = LOGIN_URLS.paycos;
        }
      }, 1600);
      return;
    }

    if (site === "highhelp") {
      const endpoints = [
        "/auth/logout",
        "/api/auth/logout",
        "/logout",
        "/api/logout",
        "/api/v1/auth/logout",
        "/auth/signout"
      ];
      await Promise.all(
        endpoints.map((path) =>
          fetch(path, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store"
          }).catch(() =>
            fetch(path, { method: "GET", credentials: "include", cache: "no-store" }).catch(
              () => null
            )
          )
        )
      );
      clearAuthStorage();
      {
        const intended = getIntendedName();
        const url = intended
          ? LOGIN_URLS.highhelp + "?unified=" + encodeURIComponent(intended)
          : LOGIN_URLS.highhelp;
        window.location.replace(url);
      }
      return;
    }

    if (site === "wilsonpay") {
      const endpoints = ["/logout", "/api/logout", "/auth/logout", "/api/auth/logout"];
      await Promise.all(
        endpoints.map((path) =>
          fetch(path, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
          }).catch(() =>
            fetch(path, { method: "GET", credentials: "include" }).catch(() => null)
          )
        )
      );
      clearAuthStorage();
      window.location.replace(LOGIN_URLS.wilsonpay);
      return;
    }
  }

  function ensureAliveAfterLogin(site) {
    setTimeout(() => {
      try {
        const body = document.body;
        if (!body) {
          window.location.href = HOME_URLS[site] || "/";
          return;
        }
        const text = (body.innerText || "").trim();
        const kids = body.children.length;
        const bg = window.getComputedStyle(body).backgroundColor;
        const isDarkEmpty =
          (kids < 2 && text.length < 20) ||
          (text.length < 5 && (bg === "rgb(0, 0, 0)" || bg === "#000" || bg === "black"));
        if (isDarkEmpty && !isOnLoginPage(site)) {
          window.location.href = HOME_URLS[site] || "/";
        }
      } catch (e) {}
    }, 2500);
    setTimeout(() => {
      try {
        if (!isOnLoginPage(site) && document.body && (document.body.innerText || "").trim().length < 15) {
          window.location.href = HOME_URLS[site] || "/";
        }
      } catch (e) {}
    }, 5000);
  }

  async function loginPaycos(account) {
    const emailInput = await waitForElement("#signin_email", 15000).catch(() => null);
    const passwordInput = await waitForElement("#signin_password", 4000).catch(() => null);
    const loginButton =
      document.querySelector('input[type="submit"][name="commit"]') ||
      document.querySelector('input[type="submit"][value="Log in"]') ||
      document.querySelector('button[type="submit"]');
    if (!emailInput || !passwordInput) {
      console.warn("[Unified] Paycos fields not found");
      return false;
    }
    setNativeValue(emailInput, account.login);
    await sleep(100);
    setNativeValue(passwordInput, account.password);
    await sleep(200);
    if (loginButton) loginButton.click();
    ensureAliveAfterLogin("paycos");
    return true;
  }

  async function loginHighhelp(account, gen) {
    const stillThis = () => {
      const intended = getIntendedName();
      if (intended && intended.toLowerCase() !== account.name.toLowerCase()) {
        console.log("[Unified] HighHelp abort:", account.name, "→ intended", intended);
        return false;
      }
      if (gen != null && !isCurrentGen(gen)) {
        console.log("[Unified] HighHelp abort stale gen", account.name);
        return false;
      }
      return true;
    };

    if (!stillThis()) return false;

    const email = await waitForElement("input[type='email'], input[name='email']", 15000).catch(
      () => null
    );
    const password = await waitForElement("input[type='password']", 6000).catch(() => null);
    if (!stillThis()) return false;
    if (!email || !password) {
      console.warn("[Unified] HighHelp fields not found");
      return false;
    }
    setNativeValue(email, account.email);
    await sleep(80);
    if (!stillThis()) return false;
    setNativeValue(password, account.password);
    await sleep(150);
    if (!stillThis()) return false;

    // Перезаписываем ещё раз на случай автозаполнения браузером (старый Arkada)
    setNativeValue(email, account.email);
    setNativeValue(password, account.password);
    await sleep(80);
    if (!stillThis()) return false;

    const submit = document.querySelector("button[type='submit']");
    if (submit) submit.click();

    const totp = await generateTOTP(account.totpSecret);
    if (!stillThis()) return false;
    if (!totp) {
      ensureAliveAfterLogin("highhelp");
      return true;
    }

    try {
      await waitForElement("input[maxlength='1'][inputmode='numeric']", 20000);
      if (!stillThis()) return false;
      const otpInputs = [
        ...document.querySelectorAll("input[maxlength='1'][inputmode='numeric']")
      ].slice(0, 6);
      if (otpInputs.length === 6) {
        const fresh = await generateTOTP(account.totpSecret, 30, 6, false);
        const code = fresh || totp;
        for (let i = 0; i < 6; i++) {
          if (!stillThis()) return false;
          otpInputs[i].focus();
          setNativeValue(otpInputs[i], code[i] || "");
          await sleep(50);
        }
        await sleep(300);
        if (!stillThis()) return false;
        const modal =
          otpInputs[0].closest('[role="dialog"], .modal, .MuiDialog-root, form') || document;
        const confirmBtn = [...modal.querySelectorAll("button")].find((b) =>
          /подтвердить|confirm|verify|вход|submit|продолжить/i.test(b.innerText || "")
        );
        if (confirmBtn) confirmBtn.click();
        ensureAliveAfterLogin("highhelp");
        return true;
      }
    } catch (e) {}

    if (!stillThis()) return false;
    try {
      const otp = await waitForElement(
        "input[name*='otp'], input[name*='code'], input[autocomplete='one-time-code']",
        12000
      );
      if (!stillThis()) return false;
      setNativeValue(otp, totp);
      const submit2 = document.querySelector("button[type='submit']");
      if (submit2) submit2.click();
    } catch (e) {
      console.warn("[Unified] HighHelp OTP not found");
    }

    ensureAliveAfterLogin("highhelp");
    return true;
  }

  function findOtpInputs() {
    const all = Array.from(document.querySelectorAll("input")).filter(
      (i) => isVisible(i) && !i.disabled && !i.readOnly
    );
    const otpLike = all.filter((i) => Number(i.getAttribute("maxlength") || 0) === 1);
    if (otpLike.length >= 6) return otpLike.slice(0, 6);
    return [];
  }

  async function loginWilsonpay(account) {
    // Ждём поля логина быстрее
    let user = null;
    let pass = null;
    for (let i = 0; i < 40; i++) {
      const candidates = Array.from(document.querySelectorAll("input"))
        .filter((inp) => isVisible(inp))
        .filter((inp) => (inp.type || "").toLowerCase() !== "password")
        .filter((inp) => !inp.disabled && !inp.readOnly);
      const byAuto = candidates.find((inp) => (inp.autocomplete || "").toLowerCase().includes("user"));
      const byName = candidates.find((inp) => /user|login|email/i.test(inp.name || ""));
      const byPlaceholder = candidates.find((inp) =>
        /логин|login|user|email/i.test(inp.placeholder || "")
      );
      user = byAuto || byName || byPlaceholder || candidates[0] || null;
      pass =
        Array.from(document.querySelectorAll('input[type="password"]')).find(
          (inp) => isVisible(inp) && !inp.disabled && !inp.readOnly
        ) || null;
      if (user && pass) break;
      await sleep(150);
    }
    if (!user || !pass) {
      console.warn("[Unified] WilsonPay fields not found");
      return false;
    }

    setNativeValue(user, account.username || "");
    await sleep(60);
    setNativeValue(pass, account.password || "");
    await sleep(80);

    const btn =
      document.querySelector('button[type="submit"]') ||
      [...document.querySelectorAll("button")].find((b) =>
        /login|войти|sign\s*in|вход|submit/i.test(b.innerText || "")
      );
    if (btn) btn.click();

    // OTP: генерируем код ПЕРЕД заполнением (свежий), опрашиваем поля каждые 100мс
    let otpInputs = await waitOtpInputs(10000);
    if (otpInputs.length >= 6) {
      const totpCode = await generateTOTP(account.totpSecret, 30, 6, true);
      if (totpCode) {
        for (let i = 0; i < 6; i++) {
          otpInputs[i].focus();
          setNativeValue(otpInputs[i], totpCode[i] || "");
          await sleep(25);
        }
        await sleep(150);
        const confirm = [...document.querySelectorAll("button")].find((b) =>
          /confirm|verify|подтвердить|submit|войти|вход|continue/i.test(b.innerText || "")
        );
        if (confirm) confirm.click();
      }
    } else {
      // Повторная попытка — иногда OTP появляется позже
      otpInputs = await waitOtpInputs(6000);
      if (otpInputs.length >= 6) {
        const totpCode = await generateTOTP(account.totpSecret, 30, 6, false);
        if (totpCode) {
          for (let i = 0; i < 6; i++) {
            otpInputs[i].focus();
            setNativeValue(otpInputs[i], totpCode[i] || "");
            await sleep(25);
          }
          await sleep(150);
          const confirm = [...document.querySelectorAll("button")].find((b) =>
            /confirm|verify|подтвердить|submit|войти|вход|continue/i.test(b.innerText || "")
          );
          if (confirm) confirm.click();
        }
      }
    }

    // Чёрный экран: проверяем чаще и уходим на home / reload
    const fixBlack = () => {
      try {
        if (getSite() !== "wilsonpay") return;
        if (isOnLoginPage("wilsonpay")) return;
        const body = document.body;
        if (!body) {
          window.location.replace(HOME_URLS.wilsonpay);
          return;
        }
        const text = (body.innerText || "").trim();
        const bg = window.getComputedStyle(body).backgroundColor;
        const kids = body.children.length;
        const empty =
          text.length < 40 ||
          (kids < 3 && text.length < 80) ||
          bg === "rgb(0, 0, 0)" ||
          bg === "rgb(0,0,0)";
        if (empty) {
          console.log("[Unified] WilsonPay blank → home");
          window.location.replace(HOME_URLS.wilsonpay);
        }
      } catch (e) {}
    };
    setTimeout(fixBlack, 1200);
    setTimeout(fixBlack, 2500);
    setTimeout(fixBlack, 4500);
    // Если через 6с всё ещё пусто — hard reload home
    setTimeout(() => {
      try {
        if (getSite() === "wilsonpay" && !isOnLoginPage("wilsonpay")) {
          const t = ((document.body && document.body.innerText) || "").trim();
          if (t.length < 50) window.location.href = HOME_URLS.wilsonpay + "?_=" + Date.now();
        }
      } catch (e) {}
    }, 6000);

    return true;
  }

  let resumeStarted = false;

  async function switchAccount(account, site) {
    try {
      console.log("[Unified] Switch →", account.name, site);
      const pending = savePending(site, account);

      if (!isOnLoginPage(site)) {
        console.log("[Unified] Not on login → logout + redirect");
        await performLogout(site);
        return;
      }

      if (site === "paycos") await loginPaycos(account);
      else if (site === "highhelp") await loginHighhelp(account, pending.gen);
      else if (site === "wilsonpay") await loginWilsonpay(account);
    } catch (e) {
      console.error("[Unified] switch error", e);
    }
  }

  async function resumePendingLogin() {
    if (resumeStarted) return;
    const site = getSite();
    if (!site) return;

    // Ручной выход: на /login без ?unified= — НЕ логиним старый аккаунт из storage
    if (!urlHasUnified()) {
      clearPending();
      return;
    }

    let attempts = 0;
    while (attempts < 30 && !isOnLoginPage(site)) {
      await sleep(250);
      attempts++;
    }
    if (!isOnLoginPage(site)) return;
    if (resumeStarted) return;
    resumeStarted = true;

    const pending = loadPendingFromUrl();
    if (!pending || (pending.site && pending.site !== site)) {
      resumeStarted = false;
      return;
    }

    const accounts = ACCOUNTS[site] || [];
    const account = accounts.find(
      (a) => a.name.toLowerCase() === (pending.name || "").toLowerCase()
    );
    if (!account) {
      clearPending();
      resumeStarted = false;
      return;
    }

    console.log("[Unified] Resume login for", account.name);
    await sleep(400);

    // Ещё раз проверяем цель — вдруг кликнули другой аккаунт
    const intended = getIntendedName() || pending.name;
    const finalAccount =
      accounts.find((a) => a.name.toLowerCase() === String(intended).toLowerCase()) || account;

    if (site === "paycos") await loginPaycos(finalAccount);
    else if (site === "highhelp") await loginHighhelp(finalAccount, pending.gen);
    else if (site === "wilsonpay") await loginWilsonpay(finalAccount);

    clearPending();
  }

  function renderPanel() {
    const site = getSite();
    if (!site) return;
    if (document.getElementById("unified-account-switcher")) return;

    const accounts = ACCOUNTS[site] || [];
    if (!accounts.length) return;

    const container = document.createElement("div");
    container.id = "unified-account-switcher";
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: "2147483647",
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: "4px",
      padding: "5px 8px",
      background: "rgba(255,255,255,0.97)",
      border: "1px solid #ddd",
      borderTop: "none",
      borderRadius: "0 0 8px 8px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      fontFamily: "system-ui, Arial, sans-serif",
      maxWidth: "92vw",
      boxSizing: "border-box",
      pointerEvents: "auto"
    });

    const colors = { paycos: "#43a047", highhelp: "#1e88e5", wilsonpay: "#5c6bc0" };
    const bg = colors[site] || "#555";

    accounts.forEach((account) => {
      const btn = document.createElement("button");
      Object.assign(btn.style, {
        padding: "4px 9px",
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "11px",
        fontWeight: "600",
        lineHeight: "1.3",
        whiteSpace: "nowrap",
        transition: "filter 0.12s"
      });
      btn.textContent = account.name;
      btn.title = account.name;
      btn.onmouseover = () => (btn.style.filter = "brightness(1.12)");
      btn.onmouseout = () => (btn.style.filter = "none");
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        switchAccount(account, site);
      };
      container.appendChild(btn);
    });

    document.documentElement.appendChild(container);
  }

  function init() {
    renderPanel();
    setTimeout(resumePendingLogin, 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  const observer = new MutationObserver(() => {
    if (!document.getElementById("unified-account-switcher")) renderPanel();
  });
  observer.observe(document.documentElement, { childList: true, subtree: false });

  const origPush = history.pushState;
  history.pushState = function () {
    origPush.apply(history, arguments);
    setTimeout(renderPanel, 150);
  };
  const origReplace = history.replaceState;
  history.replaceState = function () {
    origReplace.apply(history, arguments);
    setTimeout(renderPanel, 150);
  };
  window.addEventListener("popstate", () => setTimeout(renderPanel, 150));
})();
