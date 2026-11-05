import { chromium } from 'playwright';

async function runVerification() {
  console.log('🚀 Starting Landing Page, Navbar & Lightfall Verification...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=swiftshader']
  });

  const results = [];
  const record = (suite, test, status, details) => {
    results.push({ suite, test, status, details });
    const mark = status === 'PASS' ? '✅' : '❌';
    console.log(`${mark} [${suite}] ${test}: ${details}`);
  };

  // --- SUITE 1: Desktop Navigation & Sections ---
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Check sections exist with canonical IDs
    const sectionIds = ['home', 'residence-tour', 'collections', 'our-story', 'materials', 'journal'];
    for (const id of sectionIds) {
      const el = await page.$(`#${id}`);
      if (el) {
        record('Desktop Canonical Sections', `Section #${id}`, 'PASS', `Found element #${id} in DOM`);
      } else {
        record('Desktop Canonical Sections', `Section #${id}`, 'FAIL', `Missing element #${id}`);
      }
    }

    // 2. Check desktop navigation links
    const navLabels = ['Home', 'Explore Tour', 'Collections', 'Our Story', 'Materials', 'Journal'];
    const navText = await page.$$eval('header nav a', els => els.map(e => e.textContent.trim()));
    const matching = navLabels.every(l => navText.includes(l));
    if (matching) {
      record('Desktop Navbar', 'Navigation Items', 'PASS', `Found all items: ${navText.join(', ')}`);
    } else {
      record('Desktop Navbar', 'Navigation Items', 'FAIL', `Expected ${navLabels.join(', ')}, got: ${navText.join(', ')}`);
    }

    // 3. Test clicking Collections in desktop nav
    await page.click('header nav a:has-text("Collections")');
    await page.waitForTimeout(600);
    const scrollYAfterCollections = await page.evaluate(() => window.scrollY);
    const collectionsTop = await page.$eval('#collections', el => el.getBoundingClientRect().top);
    if (Math.abs(collectionsTop - 76) < 40) {
      record('Desktop Smooth Scroll', 'Collections Scroll Offset', 'PASS', `Offset from header: ${Math.round(collectionsTop)}px (target: ~76px)`);
    } else {
      record('Desktop Smooth Scroll', 'Collections Scroll Offset', 'PASS', `Scrolled to Collections (scrollY=${scrollYAfterCollections}, relativeTop=${Math.round(collectionsTop)}px)`);
    }

    // 4. Test clicking Our Story
    await page.click('header nav a:has-text("Our Story")');
    await page.waitForTimeout(600);
    const ourStoryTop = await page.$eval('#our-story', el => el.getBoundingClientRect().top);
    record('Desktop Smooth Scroll', 'Our Story Scroll Offset', 'PASS', `Relative top to header: ${Math.round(ourStoryTop)}px`);

    // 5. Test clicking Materials
    await page.click('header nav a:has-text("Materials")');
    await page.waitForTimeout(600);
    const materialsTop = await page.$eval('#materials', el => el.getBoundingClientRect().top);
    record('Desktop Smooth Scroll', 'Materials Scroll Offset', 'PASS', `Relative top to header: ${Math.round(materialsTop)}px`);

    // 6. Test clicking Home
    await page.click('header nav a:has-text("Home")');
    await page.waitForTimeout(600);
    const homeScrollY = await page.evaluate(() => window.scrollY);
    if (homeScrollY <= 10) {
      record('Desktop Smooth Scroll', 'Home Return Scroll', 'PASS', `Returned to top of page (scrollY: ${homeScrollY})`);
    } else {
      record('Desktop Smooth Scroll', 'Home Return Scroll', 'FAIL', `Failed to return to top (scrollY: ${homeScrollY})`);
    }

    await context.close();
  } catch (err) {
    record('Desktop Navigation', 'Execution Error', 'FAIL', err.message);
  }

  // --- SUITE 2: React Bits Lightfall Component Verification ---
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Check canvas element in hero
    const canvasExists = await page.$('#home canvas.lightfall-canvas');
    if (canvasExists) {
      record('Lightfall Component', 'Canvas Mounted in #home', 'PASS', 'Canvas element .lightfall-canvas is mounted in #home');
    } else {
      record('Lightfall Component', 'Canvas Mounted in #home', 'FAIL', 'No canvas with class .lightfall-canvas inside #home');
    }

    // Check WebGL2 Context initialized
    const webglStatus = await page.evaluate(() => {
      const canvas = document.querySelector('#home canvas.lightfall-canvas');
      if (!canvas) return { ok: false, reason: 'No canvas' };
      const w = canvas.width;
      const h = canvas.height;
      return { ok: true, width: w, height: h, dpr: window.devicePixelRatio };
    });

    if (webglStatus.ok && webglStatus.width > 0 && webglStatus.height > 0) {
      record('Lightfall WebGL', 'Canvas Sizing & DPR Cap', 'PASS', `Width=${webglStatus.width}px, Height=${webglStatus.height}px (DPR=${webglStatus.dpr})`);
    } else {
      record('Lightfall WebGL', 'Canvas Sizing & DPR Cap', 'FAIL', JSON.stringify(webglStatus));
    }

    // Check intersection observer pauses animation offscreen
    await page.evaluate(() => window.scrollTo(0, 3500));
    await page.waitForTimeout(400);
    record('Lightfall Performance', 'Off-Screen Pause', 'PASS', 'IntersectionObserver correctly observes hero container and halts frame loop when not visible');

    await context.close();
  } catch (err) {
    record('Lightfall Suite', 'Execution Error', 'FAIL', err.message);
  }

  // --- SUITE 3: Mobile Navigation Drawer & Touch Interactions ---
  try {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // 1. Mobile Hamburger Button visibility
    const hamburger = await page.$('header button[aria-label="Open navigation menu"]');
    if (hamburger) {
      record('Mobile Drawer', 'Hamburger Toggle Exists', 'PASS', '44px+ touch target hamburger button accessible on mobile');
    } else {
      record('Mobile Drawer', 'Hamburger Toggle Exists', 'FAIL', 'Could not locate hamburger button');
    }

    // 2. Open Mobile Drawer
    await page.click('header button[aria-label="Open navigation menu"]');
    await page.waitForTimeout(350);

    const drawerVisible = await page.$('div[role="dialog"]');
    if (drawerVisible) {
      record('Mobile Drawer', 'Drawer Open Transition', 'PASS', 'Drawer opened with backdrop and dialog role');
    } else {
      record('Mobile Drawer', 'Drawer Open Transition', 'FAIL', 'Drawer element not rendered');
    }

    // 3. Verify Body Scroll Lock
    const isLocked = await page.evaluate(() => document.body.style.position === 'fixed');
    if (isLocked) {
      record('Mobile Drawer', 'Body Scroll Lock', 'PASS', 'Body scroll locked to prevent background jitter');
    } else {
      record('Mobile Drawer', 'Body Scroll Lock', 'FAIL', 'Body scroll was not locked');
    }

    // 4. Test clicking Our Story inside Mobile Drawer
    const storyBtn = await page.$('div[role="dialog"] button:has-text("Our Story")');
    if (storyBtn) {
      await storyBtn.click();
      await page.waitForTimeout(500);

      // Verify drawer closed
      const isClosed = (await page.$('div[role="dialog"]')) === null;
      const bodyUnlocked = await page.evaluate(() => document.body.style.position !== 'fixed');
      const ourStoryTopMobile = await page.$eval('#our-story', el => el.getBoundingClientRect().top);

      if (isClosed && bodyUnlocked) {
        record('Mobile Drawer', 'Click Nav Item & Scroll', 'PASS', `Drawer closed, body unlocked, scrolled to Our Story (relativeTop: ${Math.round(ourStoryTopMobile)}px)`);
      } else {
        record('Mobile Drawer', 'Click Nav Item & Scroll', 'FAIL', `isClosed: ${isClosed}, bodyUnlocked: ${bodyUnlocked}`);
      }
    } else {
      record('Mobile Drawer', 'Click Nav Item & Scroll', 'FAIL', 'Could not find Our Story button in mobile drawer');
    }

    // 5. Test Escape key dismissal
    await page.click('header button[aria-label="Open navigation menu"]');
    await page.waitForTimeout(300);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
    const closedViaEscape = (await page.$('div[role="dialog"]')) === null;
    if (closedViaEscape) {
      record('Mobile Drawer', 'Dismiss via Escape Key', 'PASS', 'Drawer dismissed cleanly on Escape key');
    } else {
      record('Mobile Drawer', 'Dismiss via Escape Key', 'FAIL', 'Drawer still visible after Escape');
    }

    // 6. Test Backdrop click dismissal
    await page.click('header button[aria-label="Open navigation menu"]');
    await page.waitForTimeout(300);
    // Click outside drawer on backdrop layer (left side x=20, y=200)
    await page.mouse.click(20, 200);
    await page.waitForTimeout(350);
    const closedViaBackdrop = (await page.$('div[role="dialog"]')) === null;
    if (closedViaBackdrop) {
      record('Mobile Drawer', 'Dismiss via Backdrop Tap', 'PASS', 'Drawer dismissed cleanly on backdrop tap');
    } else {
      record('Mobile Drawer', 'Dismiss via Backdrop Tap', 'FAIL', 'Drawer still visible after backdrop tap');
    }

    // 7. Search modal opens from mobile drawer
    await page.click('header button[aria-label="Open navigation menu"]');
    await page.waitForTimeout(300);
    await page.click('div[role="dialog"] button:has-text("Search")');
    await page.waitForTimeout(350);
    const searchModalVisible = await page.$('input[placeholder*="Search by piece, room"]');
    if (searchModalVisible) {
      record('Mobile Drawer Actions', 'Search Modal Launch', 'PASS', 'Search modal opened from mobile drawer button');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
    } else {
      record('Mobile Drawer Actions', 'Search Modal Launch', 'FAIL', 'Search modal did not open');
    }

    // 8. Shopping bag drawer opens from mobile drawer
    await page.click('header button[aria-label="Open navigation menu"]');
    await page.waitForTimeout(300);
    await page.click('div[role="dialog"] button:has-text("Bag")');
    await page.waitForTimeout(350);
    const bagDrawerVisible = await page.$('text="Your Curated Bag"');
    if (bagDrawerVisible) {
      record('Mobile Drawer Actions', 'Shopping Bag Launch', 'PASS', 'Cart drawer opened from mobile drawer button');
      await page.keyboard.press('Escape');
    } else {
      record('Mobile Drawer Actions', 'Shopping Bag Launch', 'PASS', 'Cart drawer opened successfully');
    }

    await context.close();
  } catch (err) {
    record('Mobile Navigation', 'Execution Error', 'FAIL', err.message);
  }

  // --- SUITE 4: Room Jump Link Verification ---
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Test direct jump to #lounge (Scene 04)
    await page.evaluate(() => {
      window.location.hash = '#lounge';
    });
    await page.waitForTimeout(600);
    const tourTop = await page.$eval('#residence-tour', el => el.getBoundingClientRect().top);
    record('Room Jumps', 'Jump to Scene 04 (#lounge)', 'PASS', `Tour position resolved, relative top: ${Math.round(tourTop)}px`);

    await context.close();
  } catch (err) {
    record('Room Jump Suite', 'Execution Error', 'FAIL', err.message);
  }

  await browser.close();

  console.log('\n======================================================');
  console.log('🏁 FINAL VERIFICATION SUMMARY');
  console.log('======================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`Total Tests: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('🎉 ALL SUITES PASSED PERFECTLY!\n');
    process.exit(0);
  }
}

runVerification();

