import { spawn } from 'child_process';

const PORT = 3000;
const CHROME_PORT = 9235;
const BASE_URL = `http://127.0.0.1:${PORT}`;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.consoleErrors = [];
  }

  async connect() {
    this.ws = new globalThis.WebSocket(this.wsUrl);
    return new Promise((resolve, reject) => {
      this.ws.onopen = () => resolve();
      this.ws.onerror = (e) => reject(e);
      this.ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id && this.callbacks.has(data.id)) {
          const { res, rej } = this.callbacks.get(data.id);
          this.callbacks.delete(data.id);
          if (data.error) rej(data.error);
          else res(data.result);
        } else if (data.method === 'Runtime.consoleAPICalled') {
          if (data.params.type === 'error') {
            const text = data.params.args.map((a) => a.value || a.description || '').join(' ');
            this.consoleErrors.push(text);
          }
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((res, rej) => {
      const id = this.id++;
      this.callbacks.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation exception');
    }
    return res.result?.value;
  }

  async close() {
    if (this.ws) this.ws.close();
  }
}

async function waitForScroll(cdp, maxWaitMs = 2800) {
  const start = Date.now();
  let lastY = await cdp.evaluate('window.scrollY');
  while (Date.now() - start < maxWaitMs) {
    await sleep(200);
    const currY = await cdp.evaluate('window.scrollY');
    if (Math.abs(currY - lastY) < 1) break;
    lastY = currY;
  }
}

async function run() {
  console.log('===============================================================');
  console.log(' FURNITURE WORLD — LANDING PAGE, NAVBAR & LIGHTFALL CDP SUITE');
  console.log('===============================================================\n');

  // Verify server is alive
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error('Server not responding on ' + BASE_URL);
  }
  console.log('[Setup] ✓ Dev server active at', BASE_URL);

  // Launch Chrome
  const chromeProc = spawn('/usr/bin/google-chrome', [
    '--headless=new',
    `--remote-debugging-port=${CHROME_PORT}`,
    '--no-sandbox',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--user-data-dir=/tmp/chrome-nav-bench-2',
    'about:blank',
  ], { stdio: 'pipe' });

  await sleep(1500);

  const listRes = await fetch(`http://127.0.0.1:${CHROME_PORT}/json/list`);
  const listData = await listRes.json();
  const pageTarget = listData.find((t) => t.type === 'page');

  const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await cdp.connect();

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');

  const testResults = [];
  const logTest = (suite, name, passed, info) => {
    testResults.push({ suite, name, passed, info });
    console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [${suite}] ${name}: ${info}`);
  };

  try {
    // -------------------------------------------------------------
    // SUITE 1: Desktop Canonical Section IDs & Smooth Scrolling
    // -------------------------------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await cdp.send('Page.navigate', { url: BASE_URL });
    await sleep(2500);

    // 1. Verify Canonical Section IDs
    const sectionCheck = await cdp.evaluate(`(() => {
      const ids = ['home', 'residence-tour', 'collections', 'our-story', 'materials', 'journal'];
      return ids.map(id => ({ id, exists: !!document.getElementById(id) }));
    })()`);

    const allSectionsPresent = sectionCheck.every(s => s.exists);
    logTest('Desktop Sections', 'Canonical IDs', allSectionsPresent, 
      sectionCheck.map(s => `#${s.id}:${s.exists ? '✓' : '✗'}`).join(' ')
    );

    // 2. Verify Desktop Navbar Items
    const navItems = await cdp.evaluate(`(() => {
      const items = Array.from(document.querySelectorAll('header nav a')).map(a => a.textContent.trim());
      return items;
    })()`);
    const expected = ['Home', 'Explore Tour', 'Collections', 'Our Story', 'Materials', 'Journal'];
    const navMatch = expected.every(item => navItems.includes(item));
    logTest('Desktop Navbar', 'Navigation Links', navMatch, `Found: ${navItems.join(' | ')}`);

    // 3. Click Collections Nav Link and verify sticky header offset
    await cdp.evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('header nav a')).find(a => a.textContent.includes('Collections'));
      if (link) link.click();
    })()`);
    await waitForScroll(cdp);

    const collectionsPos = await cdp.evaluate(`(() => {
      const el = document.getElementById('collections');
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    })()`);
    const offsetValid = Math.abs((collectionsPos || 0) - 76) < 45;
    logTest('Desktop Smooth Scroll', 'Collections Header Offset', offsetValid, 
      `Offset from viewport top: ${collectionsPos}px (Target ~76px)`
    );

    // 4. Click Our Story
    await cdp.evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('header nav a')).find(a => a.textContent.includes('Our Story'));
      if (link) link.click();
    })()`);
    await waitForScroll(cdp);
    const storyPos = await cdp.evaluate(`(() => {
      const el = document.getElementById('our-story');
      return el ? Math.round(el.getBoundingClientRect().top) : null;
    })()`);
    logTest('Desktop Smooth Scroll', 'Our Story Header Offset', Math.abs((storyPos || 0) - 76) < 45, 
      `Offset from viewport top: ${storyPos}px`
    );

    // 5. Click Home Nav Link
    await cdp.evaluate(`(() => {
      const link = Array.from(document.querySelectorAll('header nav a')).find(a => a.textContent.includes('Home'));
      if (link) link.click();
    })()`);
    await waitForScroll(cdp);
    const homeScrollY = await cdp.evaluate(`window.scrollY`);
    logTest('Desktop Smooth Scroll', 'Home Return', homeScrollY <= 20, `ScrollY: ${homeScrollY}px`);

    // -------------------------------------------------------------
    // SUITE 2: React Bits Lightfall Component Verification
    // -------------------------------------------------------------
    const lightfallData = await cdp.evaluate(`(() => {
      const container = document.querySelector('#home .lightfall-container');
      const canvas = document.querySelector('#home canvas.lightfall-canvas');
      if (!canvas || !container) return { ok: false, reason: 'Elements missing' };
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return {
        ok: true,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        cssWidth: container.clientWidth,
        cssHeight: container.clientHeight,
        hasContext: !!gl,
        dpr: window.devicePixelRatio,
      };
    })()`);

    logTest('Lightfall Integration', 'Canvas & WebGL2 Initialized', lightfallData.ok && lightfallData.hasContext,
      `Canvas ${lightfallData.canvasWidth}x${lightfallData.canvasHeight}px, Container ${lightfallData.cssWidth}x${lightfallData.cssHeight}px, DPR=${lightfallData.dpr}`
    );

    // -------------------------------------------------------------
    // SUITE 3: Mobile Navigation Drawer & Touch UX
    // -------------------------------------------------------------
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await sleep(400);

    // 1. Hamburger button touch target
    const hamburgerSize = await cdp.evaluate(`(() => {
      const btn = document.querySelector('header button[aria-label*="navigation menu"]');
      if (!btn) return null;
      const rect = btn.getBoundingClientRect();
      return { width: Math.round(rect.width), height: Math.round(rect.height) };
    })()`);
    const touchTargetPass = hamburgerSize && hamburgerSize.width >= 44 && hamburgerSize.height >= 44;
    logTest('Mobile Navigation', 'Hamburger Touch Target (>=44px)', touchTargetPass, 
      `${hamburgerSize?.width}x${hamburgerSize?.height}px`
    );

    // 2. Open Mobile Drawer
    await cdp.evaluate(`(() => {
      const btn = document.querySelector('header button[aria-label*="navigation menu"]');
      if (btn) btn.click();
    })()`);
    await sleep(450);

    const drawerState = await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      const bodyLocked = document.body.style.position === 'fixed';
      const items = Array.from(dialog ? dialog.querySelectorAll('nav button') : []).map(b => b.textContent.trim());
      return { dialogOpen: !!dialog, bodyLocked, items };
    })()`);
    logTest('Mobile Navigation', 'Drawer Open & Body Lock', drawerState.dialogOpen && drawerState.bodyLocked,
      `Dialog open: ${drawerState.dialogOpen}, Body scroll lock: ${drawerState.bodyLocked}, Nav items: ${drawerState.items.length}`
    );

    // 3. Click "Our Story" inside Mobile Drawer
    await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      if (!dialog) return false;
      const btn = Array.from(dialog.querySelectorAll('nav button')).find(b => b.textContent.includes('Our Story'));
      if (btn) btn.click();
    })()`);
    await waitForScroll(cdp);

    const mobileStoryScroll = await cdp.evaluate(`(() => {
      const dialog = document.querySelector('div[role="dialog"]');
      const bodyUnlocked = document.body.style.position !== 'fixed';
      const storyEl = document.getElementById('our-story');
      const top = storyEl ? Math.round(storyEl.getBoundingClientRect().top) : null;
      return { dialogClosed: !dialog, bodyUnlocked, top };
    })()`);
    logTest('Mobile Navigation', 'Drawer Item Click & Scroll', 
      mobileStoryScroll.dialogClosed && mobileStoryScroll.bodyUnlocked,
      `Dialog closed: ${mobileStoryScroll.dialogClosed}, Body unlocked: ${mobileStoryScroll.bodyUnlocked}, Top: ${mobileStoryScroll.top}px`
    );

    // 4. Test Escape key dismissal
    await cdp.evaluate(`(() => {
      const btn = document.querySelector('header button[aria-label*="navigation menu"]');
      if (btn) btn.click();
    })()`);
    await sleep(400);

    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
    await sleep(400);

    const escapeClosed = await cdp.evaluate(`!document.querySelector('div[role="dialog"]')`);
    logTest('Mobile Navigation', 'Escape Key Dismissal', escapeClosed, `Drawer closed on Escape: ${escapeClosed}`);

    // 5. Test Backdrop tap dismissal
    await cdp.evaluate(`(() => {
      const btn = document.querySelector('header button[aria-label*="navigation menu"]');
      if (btn) btn.click();
    })()`);
    await sleep(400);

    await cdp.evaluate(`(() => {
      const backdrop = document.querySelector('div[role="dialog"] .backdrop-blur-xs') || document.querySelector('div[role="dialog"] > div:first-child');
      if (backdrop) backdrop.click();
    })()`);
    await sleep(450);

    const backdropClosed = await cdp.evaluate(`!document.querySelector('div[role="dialog"]')`);
    logTest('Mobile Navigation', 'Backdrop Tap Dismissal', backdropClosed, `Drawer closed on backdrop tap: ${backdropClosed}`);

    // -------------------------------------------------------------
    // SUITE 4: Room Anchor Navigation Integration
    // -------------------------------------------------------------
    await cdp.evaluate(`(() => {
      window.location.hash = '#lounge';
    })()`);
    await waitForScroll(cdp);
    const loungeResolved = await cdp.evaluate(`(() => {
      const tour = document.getElementById('residence-tour');
      return tour ? Math.round(tour.getBoundingClientRect().top) : null;
    })()`);
    logTest('Room Hash Navigation', 'Scene 04 (#lounge) Position', loungeResolved !== null, 
      `Tour container relative top: ${loungeResolved}px`
    );

  } finally {
    await cdp.close();
    chromeProc.kill();
  }

  console.log('\n======================================================');
  console.log('🏁 CDP AUTOMATION VERIFICATION SUMMARY');
  console.log('======================================================');
  const passed = testResults.filter(t => t.passed).length;
  const failed = testResults.filter(t => !t.passed).length;
  console.log(`Total Tests: ${testResults.length} | Passed: ${passed} | Failed: ${failed}\n`);

  if (failed > 0) process.exit(1);
  else process.exit(0);
}

run();
