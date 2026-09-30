/* =========================================
   PETRO-FLOW ANALYTICS v5.1
   MAIN CLIENT SCRIPT WITH COMPREHENSIVE CONTROLS,
   REPORTS CENTER, SCADA DECK, & LIVE AI CHATBOT
   ========================================= */

// State
let allWells = (typeof window !== 'undefined' && Array.isArray(window.PETRO_INITIAL_WELLS) && window.PETRO_INITIAL_WELLS.length > 0)
    ? window.PETRO_INITIAL_WELLS
    : [];
let selectedWell = null;
let currentFilter = 'all';
let currentReportFilter = 'all';
let sseConnection = null;
let activeCardTarget = null;
let allReportsData = [];

// DOM Elements - Navigation & Shell
const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menuToggle");
const navItems = document.querySelectorAll(".nav-item");
const topTabs = document.querySelectorAll(".top-tab");
const pages = document.querySelectorAll(".page");
const systemTime = document.getElementById("systemTime");
const backendStatusLabel = document.getElementById("backendStatusLabel");
const sidebarPulse = document.getElementById("sidebarPulse");
const brandHomeLink = document.getElementById("brandHomeLink");

// Image 1 Grid Elements
const image1WellsGrid = document.getElementById("image1WellsGrid");
const wellsCounterLabel = document.getElementById("wellsCounterLabel");
const filterPills = document.querySelectorAll("#wells .filter-pill");
const wellSearchInput = document.getElementById("wellSearchInput");

// Image 2 Detail Elements
const platformOverviewTitle = document.getElementById("platformOverviewTitle");
const selectedWellBadge = document.getElementById("selectedWellBadge");
const selectedWellDot = document.getElementById("selectedWellDot");
const selectedWellName = document.getElementById("selectedWellName");
const wellSwitchSelect = document.getElementById("wellSwitchSelect");
const btnBackToWells = document.getElementById("btnBackToWells");
const btnRunDiagnostics = document.getElementById("btnRunDiagnostics");
const btnOpenSCADAControls = document.getElementById("btnOpenSCADAControls");

// Image 2 Cards
const cardProdTitle = document.getElementById("cardProdTitle");
const detailProdStat = document.getElementById("detailProdStat");
const detailProdBadge = document.getElementById("detailProdBadge");
const detailProdSubtitle = document.getElementById("detailProdSubtitle");
const waveAreaPath = document.getElementById("waveAreaPath");
const waveStrokePath = document.getElementById("waveStrokePath");
const waveMarkerDot = document.getElementById("waveMarkerDot");
const activeWellsRatio = document.getElementById("activeWellsRatio");
const activeSubUnitsList = document.getElementById("activeSubUnitsList");

// Rig Visualizer Callouts
const rigStatusVal = document.getElementById("rigStatusVal");
const rigDepthVal = document.getElementById("rigDepthVal");
const rigTopFlowVal = document.getElementById("rigTopFlowVal");
const rigMidStatusVal = document.getElementById("rigMidStatusVal");
const rigBottomFlowVal = document.getElementById("rigBottomFlowVal");
const rigGasVal = document.getElementById("rigGasVal");
const rigWaterVal = document.getElementById("rigWaterVal");

// 24h Trend Chart
const trendCyanPath = document.getElementById("trendCyanPath");
const trendBluePath = document.getElementById("trendBluePath");

// Gauges & System Overview
const tankLevelVal = document.getElementById("tankLevelVal");
const tankLevelSub = document.getElementById("tankLevelSub");
const tankLevelCircle = document.getElementById("tankLevelCircle");

const pressureVal = document.getElementById("pressureVal");
const pressureSub = document.getElementById("pressureSub");
const pressureCircle = document.getElementById("pressureCircle");

const temperatureVal = document.getElementById("temperatureVal");
const temperatureSub = document.getElementById("temperatureSub");
const temperatureCircle = document.getElementById("temperatureCircle");

const detailAlertsList = document.getElementById("detailAlertsList");
const powerStatVal = document.getElementById("powerStatVal");
const powerChangeVal = document.getElementById("powerChangeVal");
const powerEqualizerBars = document.getElementById("powerEqualizerBars");

// Production Page Elements
const kpiTotalRate = document.getElementById("kpiTotalRate");
const kpiCumToday = document.getElementById("kpiCumToday");
const kpiWaterCut = document.getElementById("kpiWaterCut");
const kpiGor = document.getElementById("kpiGor");
const productionTableBody = document.getElementById("productionTableBody");
const btnRefreshProdStats = document.getElementById("btnRefreshProdStats");

// SCADA Controls Deck Elements
const scadaTargetWellLabel = document.getElementById("scadaTargetWellLabel");
const treeChokeDisplay = document.getElementById("treeChokeDisplay");
const chokeSlider = document.getElementById("chokeSlider");
const chokeSliderVal = document.getElementById("chokeSliderVal");
const btnApplyChoke = document.getElementById("btnApplyChoke");
const srpSlider = document.getElementById("srpSlider");
const srpSliderVal = document.getElementById("srpSliderVal");
const btnApplySrp = document.getElementById("btnApplySrp");
const btnTriggerSteamSoak = document.getElementById("btnTriggerSteamSoak");
const btnEmergencyShutIn = document.getElementById("btnEmergencyShutIn");

// Reports Center Elements
const reportsCardsGrid = document.getElementById("reportsCardsGrid");
const reportSearchInput = document.getElementById("reportSearchInput");
const reportsFilterPills = document.querySelectorAll("#reportsFilterPills .filter-pill");
const btnExportAllReports = document.getElementById("btnExportAllReports");
const btnViewWellReport = document.getElementById("btnViewWellReport");
const tabReports = document.getElementById("tabReports");

// Report Modal Elements
const reportModalBackdrop = document.getElementById("reportModalBackdrop");
const modalBtnClose = document.getElementById("modalBtnClose");
const modalBtnPrint = document.getElementById("modalBtnPrint");
const modalBtnCsv = document.getElementById("modalBtnCsv");
const modalRepTitle = document.getElementById("modalRepTitle");
const modalRepSub = document.getElementById("modalRepSub");
const modalRepId = document.getElementById("modalRepId");
const modalRepDate = document.getElementById("modalRepDate");
const modalRepAuthor = document.getElementById("modalRepAuthor");
const modalRepHealth = document.getElementById("modalRepHealth");
const modalRepSummary = document.getElementById("modalRepSummary");
const modalParamFlow = document.getElementById("modalParamFlow");
const modalParamPressure = document.getElementById("modalParamPressure");
const modalParamCasing = document.getElementById("modalParamCasing");
const modalParamBhp = document.getElementById("modalParamBhp");
const modalParamTemp = document.getElementById("modalParamTemp");
const modalParamVisc = document.getElementById("modalParamVisc");
const modalParamWaterCut = document.getElementById("modalParamWaterCut");
const modalParamGor = document.getElementById("modalParamGor");
const modalParamChoke = document.getElementById("modalParamChoke");
const modalParamSteam = document.getElementById("modalParamSteam");
const modalAlertsBox = document.getElementById("modalAlertsBox");
const modalActionsList = document.getElementById("modalActionsList");

// WIDS Modal Elements
const widsBadgeBtn = document.getElementById("widsBadgeBtn");
const widsModalBackdrop = document.getElementById("widsModalBackdrop");
const widsModalClose = document.getElementById("widsModalClose");
const widsAnnulusA = document.getElementById("widsAnnulusA");
const widsAnnulusB = document.getElementById("widsAnnulusB");
const widsLiquidLevel = document.getElementById("widsLiquidLevel");
const widsCathodic = document.getElementById("widsCathodic");

// Card Action Modal Elements
const cardActionModal = document.getElementById("cardActionModal");
const cardActionTitle = document.getElementById("cardActionTitle");
const btnCardFullscreen = document.getElementById("btnCardFullscreen");
const btnCardExportCsv = document.getElementById("btnCardExportCsv");
const btnCardCalibrate = document.getElementById("btnCardCalibrate");
const btnCardAlarmLimits = document.getElementById("btnCardAlarmLimits");
const btnCardCancel = document.getElementById("btnCardCancel");

// Chatbot Elements
const floatingAI = document.getElementById("floatingAI");
const aiButton = document.getElementById("aiButton");
const chatModal = document.getElementById("chatModal");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");
const chipButtons = document.querySelectorAll(".chip-btn");

// =========================================
// LIVE UTC CLOCK
// =========================================
function updateClock() {
    const now = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[now.getUTCMonth()];
    const day = String(now.getUTCDate()).padStart(2, '0');
    const year = now.getUTCFullYear();
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
    if (systemTime) {
        systemTime.textContent = `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} UTC`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// =========================================
// NAVIGATION & PAGE SWITCHING
// =========================================
function showPage(pageId) {
    pages.forEach(p => p.classList.remove("active"));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    // Sync sidebar items
    navItems.forEach(item => {
        item.classList.toggle("active", item.dataset.page === pageId);
    });

    // Sync topbar tabs
    topTabs.forEach(tab => {
        if (pageId === 'dashboard') {
            tab.classList.toggle("active", tab.dataset.page === 'dashboard' || tab.id === 'tabSystemStatus');
        } else if (pageId === 'wells') {
            tab.classList.toggle("active", tab.dataset.page === 'wells');
        } else if (pageId === 'production') {
            tab.classList.toggle("active", tab.dataset.page === 'production');
        } else if (pageId === 'scada') {
            tab.classList.toggle("active", tab.dataset.page === 'scada');
        } else if (pageId === 'reports') {
            tab.classList.toggle("active", tab.dataset.page === 'reports' || tab.id === 'tabReports');
        } else {
            tab.classList.toggle("active", tab.dataset.page === pageId);
        }
    });

    // Special page loaders
    if (pageId === 'production') {
        loadProductionStats();
    } else if (pageId === 'reports') {
        loadReports();
    } else if (pageId === 'scada') {
        syncSCADAControls();
    }

    // Mobile sidebar auto-close
    if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
    }
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        showPage(item.dataset.page);
    });
});

topTabs.forEach(tab => {
    tab.addEventListener("click", () => {
        showPage(tab.dataset.page);
    });
});

if (brandHomeLink) {
    brandHomeLink.addEventListener("click", () => showPage("dashboard"));
}

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

if (btnBackToWells) {
    btnBackToWells.addEventListener("click", () => {
        showPage("wells");
    });
}

if (btnOpenSCADAControls) {
    btnOpenSCADAControls.addEventListener("click", () => {
        showPage("scada");
    });
}

// =========================================
// SVG WAVEFORM GENERATOR FOR IMAGE 1
// =========================================
function generateSparklineSvg(points, colorTheme, width = 175, height = 80) {
    if (!points || points.length < 2) return '';

    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = (max - min) || 1;
    const padding = 6;
    const chartHeight = height - padding * 2;
    const stepX = width / (points.length - 1);

    const coords = points.map((p, i) => {
        const x = i * stepX;
        const normalized = (p - min) / range;
        const y = height - padding - (normalized * chartHeight);
        return { x: Math.round(x), y: Math.round(y) };
    });

    let strokePath = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        strokePath += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }

    const areaPath = `${strokePath} L ${coords[coords.length - 1].x},${height} L ${coords[0].x},${height} Z`;

    let strokeColor = '#00dfa2';
    if (colorTheme === 'orange') strokeColor = '#ff8838';
    if (colorTheme === 'red') strokeColor = '#ff445c';
    if (colorTheme === 'blue') strokeColor = '#0ea5e9';

    const gradId = `sparkGrad_${Math.random().toString(36).substr(2, 9)}`;

    return `
        <svg viewBox="0 0 ${width} ${height}" class="card-sparkline-svg" preserveAspectRatio="none">
            <defs>
                <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.45"/>
                    <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
                </linearGradient>
            </defs>
            <path d="${areaPath}" fill="url(#${gradId})"/>
            <path d="${strokePath}" fill="none" stroke="${strokeColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
}

// Generate Smooth Wave Path for Current Production Card
function updateWaveChartSvg(points) {
    if (!waveAreaPath || !waveStrokePath || !points || points.length < 2) return;
    const width = 280;
    const height = 90;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = (max - min) || 1;
    const padding = 10;
    const stepX = width / (points.length - 1);

    const coords = points.map((p, i) => {
        const x = i * stepX;
        const normalized = (p - min) / range;
        const y = height - padding - (normalized * (height - padding * 2));
        return { x: Math.round(x), y: Math.round(y) };
    });

    let stroke = `M ${coords[0].x},${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
        const p0 = coords[i];
        const p1 = coords[i + 1];
        const cpX = (p0.x + p1.x) / 2;
        stroke += ` C ${cpX},${p0.y} ${cpX},${p1.y} ${p1.x},${p1.y}`;
    }
    const area = `${stroke} L ${coords[coords.length - 1].x},${height} L ${coords[0].x},${height} Z`;

    waveStrokePath.setAttribute("d", stroke);
    waveAreaPath.setAttribute("d", area);

    if (waveMarkerDot && coords.length > 2) {
        const peakIdx = Math.floor(coords.length * 0.7);
        waveMarkerDot.setAttribute("cx", coords[peakIdx].x);
        waveMarkerDot.setAttribute("cy", coords[peakIdx].y);
    }
}

// Update 24h Trend Chart Dual Paths
function updateTrendChartPaths(trend24h) {
    if (!trendCyanPath || !trendBluePath || !trend24h) return;
    const cyan = trend24h.cyanSeries || [45, 50, 70, 52, 90, 60, 110, 80, 85];
    const blue = trend24h.blueSeries || [30, 42, 35, 62, 45, 95, 55, 68, 75];

    const generateLine = (series, offset = 0) => {
        const startX = 30;
        const endX = 430;
        const step = (endX - startX) / (series.length - 1);
        return series.map((val, idx) => {
            const x = Math.round(startX + idx * step);
            const y = Math.round(105 - (val / 150) * 85 + offset);
            return `${idx === 0 ? 'M' : 'L'} ${x},${Math.max(10, Math.min(105, y))}`;
        }).join(' ');
    };

    trendCyanPath.setAttribute("d", generateLine(cyan, 0));
    trendBluePath.setAttribute("d", generateLine(blue, 6));
}

// =========================================
// RENDER WELLS GRID (IMAGE 1)
// =========================================
function renderImage1Wells(wells) {
    if (!image1WellsGrid) return;
    image1WellsGrid.innerHTML = '';

    const query = (wellSearchInput ? wellSearchInput.value : '').toLowerCase().trim();

    const filtered = wells.filter(well => {
        if (currentFilter === 'production' && well.type !== 'production') return false;
        if (currentFilter === 'injection' && well.type !== 'injection') return false;
        if (currentFilter === 'attention' && well.status !== 'ATTENTION') return false;

        if (query) {
            const matchesId = well.id.toLowerCase().includes(query);
            const matchesType = well.type.toLowerCase().includes(query);
            const matchesStatus = well.status.toLowerCase().includes(query);
            if (!matchesId && !matchesType && !matchesStatus) return false;
        }
        return true;
    });

    if (wellsCounterLabel) {
        wellsCounterLabel.textContent = `${filtered.length} Monitored Units`;
    }

    filtered.forEach(well => {
        const card = document.createElement('article');
        card.className = `image1-card theme-${well.colorTheme}`;
        card.dataset.wellId = well.id;
        card.title = `Click to inspect ${well.id} in Platform Delta-9`;

        const sparklineHtml = generateSparklineSvg(well.sparkline, well.colorTheme);

        card.innerHTML = `
            <div class="card-content-top">
                <div class="card-metrics-block">
                    <span class="card-well-id">${well.id}</span>
                    <span class="card-metric-label">${well.metricLabel}</span>
                    <strong class="card-metric-val">${well.displayMetric}</strong>
                </div>
                <div class="card-sparkline-wrap">
                    ${sparklineHtml}
                </div>
            </div>

            <div class="card-footer-row">
                <div class="card-footer-left">
                    <span>${well.subMetricLabel}</span>
                    <strong>${well.subMetricValue}</strong>
                </div>
                <div class="card-footer-right">
                    ${well.capacityBadge}
                </div>
            </div>
        `;

        card.addEventListener('click', () => {
            selectWell(well.id);
            showPage('dashboard');
        });

        image1WellsGrid.appendChild(card);
    });
}

// Filter pill buttons
filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentFilter = pill.dataset.filter;
        renderImage1Wells(allWells);
    });
});

if (wellSearchInput) {
    wellSearchInput.addEventListener('input', () => {
        renderImage1Wells(allWells);
    });
}

// =========================================
// SELECT WELL (INSTANT & SEAMLESS UPDATE)
// =========================================
function selectWell(wellId) {
    if (!wellId) return;
    const cleanId = wellId.toUpperCase();
    const well = allWells.find(w => w.id === cleanId || w.id.replace(' ', '') === cleanId.replace(' ', ''));
    if (!well) return;

    selectedWell = well;

    // 1. Update Badge & Dropdown
    if (platformOverviewTitle) {
        platformOverviewTitle.textContent = `PLATFORM DELTA-9 OVERVIEW`;
    }
    if (selectedWellName) {
        selectedWellName.textContent = `${well.id} ${well.status}`;
    }
    if (selectedWellDot) {
        selectedWellDot.className = `badge-dot ${well.status === 'ATTENTION' ? 'red' : (well.type === 'injection' ? 'blue' : 'green')}`;
    }
    if (wellSwitchSelect && wellSwitchSelect.value !== well.id) {
        wellSwitchSelect.value = well.id;
    }

    // 2. Left Column: Current Production / Average Injection
    if (cardProdTitle) {
        cardProdTitle.textContent = well.type === 'injection' ? "Average Injection" : "Current Production";
    }
    if (detailProdSubtitle) {
        detailProdSubtitle.textContent = well.type === 'injection' ? "Injection 24h trend" : "24h trend";
    }
    if (detailProdStat) {
        detailProdStat.innerHTML = `${well.flowRateShort || '1.8K'} <small>${well.type === 'injection' ? 'bpd (inj)' : 'bpd'}</small>`;
    }
    if (detailProdBadge) {
        detailProdBadge.textContent = well.flowRateGain || '+4.2%';
        detailProdBadge.className = `stat-badge ${well.flowRateGain && well.flowRateGain.startsWith('-') ? 'red' : 'green'}`;
    }

    // Dynamic wave chart
    if (well.sparkline) {
        updateWaveChartSvg(well.sparkline);
    }

    // Active Units List
    if (activeWellsRatio) {
        const onlineCount = well.activeSubUnits ? well.activeSubUnits.filter(u => u.active).length : 6;
        activeWellsRatio.textContent = `${onlineCount}/12 Online`;
    }
    if (activeSubUnitsList && well.activeSubUnits) {
        activeSubUnitsList.innerHTML = well.activeSubUnits.map(unit => {
            let dotClass = 'unit-dot';
            if (unit.status === 'Warning') dotClass += ' warning';
            if (unit.status === 'Fault') dotClass += ' fault';
            return `
                <div class="unit-row">
                    <div class="unit-left">
                        <span class="${dotClass}"></span>
                        <span>${unit.name}</span>
                    </div>
                    <span class="unit-status-text">${unit.status || 'Status'}</span>
                </div>
            `;
        }).join('');
    }

    // 3. Centerpiece: Rig Visualizer Callouts
    if (rigStatusVal) {
        rigStatusVal.textContent = well.rigStatus || 'ACTIVE';
        rigStatusVal.className = `callout-val ${well.rigStatus === 'DEGRADED' ? 'status-red' : 'status-green'}`;
    }
    if (rigDepthVal) rigDepthVal.textContent = well.depth || '2,450m';
    if (rigTopFlowVal) rigTopFlowVal.textContent = well.flowRateDisplay || '1,850 bpd';
    if (rigMidStatusVal) {
        rigMidStatusVal.textContent = well.status || 'ACTIVE';
        rigMidStatusVal.className = `callout-val ${well.status === 'ATTENTION' ? 'status-red' : 'status-green'}`;
    }
    if (rigBottomFlowVal) rigBottomFlowVal.textContent = well.flowRateShort || '1.85K bpd';
    if (rigGasVal) rigGasVal.textContent = well.gas || '4.2M scf/d';
    if (rigWaterVal) rigWaterVal.textContent = well.water || '1.1K bpd';

    // 24h Trend Chart
    if (well.trend24h) {
        updateTrendChartPaths(well.trend24h);
    }

    // 4. Right Column: System Overview Circular Gauges
    const circumference = 188.5;

    // Tank Level
    if (tankLevelVal) tankLevelVal.textContent = `${well.tankLevel || 84}%`;
    if (tankLevelSub) {
        tankLevelSub.textContent = well.tankLevelStatus || 'High';
        tankLevelSub.className = `gauge-sub ${well.tankLevel > 80 ? 'red' : 'green'}`;
    }
    if (tankLevelCircle) {
        const offset = circumference - (circumference * (well.tankLevel || 84)) / 100;
        tankLevelCircle.style.strokeDashoffset = offset;
    }

    // Pressure
    if (pressureVal) pressureVal.innerHTML = `${well.pressure || 210}<small>psi</small>`;
    if (pressureSub) {
        pressureSub.textContent = well.pressureStatus || 'Optimal';
        pressureSub.className = `gauge-sub ${well.pressure < 180 ? 'red' : 'green'}`;
    }
    if (pressureCircle) {
        const pressPct = Math.min(100, Math.max(10, ((well.pressure || 210) / 380) * 100));
        const offset = circumference - (circumference * pressPct) / 100;
        pressureCircle.style.strokeDashoffset = offset;
    }

    // Temperature
    if (temperatureVal) temperatureVal.textContent = `${well.temperature || 98}°F`;
    if (temperatureSub) {
        temperatureSub.textContent = well.temperatureStatus || 'Normal';
        temperatureSub.className = `gauge-sub ${well.temperature > 102 ? 'red' : 'green'}`;
    }
    if (temperatureCircle) {
        const tempPct = Math.min(100, Math.max(10, ((well.temperature || 98) / 150) * 100));
        const offset = circumference - (circumference * tempPct) / 100;
        temperatureCircle.style.strokeDashoffset = offset;
    }

    // Alerts Feed
    if (detailAlertsList && well.alerts) {
        detailAlertsList.innerHTML = well.alerts.map(alt => `
            <div class="feed-item">
                <span class="alert-feed-dot ${alt.dot || 'red'}"></span>
                <div class="feed-info">
                    <strong class="feed-msg">${alt.text}</strong>
                    <small class="feed-time">${alt.time}</small>
                </div>
            </div>
        `).join('');
    }

    // Power Consumption & Equalizer
    if (powerStatVal) powerStatVal.textContent = `${well.power || 1.2} MW`;
    if (powerChangeVal) {
        powerChangeVal.textContent = well.powerChange || '-2.1%';
        powerChangeVal.className = `power-change ${well.powerChange && well.powerChange.startsWith('+') ? 'red' : 'green'}`;
    }
    if (powerEqualizerBars && well.powerBars) {
        powerEqualizerBars.innerHTML = well.powerBars.map(h => `
            <span class="eq-bar" style="height: ${Math.min(100, h * 2.5)}%;"></span>
        `).join('');
    }

    // Sync SCADA Target label
    if (scadaTargetWellLabel) scadaTargetWellLabel.textContent = well.id;
    if (treeChokeDisplay) treeChokeDisplay.textContent = well.choke || "18/64 in";

    // Inform backend asynchronously
    fetch('/api/wells/active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wellId: well.id })
    }).catch(err => console.warn("Active well sync notice:", err));
}

// Dropdown Change Listener (instant switch for change and input events!)
if (wellSwitchSelect) {
    wellSwitchSelect.addEventListener('change', (e) => {
        selectWell(e.target.value);
    });
    wellSwitchSelect.addEventListener('input', (e) => {
        selectWell(e.target.value);
    });
}

// Quick AI diagnostic trigger button
if (btnRunDiagnostics) {
    btnRunDiagnostics.addEventListener('click', () => {
        if (!selectedWell) return;
        openChatModal();
        sendChatMessage(`Diagnose ${selectedWell.id} live telemetry and operational state`);
    });
}

// =========================================
// REAL-TIME SERVER-SENT EVENTS (SSE) STREAM
// =========================================
function connectTelemetryStream() {
    try {
        if (sseConnection) {
            sseConnection.close();
            sseConnection = null;
        }

        sseConnection = new EventSource('/api/stream');

        sseConnection.onopen = () => {
            if (backendStatusLabel) {
                backendStatusLabel.textContent = "LIVE SCADA CONNECTED";
                backendStatusLabel.style.color = "var(--teal)";
            }
            if (sidebarPulse) {
                sidebarPulse.style.background = "var(--teal)";
            }
        };

        sseConnection.onmessage = (event) => {
            try {
                if (backendStatusLabel) {
                    backendStatusLabel.textContent = "LIVE SCADA CONNECTED";
                    backendStatusLabel.style.color = "var(--teal)";
                }

                const data = JSON.parse(event.data);
                if (data.wells && Array.isArray(data.wells)) {
                    data.wells.forEach(wUpdate => {
                        const existing = allWells.find(w => w.id === wUpdate.id);
                        if (existing) {
                            existing.flowRate = wUpdate.flowRate;
                            existing.flowRateDisplay = wUpdate.flowRateDisplay;
                            existing.flowRateShort = wUpdate.flowRateShort;
                            existing.pressure = wUpdate.pressure;
                            existing.temperature = wUpdate.temperature;
                            existing.tankLevel = wUpdate.tankLevel;
                            existing.powerBars = wUpdate.powerBars;
                            existing.sparkline = wUpdate.sparkline;
                        }
                    });

                    // Re-render wells if on Wells page
                    const isWellsActive = document.getElementById("wells").classList.contains("active");
                    if (isWellsActive) {
                        renderImage1Wells(allWells);
                    }

                    // Update Image 2 detail if visible
                    if (selectedWell) {
                        const updated = allWells.find(w => w.id === selectedWell.id);
                        if (updated) {
                            if (rigTopFlowVal) rigTopFlowVal.textContent = updated.flowRateDisplay;
                            if (pressureVal) pressureVal.innerHTML = `${updated.pressure}<small>psi</small>`;
                            if (temperatureVal) temperatureVal.textContent = `${updated.temperature}°F`;
                            if (tankLevelVal) tankLevelVal.textContent = `${updated.tankLevel}%`;
                            if (powerEqualizerBars && updated.powerBars) {
                                powerEqualizerBars.innerHTML = updated.powerBars.map(h => `
                                    <span class="eq-bar" style="height: ${Math.min(100, h * 2.5)}%;"></span>
                                `).join('');
                            }
                        }
                    }
                }
            } catch (parseErr) {
                // Ignore ping
            }
        };

        sseConnection.onerror = () => {
            if (sseConnection && sseConnection.readyState === EventSource.CONNECTING) {
                if (backendStatusLabel) {
                    backendStatusLabel.textContent = "CONNECTING SCADA...";
                    backendStatusLabel.style.color = "var(--orange)";
                }
            }
        };
    } catch (e) {
        console.error("SSE error:", e);
    }
}

// Initial Data Fetch
async function loadInitialData() {
    // If pre-loaded data is already present, render immediately (0ms lag!)
    if (allWells && allWells.length > 0) {
        renderImage1Wells(allWells);
        allReportsData = generateReportsFromWells(allWells);
        renderReportsGrid();
        if (wellSwitchSelect) {
            wellSwitchSelect.innerHTML = allWells.map(w => `
                <option value="${w.id}" ${w.id === 'WELL 0002' ? 'selected' : ''}>${w.id} ${w.status === 'ATTENTION' ? '(Attention)' : (w.type === 'injection' ? '(Injection)' : '')}</option>
            `).join('');
            wellSwitchSelect.value = "WELL 0002";
        }
        selectWell("WELL 0002");
    }

    try {
        const response = await fetch('/api/wells');
        if (response.ok) {
            const data = await response.json();
            if (data.wells && Array.isArray(data.wells)) {
                allWells = data.wells;
                renderImage1Wells(allWells);
                allReportsData = generateReportsFromWells(allWells);
                renderReportsGrid();
                
                // Keep currently selected well or set active
                const currentVal = selectedWell ? selectedWell.id : (data.activeWellId || "WELL 0002");
                if (wellSwitchSelect) {
                    wellSwitchSelect.innerHTML = allWells.map(w => `
                        <option value="${w.id}" ${w.id === currentVal ? 'selected' : ''}>${w.id} ${w.status === 'ATTENTION' ? '(Attention)' : (w.type === 'injection' ? '(Injection)' : '')}</option>
                    `).join('');
                    wellSwitchSelect.value = currentVal;
                }

                selectWell(currentVal);
            }
        }
    } catch (err) {
        console.error("Failed to load initial wells data:", err);
    }

    connectTelemetryStream();
}

// =========================================
// PRODUCTION & INFLOW ANALYTICS LOADER
// =========================================
async function loadProductionStats() {
    try {
        const res = await fetch('/api/production/stats');
        if (!res.ok) return;
        const data = await res.json();

        if (kpiTotalRate) kpiTotalRate.innerHTML = `${data.totalProductionBpd.toLocaleString()} <small>bpd</small>`;
        if (kpiCumToday) kpiCumToday.innerHTML = `${data.cumulativeBblToday.toLocaleString()} <small>bbl</small>`;
        if (kpiWaterCut) kpiWaterCut.textContent = data.avgWaterCut;
        if (kpiGor) kpiGor.innerHTML = `${data.avgGor}`;

        if (productionTableBody && data.wellsLeaderboard) {
            productionTableBody.innerHTML = data.wellsLeaderboard.map((w, idx) => `
                <tr>
                    <td><strong>#${idx + 1}</strong> <span class="text-cyan">${w.id}</span></td>
                    <td>${w.name}</td>
                    <td>${w.choke}</td>
                    <td><strong class="text-white">${w.flowRateDisplay}</strong></td>
                    <td><span class="text-green">${w.health}</span></td>
                    <td><span class="unit-dot ${w.status === 'ATTENTION' ? 'fault' : 'green'}"></span> ${w.status}</td>
                    <td>
                        <button class="primary-button" style="padding: 4px 10px; font-size: 0.72rem;" onclick="selectWell('${w.id}'); showPage('dashboard');">Inspect</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (e) {
        console.error("Production stats load error:", e);
    }
}

if (btnRefreshProdStats) {
    btnRefreshProdStats.addEventListener("click", () => {
        btnRefreshProdStats.textContent = "Refreshing...";
        loadProductionStats().then(() => {
            btnRefreshProdStats.textContent = "Field Stats Updated ✓";
            setTimeout(() => btnRefreshProdStats.textContent = "↻ Refresh Field Inflow", 1500);
        });
    });
}

// =========================================
// SCADA WELLHEAD REMOTE CONTROLS
// =========================================
function syncSCADAControls() {
    if (!selectedWell) return;
    if (scadaTargetWellLabel) scadaTargetWellLabel.textContent = selectedWell.id;
    if (treeChokeDisplay) treeChokeDisplay.textContent = selectedWell.choke || "18/64 in";

    // Set choke slider
    const currentChokeNum = parseInt((selectedWell.choke || "18").replace(/[^0-9]/g, ''), 10) || 18;
    if (chokeSlider) chokeSlider.value = currentChokeNum;
    if (chokeSliderVal) chokeSliderVal.textContent = `${currentChokeNum}/64"`;

    // Set SRP speed slider
    if (srpSlider) srpSlider.value = selectedWell.srpSpeed || 5.4;
    if (srpSliderVal) srpSliderVal.textContent = `${selectedWell.srpSpeed || 5.4} SPM`;
}

if (chokeSlider && chokeSliderVal) {
    chokeSlider.addEventListener("input", (e) => {
        chokeSliderVal.textContent = `${e.target.value}/64"`;
        if (treeChokeDisplay) treeChokeDisplay.textContent = `${e.target.value}/64 in`;
    });
}

if (srpSlider && srpSliderVal) {
    srpSlider.addEventListener("input", (e) => {
        srpSliderVal.textContent = `${e.target.value} SPM`;
    });
}

// Apply Choke button
if (btnApplyChoke) {
    btnApplyChoke.addEventListener("click", async () => {
        if (!selectedWell) return;
        const chokeVal = chokeSlider ? chokeSlider.value : 18;
        btnApplyChoke.textContent = "Applying...";
        try {
            const res = await fetch(`/api/wells/${encodeURIComponent(selectedWell.id)}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'adjust_choke', chokeSize: chokeVal })
            });
            const data = await res.json();
            if (data.well) {
                // Update local well cache
                Object.assign(selectedWell, data.well);
                selectWell(selectedWell.id);
            }
            btnApplyChoke.textContent = "Applied ✓";
            showNotification(data.message);
            setTimeout(() => btnApplyChoke.textContent = "Apply Choke Shift", 1800);
        } catch (e) {
            btnApplyChoke.textContent = "Failed";
        }
    });
}

// Apply SRP Speed button
if (btnApplySrp) {
    btnApplySrp.addEventListener("click", async () => {
        if (!selectedWell) return;
        const spm = srpSlider ? srpSlider.value : 5.4;
        btnApplySrp.textContent = "Applying...";
        try {
            const res = await fetch(`/api/wells/${encodeURIComponent(selectedWell.id)}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'adjust_srp', srpSpeed: spm })
            });
            const data = await res.json();
            if (data.well) {
                Object.assign(selectedWell, data.well);
                selectWell(selectedWell.id);
            }
            btnApplySrp.textContent = "Applied ✓";
            showNotification(data.message);
            setTimeout(() => btnApplySrp.textContent = "Adjust SPM", 1800);
        } catch (e) {
            btnApplySrp.textContent = "Failed";
        }
    });
}

// Trigger Steam Soak button
if (btnTriggerSteamSoak) {
    btnTriggerSteamSoak.addEventListener("click", async () => {
        if (!selectedWell) return;
        btnTriggerSteamSoak.textContent = "🔥 Injecting 350°F Steam...";
        try {
            const res = await fetch(`/api/wells/${encodeURIComponent(selectedWell.id)}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'steam_soak', steamAmount: '2,400 bbl' })
            });
            const data = await res.json();
            if (data.well) {
                Object.assign(selectedWell, data.well);
                selectWell(selectedWell.id);
            }
            btnTriggerSteamSoak.textContent = "Thermal Flush Complete ✓";
            showNotification(data.message);
            setTimeout(() => btnTriggerSteamSoak.textContent = "🔥 Inject 2,400 bbl Steam Soak", 2500);
        } catch (e) {
            btnTriggerSteamSoak.textContent = "Failed";
        }
    });
}

// Emergency Shut-In (ESD) button
if (btnEmergencyShutIn) {
    btnEmergencyShutIn.addEventListener("click", async () => {
        if (!selectedWell) return;
        const confirmed = confirm(`EMERGENCY SHUT-IN WARNING:\nAre you sure you want to toggle Surface Safety Valve (SSV) for ${selectedWell.id}?`);
        if (!confirmed) return;

        try {
            const res = await fetch(`/api/wells/${encodeURIComponent(selectedWell.id)}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'shut_in' })
            });
            const data = await res.json();
            if (data.well) {
                Object.assign(selectedWell, data.well);
                selectWell(selectedWell.id);
            }
            showNotification(data.message);
        } catch (e) {
            alert("ESD command failed to transmit to SCADA RTU.");
        }
    });
}

// =========================================
// REPORTS CENTER UTILITIES & CSV EXPORT
// =========================================
function downloadCsvBlob(csvContent, filename) {
    try {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
        console.error("CSV Download Blob error:", e);
    }
}

function exportSingleWellCsv(wellId) {
    const cleanId = (wellId || (selectedWell ? selectedWell.id : "WELL 0001")).toUpperCase().trim();
    const well = allWells.find(w => w.id === cleanId || w.id.replace(/\s+/g, '') === cleanId.replace(/\s+/g, ''))
        || (selectedWell && selectedWell.id === cleanId ? selectedWell : allWells[0]);
    if (!well) return;

    const filename = `PetroFlow_${well.id.replace(/\s+/g, '_')}_Telemetry_Report.csv`;
    let csv = "Timestamp_UTC,Well_ID,Well_Name,Status,Type,FlowRate_bpd,Pressure_psi,Temperature_F,Viscosity_cP,WaterCut_pct,GOR_scf_bbl,Choke,HealthIndex,Power_MW\n";
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
        const timeStr = new Date(now - i * 3600000).toISOString();
        const flow = Math.round((well.flowRate || 1800) + (Math.sin(i) * 35));
        const press = Math.round((well.pressure || 210) + (Math.cos(i) * 4));
        const temp = Math.round(((well.temperature || 98) + Math.sin(i * 0.5) * 0.8) * 10) / 10;
        csv += `${timeStr},${well.id},"${well.name}",${well.status},${well.type},${flow},${press},${temp},${well.viscosity},"${well.waterCut}","${well.gor}","${well.choke}",${well.displayMetric || well.metricValue || 0.85},${well.power || 1.1}\n`;
    }
    downloadCsvBlob(csv, filename);
    showNotification(`Downloaded SCADA Telemetry CSV for ${well.id}`);
}

function exportAllWellsCsv() {
    const list = (allWells && allWells.length > 0) ? allWells : (window.PETRO_INITIAL_WELLS || []);
    if (!list || list.length === 0) return;

    const filename = `PetroFlow_All_15_Wells_Consolidated_SCADA_Report.csv`;
    let csv = "Well_ID,Well_Name,Type,Status,FlowRate_bpd,Pressure_psi,Temperature_F,Viscosity_cP,WaterCut,GOR,Choke,Health_Index,BHP_psi,Power_MW\n";
    list.forEach(w => {
        csv += `${w.id},"${w.name}",${w.type},${w.status},${w.flowRate || 0},${w.pressure || 0},${w.temperature || 0},${w.viscosity || 0},"${w.waterCut || '0%'}","${w.gor || '0'}","${w.choke || '18/64 in'}",${w.displayMetric || w.metricValue || 0.85},${w.bhp || '1800'},${w.power || 1.1}\n`;
    });
    downloadCsvBlob(csv, filename);
    showNotification("Downloaded Consolidated SCADA Report for all 15 wells");
}

function generateReportsFromWells(wells) {
    if (!wells || !Array.isArray(wells)) return [];
    return wells.map(well => {
        let title = "Daily Production & Inflow Performance Log";
        let category = "Production Surveillance";
        let priority = "Normal";

        if (well.type === 'injection') {
            title = "High-Pressure Injection Gradient & Sweep Conformance";
            category = "Reservoir Pressure Support";
        } else if (well.status === 'ATTENTION') {
            title = well.id === 'WELL 0005'
                ? "Severe Rod-Float & Sucker Rod Pump Failure Diagnostic"
                : "Water Cut Surge & Annulus Pressure Diagnostic";
            category = "Artificial Lift Mechanical Integrity";
            priority = "Critical";
        }

        const anomalies = (well.alerts && Array.isArray(well.alerts) && well.alerts.length > 0)
            ? well.alerts.map(a => `${a.time || '12:00 PM'} - ${a.text || 'Telemetry nominal'}`)
            : ["01:20 PM - Inflow Gradient Stable & Nominal"];

        const actions = (well.recommendedActions && Array.isArray(well.recommendedActions) && well.recommendedActions.length > 0)
            ? well.recommendedActions
            : (well.id === 'WELL 0005' ? [
                "Reduce Sucker Rod Pump speed from 6.8 SPM to 4.2 SPM immediately to prevent rod buckling.",
                "Execute 2,400 bbl cyclic steam stimulation (CSS) batch to drop heavy crude viscosity below 80 cP.",
                "Re-run dynagraph surface card after thermal soak."
            ] : (well.status === 'ATTENTION' ? [
                "Isolate wellhead manifold and inspect casing-tubing annulus pressure buildup.",
                "Perform acoustic fluid level test and inspect pump valve seat integrity."
            ] : [
                "Maintain optimal choke bean size and monitor separator backpressure.",
                "Scheduled acoustic fluid level surveillance in 72 hours."
            ]));

        return {
            id: `REP-${well.id.replace(/\s+/g, '-')}`,
            wellId: well.id,
            wellName: well.name,
            wellType: well.type,
            wellStatus: well.status,
            title: title,
            category: category,
            priority: priority,
            date: "Today, 18:30 UTC",
            fileSize: "2.8 MB",
            author: "PETRO-AI Surveillance Engine v5.1",
            healthIndex: well.displayMetric || well.metricValue || "0.85",
            flowRate: well.flowRateDisplay || `${well.flowRate || 1800} bpd`,
            choke: well.choke || "18/64 in",
            bhp: well.bhp ? `${well.bhp} psi` : "1,840 psi",
            tubingHeadPressure: well.tubingPressure ? `${well.tubingPressure} psi` : `${well.pressure || 210} psi`,
            casingPressure: well.casingPressure ? `${well.casingPressure} psi` : "45 psi",
            temperature: well.temperature ? `${well.temperature}°F` : "98°F",
            viscosity: well.viscosity ? `${well.viscosity} cP` : "140 cP",
            waterCut: well.waterCut || "14.2%",
            gor: well.gor || "420 scf/bbl",
            steamInjected: well.steamInjectedBbl ? `${well.steamInjectedBbl.toLocaleString()} bbl` : "14,800 bbl",
            oilGravity: well.oilGravityAPI ? `${well.oilGravityAPI}° API` : "17.0° API",
            executiveSummary: well.diagnosis || "Operating stably within SCADA nominal envelope. Automated surveillance active.",
            anomaliesLog: anomalies,
            recommendedActions: actions
        };
    });
}

// =========================================
// REPORTS CENTER LOADER & MODAL
// =========================================
async function loadReports() {
    // 1. Immediately ensure reports data is available and rendered from allWells
    if (!allReportsData || allReportsData.length === 0) {
        if (allWells && allWells.length > 0) {
            allReportsData = generateReportsFromWells(allWells);
        } else if (typeof window !== 'undefined' && Array.isArray(window.PETRO_INITIAL_WELLS)) {
            allReportsData = generateReportsFromWells(window.PETRO_INITIAL_WELLS);
        }
    }
    renderReportsGrid();

    // 2. Fetch live reports from backend if online
    try {
        const res = await fetch('/api/reports');
        if (res.ok) {
            const data = await res.json();
            if (data.reports && Array.isArray(data.reports) && data.reports.length > 0) {
                allReportsData = data.reports;
                renderReportsGrid();
            }
        }
    } catch (e) {
        // Fallback is already safely rendered
        console.log("Backend offline or static mode, client reports active.");
    }
}

function renderReportsGrid() {
    if (!reportsCardsGrid) return;
    reportsCardsGrid.innerHTML = '';

    // If allReportsData is still empty, populate from allWells
    if (!allReportsData || allReportsData.length === 0) {
        if (allWells && allWells.length > 0) {
            allReportsData = generateReportsFromWells(allWells);
        } else if (typeof window !== 'undefined' && Array.isArray(window.PETRO_INITIAL_WELLS)) {
            allReportsData = generateReportsFromWells(window.PETRO_INITIAL_WELLS);
        }
    }

    const query = (reportSearchInput ? reportSearchInput.value : '').toLowerCase().trim();

    const filtered = (allReportsData || []).filter(rep => {
        if (currentReportFilter === 'production') {
            const isProd = rep.wellType === 'production' || (rep.category && rep.category.includes('Production'));
            if (!isProd) return false;
        }
        if (currentReportFilter === 'injection') {
            const isInj = rep.wellType === 'injection' || (rep.category && (rep.category.includes('Injection') || rep.category.includes('Pressure Support')));
            if (!isInj) return false;
        }
        if (currentReportFilter === 'attention') {
            const isAttn = rep.priority === 'Critical' || rep.wellStatus === 'ATTENTION';
            if (!isAttn) return false;
        }

        if (query) {
            const matchId = (rep.wellId || '').toLowerCase().includes(query);
            const matchTitle = (rep.title || '').toLowerCase().includes(query);
            const matchAuthor = (rep.author || '').toLowerCase().includes(query);
            const matchName = (rep.wellName || '').toLowerCase().includes(query);
            if (!matchId && !matchTitle && !matchAuthor && !matchName) return false;
        }
        return true;
    });

    if (filtered.length === 0) {
        reportsCardsGrid.innerHTML = `
            <div class="reports-empty-state">
                <div style="font-size: 2.2rem; margin-bottom: 8px;">📑</div>
                <h4>No Matching Reports Found</h4>
                <p>No well engineering dossiers match your current search query or filter selection.</p>
                <button type="button" class="primary-button" id="btnResetReportsFilter" style="margin: 0 auto;">Reset Filter & Search</button>
            </div>
        `;
        const resetBtn = document.getElementById("btnResetReportsFilter");
        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                currentReportFilter = 'all';
                reportsFilterPills.forEach(p => p.classList.toggle("active", p.dataset.repfilter === 'all'));
                if (reportSearchInput) reportSearchInput.value = '';
                renderReportsGrid();
            });
        }
        return;
    }

    filtered.forEach(rep => {
        const card = document.createElement("div");
        card.className = "report-entry-card";
        card.style.cursor = "pointer";
        const isCritical = rep.priority === 'Critical' || rep.wellStatus === 'ATTENTION';

        card.innerHTML = `
            <div>
                <div class="rep-card-top">
                    <span class="rep-badge-pill ${isCritical ? 'critical' : ''}">${rep.category || 'Surveillance'}</span>
                    <span class="rep-date">${rep.date || 'Today, 18:30 UTC'}</span>
                </div>
                <h3 class="rep-card-title">${rep.title || 'Engineering Dossier'}</h3>
                <p class="rep-card-well"><strong>${rep.wellId}</strong> — ${rep.wellName || ''}</p>

                <div class="rep-metrics-row">
                    <div class="rep-metric-item">
                        <span>Flow Rate</span>
                        <strong>${rep.flowRate || '1,800 bpd'}</strong>
                    </div>
                    <div class="rep-metric-item">
                        <span>Pressure</span>
                        <strong>${rep.tubingHeadPressure || '210 psi'}</strong>
                    </div>
                    <div class="rep-metric-item">
                        <span>Water Cut</span>
                        <strong>${rep.waterCut || '14%'}</strong>
                    </div>
                </div>
            </div>

            <div class="rep-card-actions">
                <button type="button" class="btn-view-rep" data-wellid="${rep.wellId}">👁️ View Full Report</button>
                <button type="button" class="btn-dl-csv" data-wellid="${rep.wellId}" title="Download SCADA CSV">⬇️ CSV</button>
            </div>
        `;

        const viewBtn = card.querySelector('.btn-view-rep');
        if (viewBtn) {
            viewBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                openReportModal(rep);
            });
        }

        const dlBtn = card.querySelector('.btn-dl-csv');
        if (dlBtn) {
            dlBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                exportSingleWellCsv(rep.wellId);
            });
        }

        // Entire card click opens modal
        card.addEventListener("click", () => {
            openReportModal(rep);
        });

        reportsCardsGrid.appendChild(card);
    });
}

// Filter pills on Reports page
reportsFilterPills.forEach(pill => {
    pill.addEventListener("click", () => {
        reportsFilterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        currentReportFilter = pill.dataset.repfilter;
        renderReportsGrid();
    });
});

if (reportSearchInput) {
    reportSearchInput.addEventListener("input", renderReportsGrid);
}

// Open Full Dossier Report Modal
function openReportModal(rep) {
    if (!reportModalBackdrop || !rep) return;

    if (modalRepTitle) modalRepTitle.textContent = rep.title || "Daily Production & Inflow Performance Log";
    if (modalRepSub) modalRepSub.textContent = `${rep.wellId} — ${rep.wellName || ''} • Platform Delta-9`;
    if (modalRepId) modalRepId.textContent = rep.id || `REP-${rep.wellId.replace(/\s+/g, '-')}`;
    if (modalRepDate) modalRepDate.textContent = rep.date || "Today, 18:30 UTC";
    if (modalRepAuthor) modalRepAuthor.textContent = rep.author || "PETRO-AI Surveillance Engine v5.1";
    if (modalRepHealth) modalRepHealth.textContent = rep.healthIndex || "0.85";
    if (modalRepSummary) modalRepSummary.textContent = rep.executiveSummary || "Operating stably within nominal envelopes.";

    if (modalParamFlow) modalParamFlow.textContent = rep.flowRate || "1,850 bpd";
    if (modalParamPressure) modalParamPressure.textContent = rep.tubingHeadPressure || "210 psi";
    if (modalParamCasing) modalParamCasing.textContent = rep.casingPressure || "45 psi";
    if (modalParamBhp) modalParamBhp.textContent = rep.bhp || "1,840 psi";
    if (modalParamTemp) modalParamTemp.textContent = rep.temperature || "98°F";
    if (modalParamVisc) modalParamVisc.textContent = rep.viscosity || "140 cP";
    if (modalParamWaterCut) modalParamWaterCut.textContent = rep.waterCut || "14.2%";
    if (modalParamGor) modalParamGor.textContent = rep.gor || "420 scf/bbl";
    if (modalParamChoke) modalParamChoke.textContent = rep.choke || "18/64 in";
    if (modalParamSteam) modalParamSteam.textContent = rep.steamInjected || "14,800 bbl";

    if (modalAlertsBox) {
        modalAlertsBox.innerHTML = (rep.anomaliesLog && Array.isArray(rep.anomaliesLog) && rep.anomaliesLog.length > 0)
            ? rep.anomaliesLog.map(a => `<div style="padding: 3px 0;">⚠️ ${a}</div>`).join('')
            : `<div style="color: var(--teal);">✓ All sensor safety envelopes nominal. Zero threshold breaches.</div>`;
    }

    if (modalActionsList) {
        const actions = (rep.recommendedActions && Array.isArray(rep.recommendedActions) && rep.recommendedActions.length > 0)
            ? rep.recommendedActions
            : ["Maintain optimal choke bean size and monitor separator backpressure.", "Scheduled acoustic fluid level surveillance in 72 hours."];
        modalActionsList.innerHTML = actions.map(act => `<li>${act}</li>`).join('');
    }

    // Hook CSV button to direct download
    if (modalBtnCsv) {
        modalBtnCsv.onclick = () => {
            exportSingleWellCsv(rep.wellId);
        };
    }

    reportModalBackdrop.classList.add("show");
}

if (modalBtnClose && reportModalBackdrop) {
    modalBtnClose.addEventListener("click", () => {
        reportModalBackdrop.classList.remove("show");
    });
}

// Click outside modal to close
if (reportModalBackdrop) {
    reportModalBackdrop.addEventListener("click", (e) => {
        if (e.target === reportModalBackdrop) {
            reportModalBackdrop.classList.remove("show");
        }
    });
}

// Escape key closes modals
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        if (reportModalBackdrop && reportModalBackdrop.classList.contains("show")) {
            reportModalBackdrop.classList.remove("show");
        }
        if (widsModalBackdrop && widsModalBackdrop.classList.contains("show")) {
            widsModalBackdrop.classList.remove("show");
        }
        if (cardActionModal && cardActionModal.classList.contains("show")) {
            cardActionModal.classList.remove("show");
        }
    }
});

if (modalBtnPrint) {
    modalBtnPrint.addEventListener("click", () => {
        window.print();
    });
}

// Export All Reports CSV button
if (btnExportAllReports) {
    btnExportAllReports.addEventListener("click", () => {
        exportAllWellsCsv();
    });
}

// Dashboard direct link to selected well report
if (btnViewWellReport) {
    btnViewWellReport.addEventListener("click", () => {
        if (!selectedWell) return;
        let rep = allReportsData.find(r => r.wellId === selectedWell.id);
        if (!rep) {
            const list = generateReportsFromWells([selectedWell]);
            rep = list[0];
        }
        if (rep) {
            openReportModal(rep);
        }
    });
}

// =========================================
// WIDS (WELL INTEGRITY) MODAL
// =========================================
if (widsBadgeBtn && widsModalBackdrop) {
    widsBadgeBtn.addEventListener("click", async () => {
        try {
            const res = await fetch('/api/wids');
            if (res.ok) {
                const data = await res.json();
                if (widsAnnulusA) widsAnnulusA.textContent = data.annulusPressureA;
                if (widsAnnulusB) widsAnnulusB.textContent = data.annulusPressureB;
                if (widsLiquidLevel) widsLiquidLevel.textContent = data.acousticLiquidLevel;
                if (widsCathodic) widsCathodic.textContent = data.cathodicProtectionPotential;
            }
        } catch (e) {}
        widsModalBackdrop.classList.add("show");
    });
}

if (widsModalClose && widsModalBackdrop) {
    widsModalClose.addEventListener("click", () => {
        widsModalBackdrop.classList.remove("show");
    });
}

// =========================================
// CARD CONTEXT ACTIONS (••• THREE DOTS)
// =========================================
document.querySelectorAll(".card-dots").forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        activeCardTarget = btn.dataset.card || "SCADA Telemetry";
        if (cardActionTitle) cardActionTitle.textContent = `${activeCardTarget} - Actions`;
        if (cardActionModal) cardActionModal.classList.add("show");
    });
});

if (btnCardCancel && cardActionModal) {
    btnCardCancel.addEventListener("click", () => {
        cardActionModal.classList.remove("show");
    });
}

if (btnCardFullscreen) {
    btnCardFullscreen.addEventListener("click", () => {
        if (cardActionModal) cardActionModal.classList.remove("show");
        showNotification(`Expanded fullscreen view enabled for ${activeCardTarget}.`);
    });
}

if (btnCardExportCsv) {
    btnCardExportCsv.addEventListener("click", () => {
        if (cardActionModal) cardActionModal.classList.remove("show");
        if (selectedWell) {
            window.location.href = `/api/reports/${selectedWell.id}/download.csv`;
        }
    });
}

if (btnCardCalibrate) {
    btnCardCalibrate.addEventListener("click", () => {
        if (cardActionModal) cardActionModal.classList.remove("show");
        showNotification(`RTU sensor zero-point recalibration completed for ${activeCardTarget} (Zero Drift).`);
    });
}

if (btnCardAlarmLimits) {
    btnCardAlarmLimits.addEventListener("click", () => {
        if (cardActionModal) cardActionModal.classList.remove("show");
        const high = prompt(`Enter High Alarm Threshold for ${activeCardTarget}:`, "240");
        if (high) {
            showNotification(`Alarm threshold set to ${high} for ${activeCardTarget}.`);
        }
    });
}

// Toast Notification Helper
function showNotification(text) {
    const toast = document.createElement("div");
    toast.style.cssText = `
        position: fixed;
        top: 70px;
        right: 28px;
        background: #0f1c2e;
        border: 1px solid var(--cyan);
        color: #ffffff;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 16px var(--cyan-glow);
        font-size: 0.85rem;
        z-index: 2000;
        animation: slideDown 0.3s ease;
    `;
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// =========================================
// LIVE AI CHATBOT (PETRO-AI)
// =========================================
function openChatModal() {
    if (chatModal) {
        chatModal.classList.add("show");
        if (chatInput) chatInput.focus();
    }
}

function closeChatModal() {
    if (chatModal) {
        chatModal.classList.remove("show");
    }
}

if (floatingAI) floatingAI.addEventListener("click", openChatModal);
if (aiButton) aiButton.addEventListener("click", openChatModal);
if (closeChat) closeChat.addEventListener("click", closeChatModal);

function appendChatMessage(html, sender = "bot") {
    if (!chatMessages) return null;
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-message" : "bot-message";
    msgDiv.innerHTML = html;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msgDiv;
}

function formatMarkdown(text) {
    if (!text) return "";
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/• (.*?)(?=(\n•|\n\n|$))/g, '<div style="margin-left: 12px; margin-top: 3px;">• $1</div>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');
    return formatted;
}

// ==========================================
// CLIENT-SIDE PETRO-AI INTELLIGENCE ENGINE
// Guarantees instant & professional answers
// for Greetings, SOR, CSS, Well Diagnostics & SCADA
// ==========================================
function generateLocalAIResponse(question) {
    const q = (question || "").toLowerCase().trim();

    // 1. GREETINGS
    const greetings = ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "kaise ho", "kya haal", "hola", "sup", "greetings"];
    const isGreeting = greetings.some(g => q === g || q.startsWith(g + " ") || q.endsWith(" " + g));
    if (isGreeting && q.length < 35) {
        return `👋 **Hello & Welcome to PETRO-AI!**
Main Platform Delta-9 (Baghewala Heavy Oil Field) ka dedicated **Digital-Well Intelligence Agent** hoon.

Main real-time mein sabhi **15 active wells (WELL 0001 se WELL 0015)** ka SCADA sensor data, wellhead pressures, rod-float risks, aur thermal steam dynamics monitor kar raha hoon.

Aap mujhse pooch sakte hain:
• **SOR (Steam-Oil Ratio)** kya hai aur ise kaise optimize karein?
• **CSS (Cyclic Steam Stimulation)** huff-and-puff mechanism
• Kisi bhi specific well ka diagnostic (e.g. *"WELL 0005 me kya issue hai?"*)
• Choke adjustment, SRP speed, ya field reports download help
• Total field production aur SCADA alerts summary.`;
    }

    // 2. SOR (Steam-Oil Ratio) Query
    if (q.includes("sor") || q.includes("steam-oil") || q.includes("steam oil ratio")) {
        return `📊 **Comprehensive Guide: Steam-Oil Ratio (SOR)**

**1. Definition & Fundamental Formula:**
$$\\text{SOR} = \\frac{\\text{Cold Water Equivalent (CWE) Steam Injected (bbl)}}{\\text{Heavy Crude Oil Produced (bbl)}}$$
SOR thermal Enhanced Oil Recovery (EOR) ka sabse critical thermodynamic aur economic indicator hai. Yeh batata hai ki ek barrel heavy oil nikaalne ke liye kitne barrels steam inject karni padti hai.

**2. Key Types of SOR:**
• **Instantaneous SOR (ISOR):** Daily basis ya current steam cycle par measured ratio.
• **Cumulative SOR (CSOR):** Field ya well ke lifetime mein total steam injected divided by total oil produced.

**3. Economic & Technical Benchmarks (Baghewala Field, 16° API):**
• **Optimal SOR (< 2.8 - 3.2):** High thermal efficiency. Heat loss minimum hai aur reservoir sweep uniform hai.
• **Acceptable SOR (3.2 - 4.2):** Economic break-even range depending on steam fuel & natural gas prices.
• **Critical SOR (> 4.8):** Warning! Indicating steam channeling, thief zone losses, ya premature steam breakthrough.

**4. How to Optimize SOR in Platform Delta-9:**
1. Choke size ko 18/64" par control karein taaki early steam bypass na ho.
2. High-temperature polymer foam diverters inject karein taaki steam thief zones block ho sakein.
3. Cyclic Steam Stimulation (CSS) mein soak period (3–5 days) accurately maintain karein.`;
    }

    // 3. CSS (Cyclic Steam Stimulation / "Huff and Puff")
    if (q.includes("css") || q.includes("cyclic steam") || q.includes("huff and puff") || q.includes("steam soak") || q.includes("steam injection")) {
        return `🔥 **Cyclic Steam Stimulation (CSS) / 'Huff and Puff' Technical Dossier**

**1. Mechanism & Objective:**
CSS ek cyclic thermal stimulation technique hai jo ultra-viscous crudes (Viscosity > 1,000 cP) ke liye design ki gayi hai. Temperature badhne se crude oil ki viscosity exponentially drop hoti hai—Baghewala heavy oil reservoir mein **1,200 cP at 90°F se घटकर ~35 cP at 300°F** ho jaati hai!

**2. The Three Sequential Operating Stages:**
• **Stage 1: Injection ('Huff'):**
  - High-pressure dry saturated steam (80% steam quality) at 350°F ko 2,000 se 3,500 bbl volume mein 2 se 4 weeks ke liye wellbore mein inject kiya jata hai.
• **Stage 2: Soaking:**
  - Well ko **3 se 7 days ke liye shut-in** kiya jata hai taaki heat conduction reservoir formation aur heavy asphaltic wax matrix mein deeply penetrate ho sake.
• **Stage 3: Production ('Puff'):**
  - Well ko wapas Sucker Rod Pump (SRP) par lagaya jata hai. Heavy oil fluid mobility restore hone se production initial rate 3x se 5x surge karti hai aur rod-float risk mitigate ho jata hai!

**3. Active Field Status:**
• **WELL 0005** is currently the primary candidate for an immediate 2,400 bbl CSS flush to eliminate rod-float risk (68%).
• SCADA tab mein aap direct **'🔥 Inject 2,400 bbl Steam Soak'** button click karke steam flush cycle initiate kar sakte hain!`;
    }

    // 4. Rod-Float Risk & Sucker Rod Pump (SRP)
    if (q.includes("rod-float") || q.includes("rod float") || q.includes("srp") || q.includes("viscosity") || q.includes("fluid pound")) {
        return `⚙️ **Rod-Float Mechanics & Mitigation Protocol**

**1. Root Cause:**
Cold heavy crude (viscosity > 140 cP) mein downstroke ke dauran sucker rod par frictional viscous drag downward gravitational acceleration se zyada ho jata hai ($F_{\\text{drag}} > W_{\\text{rod}} - F_{\\text{buoyant}}$).
Isse rod string downstroke par float/buckle karti hai, pump barrel fill nahi hota, aur upstroke aate hi **Severe Fluid Pound** shock load generate hota hai.

**2. High Risk Target: WELL 0005 (Rod-Float Risk: 68%):**
• Oil viscosity: **158 cP**
• Current stroke rate: **6.8 SPM** (too high for viscous crude fall velocity).

**3. Immediate Operational Protocol:**
1. SCADA control tab mein jaakar SPM ko 6.8 se **4.2 SPM** par adjust karein.
2. Initiate 2,400 bbl Cyclic Steam Stimulation (CSS) flush.
3. Install continuous chemical pour-point depressant at wellhead.`;
    }

    // 5. Specific Well Queries (WELL 0001 through WELL 0015)
    for (const well of allWells) {
        const idLower = well.id.toLowerCase();
        const shortNum = well.id.replace(/[^0-9]/g, '');
        const shortNumStripped = parseInt(shortNum, 10).toString();
        
        if (q.includes(idLower) || q.includes(`well ${shortNum}`) || q.includes(`well ${shortNumStripped}`) || q.includes(`well${shortNumStripped}`)) {
            if (q.includes("issue") || q.includes("problem") || q.includes("dikkat") || q.includes("health") || q.includes("kharab") || q.includes("kyu") || q.includes("why")) {
                if (well.id === "WELL 0005") {
                    return `🚨 **Diagnostic Report for WELL 0005 (Critical):**
• **Health Index:** 0.57 (RED ALERT) | Flow Rate: 1,220 bpd (-12.4%)
• **Root Cause:** Heavy oil viscosity accumulation (158 cP) has triggered severe **Rod-Float Risk (68%)**. Sucker rod string floats on downstroke, causing delayed pump fillage & fluid pound shock.
• **SCADA Readings:** Pressure 172 psi (Low warning), Tank Level 92%, Temperature 104°F.
• **Action Plan:**
  1. SCADA tab mein jakar SRP Speed **4.2 SPM** karein.
  2. **'🔥 Inject 2,400 bbl Steam Soak'** dabayein taaki viscosity 45 cP par drop ho sake.`;
                } else if (well.id === "WELL 0014") {
                    return `⚠️ **Diagnostic Report for WELL 0014 (Warning):**
• **Health Index:** 0.62 (Warning) | Flow Rate: 1,180 bpd (-9.8%)
• **Root Cause:** High water cut breakthrough (38%) from edge water aquifer.
• **Action Plan:** Choke size reduced to 14/64" to control water coning. Water shut-off polymer treatment recommended.`;
                } else {
                    return `✓ **Status Report for ${well.id}:**
• **Status:** ${well.status} (${well.colorTheme.toUpperCase()})
• **${well.metricLabel}:** ${well.displayMetric}
• **Current Flow Rate:** ${well.flowRateDisplay} (Choke: ${well.choke})
• **Wellhead Pressure:** ${well.pressure} psi (${well.pressureStatus})
• **Temperature:** ${well.temperature}°F (${well.temperatureStatus})
• **Diagnosis:** ${well.diagnosis}`;
                }
            }

            return `📋 **${well.id} (${well.name}):**
• **Type:** ${well.type.toUpperCase()} | Status: ${well.status}
• **${well.metricLabel}:** ${well.displayMetric}
• **Operating Depth:** ${well.depth} | BHP: ${well.bhp} psi
• **Current Flow Rate:** ${well.flowRateDisplay} (Choke: ${well.choke})
• **Gas / Water:** Gas ${well.gas} | Water ${well.water} (Water Cut: ${well.waterCut})
• **Active Alarms:** ${well.alerts && well.alerts.length > 0 ? well.alerts.map(a => a.text).join('; ') : 'Zero threshold alarms. System healthy.'}`;
        }
    }

    // 6. Reports & Downloads Query
    if (q.includes("report") || q.includes("download") || q.includes("export") || q.includes("pdf") || q.includes("csv")) {
        return `📑 **Petro-Flow Oilfield Reports System:**
Aap sidebar mein **REPORTS** tab click karke sabhi 15 wells ki official dossiers dekh sakte hain:
1. **👁️ View Full Report:** Wellhead pressure, Bottomhole Pressure (BHP), GOR, Water Cut, aur AI Recommendations ka complete log.
2. **⬇️ Download CSV:** Single well ka 24h real-time sensor time-series data direct CSV mein download karein.
3. **📥 Download All Wells CSV:** Top header button se sabhi 15 wells ka consolidated SCADA dataset ek click mein export karein.
4. **🖨️ PDF / Print:** Official print-ready engineering dossier open ho jaata hai.`;
    }

    // 7. General Field Status Query
    if (q.includes("sab") || q.includes("saare") || q.includes("kaisa") || q.includes("sthiti") || q.includes("haal") || q.includes("field status") || q.includes("production")) {
        const prodWells = allWells.filter(w => w.type === 'production');
        const healthyCount = allWells.filter(w => w.status === 'ACTIVE').length;
        const totalBpd = prodWells.reduce((a, b) => a + (b.flowRate || 0), 0);
        return `🛢️ **Platform Delta-9 Field Status Overview:**
• **Total Monitored Wells:** 15 Wells (12 Production Wells + 3 High-Pressure Injection Nodes).
• **Total Field Production:** **${totalBpd.toLocaleString()} bpd** (Daily Target 140,000 bbl on track).
• **Operational Health:** ${healthyCount}/15 Wells bilkul nominal envelope mein chal rahe hain.
• **Attention Wells:**
  - **WELL 0005** (Red Alert: Health 0.57, severe rod-float 68%).
  - **WELL 0014** (Water cut surge 38%).
• **Injection Support:** Nodes **WELL 0008, 0009, 0010** continuously 7,112 bpd injection maintain kar rahe hain.`;
    }

    // Default Intelligence
    return `🤖 **PETRO-AI Connected:**
Main Platform Delta-9 ke sabhi 15 wells ka real-time telemetry monitor kar raha hoon.
Aap pooch sakte hain:
• *"SOR kya hota hai?"*
• *"CSS steam injection process explain karo"*
• *"WELL 0005 me kya issue hai?"*
• *"WELL 0003 ka data dikhao"*
• *"Total field production kitni hai?"*`;
}

async function sendChatMessage(question) {
    if (!question || !question.trim()) return;
    const q = question.trim();

    appendChatMessage(q, "user");
    if (chatInput) chatInput.value = "";

    const thinkingEl = appendChatMessage(`
        <div class="bot-thinking">
            <span class="bot-live-dot"></span>
            <span>PETRO-AI is analyzing live SCADA sensors...</span>
        </div>
    `, "bot");

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: q })
        });

        if (thinkingEl) thinkingEl.remove();

        if (res.ok) {
            const data = await res.json();
            const formattedAnswer = formatMarkdown(data.answer);
            appendChatMessage(formattedAnswer, "bot");
            return;
        }
        throw new Error("Server chat response not ok");

    } catch (err) {
        if (thinkingEl) thinkingEl.remove();
        console.warn("Using local Petro-AI response engine:", err);
        const localAns = generateLocalAIResponse(q);
        appendChatMessage(formatMarkdown(localAns), "bot");
    }
}

if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (chatInput) {
            sendChatMessage(chatInput.value);
        }
    });
}

chipButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const query = btn.dataset.query;
        if (query) {
            sendChatMessage(query);
        }
    });
});

// =========================================
// DIGITAL TWIN SLIDER SIMULATION
// =========================================
const daySlider = document.getElementById("daySlider");
const simulationDay = document.getElementById("simulationDay");
const twinTemperature = document.getElementById("twinTemperature");
const twinViscosity = document.getElementById("twinViscosity");
const twinSweep = document.getElementById("twinSweep");

if (daySlider) {
    daySlider.addEventListener("input", (e) => {
        const day = parseInt(e.target.value, 10);
        if (simulationDay) simulationDay.textContent = day;

        const temp = 80 + Math.round((day / 100) * 28);
        const visc = Math.max(120, Math.round(1800 - (day / 100) * 1500));
        const sweep = Math.min(95, 40 + Math.round((day / 100) * 52));

        if (twinTemperature) twinTemperature.textContent = `${temp}°F`;
        if (twinViscosity) twinViscosity.textContent = `${visc.toLocaleString()} cP`;
        if (twinSweep) twinSweep.textContent = `${sweep}%`;
    });
}

// =========================================
// ALERTS ACKNOWLEDGE ALL
// =========================================
const acknowledgeAllBtn = document.getElementById("acknowledgeAll");
const fullAlertList = document.getElementById("fullAlertList");

function renderFullAlertList() {
    if (!fullAlertList) return;
    const sampleAlerts = [
        { id: "alt-1", well: "WELL 0005", text: "Severe Rod-Float Risk (68%) & Fluid Pound", time: "01:10 PM", type: "critical" },
        { id: "alt-2", well: "WELL 0002", text: "Low Pressure Alert - WS", time: "12:48 PM", type: "critical" },
        { id: "alt-3", well: "PLATFORM DELTA-9", text: "High Level - T1 (84% Tank)", time: "12:45 PM", type: "warning" },
        { id: "alt-4", well: "WELL 0008", text: "Injection Manifold Balancing Check", time: "09:40 AM", type: "info" }
    ];

    fullAlertList.innerHTML = sampleAlerts.map(a => `
        <div class="alert-row-item">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span class="alert-feed-dot ${a.type === 'critical' ? 'red' : 'blue'}"></span>
                <div>
                    <strong style="font-size: 0.88rem; color: #fff;">[${a.well}] ${a.text}</strong>
                    <div style="font-size: 0.72rem; color: #647b96; margin-top: 2px;">Timestamp: ${a.time}</div>
                </div>
            </div>
            <button class="primary-button" style="padding: 6px 12px; font-size: 0.75rem;" onclick="this.parentElement.remove()">Acknowledge</button>
        </div>
    `).join('');
}
renderFullAlertList();

if (acknowledgeAllBtn && fullAlertList) {
    acknowledgeAllBtn.addEventListener("click", () => {
        fullAlertList.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--teal); font-weight: 600;">All SCADA alarms acknowledged and archived.</div>`;
    });
}

// Initial bootstrap
window.addEventListener("DOMContentLoaded", () => {
    loadInitialData();
});