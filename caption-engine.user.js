// ==UserScript==
// @name         YouTube Caption Styler
// @namespace    walamo.youtube.captions
// @version      6.3
// @description  Professional YouTube caption engine with native scaling and advanced effects.
// @match        https://www.youtube.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @exclude      https://www.youtube.com/live_chat*
// @exclude      https://www.youtube.com/live_chat_replay*
// @run-at       document-idle
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

(function () {
  'use strict';

  const defaults = {
    bgRed: 0, bgGreen: 0, bgBlue: 0,
    bgRed2: 0, bgGreen2: 0, bgBlue2: 0,
    bgOpacity: 25,
    radius: 35, padX: 5, padY: 5, blur: 0,
    textRed: 255, textGreen: 255, textBlue: 255,
    textShadow: 50, textShadowOpacity: 90, textShadowBlur: 15,
    textShadowDistanceX: 0, textShadowDistanceY: 2, textShadowSpread: 0,
    outlineRed: 0, outlineGreen: 0, outlineBlue: 0,
    fontFamily: 'inherit', fontWeight: 400, fontScale: 100, letterSpacing: 0, lineHeight: 120,
    fontStyle: 'normal', textDecoration: 'none', textTransform: 'none', fontStretch: 'normal',
    fontVariant: 'normal', textRendering: 'auto', whiteSpace: 'normal',
    textAlign: 'center',
    borderOpacity: 0, borderWidth: 0,
    glassBorder: 0, glassShine: 0, glassGlow: 0, glassTint: 0, glassDepth: 0, glassRefraction: 0,
    glowRed: 255, glowGreen: 255, glowBlue: 255,
    fontGlowBoost: 0,
    fontGlowRed: 255, fontGlowGreen: 255, fontGlowBlue: 255,
    vPos: 0, hPos: 0, maxWidth: 100,
    panelTheme: 'Dark', basicMode: 0,
    panelBgImg: '', panelBgOpacity: 55, panelOpacity: 100, panelGradAngle: 135, panelBgFade: 0, panelBgFadeStart: 0, panelBgFadeEnd: 100, panelBgBlur: 0,
    // Last Word Highlight
    lastWordHighlight: 0,
    highlightRed: 255,
    highlightGreen: 220,
    highlightBlue: 0,
    highlightOpacity: 28,
    highlightBorderOpacity: 80,
    highlightBorderWidth: 2,
    highlightRadius: 8,
    highlightPadX: 5,
    highlightPadY: 2,
    highlightGlow: 12,
    // Reading Focus Mode
    readingFocus: 0,
    readingFocusOldOpacity: 35,
    readingFocusCurrentOpacity: 100,
    // Caption Cleanup
    captionCleanup: 0,
    cleanupSpeakerArrows: 0,
    cleanupBrackets: 0,
    cleanupParens: 0,
    cleanupLyrics: 0,
    cleanupSpeakers: 0,
    cleanupStutters: 0,
    cleanupCustomEnabled: 0,
    cleanupCustomRegex: '',
    // Smart Filler Removal
    fillerRemoval: 0,
    fillerMode: 0,
    fillerOpacity: 35,
    // Whisper Mode
    whisperMode: 0,
    whisperScale: 78,
    whisperOpacity: 60,
    whisperLighten: 35,
    whisperAudioDetect: 1,
    whisperAudioThreshold: 20,
    // Layout
    maxLines: 0, lineClamp: 0, wordBreak: 'normal',
    // Smart Contrast
    smartContrast: 0, smartMode: 'caption', smartBgBoost: 20, smartOutlineBoost: 50, smartShadowBoost: 30, smartDarkBgReduction: 20, smartDarkGlowBoost: 30, smartFreq: 1000, smartPerf: 1,
    idleOpacity: 40,
    enableIdleFade: 0,
    secondaryShadowX: 2,
    secondaryShadowY: 2,
    secondaryShadowBlur: 8,
    secondaryShadowOpacity: 50,
    secShadowRed: 0,
    secShadowGreen: 0,
    secShadowBlue: 0,
    fontFavorites: [],
    recentFonts: [],
    customFonts: [],
  };

  let currentLuma = 128; // Global for UI status

  const glassStyles = {
    'Off': { glassBorder: 0, glassShine: 0, glassGlow: 0, glassTint: 0, glassDepth: 0, glassRefraction: 0 },
    'Apple Liquid Glass': { glassBorder: 100, glassShine: 100, glassGlow: 30, glassTint: 20, glassDepth: 60, glassRefraction: 80, blur: 15 },
    'Frosted': { glassBorder: 40, glassShine: 20, glassGlow: 0, glassTint: 10, glassDepth: 0, glassRefraction: 20, blur: 10, bgOpacity: 40 },
    'Acrylic': { glassBorder: 20, glassShine: 10, glassGlow: 0, glassTint: 5, glassDepth: 10, glassRefraction: 40, blur: 20, bgOpacity: 60 },
    'Glossy': { glassBorder: 60, glassShine: 80, glassGlow: 40, glassTint: 0, glassDepth: 30, glassRefraction: 10, blur: 0 },
    'Crystal': { glassBorder: 90, glassShine: 100, glassGlow: 20, glassTint: 0, glassDepth: 10, glassRefraction: 100, blur: 0 },
  };

  const presets = {
    'Default': { bgOpacity: 75, radius: 4, padX: 10, padY: 4, fontFamily: 'inherit', fontWeight: 400, fontScale: 100, textAlign: 'center' },
    'TikTok Captions': { bgRed: 36, bgGreen: 36, bgBlue: 37, bgRed2: 36, bgGreen2: 36, bgBlue2: 37, bgOpacity: 100, radius: 26, padX: 30, padY: 20, blur: 0, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 0, textShadowBlur: 0, textShadowDistanceX: 0, textShadowDistanceY: 0, textShadowSpread: 0, fontFamily: 'Helvetica, sans-serif', fontWeight: 400, fontScale: 100, textAlign: 'left', lineHeight: 100 },
    'Apple Liquid Glass': { bgRed: 40, bgGreen: 45, bgBlue: 55, bgOpacity: 25, radius: 120, padX: 45, padY: 25, blur: 15, glassBorder: 100, glassShine: 100, glassGlow: 30, glassTint: 20, glassDepth: 60, glassRefraction: 80, fontScale: 100, textAlign: 'center' },
    'Netflix': { bgRed: 0, bgGreen: 0, bgBlue: 0, bgOpacity: 75, radius: 0, padX: 12, padY: 6, blur: 0, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 60, textShadowBlur: 4, textShadowDistanceY: 2, fontWeight: 400, fontFamily: 'Helvetica, Arial, sans-serif', fontScale: 100, textAlign: 'center' },
    'Blu-Ray': { bgOpacity: 0, textRed: 255, textGreen: 255, textBlue: 230, textShadowOpacity: 100, textShadowBlur: 0, textShadowDistanceX: 1, textShadowDistanceY: 1, textShadowSpread: 1, outlineRed: 0, outlineGreen: 0, outlineBlue: 0, fontFamily: 'Arial, sans-serif', letterSpacing: 1, fontScale: 100, textAlign: 'center' },
    'Crunchyroll': { bgOpacity: 0, textRed: 255, textGreen: 220, textBlue: 0, textShadowOpacity: 100, textShadowBlur: 0, textShadowSpread: 2, textShadowDistanceX: 1, textShadowDistanceY: 1, outlineRed: 0, outlineGreen: 0, outlineBlue: 0, fontWeight: 400, fontFamily: '"Trebuchet MS", sans-serif', fontScale: 100, textAlign: 'center' },
    'Anime Fansub': { bgOpacity: 0, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 0, textShadowSpread: 2, outlineRed: 0, outlineGreen: 0, outlineBlue: 0, fontWeight: 400, fontFamily: 'Arial, sans-serif', fontScale: 100, textAlign: 'center' },
    'YouTube Classic (2014)': { bgRed: 0, bgGreen: 0, bgBlue: 0, bgOpacity: 60, radius: 2, padX: 6, padY: 2, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 0, fontWeight: 400, fontFamily: 'Roboto, Arial, sans-serif', fontScale: 90, textAlign: 'center' },
    'TikTok Classic': { bgOpacity: 0, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 0, textShadowDistanceX: 2, textShadowDistanceY: 2, outlineRed: 255, outlineGreen: 0, outlineBlue: 80, fontWeight: 900, vPos: 20, fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', fontScale: 100, secondaryShadowOpacity: 100, secondaryShadowX: -2, secondaryShadowY: -2, secondaryShadowBlur: 0, secShadowRed: 0, secShadowGreen: 242, secShadowBlue: 234, textAlign: 'center' },
    'VHS': { bgRed: 0, bgGreen: 0, bgBlue: 40, bgOpacity: 80, radius: 0, padX: 15, padY: 5, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 10, outlineRed: 0, outlineGreen: 255, outlineBlue: 255, fontFamily: '"Courier New", monospace', fontScale: 110, textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: 2, textAlign: 'center' },
    'Terminal': { bgRed: 0, bgGreen: 20, bgBlue: 0, bgOpacity: 90, radius: 4, padX: 15, padY: 8, textRed: 50, textGreen: 255, textBlue: 50, textShadowOpacity: 80, textShadowBlur: 5, outlineRed: 0, outlineGreen: 150, outlineBlue: 0, fontFamily: 'monospace', fontScale: 95, borderWidth: 1, borderOpacity: 30, textAlign: 'left' },
    'Manga Reader': { bgRed: 255, bgGreen: 255, bgBlue: 255, bgOpacity: 100, radius: 0, padX: 10, padY: 5, textRed: 0, textGreen: 0, textBlue: 0, textShadowOpacity: 0, fontWeight: 700, fontFamily: '"Trebuchet MS", sans-serif', fontScale: 105, borderWidth: 3, borderOpacity: 100, textAlign: 'center' },
    'Movie Theater': { bgOpacity: 0, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 2, textShadowDistanceY: 2, fontWeight: 400, fontFamily: 'serif', fontScale: 120, letterSpacing: 1, textAlign: 'center' },
    'Subway Surfers Brainrot': { bgRed: 255, bgGreen: 255, bgBlue: 0, bgOpacity: 100, radius: 50, padX: 30, padY: 15, textRed: 255, textGreen: 0, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 0, textShadowDistanceX: 4, textShadowDistanceY: 4, outlineRed: 0, outlineGreen: 0, outlineBlue: 0, fontWeight: 900, fontFamily: 'system-ui', fontScale: 150, textTransform: 'uppercase', fontStyle: 'italic', textAlign: 'center' },
    'Nordic Minimalism': { bgRed: 240, bgGreen: 240, bgBlue: 240, bgOpacity: 95, radius: 12, padX: 20, padY: 10, textRed: 40, textGreen: 40, textBlue: 40, textShadowOpacity: 0, fontWeight: 300, fontFamily: 'Helvetica, Arial, sans-serif', fontScale: 90, letterSpacing: 1, textAlign: 'center' },
    'Windows XP': { bgRed: 0, bgGreen: 80, bgBlue: 200, bgOpacity: 100, radius: 8, padX: 10, padY: 5, textRed: 255, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 2, textShadowDistanceY: 2, outlineRed: 0, outlineGreen: 0, outlineBlue: 100, fontWeight: 700, fontFamily: 'Tahoma, sans-serif', fontScale: 100, borderWidth: 2, borderOpacity: 100, textAlign: 'center' },
    'Steam Deck': { bgRed: 26, bgGreen: 26, bgBlue: 26, bgOpacity: 95, radius: 4, padX: 15, padY: 8, textRed: 235, textGreen: 235, textBlue: 235, textShadowOpacity: 0, fontWeight: 400, fontFamily: 'system-ui, sans-serif', fontScale: 100, borderWidth: 1, borderOpacity: 20, letterSpacing: 0.5, textAlign: 'center' },
    'Cyberpunk': { bgRed: 20, bgGreen: 10, bgBlue: 30, bgOpacity: 85, radius: 0, padX: 20, padY: 10, blur: 5, textRed: 0, textGreen: 255, textBlue: 255, textShadowOpacity: 100, textShadowBlur: 10, textShadowDistanceX: 3, textShadowDistanceY: 3, outlineRed: 255, outlineGreen: 0, outlineBlue: 255, textShadowSpread: 1, glassGlow: 100, glowRed: 0, glowGreen: 255, glowBlue: 255, borderWidth: 2, borderOpacity: 100, fontFamily: 'monospace', textTransform: 'uppercase', fontScale: 110, letterSpacing: 2, secondaryShadowOpacity: 80, secondaryShadowX: -3, secondaryShadowY: -3, secondaryShadowBlur: 0, secShadowRed: 255, secShadowGreen: 20, secShadowBlue: 147, textAlign: 'center' },
  };

  const settings = {};
  for (const key in defaults) { settings[key] = GM_getValue(key, defaults[key]); }
  const customPresets = GM_getValue('customPresets', {});

  function saveCustomPreset(name) { customPresets[name] = { ...settings }; GM_setValue('customPresets', customPresets); }
  function deleteCustomPreset(name) { delete customPresets[name]; GM_setValue('customPresets', customPresets); }

  const PRESET_PRESERVED = ['panelTheme', 'basicMode', 'fontFavorites', 'recentFonts', 'customFonts', 'cleanupCustomRegex', 'captionCleanup', 'fillerRemoval', 'whisperMode', 'readingFocus', 'lastWordHighlight'];

  function applyPresetValues(p) {
    if (!p) return;
    for (const k in defaults) {
      if (PRESET_PRESERVED.includes(k)) continue;
      applySetting(k, (p[k] !== undefined) ? p[k] : defaults[k]);
    }
  }

  function applyRandomStyle() {
    const pool = { ...presets, ...customPresets };
    const names = Object.keys(pool);
    if (!names.length) return null;
    const name = names[Math.floor(Math.random() * names.length)];
    applyPresetValues(pool[name]);
    return name;
  }

  let ttPolicy;
  try {
    ttPolicy = window.trustedTypes?.createPolicy('walamo-policy', { createHTML: (s) => s });
  } catch (e) {
    ttPolicy = { createHTML: (s) => s };
  }

  function setHTML(el, html) {
    if (el) el.innerHTML = ttPolicy.createHTML(html);
  }

  const SYSTEM_FONTS = ['Arial', 'Verdana', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New', 'monospace', 'sans-serif', 'serif', 'system-ui'];
  const GOOGLE_FONTS_BASE = ['Inter', 'Roboto', 'Noto Sans', 'Poppins', 'Mona Sans', 'IBM Plex Sans'];

  function loadGoogleFont(family) {
    const id = `walamo-font-${family.replace(/\s+/g, '-').toLowerCase()}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`;
    document.head.appendChild(link);
  }

  async function loadCustomFont(name, url) {
    try {
      const font = new FontFace(name, `url(${url})`);
      await font.load();
      document.fonts.add(font);
      return true;
    } catch (e) {
        console.error('Font load failed:', name, url, e);
        return false;
    }
  }

  function initFontPicker(triggerEl, onSelect) {
    let modal = document.querySelector('#walamo-font-picker-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'walamo-font-picker-modal';
        setHTML(modal, `
            <div class="walamo-font-picker-content">
                <div class="walamo-font-picker-header">
                    <input type="text" class="walamo-font-picker-search" placeholder="Search fonts (e.g. Roboto)...">
                </div>
                <div class="walamo-font-picker-body"></div>
                <div class="walamo-font-custom-input">
                    <input type="text" id="walamo-custom-font-name" placeholder="Font Name (e.g. Geist)">
                    <input type="text" id="walamo-custom-font-url" placeholder="URL (WOFF2/TTF) or leave empty for Google Font">
                    <div style="display:flex; gap:10px;">
                        <button class="walamo-action-btn" id="walamo-custom-font-save" style="flex:1; background:var(--walamo-panel-accent);">Add Font</button>
                        <button class="walamo-action-btn" id="walamo-custom-font-cancel" style="flex:1;">Cancel</button>
                    </div>
                </div>
                <div class="walamo-font-picker-footer">
                    <div style="font-size:11px; opacity:0.6;">Tip: Use arrows to navigate</div>
                    <button class="walamo-font-add-btn">+ Add Custom</button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
        
        modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
        const addBtn = modal.querySelector('.walamo-font-add-btn');
        const customInput = modal.querySelector('.walamo-font-custom-input');
        const body = modal.querySelector('.walamo-font-picker-body');
        
        addBtn.onclick = () => { customInput.classList.add('active'); body.style.display = 'none'; };
        modal.querySelector('#walamo-custom-font-cancel').onclick = () => { customInput.classList.remove('active'); body.style.display = 'block'; };
        
        modal.querySelector('#walamo-custom-font-save').onclick = async () => {
            const name = modal.querySelector('#walamo-custom-font-name').value.trim();
            const url = modal.querySelector('#walamo-custom-font-url').value.trim();
            if (!name) return;
            
            const newFont = { name, url, type: url ? 'url' : 'google' };
            settings.customFonts.push(newFont);
            GM_setValue('customFonts', settings.customFonts);
            
            if (url) await loadCustomFont(name, url);
            else loadGoogleFont(name);
            
            renderFonts();
            customInput.classList.remove('active');
            body.style.display = 'block';
        };
    }

    const body = modal.querySelector('.walamo-font-picker-body');
    const search = modal.querySelector('.walamo-font-picker-search');
    
    const renderFonts = () => {
        const query = search.value.toLowerCase();
        setHTML(body, '');
        
        const categories = [
            { title: 'Favorites', fonts: settings.fontFavorites },
            { title: 'Recently Used', fonts: settings.recentFonts },
            { title: 'Custom Fonts', fonts: settings.customFonts.map(f => f.name) },
            { title: 'Google Fonts', fonts: GOOGLE_FONTS_BASE },
            { title: 'System Fonts', fonts: SYSTEM_FONTS }
        ];

        categories.forEach(cat => {
            const filtered = cat.fonts.filter(f => f.toLowerCase().includes(query));
            if (filtered.length === 0) return;
            
            const catDiv = document.createElement('div');
            catDiv.className = 'walamo-font-category';
            setHTML(catDiv, `<div class="walamo-font-category-title">${cat.title}</div>`);
            
            filtered.forEach(font => {
                if (cat.title === 'Google Fonts' || (cat.title === 'Custom Fonts' && !settings.customFonts.find(cf => cf.name === font)?.url)) {
                    loadGoogleFont(font);
                }
                
                const item = document.createElement('div');
                item.className = 'walamo-font-item';
                if (settings.fontFamily === font) item.classList.add('active');
                
                const isFav = settings.fontFavorites.includes(font);
                setHTML(item, `
                    <div class="font-info">
                        <div class="font-family-name">${font}</div>
                        <div class="font-sample" style="font-family: '${font}', sans-serif;">The quick brown fox jumps over the lazy dog</div>
                    </div>
                    <div class="favorite-toggle ${isFav ? 'active' : ''}">★</div>
                `);
                
                item.onclick = (e) => {
                    if (e.target.classList.contains('favorite-toggle')) {
                        if (isFav) settings.fontFavorites = settings.fontFavorites.filter(f => f !== font);
                        else settings.fontFavorites.push(font);
                        GM_setValue('fontFavorites', settings.fontFavorites);
                        renderFonts();
                        return;
                    }
                    
                    settings.recentFonts = [font, ...settings.recentFonts.filter(f => f !== font)].slice(0, 5);
                    GM_setValue('recentFonts', settings.recentFonts);
                    onSelect(font);
                    modal.classList.remove('active');
                };
                
                catDiv.appendChild(item);
            });
            body.appendChild(catDiv);
        });
    };

    search.oninput = renderFonts;
    triggerEl.onclick = () => {
        modal.classList.add('active');
        search.value = '';
        renderFonts();
        setTimeout(() => search.focus(), 50);
    };
    
    // Keyboard Nav
    search.onkeydown = (e) => {
        const items = body.querySelectorAll('.walamo-font-item');
        let index = Array.from(items).findIndex(it => it.classList.contains('focused'));
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items.forEach(it => it.classList.remove('focused'));
            index = (index + 1) % items.length;
            items[index].classList.add('focused');
            items[index].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items.forEach(it => it.classList.remove('focused'));
            index = (index - 1 + items.length) % items.length;
            items[index].classList.add('focused');
            items[index].scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter' && index !== -1) {
            items[index].click();
        }
    };
  }

  function lightenRgb(r, g, b, amount) {
    const t = Math.max(0, Math.min(100, amount ?? 0)) / 100;
    return [
      Math.round((r ?? 255) + (255 - (r ?? 255)) * t),
      Math.round((g ?? 255) + (255 - (g ?? 255)) * t),
      Math.round((b ?? 255) + (255 - (b ?? 255)) * t)
    ];
  }

  function rgbToHex(r, g, b) { const f = (n) => { const h = Math.max(0, Math.min(255, Math.floor(n || 0))).toString(16); return h.length === 1 ? '0' + h : h; }; return "#" + f(r) + f(g) + f(b); }
  function hexToRgb(hex) { const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex); return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 0, g: 0, b: 0 }; }
  function hexToRgba(hex, alpha) {
    const { r, g, b } = hexToRgb(hex.trim());
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function generateTextShadow() {
    const x = settings.textShadowDistanceX ?? 0, y = settings.textShadowDistanceY ?? 0, blur = settings.textShadowBlur ?? 0, opacity = (settings.textShadowOpacity ?? 0) / 100, spread = settings.textShadowSpread ?? 0;
    const r = settings.outlineRed ?? 0, g = settings.outlineGreen ?? 0, b = settings.outlineBlue ?? 0;
    const color = `rgba(${r},${g},${b},${opacity})`;

    let shadows = [];
    if (spread === 0) {
        shadows.push(`${x}px ${y}px ${blur}px ${color}`);
    } else {
        for (let i = -spread; i <= spread; i++) {
            for (let j = -spread; j <= spread; j++) {
                if (i === 0 && j === 0) continue;
                shadows.push(`${x + i}px ${y + j}px ${blur}px ${color}`);
            }
        }
    }

    // Advanced Shadow Layering
    if (settings.secondaryShadowOpacity > 0) {
        const sr = settings.secShadowRed ?? 0, sg = settings.secShadowGreen ?? 0, sb = settings.secShadowBlue ?? 0;
        const sColor = `rgba(${sr},${sg},${sb},${settings.secondaryShadowOpacity / 100})`;
        shadows.push(`${settings.secondaryShadowX}px ${settings.secondaryShadowY}px ${settings.secondaryShadowBlur}px ${sColor}`);
    }

    if ((settings.fontGlowBoost ?? 0) > 0) {
        const gr = settings.fontGlowRed ?? 255, gg = settings.fontGlowGreen ?? 255, gb = settings.fontGlowBlue ?? 255;
        const boost = settings.fontGlowBoost / 100;
        const blur1 = Math.max(2, boost * 20);
        const blur2 = Math.max(4, boost * 40);
        shadows.push(`0 0 ${blur1}px rgba(${gr},${gg},${gb},${boost})`);
        shadows.push(`0 0 ${blur2}px rgba(${gr},${gg},${gb},${boost * 0.45})`);
    }

    return shadows.join(', ');
  }

  let lastWordHighlightEls = [];
  let lastWordHighlightFrame = 0;

  function clearLastWordHighlight() {
    for (const el of lastWordHighlightEls) el.remove();
    lastWordHighlightEls = [];
  }

  function scheduleLastWordHighlight() {
    if (lastWordHighlightFrame) return;
    lastWordHighlightFrame = requestAnimationFrame(() => {
        lastWordHighlightFrame = 0;
        drawLastWordHighlight();
    });
  }

  function getLastWordRange(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) { return (node.nodeValue && /\S/.test(node.nodeValue)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
    });
    let lastNode = null, lastMatch = null;
    while (walker.nextNode()) {
        const node = walker.currentNode;
        const text = node.nodeValue;
        const matches = [...text.matchAll(/\S+/g)];
        if (matches.length) { lastNode = node; lastMatch = matches[matches.length - 1]; }
    }
    if (!lastNode || !lastMatch) return null;
    const range = document.createRange();
    range.setStart(lastNode, lastMatch.index);
    range.setEnd(lastNode, lastMatch.index + lastMatch[0].length);
    return range;
  }

  function drawLastWordHighlight() {
    clearLastWordHighlight();
    if (settings.lastWordHighlight !== 1) return;
    const captions = document.querySelector('.ytp-caption-window-container .captions-text') || document.querySelector('.ytp-caption-window-container');
    if (!captions) return;
    const range = getLastWordRange(captions);
    if (!range) return;
    const rect = range.getBoundingClientRect();
    if (!rect || rect.width <= 0 || rect.height <= 0) return;
    const padX = settings.highlightPadX ?? 5, padY = settings.highlightPadY ?? 2;
    const highlight = document.createElement('span');
    highlight.className = 'walamo-last-word-highlight';
    Object.assign(highlight.style, {
        left: `${rect.left - padX}px`,
        top: `${rect.top - padY}px`,
        width: `${rect.width + padX * 2}px`,
        height: `${rect.height + padY * 2}px`
    });
    const parent = document.fullscreenElement || document.body;
    parent.appendChild(highlight);
    lastWordHighlightEls.push(highlight);
  }

  let readingFocusFrame = 0;
  let captionTextFrame = 0;
  let captionProcessing = false;
  let whisperTextUntil = 0;
  let whisperAudioUntil = 0;
  let audioCtx = null;
  let audioAnalyser = null;
  let audioSourceVideo = null;

  const WHISPER_TEXT_PATTERN = /\((whispering|whispers|whisper|whispered|quietly|mumbling|mumbles|softly|soft|under breath|in a whisper)\)|\[(whispering|whispers|whisper|whispered|quietly|mumbling|mumbles|softly|soft|under breath|in a whisper)\]/i;

  const FILLER_PATTERN = /\b(uh+h?|um+m?|uhm|you know|like)\b/gi;
  const FILLER_WORD = '(uh+h?|um+m?|uhm|you know|like)';
  const SENTENCE_START_FILLER = new RegExp(`^([\\t\\n\\r\\f\\v ]*)\\b${FILLER_WORD}\\b[\\t\\n\\r\\f\\v ]*`, 'i');
  const AFTER_PUNCT_FILLER = new RegExp(`([.!?][\\t\\n\\r\\f\\v ]+)\\b${FILLER_WORD}\\b[\\t\\n\\r\\f\\v ]*`, 'gi');

  function updateStreamStateFromText(text, state) {
    for (let i = text.length - 1; i >= 0; i--) {
      const ch = text[i];
      if (/[.!?]/.test(ch)) {
        state.atSentenceStart = true;
        return;
      }
      if (/[^\s\u00A0]/.test(ch)) {
        state.atSentenceStart = false;
        return;
      }
    }
  }

  function capitalizeNextLetter(text, state) {
    if (!state.capNext) return text;
    return text.replace(/^([\t\n\r\f\v \u00A0]*)([a-z])/, (_, spaces, letter) => {
      state.capNext = false;
      return spaces + letter.toUpperCase();
    });
  }

  function removeFillersFromText(text, state) {
    let t = text;

    if (state.atSentenceStart) {
      const m = t.match(SENTENCE_START_FILLER);
      if (m) {
        t = m[1] + t.slice(m[0].length);
        if (!t.trim()) t = m[1] || ' ';
        state.capNext = true;
      }
    }

    t = t.replace(AFTER_PUNCT_FILLER, (_, boundary) => {
      state.capNext = true;
      return boundary;
    });

    FILLER_PATTERN.lastIndex = 0;
    t = collapseSpaces(t.replace(FILLER_PATTERN, ' '));
    t = capitalizeNextLetter(t, state);
    return t;
  }

  function getCaptionLines() {
    const container = document.querySelector('.ytp-caption-window-container');
    if (!container) return [];

    let lines = Array.from(container.querySelectorAll('.caption-visual-line'));
    if (lines.length) return lines;

    const captionsText = container.querySelector('.captions-text');
    if (captionsText) {
      lines = Array.from(captionsText.children).filter(el =>
        el.querySelector('.ytp-caption-segment') || el.classList.contains('ytp-caption-segment')
      );
      if (lines.length) return lines;
    }

    const segments = Array.from(container.querySelectorAll('.ytp-caption-segment'));
    if (segments.length <= 1) return segments.length ? [segments[0].closest('.caption-visual-line') || segments[0].parentElement || segments[0]] : [];

    const groups = [];
    let lastTop = null;
    let current = null;
    for (const seg of segments) {
      const top = Math.round(seg.getBoundingClientRect().top);
      if (lastTop === null || Math.abs(top - lastTop) > 2) {
        current = { el: seg.closest('.caption-visual-line') || seg.parentElement || seg, top };
        groups.push(current);
        lastTop = top;
      }
    }
    return groups.map(g => g.el).filter(Boolean);
  }

  function scheduleReadingFocus() {
    if (readingFocusFrame) return;

    readingFocusFrame = requestAnimationFrame(() => {
      readingFocusFrame = 0;
      applyReadingFocus();
    });
  }

  function applyReadingFocus() {
    const container = document.querySelector('.ytp-caption-window-container');
    if (!container) return;

    container.querySelectorAll('.walamo-focus-old, .walamo-focus-current').forEach(el => {
      el.classList.remove('walamo-focus-old', 'walamo-focus-current');
    });

    if (settings.readingFocus !== 1) return;

    const lines = getCaptionLines();
    if (lines.length === 0) return;

    lines.forEach((line, index) => {
      const cls = index === lines.length - 1 ? 'walamo-focus-current' : 'walamo-focus-old';
      line.classList.add(cls);
      if (!line.matches?.('.ytp-caption-segment')) {
        line.querySelectorAll('.ytp-caption-segment').forEach(seg => seg.classList.add(cls));
      }
    });
  }

  function collapseSpaces(text) {
    return text.replace(/[\t\n\r\f\v ]{2,}/g, ' ');
  }

  function cleanCaptionText(text) {
    if (settings.captionCleanup !== 1) return text;
    let t = text;
    const sp = ' ';
    if (settings.cleanupSpeakerArrows === 1) t = t.replace(/>>\s*/g, sp);
    if (settings.cleanupBrackets === 1) t = t.replace(/\[[^\]]*\]/g, sp);
    if (settings.cleanupParens === 1) t = t.replace(/\([^)]*\)/g, sp);
    if (settings.cleanupLyrics === 1) t = t.replace(/♪[^♪]*♪/g, sp);
    if (settings.cleanupSpeakers === 1) t = t.replace(/\b[A-Z]+[A-Z0-9\s]*:\s*/g, sp);
    if (settings.cleanupStutters === 1) {
      const STUTTER_PATTERN = /\b(a|an|the|in|on|at|to|of|and|I|you|we|they|this|it|is|are|was|were)(?:\s+\1)+\b/gi;
      t = t.replace(STUTTER_PATTERN, '$1');
    }
    if (settings.cleanupCustomEnabled === 1 && settings.cleanupCustomRegex) {
      try { t = t.replace(new RegExp(settings.cleanupCustomRegex, 'gi'), sp); } catch (e) {}
    }
    return collapseSpaces(t);
  }

  function removeFillers(text) {
    return removeFillersFromText(text, { atSentenceStart: true, capNext: false });
  }

  function dimFillers(text) {
    FILLER_PATTERN.lastIndex = 0;
    return text.replace(FILLER_PATTERN, m => `<span class="walamo-filler-dim">${m}</span>`);
  }

  function processCaptionTextNode(node, streamState) {
    if (node.parentElement?.closest('.walamo-filler-dim')) return;

    let text = cleanCaptionText(node.nodeValue);

    if (settings.fillerRemoval === 1) {
      if (settings.fillerMode === 1) {
        text = capitalizeNextLetter(text, streamState);
        const html = dimFillers(text);
        if (html !== text) {
          const wrapper = document.createElement('span');
          setHTML(wrapper, html);
          node.parentNode.replaceChild(wrapper, node);
          updateStreamStateFromText(text, streamState);
          return;
        }
      } else {
        text = removeFillersFromText(text, streamState);
      }
    } else {
      text = capitalizeNextLetter(text, streamState);
    }

    if (text !== node.nodeValue) node.nodeValue = text;
    updateStreamStateFromText(text, streamState);
  }

  function collectCaptionTextNodes(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!n.nodeValue || !n.parentElement?.closest('.ytp-caption-segment')) return NodeFilter.FILTER_REJECT;
        if (n.parentElement.closest('.walamo-filler-dim')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function applyCaptionTextProcessing() {
    if (settings.captionCleanup !== 1 && settings.fillerRemoval !== 1) return;
    const container = document.querySelector('.ytp-caption-window-container');
    if (!container) return;

    captionProcessing = true;
    try {
      const streamState = { atSentenceStart: true, capNext: false };
      collectCaptionTextNodes(container).forEach(node => processCaptionTextNode(node, streamState));

      container.querySelectorAll('.ytp-caption-segment').forEach(seg => {
        if (!seg.textContent.trim()) {
          if (seg.textContent.length) seg.textContent = '\u00A0';
          else seg.style.display = 'none';
        } else {
          seg.style.display = '';
        }
      });
    } finally {
      captionProcessing = false;
    }
  }

  function scheduleCaptionTextProcessing() {
    if (captionTextFrame) return;
    captionTextFrame = requestAnimationFrame(() => {
      captionTextFrame = 0;
      applyCaptionTextProcessing();
    });
  }

  function initWhisperAudio() {
    if (audioAnalyser || settings.whisperMode !== 1 || settings.whisperAudioDetect !== 1) return;
    const video = document.querySelector('video');
    if (!video) return;
    try {
      audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(video);
      audioAnalyser = audioCtx.createAnalyser();
      audioAnalyser.fftSize = 256;
      source.connect(audioAnalyser);
      audioAnalyser.connect(audioCtx.destination);
      audioSourceVideo = video;
    } catch (e) {
      audioAnalyser = null;
      audioSourceVideo = null;
    }
  }

  function getAudioVolumePercent() {
    if (!audioAnalyser) return null;
    if (audioCtx?.state === 'suspended') audioCtx.resume().catch(() => {});
    const data = new Uint8Array(audioAnalyser.frequencyBinCount);
    audioAnalyser.getByteFrequencyData(data);
    let sum = 0;
    for (let i = 0; i < data.length; i++) sum += data[i];
    return (sum / data.length / 255) * 100;
  }

  function setWhisperActive(active) {
    const container = document.querySelector('.ytp-caption-window-container');
    if (container) container.classList.toggle('walamo-whisper-active', active);
  }

  function updateWhisperMode() {
    if (settings.whisperMode !== 1) {
      setWhisperActive(false);
      return;
    }

    initWhisperAudio();
    const container = document.querySelector('.ytp-caption-window-container');
    const rawText = container?.textContent || '';
    if (WHISPER_TEXT_PATTERN.test(rawText)) whisperTextUntil = Date.now() + 4000;

    let active = Date.now() < whisperTextUntil;

    if (!active && settings.whisperAudioDetect === 1) {
      const vol = getAudioVolumePercent();
      const video = document.querySelector('video');
      if (vol !== null && video && !video.paused && !video.muted) {
        if (vol < (settings.whisperAudioThreshold ?? 20)) whisperAudioUntil = Date.now() + 800;
        else whisperAudioUntil = 0;
      }
      if (Date.now() < whisperAudioUntil) active = true;
    }

    setWhisperActive(active);
  }

  function handleCaptionMutation() {
    if (captionProcessing) return;
    updateWhisperMode();
    scheduleLastWordHighlight();
    scheduleReadingFocus();
    scheduleCaptionTextProcessing();
  }

  const captionObserver = new MutationObserver(handleCaptionMutation);

  function applySetting(key, value, skipSave = false) {
    if (key === undefined) return;
    settings[key] = (typeof value === 'string' && !isNaN(value) && value !== "") ? Number(value) : value;
    if (!skipSave) GM_setValue(key, settings[key]);
    const root = document.documentElement, s = settings;
    try {
      // Smart Contrast Boosts
      let bgBoost = 0, shBoost = 0, otBoost = 0, glBoost = 0;
      if (s.smartContrast) {
        if (currentLuma > 128) {
          const factor = (currentLuma - 128) / 127;
          bgBoost = factor * s.smartBgBoost;
          shBoost = factor * s.smartShadowBoost;
          otBoost = factor * s.smartOutlineBoost;
        } else {
          const factor = (128 - currentLuma) / 128;
          bgBoost = -factor * s.smartDarkBgReduction;
          glBoost = factor * s.smartDarkGlowBoost;
        }
      }

      // Caption Styles
      const opacity = Math.max(0, Math.min(100, (s.bgOpacity ?? 0) + bgBoost)) / 100;
      const bg = `linear-gradient(180deg, rgba(${s.bgRed ?? 0}, ${s.bgGreen ?? 0}, ${s.bgBlue ?? 0}, ${opacity}) 0%, rgba(${s.bgRed2 ?? 0}, ${s.bgGreen2 ?? 0}, ${s.bgBlue2 ?? 0}, ${opacity}) 100%)`;
      root.style.setProperty('--walamo-caption-bg', bg);
      root.style.setProperty('--walamo-caption-radius', `${(s.radius ?? 0) / 100}em`);
      root.style.setProperty('--walamo-caption-pad-x', `${(s.padX ?? 0) / 100}em`);
      root.style.setProperty('--walamo-caption-pad-y', `${(s.padY ?? 0) / 100}em`);
      root.style.setProperty('--walamo-caption-blur', `${s.blur ?? 0}px`);
      root.style.setProperty('--walamo-text-color', `rgb(${s.textRed ?? 255}, ${s.textGreen ?? 255}, ${s.textBlue ?? 255})`);
      
      // Shadow with Smart Boost
      const saveSh = s.textShadowOpacity;
      settings.textShadowOpacity = Math.min(100, (s.textShadowOpacity ?? 0) + shBoost);
      root.style.setProperty('--walamo-text-shadow', generateTextShadow());
      settings.textShadowOpacity = saveSh;

      root.style.setProperty('--walamo-font-family', s.fontFamily ?? 'inherit');
      root.style.setProperty('--walamo-font-weight', s.fontWeight ?? 400);
      root.style.setProperty('--walamo-font-scale', (s.fontScale ?? 100) / 100);
      root.style.setProperty('--walamo-letter-spacing', `${(s.letterSpacing ?? 0) / 100}em`);
      root.style.setProperty('--walamo-line-height', `${s.lineHeight ?? 120}%`);
      root.style.setProperty('--walamo-font-style', s.fontStyle ?? 'normal');
      root.style.setProperty('--walamo-text-decoration', s.textDecoration ?? 'none');
      root.style.setProperty('--walamo-text-transform', s.textTransform ?? 'none');
      root.style.setProperty('--walamo-font-stretch', s.fontStretch ?? 'normal');
      root.style.setProperty('--walamo-font-variant', s.fontVariant ?? 'normal');
      root.style.setProperty('--walamo-text-rendering', s.textRendering ?? 'auto');
      root.style.setProperty('--walamo-white-space', s.whiteSpace ?? 'normal');
      root.style.setProperty('--walamo-text-align', s.textAlign ?? 'center');
      if ((s.glassBorder ?? 0) > 0) {
        root.style.setProperty('--walamo-glass-border-gradient', `linear-gradient(180deg, rgba(255,255,255, ${(s.glassBorder / 100) * 0.25}), rgba(255,255,255, ${(s.glassBorder / 100) * 0.05}))`);
        root.style.setProperty('--walamo-border-width', '1px');
        root.style.setProperty('--walamo-border-color', 'transparent');
      } else {
        root.style.setProperty('--walamo-glass-border-gradient', 'transparent');
        root.style.setProperty('--walamo-border-width', `${s.borderWidth ?? 0}px`);
        root.style.setProperty('--walamo-border-color', `rgba(255,255,255,${Math.min(100, (s.borderOpacity ?? 0) + otBoost) / 100})`);
      }
      if ((s.glassShine ?? 0) > 0) {
        root.style.setProperty('--walamo-glass-specular', `linear-gradient(180deg, rgba(255,255,255, ${(s.glassShine / 100) * 0.20}), rgba(255,255,255, ${(s.glassShine / 100) * 0.03}) 30%, transparent 70%)`);
      } else {
        root.style.setProperty('--walamo-glass-specular', 'transparent');
      }
      root.style.setProperty('--walamo-glass-border', (s.glassBorder ?? 0) / 100);
      root.style.setProperty('--walamo-glass-shine', (s.glassShine ?? 0) / 100);
      root.style.setProperty('--walamo-glass-glow', Math.min(100, (s.glassGlow ?? 0) + glBoost) / 100);
      root.style.setProperty('--walamo-glass-tint', (s.glassTint ?? 0) / 100);
      root.style.setProperty('--walamo-glass-depth', (s.glassDepth ?? 0) / 100);
      root.style.setProperty('--walamo-glass-refraction', (s.glassRefraction ?? 0) / 100);
      root.style.setProperty('--walamo-glow-color', `rgb(${s.glowRed ?? 255}, ${s.glowGreen ?? 255}, ${s.glowBlue ?? 255})`);
      root.style.setProperty('--walamo-v-pos', `${s.vPos ?? 0}px`);
      root.style.setProperty('--walamo-h-pos', `${s.hPos ?? 0}px`);
      root.style.setProperty('--walamo-max-width', `${s.maxWidth ?? 100}%`);
      root.style.setProperty('--walamo-idle-opacity', (s.idleOpacity ?? 40) / 100);

      // Last Word Highlight Vars
      root.style.setProperty('--walamo-highlight-color', `${s.highlightRed ?? 255}, ${s.highlightGreen ?? 220}, ${s.highlightBlue ?? 0}`);
      root.style.setProperty('--walamo-highlight-opacity', (s.highlightOpacity ?? 28) / 100);
      root.style.setProperty('--walamo-highlight-border-opacity', (s.highlightBorderOpacity ?? 80) / 100);
      root.style.setProperty('--walamo-highlight-border-width', `${s.highlightBorderWidth ?? 2}px`);
      root.style.setProperty('--walamo-highlight-radius', `${s.highlightRadius ?? 8}px`);
      root.style.setProperty('--walamo-highlight-glow', `${s.highlightGlow ?? 12}px`);
      root.style.setProperty('--walamo-focus-old-opacity', (s.readingFocusOldOpacity ?? 35) / 100);
      root.style.setProperty('--walamo-focus-current-opacity', (s.readingFocusCurrentOpacity ?? 100) / 100);
      root.style.setProperty('--walamo-filler-opacity', (s.fillerOpacity ?? 35) / 100);
      const [wr, wg, wb] = lightenRgb(s.textRed, s.textGreen, s.textBlue, s.whisperLighten ?? 35);
      root.style.setProperty('--walamo-whisper-scale', (s.whisperScale ?? 78) / 100);
      root.style.setProperty('--walamo-whisper-opacity', (s.whisperOpacity ?? 60) / 100);
      root.style.setProperty('--walamo-whisper-color', `rgb(${wr}, ${wg}, ${wb})`);
      scheduleLastWordHighlight();
      scheduleReadingFocus();
      scheduleCaptionTextProcessing();
      updateWhisperMode();

      // Panel Styles
      root.style.setProperty('--walamo-panel-bg-alpha', (s.panelBgOpacity ?? 55) / 100);
      root.style.setProperty('--walamo-panel-bg-img', s.panelBgImg ? `url("${s.panelBgImg}")` : 'none');
      root.style.setProperty('--walamo-panel-bg-img-opacity', s.panelBgImg ? (s.panelBgOpacity ?? 55) / 100 : 0);
      root.style.setProperty('--walamo-panel-bg-fade-start', `${s.panelBgFadeStart ?? 0}%`);
      root.style.setProperty('--walamo-panel-bg-fade-end', `${s.panelBgFadeEnd ?? 100}%`);
      root.style.setProperty('--walamo-panel-bg-blur', `${s.panelBgBlur ?? 0}px`);
      root.style.setProperty('--walamo-panel-bg-blur-factor', `${(s.panelBgBlur ?? 0) / 100}`);
      const panel = document.querySelector('#walamo-caption-panel');
      if (panel) {
        panel.style.opacity = (s.panelOpacity ?? 100) / 100;
        panel.classList.toggle('walamo-panel-bg-fade', s.panelBgFade === 1);
        const theme = s.panelTheme?.toLowerCase() || 'dark';
        let bgLayers = [];

        if (['nebula', 'midnight', 'emerald', 'crimson'].includes(theme)) {
            const colors = { nebula: '#0f0c29, #302b63, #24243e', midnight: '#090909, #1a1a2e', emerald: '#061712, #012e24', crimson: '#1a0505, #4a0e0e' }[theme];
            const alpha = (s.panelBgOpacity ?? 55) / 100;
            const rgbaStops = colors.split(',').map(c => hexToRgba(c, alpha)).join(', ');
            bgLayers.push(`linear-gradient(${s.panelGradAngle ?? 135}deg, ${rgbaStops})`);
            panel.style.backgroundColor = 'transparent';
        } else if (['glass', 'lightglass'].includes(theme)) {
            panel.style.backgroundColor = 'transparent';
        } else {
            panel.style.backgroundColor = '';
        }
        panel.style.backgroundImage = bgLayers.length ? bgLayers.join(', ') : 'none';
      }
    } catch (e) { console.error('Walamo Apply Error:', e); }
  }

  GM_addStyle(`
    /* Last Word Highlight */
    .walamo-last-word-highlight { position: fixed; box-sizing: border-box; pointer-events: none; z-index: 2147483646; background: rgba(var(--walamo-highlight-color), var(--walamo-highlight-opacity)); border: var(--walamo-highlight-border-width) solid rgba(var(--walamo-highlight-color), var(--walamo-highlight-border-opacity)); border-radius: var(--walamo-highlight-radius); box-shadow: 0 0 var(--walamo-highlight-glow) rgba(var(--walamo-highlight-color), var(--walamo-highlight-border-opacity)); mix-blend-mode: screen; }

    /* Reading Focus Mode */
    .caption-visual-line.walamo-focus-old .ytp-caption-segment,
    .ytp-caption-segment.walamo-focus-old {
      opacity: var(--walamo-focus-old-opacity) !important;
    }

    .caption-visual-line.walamo-focus-current .ytp-caption-segment,
    .ytp-caption-segment.walamo-focus-current {
      opacity: var(--walamo-focus-current-opacity) !important;
    }

    /* Smart Filler Dim */
    .walamo-filler-dim {
      opacity: var(--walamo-filler-opacity) !important;
    }

    /* Whisper Mode */
    .ytp-caption-window-container.walamo-whisper-active .ytp-caption-segment {
      font-size: calc(2.2em * var(--walamo-font-scale) * var(--walamo-whisper-scale)) !important;
      opacity: var(--walamo-whisper-opacity) !important;
      color: var(--walamo-whisper-color) !important;
      font-weight: 300 !important;
    }
    
    :root { --walamo-panel-bg: #181818; --walamo-panel-text: #fff; --walamo-panel-accent: #3ea6ff; --walamo-panel-border: #333; --walamo-panel-bg-alpha: 1; --walamo-focus-old-opacity: 0.35; --walamo-focus-current-opacity: 1; --walamo-filler-opacity: 0.35; --walamo-whisper-scale: 0.78; --walamo-whisper-opacity: 0.6; --walamo-whisper-color: rgb(220, 220, 220); }

    .caption-window {
        background: transparent !important;
        overflow: visible !important;
        translate: var(--walamo-h-pos) var(--walamo-v-pos) !important;
        max-width: var(--walamo-max-width) !important;
        text-align: var(--walamo-text-align) !important;
        display: -webkit-box !important;
        -webkit-box-orient: vertical !important;
        -webkit-line-clamp: var(--walamo-max-lines) !important;
    }

    /* Removed Backdrop Mask */

    .ytp-caption-segment {
      position: relative !important; display: inline-block !important; color: var(--walamo-text-color) !important; background: var(--walamo-caption-bg) padding-box, var(--walamo-glass-border-gradient, transparent) border-box !important; border-radius: var(--walamo-caption-radius) !important; padding: var(--walamo-caption-pad-y) var(--walamo-caption-pad-x) !important; box-decoration-break: clone !important; -webkit-box-decoration-break: clone !important; backdrop-filter: blur(var(--walamo-caption-blur)); -webkit-backdrop-filter: blur(var(--walamo-caption-blur)); text-shadow: var(--walamo-text-shadow) !important;
      font-family: var(--walamo-font-family) !important; font-weight: var(--walamo-font-weight) !important; font-style: var(--walamo-font-style) !important; text-decoration: var(--walamo-text-decoration) !important; text-transform: var(--walamo-text-transform) !important; font-stretch: var(--walamo-font-stretch) !important; font-variant: var(--walamo-font-variant) !important; text-rendering: var(--walamo-text-rendering) !important; 
      white-space: var(--walamo-white-space) !important; word-break: var(--walamo-word-break) !important;
      font-size: calc(2.2em * var(--walamo-font-scale)) !important; letter-spacing: var(--walamo-letter-spacing) !important; line-height: var(--walamo-line-height) !important; border: var(--walamo-border-width) solid var(--walamo-border-color) !important;
      box-shadow: inset 0 1px 0 rgba(255,255,255, calc(.25 * var(--walamo-glass-shine))), inset 0 -1px 0 rgba(255,255,255, calc(.05 * var(--walamo-glass-shine))), inset 0 0 12px rgba(255,255,255, calc(.06 * var(--walamo-glass-glow))), inset 0 -1px 0 rgba(0,0,0, calc(.35 * var(--walamo-glass-depth))), 0 1px calc(4px * var(--walamo-glass-depth)) rgba(0,0,0, calc(.45 * var(--walamo-glass-depth))), 0 0 calc(18px * var(--walamo-glass-glow)) var(--walamo-glow-color) !important;
      transition: opacity 0.3s ease;
    }

    /* Disable font scaling in inline previews (front page hover) */
    ytd-browse[page-subtype="home"] .ytp-caption-segment,
    #inline-preview-player .ytp-caption-segment,
    .ytd-video-preview .ytp-caption-segment,
    .ytp-inline-preview-mode .ytp-caption-segment {
      font-size: calc(1.2em * var(--walamo-font-scale)) !important;
    }
    
    .ytp-caption-segment::before {
      content: "";
      position: absolute;
      inset: 0;
      background: var(--walamo-glass-specular, transparent);
      pointer-events: none;
      border-radius: inherit;
    }

    /* Idle Fade Logic */
    .walamo-idle-active .ytp-caption-segment {
        opacity: var(--walamo-idle-opacity);
    }

    #walamo-preview-container { background: #000; background-image: linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%); background-size: 20px 20px; background-position: 0 0, 0 10px, 10px 10px, 10px 0; padding: 0; height: 120px; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin-bottom: 15px; text-align: center; overflow: hidden; border: 1px solid var(--walamo-panel-border); }
    #walamo-caption-panel { position: fixed; right: 20px; top: 80px; z-index: 2147483646; background: var(--walamo-panel-bg); color: var(--walamo-panel-text); font-family: system-ui, sans-serif; font-size: 13px; width: 320px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 8px 32px rgba(0,0,0,0.5); border: 1px solid var(--walamo-panel-border); border-radius: 12px; overflow: hidden; isolation: isolate; }
    #walamo-caption-panel::before {
      content: "";
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: -1;
      background-image: var(--walamo-panel-bg-img, none);
      background-size: cover;
      background-position: center;
      opacity: var(--walamo-panel-bg-img-opacity, 0);
      pointer-events: none;
      transition: opacity 0.3s ease, filter 0.3s ease, transform 0.3s ease;
      border-radius: inherit;
      filter: blur(var(--walamo-panel-bg-blur, 0px));
      -webkit-filter: blur(var(--walamo-panel-bg-blur, 0px));
      transform: scale(calc(1 + var(--walamo-panel-bg-blur-factor, 0)));
    }
    #walamo-caption-panel.walamo-panel-bg-fade::before {
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) var(--walamo-panel-bg-fade-start, 0%), rgba(0,0,0,0) var(--walamo-panel-bg-fade-end, 100%));
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) var(--walamo-panel-bg-fade-start, 0%), rgba(0,0,0,0) var(--walamo-panel-bg-fade-end, 100%));
    }
    #walamo-panel-header { padding: 14px 14px 0 14px; position: relative; z-index: 2; }
    .walamo-panel-scroll { overflow-y: auto; padding: 0 14px 14px 14px; flex: 1; min-height: 0; }
    #walamo-caption-panel h3 { margin: 0 0 12px 0; font-size: 16px; font-weight: 700; color: var(--walamo-panel-accent); }

    /* Panel Themes */
    .walamo-theme-dark { --walamo-panel-bg: rgba(24, 24, 24, var(--walamo-panel-bg-alpha)); --walamo-panel-text: #fff; --walamo-panel-accent: #3ea6ff; --walamo-panel-border: rgba(255,255,255,0.12); }
    .walamo-theme-light { --walamo-panel-bg: rgba(245, 245, 247, var(--walamo-panel-bg-alpha)); --walamo-panel-text: #111; --walamo-panel-accent: #065fd4; --walamo-panel-border: rgba(0,0,0,0.1); }
    .walamo-theme-oled { --walamo-panel-bg: rgba(0, 0, 0, var(--walamo-panel-bg-alpha)); --walamo-panel-text: #eee; --walamo-panel-accent: #3ea6ff; --walamo-panel-border: rgba(255,255,255,0.08); }
    .walamo-theme-glass {
      --walamo-panel-bg: rgba(18, 18, 28, calc(var(--walamo-panel-bg-alpha) * 0.42));
      --walamo-panel-text: #f5f5f5;
      --walamo-panel-accent: #8fd3ff;
      --walamo-panel-border: rgba(255,255,255,0.28);
      backdrop-filter: blur(22px) saturate(180%);
      -webkit-backdrop-filter: blur(22px) saturate(180%);
      box-shadow: 0 8px 32px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.25);
    }
    .walamo-theme-lightglass {
      --walamo-panel-bg: rgba(255, 255, 255, calc(var(--walamo-panel-bg-alpha) * 0.38));
      --walamo-panel-text: #141414;
      --walamo-panel-accent: #065fd4;
      --walamo-panel-border: rgba(255,255,255,0.72);
      backdrop-filter: blur(26px) saturate(200%);
      -webkit-backdrop-filter: blur(26px) saturate(200%);
      box-shadow: 0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.85), inset 0 -1px 0 rgba(0,0,0,0.06);
    }
    .walamo-theme-nebula { --walamo-panel-text: #fff; --walamo-panel-accent: #b388ff; --walamo-panel-border: rgba(179,136,255,0.25); }
    .walamo-theme-midnight { --walamo-panel-text: #e8e8e8; --walamo-panel-accent: #6eb5ff; --walamo-panel-border: rgba(110,181,255,0.2); }
    .walamo-theme-emerald { --walamo-panel-text: #e0fff4; --walamo-panel-accent: #5dffb0; --walamo-panel-border: rgba(93,255,176,0.2); }
    .walamo-theme-crimson { --walamo-panel-text: #ffe8e8; --walamo-panel-accent: #ff6b6b; --walamo-panel-border: rgba(255,107,107,0.25); }
    #walamo-caption-panel.walamo-theme-glass select,
    #walamo-caption-panel.walamo-theme-glass input[type="text"],
    #walamo-caption-panel.walamo-theme-glass input[type="number"],
    #walamo-caption-panel.walamo-theme-lightglass select,
    #walamo-caption-panel.walamo-theme-lightglass input[type="text"],
    #walamo-caption-panel.walamo-theme-lightglass input[type="number"] {
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
    #walamo-caption-panel.walamo-theme-glass select,
    #walamo-caption-panel.walamo-theme-glass input[type="text"],
    #walamo-caption-panel.walamo-theme-glass input[type="number"] {
      background: rgba(255,255,255,0.08) !important;
    }
    #walamo-caption-panel.walamo-theme-lightglass select,
    #walamo-caption-panel.walamo-theme-lightglass input[type="text"],
    #walamo-caption-panel.walamo-theme-lightglass input[type="number"] {
      background: rgba(255,255,255,0.45) !important;
    }
    #walamo-search-container { backdrop-filter: inherit; -webkit-backdrop-filter: inherit; }
    #walamo-caption-panel select { width: 100%; background: rgba(255,255,255,0.08) !important; color: inherit !important; border: 1px solid var(--walamo-panel-border); border-radius: 8px; padding: 8px; outline: none; margin-bottom: 4px; appearance: none; cursor: pointer; transition: all 0.2s; }
    #walamo-caption-panel select:hover { background: rgba(255,255,255,0.15) !important; border-color: var(--walamo-panel-accent); }
    #walamo-caption-panel option { background: #1a1a1a !important; color: #fff !important; padding: 8px; }
    #walamo-caption-panel input[type="text"], #walamo-caption-panel input[type="number"] { width: 100%; box-sizing: border-box !important; background: rgba(255,255,255,0.05); color: inherit; border: 1px solid var(--walamo-panel-border); border-radius: 6px; padding: 6px; outline: none; }
    #walamo-caption-panel input[type="number"] { width: 60px; padding: 2px 4px; text-align: right; background: transparent; border: 0; font-weight: 600; font-family: monospace; }
    #walamo-caption-panel input[type="number"]::-webkit-inner-spin-button { display: none; }
    #walamo-caption-panel input[type="color"] { padding: 0; border: 0; width: 40px; height: 24px; background: transparent; cursor: pointer; }
    #walamo-caption-panel input[type="range"] { -webkit-appearance: none; width: 100%; height: 4px; background: var(--walamo-panel-border); border-radius: 2px; outline: none; margin: 12px 0; }
    #walamo-caption-panel input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; background: var(--walamo-panel-accent); border-radius: 50%; cursor: pointer; box-shadow: 0 0 10px var(--walamo-panel-accent); }
    .walamo-section { border-bottom: 1px solid var(--walamo-panel-border); margin-bottom: 4px; }
    .walamo-section-header { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; cursor: pointer; font-weight: 600; transition: color 0.2s; }
    .walamo-section-header:hover { color: var(--walamo-panel-accent); }
    .walamo-section-content { display: none; padding: 0 4px 12px 4px; }
    .walamo-section.active .walamo-section-content { display: block; }
    .walamo-section-header::after { content: "▼"; font-size: 10px; transition: transform 0.3s; }
    .walamo-section.active .walamo-section-header::after { transform: rotate(180deg); }
    .walamo-info { display: inline-block; width: 16px; height: 16px; background: var(--walamo-panel-border); color: inherit; font-size: 11px; line-height: 16px; text-align: center; border-radius: 50%; margin-left: 8px; cursor: help; position: relative; }
    
    #walamo-tooltip {
      position: fixed;
      z-index: 2147483647;
      background: var(--walamo-panel-bg);
      color: var(--walamo-panel-text);
      --walamo-panel-bg-alpha: 0.95 !important;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 12px;
      line-height: 1.4;
      width: 220px;
      white-space: normal;
      border: 1px solid var(--walamo-panel-accent);
      box-shadow: 0 10px 40px rgba(0,0,0,0.8);
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, transform 0.2s;
      transform: translateX(10px);
    }
    #walamo-tooltip.active {
      opacity: 1;
      visibility: visible;
      transform: translateX(0);
    }

    .walamo-switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid var(--walamo-panel-border);
      border-radius: 20px;
      transition: background-color 0.25s, border-color 0.25s;
      cursor: pointer;
    }
    .walamo-switch::after {
      content: "";
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background-color: #fff;
      top: 2px;
      left: 2px;
      transition: transform 0.25s;
      box-shadow: 0 1px 3px rgba(0,0,0,0.4);
    }
    .walamo-switch.active {
      background-color: var(--walamo-panel-accent);
      border-color: var(--walamo-panel-accent);
    }
    .walamo-switch.active::after {
      transform: translateX(16px);
    }
    #walamo-search-container { margin-bottom: 12px; }
    #walamo-search {
      width: 100%;
      box-sizing: border-box !important;
      background: rgba(0, 0, 0, 0.2) !important;
      border: 1px solid var(--walamo-panel-border) !important;
      border-radius: 8px !important;
      padding: 8px 12px !important;
      color: inherit !important;
      font-size: 12px !important;
      outline: none !important;
      transition: all 0.2s;
    }
    .walamo-theme-light #walamo-search {
      background: rgba(0, 0, 0, 0.05) !important;
    }
    .walamo-theme-lightglass #walamo-search {
      background: rgba(255, 255, 255, 0.45) !important;
      border-color: rgba(0, 0, 0, 0.15) !important;
    }
    .walamo-theme-glass #walamo-search {
      background: rgba(255, 255, 255, 0.07) !important;
    }
    #walamo-search:focus {
      border-color: var(--walamo-panel-accent) !important;
      box-shadow: 0 0 8px rgba(62, 166, 255, 0.3) !important;
      background: rgba(0, 0, 0, 0.3) !important;
    }
    .walamo-theme-light #walamo-search:focus {
      background: rgba(0, 0, 0, 0.08) !important;
    }
    #walamo-mode-toggle { display: flex; background: var(--walamo-panel-border); border-radius: 8px; padding: 2px; margin-bottom: 12px; }
    .walamo-mode-btn { flex: 1; padding: 6px; text-align: center; cursor: pointer; border-radius: 6px; font-weight: 600; }
    .walamo-mode-btn.active { background: var(--walamo-panel-bg); color: var(--walamo-panel-accent); }
    .walamo-button-group { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
    .walamo-action-btn { padding: 8px; border-radius: 8px; background: var(--walamo-panel-border); color: inherit; font-size: 12px; border: 0; cursor: pointer; }
    #walamo-caption-close { position: absolute; top: 8px; right: 8px; width: 24px; height: 24px; border: 0; border-radius: 50%; background: var(--walamo-panel-border); color: inherit; cursor: pointer; }
    .walamo-slider-top { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
    .walamo-mini-reset { width: 18px; height: 18px; line-height: 18px; text-align: center; border-radius: 4px; background: var(--walamo-panel-border); cursor: pointer; font-size: 10px; margin-left: 6px; border: 0; color: inherit; }
    .walamo-status { margin-top: 10px; padding: 8px; border-radius: 8px; background: rgba(0,0,0,0.2); font-size: 11px; font-family: monospace; border: 1px solid var(--walamo-panel-border); }

    /* Advanced Font Picker */
    .walamo-font-picker-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--walamo-panel-border); border-radius: 8px; cursor: pointer; margin-top: 8px; transition: all 0.2s; }
    .walamo-font-picker-trigger:hover { background: rgba(255,255,255,0.1); border-color: var(--walamo-panel-accent); }
    .walamo-font-picker-trigger .font-name { font-weight: 600; flex: 1; text-align: left; }
    .walamo-font-picker-trigger .font-preview { font-size: 11px; opacity: 0.7; margin-right: 10px; }

    #walamo-font-picker-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: none; align-items: center; justify-content: center; z-index: 2147483647; backdrop-filter: blur(4px); }
    #walamo-font-picker-modal.active { display: flex; }
    .walamo-font-picker-content { width: 450px; max-height: 80vh; background: var(--walamo-panel-bg); border: 1px solid var(--walamo-panel-border); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.6); }
    .walamo-font-picker-header { padding: 20px; border-bottom: 1px solid var(--walamo-panel-border); }
    .walamo-font-picker-search { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--walamo-panel-border); border-radius: 10px; padding: 12px; color: #fff; outline: none; font-size: 14px; }
    .walamo-font-picker-search:focus { border-color: var(--walamo-panel-accent); }
    
    .walamo-font-picker-body { flex: 1; overflow-y: auto; padding: 10px; }
    .walamo-font-category { margin-bottom: 15px; }
    .walamo-font-category-title { font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--walamo-panel-accent); margin: 10px 10px 5px 10px; letter-spacing: 1px; }
    
    .walamo-font-item { display: flex; align-items: center; padding: 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; position: relative; }
    .walamo-font-item:hover { background: rgba(255,255,255,0.08); }
    .walamo-font-item.active { background: rgba(62, 166, 255, 0.15); border: 1px solid var(--walamo-panel-accent); }
    .walamo-font-item .font-info { flex: 1; }
    .walamo-font-item .font-family-name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
    .walamo-font-item .font-sample { font-size: 16px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .walamo-font-item .favorite-toggle { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; opacity: 0.3; transition: opacity 0.2s; font-size: 16px; margin-left: 10px; }
    .walamo-font-item:hover .favorite-toggle { opacity: 0.7; }
    .walamo-font-item .favorite-toggle.active { opacity: 1; color: #ffca28; }
    
    .walamo-font-picker-footer { padding: 15px; border-top: 1px solid var(--walamo-panel-border); display: flex; justify-content: space-between; align-items: center; }
    .walamo-font-add-btn { background: var(--walamo-panel-accent); color: #fff; border: 0; padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; }
    
    .walamo-font-custom-input { padding: 20px; display: none; flex-direction: column; gap: 12px; }
    .walamo-font-custom-input.active { display: flex; }
    .walamo-font-custom-input input { background: rgba(255,255,255,0.05); border: 1px solid var(--walamo-panel-border); border-radius: 8px; padding: 10px; color: #fff; outline: none; }
  `);

  function openPanel() {
    try {
      const existing = document.querySelector('#walamo-caption-panel');
      if (existing) { existing.remove(); return; }
      const panel = document.createElement('div');
      panel.id = 'walamo-caption-panel';
      panel.className = `walamo-theme-${(settings.panelTheme || 'Dark').toLowerCase()}`;
      
      const headerContainer = document.createElement('div');
      headerContainer.id = 'walamo-panel-header';
      
      const closeBtn = document.createElement('button'); closeBtn.id = 'walamo-caption-close'; closeBtn.textContent = '×'; closeBtn.onclick = () => panel.remove(); headerContainer.appendChild(closeBtn);
      const title = document.createElement('h3'); title.textContent = 'Caption Styler Pro'; headerContainer.appendChild(title);
      const previewContainer = document.createElement('div'); previewContainer.id = 'walamo-preview-container';
      const previewText = document.createElement('span'); previewText.className = 'ytp-caption-segment'; previewText.textContent = 'Live Preview Example'; previewContainer.appendChild(previewText); headerContainer.appendChild(previewContainer);
      const searchContainer = document.createElement('div'); searchContainer.id = 'walamo-search-container';
      const searchInput = document.createElement('input'); searchInput.id = 'walamo-search'; searchInput.type = 'text'; searchInput.placeholder = 'Search settings...'; searchContainer.appendChild(searchInput); headerContainer.appendChild(searchContainer);
      const modeToggle = document.createElement('div'); modeToggle.id = 'walamo-mode-toggle';
      const isBasic = settings.basicMode === 1;
      const basicBtn = document.createElement('div'); basicBtn.className = `walamo-mode-btn ${isBasic ? 'active' : ''}`; basicBtn.textContent = 'Basic';
      const advBtn = document.createElement('div'); advBtn.className = `walamo-mode-btn ${!isBasic ? 'active' : ''}`; advBtn.textContent = 'Advanced';
      modeToggle.appendChild(basicBtn); modeToggle.appendChild(advBtn); headerContainer.appendChild(modeToggle);
      panel.appendChild(headerContainer);

      const scrollContainer = document.createElement('div');
      scrollContainer.className = 'walamo-panel-scroll';
      panel.appendChild(scrollContainer);

      const uiMap = {};
      let tooltipEl = document.querySelector('#walamo-tooltip');
      if (!tooltipEl) {
        tooltipEl = document.createElement('div');
        tooltipEl.id = 'walamo-tooltip';
        document.body.appendChild(tooltipEl);
      }
      const showTooltip = (el) => {
        tooltipEl.textContent = el.dataset.tooltip;
        tooltipEl.className = `walamo-theme-${(settings.panelTheme || 'Dark').toLowerCase()} active`;
        const rect = el.getBoundingClientRect();
        const tRect = tooltipEl.getBoundingClientRect();
        let left = rect.left - tRect.width - 12;
        if (left < 10) left = rect.right + 12; // Fallback to right side
        let top = rect.top + rect.height/2 - tRect.height/2;
        top = Math.max(10, Math.min(window.innerHeight - tRect.height - 10, top)); // Viewport clamp
        tooltipEl.style.left = `${left}px`;
        tooltipEl.style.top = `${top}px`;
      };
      const hideTooltip = () => tooltipEl.classList.remove('active');
      scrollContainer.addEventListener('scroll', hideTooltip);

      function createSection(name, basic = false) {
        const section = document.createElement('div'); section.className = 'walamo-section';
        if (!basic && settings.basicMode === 1) section.style.display = 'none';
        const header = document.createElement('div'); header.className = 'walamo-section-header'; header.textContent = name;
        const content = document.createElement('div'); content.className = 'walamo-section-content';
        header.onclick = () => { const active = section.classList.contains('active'); document.querySelectorAll('.walamo-section').forEach(s => s.classList.remove('active')); if (!active) section.classList.add('active'); };
        section.appendChild(header); section.appendChild(content); scrollContainer.appendChild(section); return content;
      }
      function appendOption(select, value, text) { const opt = document.createElement('option'); opt.value = value; opt.textContent = text; select.appendChild(opt); }
      function addSlider(name, key, min, max, target, tooltip = "") {
        const row = document.createElement('div'); row.className = 'walamo-slider-row'; row.dataset.search = name.toLowerCase();
        const top = document.createElement('div'); top.className = 'walamo-slider-top';
        const labelArea = document.createElement('div'); labelArea.style.display = 'flex'; labelArea.style.alignItems = 'center';
        const lbl = document.createElement('span'); lbl.textContent = name; labelArea.appendChild(lbl);
        if (tooltip) {
          const i = document.createElement('span'); i.className = 'walamo-info'; i.dataset.tooltip = tooltip; i.textContent = 'i';
          i.onmouseenter = () => showTooltip(i);
          i.onmouseleave = hideTooltip;
          labelArea.appendChild(i);
        }
        const resetBtn = document.createElement('button'); resetBtn.className = 'walamo-mini-reset'; resetBtn.textContent = '↺'; resetBtn.onclick = () => { const def = defaults[key]; input.value = def; numInput.value = def; applySetting(key, def); };
        labelArea.appendChild(resetBtn);
        const numInput = document.createElement('input'); numInput.type = 'number'; numInput.value = settings[key] ?? defaults[key];
        const input = document.createElement('input'); input.type = 'range'; input.min = min; input.max = max; input.value = settings[key] ?? defaults[key];
        input.oninput = () => { applySetting(key, input.value); numInput.value = input.value; };
        numInput.oninput = () => { applySetting(key, numInput.value); input.value = numInput.value; };
        top.appendChild(labelArea); top.appendChild(numInput); row.appendChild(top); row.appendChild(input); target.appendChild(row);
        uiMap[key] = { input, val: numInput };
      }
      function addPicker(name, keyP, target, grad = false) {
        const row = document.createElement('div'); row.className = 'walamo-slider-row'; row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.marginTop = '10px'; row.dataset.search = name.toLowerCase();
        const lbl = document.createElement('span'); lbl.textContent = name;
        const pks = document.createElement('div'); pks.style.display = 'flex'; pks.style.gap = '8px';
        const cp1 = document.createElement('input'); cp1.type = 'color'; cp1.value = rgbToHex(settings[keyP+'Red'], settings[keyP+'Green'], settings[keyP+'Blue']);
        cp1.oninput = () => { const r = hexToRgb(cp1.value); applySetting(keyP+'Red', r.r); applySetting(keyP+'Green', r.g); applySetting(keyP+'Blue', r.b); };
        pks.appendChild(cp1);
        let cp2 = null;
        if (grad) { cp2 = document.createElement('input'); cp2.type = 'color'; cp2.value = rgbToHex(settings[keyP+'Red2'], settings[keyP+'Green2'], settings[keyP+'Blue2']); cp2.oninput = () => { const r = hexToRgb(cp2.value); applySetting(keyP+'Red2', r.r); applySetting(keyP+'Green2', r.g); applySetting(keyP+'Blue2', r.b); }; pks.appendChild(cp2); }
        row.appendChild(lbl); row.appendChild(pks); target.appendChild(row);
        uiMap[keyP] = { cp1, cp2 };
      }
      function addDropdown(name, key, options, target, tooltip = "") {
        const row = document.createElement('div'); row.className = 'walamo-slider-row'; row.style.marginTop = '10px'; row.dataset.search = name.toLowerCase();
        const top = document.createElement('div'); top.className = 'walamo-slider-top';
        const lbl = document.createElement('span'); lbl.textContent = name;
        if (tooltip) {
          const i = document.createElement('span'); i.className = 'walamo-info'; i.dataset.tooltip = tooltip; i.textContent = 'i';
          i.onmouseenter = () => showTooltip(i);
          i.onmouseleave = hideTooltip;
          lbl.appendChild(i);
        }
        top.appendChild(lbl);
        const sel = document.createElement('select'); for (const optVal in options) appendOption(sel, optVal, options[optVal]);
        sel.value = settings[key] || defaults[key]; sel.onchange = () => applySetting(key, sel.value);
        row.appendChild(top); row.appendChild(sel); target.appendChild(row);
        uiMap[key] = { select: sel };
      }
      function addToggle(name, key, target, tooltip = "") {
        const row = document.createElement('div'); row.className = 'walamo-slider-row'; row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center'; row.style.marginTop = '10px'; row.dataset.search = name.toLowerCase();
        const labelArea = document.createElement('div'); labelArea.style.display = 'flex'; labelArea.style.alignItems = 'center';
        const lbl = document.createElement('span'); lbl.textContent = name; labelArea.appendChild(lbl);
        if (tooltip) {
          const i = document.createElement('span'); i.className = 'walamo-info'; i.dataset.tooltip = tooltip; i.textContent = 'i';
          i.onmouseenter = () => showTooltip(i);
          i.onmouseleave = hideTooltip;
          labelArea.appendChild(i);
        }
        const sw = document.createElement('div'); sw.className = `walamo-switch ${settings[key] === 1 ? 'active' : ''}`;
        sw.onclick = () => {
          const val = settings[key] === 1 ? 0 : 1;
          applySetting(key, val);
          sw.classList.toggle('active', val === 1);
        };
        row.appendChild(labelArea); row.appendChild(sw); target.appendChild(row);
        uiMap[key] = { switch: sw };
      }
      function updateUI() {
        for (const k in settings) {
          const ui = uiMap[k]; if (!ui) continue;
          if (ui.input) { ui.input.value = settings[k]; if (ui.val) ui.val.value = settings[k]; }
          else if (ui.cp1) { ui.cp1.value = rgbToHex(settings[k+'Red'], settings[k+'Green'], settings[k+'Blue']); if (ui.cp2) ui.cp2.value = rgbToHex(settings[k+'Red2'], settings[k+'Green2'], settings[k+'Blue2']); }
          else if (ui.select) { ui.select.value = settings[k] || ""; }
          else if (ui.switch) { ui.switch.classList.toggle('active', settings[k] === 1); }
        }
      }
      function applyPreset(p) {
        applyPresetValues(p);
        updateUI();
      }

      // Sections
      const s1 = createSection('Presets', true);
      const sel1 = document.createElement('select'); appendOption(sel1, "", "-- Built-in --"); for (const p in presets) appendOption(sel1, p, p); s1.appendChild(sel1);
      sel1.onchange = () => applyPreset(presets[sel1.value]);
      sel1.onkeydown = (e) => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') setTimeout(() => applyPreset(presets[sel1.value]), 10); };
      const sel2 = document.createElement('select'); sel2.style.marginTop = '8px';
      const upCust = () => { while (sel2.firstChild) sel2.removeChild(sel2.firstChild); appendOption(sel2, "", "-- My Presets --"); for (const p in customPresets) appendOption(sel2, p, p); };
      upCust(); s1.appendChild(sel2);
      sel2.onchange = () => applyPreset(customPresets[sel2.value]);
      sel2.onkeydown = (e) => { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') setTimeout(() => applyPreset(customPresets[sel2.value]), 10); };
      const aG1 = document.createElement('div'); aG1.className = 'walamo-button-group';
      const bS = document.createElement('button'); bS.className = 'walamo-action-btn'; bS.textContent = 'Save Current'; bS.onclick = () => { const n = prompt('Name:'); if (n) { saveCustomPreset(n); upCust(); } };
      const bD = document.createElement('button'); bD.className = 'walamo-action-btn'; bD.textContent = 'Delete Selected'; bD.onclick = () => { if (sel2.value) { deleteCustomPreset(sel2.value); upCust(); } };
      aG1.appendChild(bS); aG1.appendChild(bD); s1.appendChild(aG1);
      const bRandom = document.createElement('button'); bRandom.className = 'walamo-action-btn'; bRandom.style.marginTop = '8px'; bRandom.style.width = '100%'; bRandom.textContent = 'Random Style';
      bRandom.onclick = () => {
        const name = applyRandomStyle();
        updateUI();
        if (name && presets[name]) sel1.value = name;
        else if (name && customPresets[name]) sel2.value = name;
        bRandom.textContent = name ? `Applied: ${name}` : 'Random Style';
        setTimeout(() => { bRandom.textContent = 'Random Style'; }, 1800);
      };
      s1.appendChild(bRandom);

      const s2 = createSection('Appearance', true); addPicker('Background', 'bg', s2, true); addSlider('Opacity', 'bgOpacity', 0, 100, s2); addSlider('Radius', 'radius', 0, 150, s2); addSlider('Blur', 'blur', 0, 40, s2); addSlider('Padding X', 'padX', 0, 80, s2); addSlider('Padding Y', 'padY', 0, 80, s2);

      const sHighlight = createSection('Last Word Highlight', true);
      addToggle('Last Word Highlight', 'lastWordHighlight', sHighlight);
      addPicker('Highlight Color', 'highlight', sHighlight);
      addSlider('Highlight Opacity', 'highlightOpacity', 0, 100, sHighlight);
      addSlider('Border Opacity', 'highlightBorderOpacity', 0, 100, sHighlight);
      addSlider('Border Width', 'highlightBorderWidth', 0, 8, sHighlight);
      addSlider('Radius', 'highlightRadius', 0, 40, sHighlight);
      addSlider('Padding X', 'highlightPadX', 0, 20, sHighlight);
      addSlider('Padding Y', 'highlightPadY', 0, 20, sHighlight);
      addSlider('Glow', 'highlightGlow', 0, 40, sHighlight);

      const sFocus = createSection('Reading Focus', true);
      addToggle('Reading Focus', 'readingFocus', sFocus);
      addSlider('Old Line Opacity', 'readingFocusOldOpacity', 0, 100, sFocus);
      addSlider('Current Line Opacity', 'readingFocusCurrentOpacity', 0, 100, sFocus);

      const sCleanup = createSection('Caption Cleanup', true);
      addToggle('Caption Cleanup', 'captionCleanup', sCleanup, 'Strip noisy subtitle markup from captions');
      addToggle('Remove [Brackets]', 'cleanupBrackets', sCleanup, 'e.g. [Music]');
      addToggle('Remove (Parentheses)', 'cleanupParens', sCleanup, 'e.g. (whispers)');
      addToggle('Remove ♪ Lyrics ♪', 'cleanupLyrics', sCleanup);
      addToggle('Remove Speaker Names', 'cleanupSpeakers', sCleanup, 'e.g. JOHN:');
      addToggle('Remove >> Arrows', 'cleanupSpeakerArrows', sCleanup, 'Remove >> symbols indicating speaker changes');
      addToggle('Remove Word Stutters', 'cleanupStutters', sCleanup, 'Remove duplicate adjacent common words like "the the", "in in", etc.');
      
      // Smart Filler Removal (Mashed into Cleanup)
      addToggle('Filler Removal', 'fillerRemoval', sCleanup, 'Targets uh, um, uhh, uhm, you know, like, I');
      addToggle('Dim Fillers', 'fillerMode', sCleanup, 'On to dim fillers (using opacity below), Off to remove them completely');
      addSlider('Filler Opacity', 'fillerOpacity', 0, 100, sCleanup, 'Opacity when using Dim mode');

      addToggle('Custom Regex Filter', 'cleanupCustomEnabled', sCleanup);
      const regexRow = document.createElement('div'); regexRow.className = 'walamo-slider-row'; regexRow.style.marginTop = '10px'; regexRow.dataset.search = 'custom regex filter';
      const regexInp = document.createElement('input'); regexInp.type = 'text'; regexInp.placeholder = 'Custom regex pattern...'; regexInp.value = settings.cleanupCustomRegex || '';
      regexInp.onchange = () => applySetting('cleanupCustomRegex', regexInp.value);
      regexInp.oninput = () => applySetting('cleanupCustomRegex', regexInp.value);
      regexRow.appendChild(regexInp); sCleanup.appendChild(regexRow);

      const sWhisper = createSection('Whisper Mode', true);
      addToggle('Whisper Mode', 'whisperMode', sWhisper, 'Smaller, lighter captions for whispers');
      addToggle('Detect Low Audio', 'whisperAudioDetect', sWhisper, 'Style captions when video audio is quiet');
      addSlider('Audio Threshold', 'whisperAudioThreshold', 5, 50, sWhisper, 'Lower = more sensitive to quiet speech');
      addSlider('Whisper Scale (%)', 'whisperScale', 50, 100, sWhisper);
      addSlider('Whisper Opacity', 'whisperOpacity', 20, 100, sWhisper);
      addSlider('Text Lighten', 'whisperLighten', 0, 80, sWhisper);

      const sLay = createSection('Layout / Lines');
      addSlider('Max Width (%)', 'maxWidth', 20, 100, sLay);
      addDropdown('Text Align', 'textAlign', { 'left': 'Left', 'center': 'Center', 'right': 'Right' }, sLay);
      addDropdown('Max Lines', 'maxLines', { 0: 'Unlimited', 1: '1 Line', 2: '2 Lines', 3: '3 Lines' }, sLay);
      addDropdown('Word Break', 'wordBreak', { 'normal': 'Normal', 'break-word': 'Break Word', 'keep-all': 'Keep All' }, sLay);
      addDropdown('White Space', 'whiteSpace', { 'normal': 'Normal', 'pre-wrap': 'Pre-wrap', 'break-spaces': 'Break-spaces' }, sLay);

      const sTypo = createSection('Typography', true);
      
      const fontTrigger = document.createElement('div');
      fontTrigger.className = 'walamo-font-picker-trigger';
      setHTML(fontTrigger, `<span class="font-preview" style="font-family: '${settings.fontFamily}', sans-serif;">Abc</span><span class="font-name">${settings.fontFamily}</span><span>▼</span>`);
      sTypo.appendChild(fontTrigger);
      
      initFontPicker(fontTrigger, (font) => {
          applySetting('fontFamily', font);
          fontTrigger.querySelector('.font-name').textContent = font;
          fontTrigger.querySelector('.font-preview').style.fontFamily = `'${font}', sans-serif`;
      });

      addDropdown('Font Weight', 'fontWeight', { 100: '100 - Thin', 200: '200 - Extra Light', 300: '300 - Light', 400: '400 - Regular', 500: '500 - Medium', 600: '600 - Semi Bold', 700: '700 - Bold', 800: '800 - Extra Bold', 900: '900 - Black' }, sTypo);
      addSlider('Font Scale (%)', 'fontScale', 20, 500, sTypo);
      addDropdown('Font Style', 'fontStyle', { 'normal': 'Normal', 'italic': 'Italic' }, sTypo);
      const decRow = document.createElement('div'); decRow.className = 'walamo-slider-row'; decRow.style.marginTop = '10px'; decRow.textContent = 'Text Decoration';
      const decGrp = document.createElement('div'); decGrp.style.display = 'flex'; decGrp.style.gap = '4px'; decGrp.style.marginTop = '4px';
      ['none', 'underline', 'overline', 'line-through'].forEach(d => { const b = document.createElement('button'); b.className = 'walamo-action-btn'; b.textContent = d.replace('line-through', 'strike'); b.onclick = () => applySetting('textDecoration', d); decGrp.appendChild(b); });
      sTypo.appendChild(decRow); sTypo.appendChild(decGrp);
      addSlider('Letter Spacing', 'letterSpacing', -20, 50, sTypo);
      addSlider('Line Height', 'lineHeight', 80, 200, sTypo);

      const sColors = createSection('Colors', true);
      addPicker('Text Color', 'text', sColors);
      addPicker('Shadow Color', 'outline', sColors);
      addPicker('Glow Color', 'glow', sColors);
      addPicker('Secondary Shadow', 'secShadow', sColors);

      const sSmart = createSection('Smart Contrast');
      addToggle('Smart Contrast', 'smartContrast', sSmart, 'Samples video brightness and auto-adjusts caption background, shadow, outline, and glow so text stays readable on bright or dark scenes.');
      addDropdown('Sampling Frequency', 'smartFreq', { 2000: 'Low', 1000: 'Balanced', 500: 'High' }, sSmart, 'How often the video frame is analyzed. Low uses less CPU; High reacts faster when the scene gets brighter or darker.');
      addSlider('Bright BG Boost', 'smartBgBoost', 0, 100, sSmart);
      addSlider('Bright Shadow Boost', 'smartShadowBoost', 0, 100, sSmart);
      addSlider('Bright Outline Boost', 'smartOutlineBoost', 0, 100, sSmart);
      addSlider('Dark BG Reduction', 'smartDarkBgReduction', 0, 100, sSmart);
      addSlider('Dark Glow Boost', 'smartDarkGlowBoost', 0, 100, sSmart);
      const status = document.createElement('div'); status.className = 'walamo-status'; status.id = 'walamo-smart-status'; status.textContent = 'Smart Contrast: Initializing...'; sSmart.appendChild(status);

      const sEffects = createSection('Effects & Automation', true);
      addToggle('Idle Fading', 'enableIdleFade', sEffects, 'Fades captions when video is paused or idle');
      addSlider('Idle Opacity', 'idleOpacity', 0, 100, sEffects, 'Opacity level during idle state');
      addSlider('Sec. Shadow X', 'secondaryShadowX', -50, 50, sEffects);
      addSlider('Sec. Shadow Y', 'secondaryShadowY', -50, 50, sEffects);
      addSlider('Sec. Shadow Blur', 'secondaryShadowBlur', 0, 100, sEffects);
      addSlider('Sec. Shadow Opacity', 'secondaryShadowOpacity', 0, 100, sEffects);

      const s4 = createSection('Shadow Settings');
      addSlider('Shadow Blur', 'textShadowBlur', 0, 40, s4);
      addSlider('Shadow Opacity', 'textShadowOpacity', 0, 100, s4);
      addSlider('Shadow Spread', 'textShadowSpread', 0, 10, s4);
      addSlider('Shadow X', 'textShadowDistanceX', -20, 20, s4);
      addSlider('Shadow Y', 'textShadowDistanceY', -20, 20, s4);
      addSlider('Glow Shadow Boost', 'fontGlowBoost', 0, 100, s4, 'Bright white/colored halo around caption text');
      addPicker('Glow Shadow Color', 'fontGlow', s4);

      const s5 = createSection('Glass Style');
      const gSel = document.createElement('select'); appendOption(gSel, "", "-- Quick Glass Styles --"); for (const g in glassStyles) appendOption(gSel, g, g); s5.appendChild(gSel);
      gSel.onchange = () => { if (gSel.value) { for (const k in glassStyles[gSel.value]) applySetting(k, glassStyles[gSel.value][k]); updateUI(); } };
      addSlider('Border', 'glassBorder', 0, 100, s5);
      addSlider('Shine', 'glassShine', 0, 100, s5);
      addSlider('Glow', 'glassGlow', 0, 100, s5);
      addSlider('Tint', 'glassTint', 0, 100, s5);
      addSlider('Depth', 'glassDepth', 0, 100, s5);
      addSlider('Refraction', 'glassRefraction', 0, 100, s5);

      const s6 = createSection('Position'); addSlider('Vertical Pos', 'vPos', -500, 500, s6); addSlider('Horizontal Pos', 'hPos', -500, 500, s6);

      const s7 = createSection('Advanced');
      const tSel = document.createElement('select'); ['Dark', 'Light', 'Glass', 'OLED', 'LightGlass', 'Nebula', 'Midnight', 'Emerald', 'Crimson'].forEach(t => appendOption(tSel, t, "Panel Theme: " + t)); tSel.value = settings.panelTheme || "Dark"; s7.appendChild(tSel);
      tSel.onchange = () => { applySetting('panelTheme', tSel.value); panel.className = `walamo-theme-${tSel.value.toLowerCase()}`; };

      const bgContainer = document.createElement('div'); bgContainer.style.display = 'flex'; bgContainer.style.gap = '8px'; bgContainer.style.marginTop = '10px';
      const bgInp = document.createElement('input'); bgInp.type = 'text'; bgInp.placeholder = 'Background Image URL...'; bgInp.value = settings.panelBgImg || '';
      bgInp.style.flex = '1';
      const bgBtn = document.createElement('button'); bgBtn.className = 'walamo-action-btn'; bgBtn.textContent = 'Apply'; bgBtn.style.width = '60px';
      bgBtn.onclick = () => applySetting('panelBgImg', bgInp.value);
      bgContainer.appendChild(bgInp); bgContainer.appendChild(bgBtn); s7.appendChild(bgContainer);

      addToggle('Fade Gradient', 'panelBgFade', s7, 'Fades the background image out towards the bottom');
      addSlider('Fade Start (%)', 'panelBgFadeStart', 0, 100, s7);
      addSlider('Fade End (%)', 'panelBgFadeEnd', 0, 100, s7);
      addSlider('Panel BG Blur', 'panelBgBlur', 0, 40, s7, 'Blur the panel background image for a frosted glass look');
      addSlider('Panel BG Opacity', 'panelBgOpacity', 0, 100, s7, 'Transparency of the panel background only — lower for more glass effect');
      addSlider('Panel Opacity', 'panelOpacity', 0, 100, s7, 'Opacity of the entire panel including all controls');
      addSlider('Gradient Angle', 'panelGradAngle', 0, 360, s7);

      const aG2 = document.createElement('div'); aG2.className = 'walamo-button-group';
      const bE = document.createElement('button'); bE.className = 'walamo-action-btn'; bE.textContent = 'Export JSON';
      bE.onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })); a.download = 'captions.json'; a.click(); };
      const bI = document.createElement('button'); bI.className = 'walamo-action-btn'; bI.textContent = 'Import JSON';
      bI.onclick = () => { const i = document.createElement('input'); i.type = 'file'; i.onchange = e => { const r = new FileReader(); r.onload = x => { const d = JSON.parse(x.target.result); for (const k in d) if (k in defaults) applySetting(k, d[k]); updateUI(); }; r.readAsText(e.target.files[0]); }; i.click(); };
      aG2.appendChild(bE); aG2.appendChild(bI); s7.appendChild(aG2);
      const bR = document.createElement('button'); bR.className = 'walamo-action-btn'; bR.style.color = '#f44'; bR.textContent = 'Nuke All Settings';
      bR.onclick = () => { if (confirm('Reset everything?')) { for (const k in defaults) applySetting(k, defaults[k]); updateUI(); } }; s7.appendChild(bR);

      searchInput.oninput = () => {
        const q = searchInput.value.trim().toLowerCase();
        const rows = document.querySelectorAll('.walamo-slider-row');
        const sections = document.querySelectorAll('.walamo-section');
        if (!q) {
          rows.forEach(r => r.style.display = '');
          sections.forEach(s => {
            s.style.display = '';
            s.querySelector('.walamo-section-header').style.display = '';
          });
          return;
        }
        sections.forEach(s => {
          let hasMatch = false;
          s.querySelectorAll('.walamo-slider-row').forEach(r => {
            const match = r.dataset.search.includes(q);
            r.style.display = match ? 'block' : 'none';
            if (match) hasMatch = true;
          });
          if (hasMatch) {
            s.style.display = 'block';
            s.classList.add('active');
            s.querySelector('.walamo-section-header').style.display = 'none';
          } else {
            s.style.display = 'none';
          }
        });
      };
      basicBtn.onclick = () => { applySetting('basicMode', 1); panel.remove(); openPanel(); };
      advBtn.onclick = () => { applySetting('basicMode', 0); panel.remove(); openPanel(); };
      document.body.appendChild(panel);
      for (const k in defaults) applySetting(k, settings[k], true);
    } catch (err) { alert('Caption Styler Error: ' + err.message); console.error(err); }
  }

  // Smart Contrast Sampling
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = 64; canvas.height = 36;

  function sampleVideo() {
    if (!settings.smartContrast) return;
    const video = document.querySelector('video');
    const player = document.querySelector('#movie_player');
    if (!video || !player || video.paused || document.hidden) return;

    try {
        const vWidth = video.videoWidth || 640;
        const vHeight = video.videoHeight || 360;
        const sh = Math.round(vHeight * 0.3);
        const sy = vHeight - sh;
        ctx.drawImage(video, 0, sy, vWidth, sh, 0, 0, canvas.width, canvas.height);
        
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r=0, g=0, b=0;
        for (let i=0; i<data.length; i+=4) { r+=data[i]; g+=data[i+1]; b+=data[i+2]; }
        const count = data.length / 4;
        const avgR = r/count, avgG = g/count, avgB = b/count;
        const targetLuma = 0.2126 * avgR + 0.7152 * avgG + 0.0722 * avgB;
        
        // Smooth transition
        currentLuma = currentLuma * 0.75 + targetLuma * 0.25;
        
        const stat = document.querySelector('#walamo-smart-status');
        if (stat) {
            const label = currentLuma > 160 ? 'BRIGHT' : (currentLuma < 70 ? 'DARK' : 'MEDIUM');
            stat.textContent = `Smart Contrast: ${label} (Luma: ${Math.round(currentLuma)})`;
            stat.style.color = currentLuma > 160 ? '#ff0' : (currentLuma < 70 ? '#aaf' : '#fff');
        }
        applySetting('update_boosts', null, true); // Trigger reactive update
    } catch (e) {
        settings.smartContrast = 0;
        const stat = document.querySelector('#walamo-smart-status');
        if (stat) stat.textContent = 'Smart Contrast: Disabled (CORS Restriction)';
    }
  }

  setInterval(sampleVideo, settings.smartFreq || 1000);

  setInterval(() => {
    if (settings.whisperMode === 1) updateWhisperMode();
  }, 250);

  function ready(fn) {
    if (document.body) { fn(); return; }
    const obs = new MutationObserver(() => { if (document.body) { obs.disconnect(); fn(); } });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  ready(() => {
    GM_registerMenuCommand('Open Caption Styler', openPanel);
    
    // Load active font if it's a Google Font
    if (GOOGLE_FONTS_BASE.includes(settings.fontFamily)) loadGoogleFont(settings.fontFamily);
    
    // Load custom fonts
    settings.customFonts.forEach(cf => {
        if (cf.url) loadCustomFont(cf.name, cf.url);
        else loadGoogleFont(cf.name);
    });

    for (const k in defaults) applySetting(k, settings[k], true);

    // Start Caption Observer
    const captionContainer = document.querySelector('.ytp-caption-window-container');
    if (captionContainer) {
        captionObserver.observe(captionContainer, { childList: true, subtree: true, characterData: true });
    } else {
        const playerObs = new MutationObserver(() => {
            const c = document.querySelector('.ytp-caption-window-container');
            if (c) {
                captionObserver.observe(c, { childList: true, subtree: true, characterData: true });
                playerObs.disconnect();
            }
        });
        playerObs.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Idle fade listener
    setInterval(() => {
        const player = document.querySelector('#movie_player');
        if (!player) return;
        if (settings.enableIdleFade === 1) {
            const isPaused = player.classList.contains('paused-mode');
            const isAutohide = player.classList.contains('ytp-autohide');
            // Only fade if video is paused AND user is idle (controls hidden)
            if (isPaused && isAutohide) player.classList.add('walamo-idle-active');
            else player.classList.remove('walamo-idle-active');
        } else {
            player.classList.remove('walamo-idle-active');
        }
    }, 500);
  });
})();