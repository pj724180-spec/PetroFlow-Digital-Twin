const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// SCADA TELEMETRY DATA STORE - 15 WELLS
// ==========================================

const generateInitialHistory = (pattern, count = 28) => {
    const points = [];
    for (let i = 0; i < count; i++) {
        let val;
        if (pattern === 'orange_fluctuate') {
            val = 0.72 + Math.sin(i * 0.7) * 0.12 + ((i % 3 === 0) ? 0.08 : -0.04);
        } else if (pattern === 'green_descend') {
            val = 0.98 - (i / count) * 0.09 + Math.sin(i * 0.8) * 0.03;
        } else if (pattern === 'green_high') {
            val = 0.91 + Math.sin(i * 0.6) * 0.05 + ((i % 4 === 0) ? 0.03 : -0.02);
        } else if (pattern === 'red_decline') {
            const step = Math.floor(i / 4);
            val = 0.88 - step * 0.05 + (Math.random() * 0.02 - 0.01);
        } else if (pattern === 'blue_dense') {
            val = 230 + Math.sin(i * 1.2) * 35 + ((i % 2 === 0) ? 15 : -10);
        } else if (pattern === 'blue_moderate') {
            val = 210 + Math.sin(i * 0.9) * 28 + ((i % 4 === 0) ? 20 : -5);
        } else {
            val = 0.85 + Math.sin(i * 0.5) * 0.08;
        }
        points.push(Math.round(val * 100) / 100);
    }
    return points;
};

let currentActiveWellId = "WELL 0002";

// 15 Complete Wells (WELL 0001 to WELL 0015)
let wellsData = [
    {
        id: "WELL 0001",
        name: "Well 0001 - North Crest",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.88,
        displayMetric: "0.88",
        subMetricLabel: "Production",
        subMetricValue: "2420",
        capacityBadge: "56k BOPD",
        colorTheme: "orange",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,410m",
        flowRate: 1780,
        flowRateDisplay: "1,780 bpd",
        flowRateShort: "1.78K bpd",
        flowRateGain: "+2.8%",
        gas: "3.8M scf/d",
        water: "0.9K bpd",
        tankLevel: 79,
        tankLevelStatus: "Optimal",
        pressure: 208,
        pressureStatus: "Optimal",
        temperature: 96,
        temperatureStatus: "Normal",
        power: 1.15,
        powerChange: "-1.5%",
        powerBars: [7, 12, 19, 15, 11, 24, 18, 28, 22, 16, 20, 26],
        sparkline: generateInitialHistory('orange_fluctuate'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [42, 48, 65, 50, 82, 58, 102, 75, 80],
            blueSeries: [28, 38, 32, 58, 42, 88, 50, 62, 70]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-01", type: "info", dot: "blue", text: "Inflow Gradient Stable", time: "01:20 PM" }
        ],
        choke: "17/64 in",
        chokePct: 53,
        srpSpeed: 5.2,
        bhp: 1820,
        waterCut: "13.5%",
        gor: "410 scf/bbl",
        viscosity: 140,
        casingPressure: 42,
        tubingPressure: 208,
        steamInjectedBbl: 13200,
        oilGravityAPI: 16.9,
        diagnosis: "Operating stably. High drainage efficiency on North flank."
    },
    {
        id: "WELL 0002",
        name: "Well 0002 - Alpha Derrick",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.84,
        displayMetric: "0.84",
        subMetricLabel: "Production",
        subMetricValue: "2512",
        capacityBadge: "56k BOPD",
        colorTheme: "orange",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,450m",
        flowRate: 1850,
        flowRateDisplay: "1,850 bpd",
        flowRateShort: "1.8K bpd",
        flowRateGain: "+4.2%",
        gas: "4.2M scf/d",
        water: "1.1K bpd",
        tankLevel: 84,
        tankLevelStatus: "High",
        pressure: 210,
        pressureStatus: "Optimal",
        temperature: 98,
        temperatureStatus: "Normal",
        power: 1.2,
        powerChange: "-2.1%",
        powerBars: [8, 14, 22, 16, 12, 28, 20, 32, 26, 18, 22, 30],
        sparkline: generateInitialHistory('orange_fluctuate'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [45, 50, 70, 52, 90, 60, 110, 80, 85],
            blueSeries: [30, 42, 35, 62, 45, 95, 55, 68, 75]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-1", type: "critical", dot: "red", text: "Low Pressure Alert - WS", time: "12:48 PM" },
            { id: "alt-2", type: "info", dot: "blue", text: "High Level - T1", time: "12:45 PM" }
        ],
        choke: "18/64 in",
        chokePct: 56,
        srpSpeed: 5.4,
        bhp: 1840,
        waterCut: "14.2%",
        gor: "420 scf/bbl",
        viscosity: 142,
        casingPressure: 45,
        tubingPressure: 210,
        steamInjectedBbl: 14800,
        oilGravityAPI: 16.8,
        diagnosis: "Operating stably within SRP nominal envelope. Casing gas vent pressure nominal at 210 psi. Production trend up by 4.2%."
    },
    {
        id: "WELL 0003",
        name: "Well 0003 - Delta Platform",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.94,
        displayMetric: "0.94",
        subMetricLabel: "Production",
        subMetricValue: "2718",
        capacityBadge: "56k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,610m",
        flowRate: 1980,
        flowRateDisplay: "1,980 bpd",
        flowRateShort: "1.98K bpd",
        flowRateGain: "+5.8%",
        gas: "3.9M scf/d",
        water: "0.8K bpd",
        tankLevel: 76,
        tankLevelStatus: "Optimal",
        pressure: 225,
        pressureStatus: "Optimal",
        temperature: 94,
        temperatureStatus: "Normal",
        power: 1.1,
        powerChange: "-1.8%",
        powerBars: [6, 12, 18, 14, 10, 24, 18, 26, 22, 16, 20, 26],
        sparkline: generateInitialHistory('green_descend'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [55, 62, 78, 65, 95, 75, 125, 95, 100],
            blueSeries: [40, 50, 45, 70, 55, 105, 68, 75, 85]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-3", type: "info", dot: "blue", text: "Optimal GOR Verified", time: "11:15 AM" }
        ],
        choke: "20/64 in",
        chokePct: 62,
        srpSpeed: 5.6,
        bhp: 1920,
        waterCut: "11.5%",
        gor: "385 scf/bbl",
        viscosity: 130,
        casingPressure: 38,
        tubingPressure: 225,
        steamInjectedBbl: 18200,
        oilGravityAPI: 17.4,
        diagnosis: "Excellent reservoir sweep efficiency. Low water cut (0.8K bpd). Peak production rate sustained."
    },
    {
        id: "WELL 0004",
        name: "Well 0004 - Central Fault Block",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.86,
        displayMetric: "0.86",
        subMetricLabel: "Production",
        subMetricValue: "2340",
        capacityBadge: "56k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,520m",
        flowRate: 1720,
        flowRateDisplay: "1,720 bpd",
        flowRateShort: "1.72K bpd",
        flowRateGain: "+1.9%",
        gas: "3.6M scf/d",
        water: "1.0K bpd",
        tankLevel: 80,
        tankLevelStatus: "Optimal",
        pressure: 212,
        pressureStatus: "Optimal",
        temperature: 97,
        temperatureStatus: "Normal",
        power: 1.16,
        powerChange: "-1.0%",
        powerBars: [8, 13, 17, 15, 12, 23, 19, 27, 21, 15, 19, 25],
        sparkline: generateInitialHistory('green_high'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [44, 52, 68, 54, 86, 64, 108, 82, 86],
            blueSeries: [32, 40, 36, 60, 48, 92, 58, 66, 72]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-04", type: "info", dot: "blue", text: "Drawdown Within Safety Envelope", time: "10:50 AM" }
        ],
        choke: "18/64 in",
        chokePct: 56,
        srpSpeed: 5.3,
        bhp: 1850,
        waterCut: "14.8%",
        gor: "415 scf/bbl",
        viscosity: 138,
        casingPressure: 43,
        tubingPressure: 212,
        steamInjectedBbl: 14100,
        oilGravityAPI: 16.7,
        diagnosis: "Stable drawdown. Steady pressure transmission from injection node 0008."
    },
    {
        id: "WELL 0005",
        name: "Well 0005 - Southern Flank",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.57,
        displayMetric: "0.57",
        subMetricLabel: "Production",
        subMetricValue: "1640",
        capacityBadge: "56k BOPD",
        colorTheme: "red",
        status: "ATTENTION",
        rigStatus: "DEGRADED",
        depth: "2,380m",
        flowRate: 1220,
        flowRateDisplay: "1,220 bpd",
        flowRateShort: "1.22K bpd",
        flowRateGain: "-12.4%",
        gas: "5.1M scf/d",
        water: "2.4K bpd",
        tankLevel: 92,
        tankLevelStatus: "High Alert",
        pressure: 172,
        pressureStatus: "Low Warning",
        temperature: 104,
        temperatureStatus: "Elevated",
        power: 1.45,
        powerChange: "+8.4%",
        powerBars: [14, 20, 28, 22, 26, 34, 30, 40, 36, 28, 32, 38],
        sparkline: generateInitialHistory('red_decline'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [80, 75, 68, 60, 55, 48, 42, 38, 35],
            blueSeries: [70, 68, 62, 58, 50, 44, 40, 35, 32]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Warning", active: true },
            { id: "w-3", name: "Wells 3", status: "Fault", active: false },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Warning", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-4", type: "critical", dot: "red", text: "Severe Rod-Float Risk (68%)", time: "01:10 PM" },
            { id: "alt-5", type: "critical", dot: "red", text: "Fluid Pound Detected on Downstroke", time: "12:55 PM" },
            { id: "alt-6", type: "warning", dot: "blue", text: "High Viscosity 158 cP Detected", time: "11:40 AM" }
        ],
        choke: "14/64 in",
        chokePct: 44,
        srpSpeed: 6.8,
        bhp: 1410,
        waterCut: "28.5%",
        gor: "620 scf/bbl",
        viscosity: 158,
        casingPressure: 78,
        tubingPressure: 172,
        steamInjectedBbl: 8500,
        oilGravityAPI: 14.5,
        diagnosis: "Critical attention required: Rod-float risk is at 68% due to heavy oil viscosity buildup (158 cP) impeding sucker rod fall speed. Recommendation: reduce stroke speed to 4.2 SPM and initiate cyclic steam injection cycle to restore fluid mobility."
    },
    {
        id: "WELL 0006",
        name: "Well 0006 - Eastern Derrick",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.90,
        displayMetric: "0.9",
        subMetricLabel: "Production",
        subMetricValue: "1640",
        capacityBadge: "56k BOPD",
        colorTheme: "orange",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,490m",
        flowRate: 1640,
        flowRateDisplay: "1,640 bpd",
        flowRateShort: "1.64K bpd",
        flowRateGain: "+1.5%",
        gas: "4.0M scf/d",
        water: "1.2K bpd",
        tankLevel: 81,
        tankLevelStatus: "Normal",
        pressure: 205,
        pressureStatus: "Optimal",
        temperature: 96,
        temperatureStatus: "Normal",
        power: 1.18,
        powerChange: "-0.5%",
        powerBars: [8, 12, 16, 14, 12, 22, 18, 24, 20, 16, 18, 22],
        sparkline: generateInitialHistory('orange_fluctuate'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [40, 48, 55, 50, 72, 58, 88, 70, 75],
            blueSeries: [32, 38, 42, 48, 52, 65, 58, 62, 68]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-7", type: "info", dot: "blue", text: "Routine Choke Calibration Complete", time: "10:20 AM" }
        ],
        choke: "16/64 in",
        chokePct: 50,
        srpSpeed: 5.2,
        bhp: 1780,
        waterCut: "15.0%",
        gor: "410 scf/bbl",
        viscosity: 140,
        casingPressure: 42,
        tubingPressure: 205,
        steamInjectedBbl: 13500,
        oilGravityAPI: 16.5,
        diagnosis: "Operating within normal parameters. Thermal front boundary stable."
    },
    {
        id: "WELL 0007",
        name: "Well 0007 - West Flank",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.92,
        displayMetric: "0.92",
        subMetricLabel: "Production",
        subMetricValue: "2680",
        capacityBadge: "58k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,590m",
        flowRate: 1950,
        flowRateDisplay: "1,950 bpd",
        flowRateShort: "1.95K bpd",
        flowRateGain: "+3.8%",
        gas: "4.1M scf/d",
        water: "0.9K bpd",
        tankLevel: 75,
        tankLevelStatus: "Optimal",
        pressure: 222,
        pressureStatus: "Optimal",
        temperature: 95,
        temperatureStatus: "Normal",
        power: 1.14,
        powerChange: "-1.6%",
        powerBars: [7, 13, 18, 15, 11, 23, 17, 26, 21, 15, 19, 25],
        sparkline: generateInitialHistory('green_high'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [50, 58, 74, 62, 92, 72, 118, 90, 95],
            blueSeries: [38, 46, 42, 66, 52, 100, 64, 72, 80]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-07", type: "info", dot: "blue", text: "Low GOR Surveillance Nominal", time: "09:55 AM" }
        ],
        choke: "19/64 in",
        chokePct: 59,
        srpSpeed: 5.5,
        bhp: 1910,
        waterCut: "12.0%",
        gor: "390 scf/bbl",
        viscosity: 132,
        casingPressure: 39,
        tubingPressure: 222,
        steamInjectedBbl: 17500,
        oilGravityAPI: 17.3,
        diagnosis: "Excellent reservoir drive energy. High productivity index."
    },
    {
        id: "WELL 0008",
        name: "Well 0008 - Injection Node Alpha",
        type: "injection",
        metricLabel: "Average Injection",
        metricValue: 244,
        displayMetric: "244",
        subMetricLabel: "Injection",
        subMetricValue: "2512",
        capacityBadge: "2.5k bpd",
        colorTheme: "blue",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,550m",
        flowRate: 2512,
        flowRateDisplay: "2,512 bpd",
        flowRateShort: "2.51K bpd",
        flowRateGain: "+3.1%",
        gas: "0.2M scf/d",
        water: "2.5K bpd",
        tankLevel: 68,
        tankLevelStatus: "Optimal",
        pressure: 340,
        pressureStatus: "Optimal High",
        temperature: 88,
        temperatureStatus: "Cool",
        power: 0.95,
        powerChange: "-3.2%",
        powerBars: [10, 16, 24, 20, 16, 26, 22, 28, 24, 18, 20, 25],
        sparkline: generateInitialHistory('blue_moderate'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [60, 65, 75, 70, 85, 80, 95, 90, 92],
            blueSeries: [55, 58, 68, 64, 78, 72, 88, 82, 86]
        },
        activeSubUnits: [
            { id: "w-1", name: "Inject 1", status: "Online", active: true },
            { id: "w-2", name: "Inject 2", status: "Online", active: true },
            { id: "w-3", name: "Inject 3", status: "Online", active: true },
            { id: "w-4", name: "Inject 4", status: "Online", active: true },
            { id: "w-5", name: "Inject 5", status: "Online", active: true },
            { id: "w-6", name: "Inject 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-8", type: "info", dot: "blue", text: "Injection Manifold Balancing", time: "09:40 AM" }
        ],
        choke: "24/64 in",
        chokePct: 75,
        srpSpeed: 0,
        bhp: 2850,
        waterCut: "100%",
        gor: "0 scf/bbl",
        viscosity: 1.0,
        casingPressure: 120,
        tubingPressure: 340,
        steamInjectedBbl: 32000,
        oilGravityAPI: 0,
        diagnosis: "Water & steam injection rate stable at 2,512 bpd. Maintaining pressure support for adjacent producing wells."
    },
    {
        id: "WELL 0009",
        name: "Well 0009 - Injection Node Beta",
        type: "injection",
        metricLabel: "Average Injection",
        metricValue: 274,
        displayMetric: "274",
        subMetricLabel: "Injection",
        subMetricValue: "2220",
        capacityBadge: "2.2k bpd",
        colorTheme: "blue",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,580m",
        flowRate: 2220,
        flowRateDisplay: "2,220 bpd",
        flowRateShort: "2.22K bpd",
        flowRateGain: "+0.8%",
        gas: "0.1M scf/d",
        water: "2.2K bpd",
        tankLevel: 71,
        tankLevelStatus: "Optimal",
        pressure: 355,
        pressureStatus: "Optimal High",
        temperature: 90,
        temperatureStatus: "Normal",
        power: 0.98,
        powerChange: "-1.5%",
        powerBars: [8, 14, 20, 18, 14, 24, 20, 26, 22, 16, 22, 28],
        sparkline: generateInitialHistory('blue_dense'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [50, 58, 65, 62, 75, 70, 85, 82, 84],
            blueSeries: [48, 52, 60, 58, 70, 66, 80, 78, 80]
        },
        activeSubUnits: [
            { id: "w-1", name: "Inject 1", status: "Online", active: true },
            { id: "w-2", name: "Inject 2", status: "Online", active: true },
            { id: "w-3", name: "Inject 3", status: "Online", active: true },
            { id: "w-4", name: "Inject 4", status: "Online", active: true },
            { id: "w-5", name: "Inject 5", status: "Online", active: true },
            { id: "w-6", name: "Inject 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-9", type: "info", dot: "blue", text: "Displacement front intact", time: "08:20 AM" }
        ],
        choke: "22/64 in",
        chokePct: 68,
        srpSpeed: 0,
        bhp: 2920,
        waterCut: "100%",
        gor: "0 scf/bbl",
        viscosity: 1.0,
        casingPressure: 135,
        tubingPressure: 355,
        steamInjectedBbl: 29500,
        oilGravityAPI: 0,
        diagnosis: "Beta injection node maintaining constant bottom-hole pressure support. Displacing viscous crudes toward Well 0002 and Well 0003."
    },
    {
        id: "WELL 0010",
        name: "Well 0010 - Injection Node Gamma",
        type: "injection",
        metricLabel: "Average Injection",
        metricValue: 260,
        displayMetric: "260",
        subMetricLabel: "Injection",
        subMetricValue: "2380",
        capacityBadge: "2.4k bpd",
        colorTheme: "blue",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,560m",
        flowRate: 2380,
        flowRateDisplay: "2,380 bpd",
        flowRateShort: "2.38K bpd",
        flowRateGain: "+2.1%",
        gas: "0.15M scf/d",
        water: "2.3K bpd",
        tankLevel: 70,
        tankLevelStatus: "Optimal",
        pressure: 348,
        pressureStatus: "Optimal High",
        temperature: 89,
        temperatureStatus: "Normal",
        power: 0.96,
        powerChange: "-2.0%",
        powerBars: [9, 15, 21, 19, 15, 25, 21, 27, 23, 17, 21, 26],
        sparkline: generateInitialHistory('blue_moderate'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [55, 62, 70, 66, 80, 75, 90, 86, 88],
            blueSeries: [50, 56, 64, 60, 74, 70, 84, 80, 82]
        },
        activeSubUnits: [
            { id: "w-1", name: "Inject 1", status: "Online", active: true },
            { id: "w-2", name: "Inject 2", status: "Online", active: true },
            { id: "w-3", name: "Inject 3", status: "Online", active: true },
            { id: "w-4", name: "Inject 4", status: "Online", active: true },
            { id: "w-5", name: "Inject 5", status: "Online", active: true },
            { id: "w-6", name: "Inject 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-10inj", type: "info", dot: "blue", text: "Thermal Sweep Front Conformance", time: "08:00 AM" }
        ],
        choke: "23/64 in",
        chokePct: 72,
        srpSpeed: 0,
        bhp: 2890,
        waterCut: "100%",
        gor: "0 scf/bbl",
        viscosity: 1.0,
        casingPressure: 128,
        tubingPressure: 348,
        steamInjectedBbl: 31000,
        oilGravityAPI: 0,
        diagnosis: "Maintaining peripheral steamflood sweep towards central block."
    },
    {
        id: "WELL 0011",
        name: "Well 0011 - Northern Sector",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.91,
        displayMetric: "0.91",
        subMetricLabel: "Production",
        subMetricValue: "2650",
        capacityBadge: "58k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,420m",
        flowRate: 1920,
        flowRateDisplay: "1,920 bpd",
        flowRateShort: "1.92K bpd",
        flowRateGain: "+3.4%",
        gas: "3.8M scf/d",
        water: "0.9K bpd",
        tankLevel: 78,
        tankLevelStatus: "Normal",
        pressure: 218,
        pressureStatus: "Optimal",
        temperature: 97,
        temperatureStatus: "Normal",
        power: 1.15,
        powerChange: "-1.2%",
        powerBars: [7, 13, 19, 15, 11, 23, 17, 25, 21, 15, 19, 25],
        sparkline: generateInitialHistory('green_descend'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [48, 55, 72, 60, 88, 70, 115, 88, 92],
            blueSeries: [36, 45, 40, 65, 50, 98, 62, 70, 78]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-10", type: "info", dot: "blue", text: "High Inflow Performance", time: "07:50 AM" }
        ],
        choke: "19/64 in",
        chokePct: 59,
        srpSpeed: 5.5,
        bhp: 1890,
        waterCut: "12.8%",
        gor: "395 scf/bbl",
        viscosity: 135,
        casingPressure: 40,
        tubingPressure: 218,
        steamInjectedBbl: 16400,
        oilGravityAPI: 17.1,
        diagnosis: "Excellent reservoir pressure transmission from Node 0008."
    },
    {
        id: "WELL 0012",
        name: "Well 0012 - Deep Reservoir",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.93,
        displayMetric: "0.93",
        subMetricLabel: "Production",
        subMetricValue: "2820",
        capacityBadge: "60k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,460m",
        flowRate: 2010,
        flowRateDisplay: "2,010 bpd",
        flowRateShort: "2.01K bpd",
        flowRateGain: "+4.9%",
        gas: "4.1M scf/d",
        water: "1.0K bpd",
        tankLevel: 82,
        tankLevelStatus: "Normal",
        pressure: 215,
        pressureStatus: "Optimal",
        temperature: 98,
        temperatureStatus: "Normal",
        power: 1.22,
        powerChange: "-2.0%",
        powerBars: [9, 15, 21, 17, 13, 25, 19, 29, 23, 17, 21, 28],
        sparkline: generateInitialHistory('green_descend'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [52, 60, 76, 68, 92, 78, 120, 92, 98],
            blueSeries: [38, 48, 44, 68, 54, 102, 65, 74, 82]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-11", type: "info", dot: "blue", text: "Optimal Drawdown Envelope", time: "07:15 AM" }
        ],
        choke: "21/64 in",
        chokePct: 65,
        srpSpeed: 5.7,
        bhp: 1950,
        waterCut: "13.0%",
        gor: "410 scf/bbl",
        viscosity: 132,
        casingPressure: 44,
        tubingPressure: 215,
        steamInjectedBbl: 19800,
        oilGravityAPI: 17.2,
        diagnosis: "Maximum production output achieved without gas coning."
    },
    {
        id: "WELL 0013",
        name: "Well 0013 - Subsurface Spine",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.89,
        displayMetric: "0.89",
        subMetricLabel: "Production",
        subMetricValue: "2480",
        capacityBadge: "56k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,530m",
        flowRate: 1810,
        flowRateDisplay: "1,810 bpd",
        flowRateShort: "1.81K bpd",
        flowRateGain: "+2.5%",
        gas: "3.7M scf/d",
        water: "1.1K bpd",
        tankLevel: 77,
        tankLevelStatus: "Optimal",
        pressure: 214,
        pressureStatus: "Optimal",
        temperature: 95,
        temperatureStatus: "Normal",
        power: 1.16,
        powerChange: "-1.1%",
        powerBars: [8, 13, 17, 15, 11, 23, 18, 27, 22, 16, 19, 25],
        sparkline: generateInitialHistory('green_high'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [46, 54, 70, 56, 88, 66, 110, 84, 88],
            blueSeries: [34, 42, 38, 62, 50, 94, 60, 68, 74]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-13", type: "info", dot: "blue", text: "Thermal Front Stable", time: "06:45 AM" }
        ],
        choke: "18/64 in",
        chokePct: 56,
        srpSpeed: 5.3,
        bhp: 1860,
        waterCut: "14.5%",
        gor: "405 scf/bbl",
        viscosity: 139,
        casingPressure: 41,
        tubingPressure: 214,
        steamInjectedBbl: 15200,
        oilGravityAPI: 16.8,
        diagnosis: "Nominal operational envelope. Steady production sustained."
    },
    {
        id: "WELL 0014",
        name: "Well 0014 - Southwest Perimeter",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.62,
        displayMetric: "0.62",
        subMetricLabel: "Production",
        subMetricValue: "1510",
        capacityBadge: "54k BOPD",
        colorTheme: "red",
        status: "ATTENTION",
        rigStatus: "DEGRADED",
        depth: "2,390m",
        flowRate: 1180,
        flowRateDisplay: "1,180 bpd",
        flowRateShort: "1.18K bpd",
        flowRateGain: "-9.8%",
        gas: "4.8M scf/d",
        water: "2.8K bpd",
        tankLevel: 89,
        tankLevelStatus: "Warning",
        pressure: 178,
        pressureStatus: "Low Warning",
        temperature: 102,
        temperatureStatus: "Elevated",
        power: 1.38,
        powerChange: "+6.5%",
        powerBars: [12, 18, 25, 20, 24, 32, 28, 36, 31, 25, 29, 34],
        sparkline: generateInitialHistory('red_decline'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [75, 70, 64, 58, 52, 45, 40, 36, 32],
            blueSeries: [65, 62, 58, 52, 46, 40, 36, 32, 30]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Warning", active: true },
            { id: "w-3", name: "Wells 3", status: "Fault", active: false },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Warning", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-14a", type: "critical", dot: "red", text: "High Water Cut Breakthrough (38%)", time: "06:15 AM" },
            { id: "alt-14b", type: "warning", dot: "blue", text: "Bottomhole Pressure Decline", time: "05:30 AM" }
        ],
        choke: "14/64 in",
        chokePct: 44,
        srpSpeed: 6.2,
        bhp: 1480,
        waterCut: "38.0%",
        gor: "590 scf/bbl",
        viscosity: 152,
        casingPressure: 68,
        tubingPressure: 178,
        steamInjectedBbl: 9200,
        oilGravityAPI: 15.2,
        diagnosis: "Water cut spike detected (38%). Choke size reduced to 14/64\" to suppress water coning."
    },
    {
        id: "WELL 0015",
        name: "Well 0015 - Deep Basin Alpha",
        type: "production",
        metricLabel: "Health Index",
        metricValue: 0.95,
        displayMetric: "0.95",
        subMetricLabel: "Production",
        subMetricValue: "2890",
        capacityBadge: "62k BOPD",
        colorTheme: "teal",
        status: "ACTIVE",
        rigStatus: "ACTIVE",
        depth: "2,640m",
        flowRate: 2080,
        flowRateDisplay: "2,080 bpd",
        flowRateShort: "2.08K bpd",
        flowRateGain: "+6.2%",
        gas: "4.3M scf/d",
        water: "0.7K bpd",
        tankLevel: 74,
        tankLevelStatus: "Optimal",
        pressure: 228,
        pressureStatus: "Optimal",
        temperature: 93,
        temperatureStatus: "Normal",
        power: 1.12,
        powerChange: "-2.4%",
        powerBars: [6, 11, 17, 14, 10, 22, 17, 25, 20, 15, 19, 24],
        sparkline: generateInitialHistory('green_high'),
        trend24h: {
            hours: ["Oct", "06", "08", "12", "15", "18", "12", "20", "24h"],
            cyanSeries: [58, 66, 82, 70, 100, 80, 130, 102, 108],
            blueSeries: [44, 52, 48, 74, 60, 112, 72, 80, 90]
        },
        activeSubUnits: [
            { id: "w-1", name: "Wells 1", status: "Online", active: true },
            { id: "w-2", name: "Wells 2", status: "Online", active: true },
            { id: "w-3", name: "Wells 3", status: "Online", active: true },
            { id: "w-4", name: "Wells 4", status: "Online", active: true },
            { id: "w-5", name: "Wells 5", status: "Online", active: true },
            { id: "w-6", name: "Wells 6", status: "Online", active: true }
        ],
        alerts: [
            { id: "alt-15", type: "info", dot: "blue", text: "Field Top Inflow Performance", time: "05:00 AM" }
        ],
        choke: "22/64 in",
        chokePct: 68,
        srpSpeed: 5.8,
        bhp: 1980,
        waterCut: "9.8%",
        gor: "370 scf/bbl",
        viscosity: 126,
        casingPressure: 36,
        tubingPressure: 228,
        steamInjectedBbl: 21500,
        oilGravityAPI: 17.6,
        diagnosis: "Top producing well across Platform Delta-9. Peak reservoir energy."
    }
];

let sseClients = [];

// ==========================================
// REAL-TIME TELEMETRY BACKGROUND TICK
// ==========================================
setInterval(() => {
    wellsData.forEach((well) => {
        if (well.type === 'production') {
            const deltaP = (Math.random() - 0.49) * 4;
            well.pressure = Math.round(Math.max(140, Math.min(260, well.pressure + (Math.random() - 0.5) * 1.5)));
            well.temperature = Math.round((well.temperature + (Math.random() - 0.5) * 0.2) * 10) / 10;
            well.flowRate = Math.round(Math.max(800, well.flowRate + deltaP));
            well.flowRateDisplay = `${well.flowRate.toLocaleString()} bpd`;
            well.flowRateShort = `${(well.flowRate / 1000).toFixed(2)}K bpd`;
            
            const lastVal = well.sparkline[well.sparkline.length - 1];
            let nextVal = lastVal + (Math.random() - 0.5) * 0.04;
            if (well.status === "ATTENTION") {
                nextVal = Math.min(0.68, Math.max(0.48, nextVal));
            } else {
                nextVal = Math.min(0.99, Math.max(0.70, nextVal));
            }
            well.sparkline.shift();
            well.sparkline.push(Math.round(nextVal * 100) / 100);
        } else {
            well.pressure = Math.round(Math.max(300, Math.min(390, well.pressure + (Math.random() - 0.5) * 2)));
            const deltaI = (Math.random() - 0.48) * 6;
            well.flowRate = Math.round(well.flowRate + deltaI);
            well.flowRateDisplay = `${well.flowRate.toLocaleString()} bpd`;

            const lastVal = well.sparkline[well.sparkline.length - 1];
            let nextVal = lastVal + (Math.random() - 0.5) * 12;
            nextVal = Math.min(310, Math.max(180, nextVal));
            well.sparkline.shift();
            well.sparkline.push(Math.round(nextVal));
        }

        well.powerBars = well.powerBars.map(h => Math.max(6, Math.min(42, Math.round(h + (Math.random() - 0.5) * 6))));
    });

    if (sseClients.length > 0) {
        const payload = JSON.stringify({
            timestamp: new Date().toISOString(),
            activeWellId: currentActiveWellId,
            wells: wellsData.map(w => ({
                id: w.id,
                healthIndex: w.metricValue,
                flowRate: w.flowRate,
                flowRateDisplay: w.flowRateDisplay,
                flowRateShort: w.flowRateShort,
                flowRateGain: w.flowRateGain,
                pressure: w.pressure,
                temperature: w.temperature,
                tankLevel: w.tankLevel,
                power: w.power,
                powerChange: w.powerChange,
                powerBars: w.powerBars,
                sparkline: w.sparkline
            }))
        });
        sseClients.forEach(client => {
            try {
                client.res.write(`data: ${payload}\n\n`);
            } catch (err) {}
        });
    }
}, 2500);

// Heartbeat keep-alive every 15s
setInterval(() => {
    sseClients.forEach(client => {
        try {
            client.res.write(': keep-alive\n\n');
        } catch (e) {}
    });
}, 15000);

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Get all 15 wells
app.get('/api/wells', (req, res) => {
    res.json({
        success: true,
        count: wellsData.length,
        activeWellId: currentActiveWellId,
        wells: wellsData
    });
});

// Set active well
app.post('/api/wells/active', (req, res) => {
    const { wellId } = req.body;
    if (wellId) {
        const found = wellsData.find(w => w.id === wellId);
        if (found) {
            currentActiveWellId = found.id;
            return res.json({ success: true, activeWell: found });
        }
    }
    res.status(404).json({ success: false, error: "Well not found" });
});

// Get single well
app.get('/api/wells/:id', (req, res) => {
    const rawId = req.params.id.toUpperCase().replace('-', ' ').trim();
    const found = wellsData.find(w => w.id === rawId || w.id.replace(' ', '') === rawId.replace(' ', ''));
    if (!found) {
        return res.status(404).json({ success: false, error: `Well ${req.params.id} not found` });
    }
    currentActiveWellId = found.id;
    res.json({
        success: true,
        well: found
    });
});

// Remote SCADA Controls
app.post('/api/wells/:id/control', (req, res) => {
    const rawId = req.params.id.toUpperCase().replace('-', ' ').trim();
    const well = wellsData.find(w => w.id === rawId || w.id.replace(' ', '') === rawId.replace(' ', ''));
    if (!well) {
        return res.status(404).json({ success: false, error: "Well not found" });
    }

    const { action, chokeSize, srpSpeed, steamAmount } = req.body;
    let message = "";

    if (action === "adjust_choke" && chokeSize) {
        well.choke = `${chokeSize}/64 in`;
        const delta = (parseInt(chokeSize, 10) - 16) * 45;
        well.flowRate = Math.max(900, Math.round(1600 + delta));
        well.flowRateDisplay = `${well.flowRate.toLocaleString()} bpd`;
        well.flowRateShort = `${(well.flowRate / 1000).toFixed(2)}K bpd`;
        well.tubingPressure = Math.max(140, Math.round(230 - (parseInt(chokeSize, 10) - 16) * 4));
        well.pressure = well.tubingPressure;
        message = `Choke bean adjusted to ${well.choke}. Flow rate shifted to ${well.flowRateDisplay} at ${well.tubingPressure} psi.`;
    } else if (action === "adjust_srp" && srpSpeed) {
        well.srpSpeed = parseFloat(srpSpeed);
        if (well.id === "WELL 0005") {
            if (well.srpSpeed <= 4.5) {
                well.status = "MONITORING";
                well.rigStatus = "OPTIMIZED";
                well.colorTheme = "orange";
                well.metricValue = 0.74;
                well.displayMetric = "0.74";
                message = `SRP speed reduced to ${well.srpSpeed} SPM. Sucker rod fall lag mitigated; rod-float risk dropped to 22%.`;
            } else {
                well.status = "ATTENTION";
                well.rigStatus = "DEGRADED";
                message = `SRP speed set to ${well.srpSpeed} SPM.`;
            }
        } else {
            message = `SRP speed updated to ${well.srpSpeed} SPM.`;
        }
    } else if (action === "steam_soak") {
        well.temperature = Math.round((well.temperature + 18) * 10) / 10;
        well.viscosity = Math.max(45, Math.round(well.viscosity * 0.55));
        well.flowRate = Math.round(well.flowRate * 1.25);
        well.flowRateDisplay = `${well.flowRate.toLocaleString()} bpd`;
        well.flowRateShort = `${(well.flowRate / 1000).toFixed(2)}K bpd`;
        if (well.id === "WELL 0005") {
            well.status = "ACTIVE";
            well.rigStatus = "ACTIVE";
            well.colorTheme = "teal";
            well.metricValue = 0.88;
            well.displayMetric = "0.88";
        }
        message = `Steam soak (${steamAmount || '2,400 bbl'}) executed! Temperature: ${well.temperature}°F, Viscosity: ${well.viscosity} cP. Production boosted by 25%.`;
    } else if (action === "shut_in") {
        well.status = well.status === "SHUT-IN" ? "ACTIVE" : "SHUT-IN";
        well.rigStatus = well.status === "SHUT-IN" ? "OFFLINE" : "ACTIVE";
        message = `Surface Safety Valve (SSV) toggled. Well is now ${well.status}.`;
    }

    res.json({ success: true, message, well });
});

// Production & Inflow Stats
app.get('/api/production/stats', (req, res) => {
    const prodWells = wellsData.filter(w => w.type === 'production');
    const totalRate = prodWells.reduce((a, b) => a + b.flowRate, 0);
    const cumulativeBblToday = 142850 + Math.round((Date.now() % 86400000) / 1000);

    res.json({
        totalProductionBpd: totalRate,
        cumulativeBblToday: cumulativeBblToday,
        avgWaterCut: "16.4%",
        avgGor: "435 scf/bbl",
        activeProducingWells: prodWells.length,
        fieldEfficiency: "94.2%",
        wellsLeaderboard: prodWells.map(w => ({
            id: w.id,
            name: w.name,
            flowRate: w.flowRate,
            flowRateDisplay: w.flowRateDisplay,
            choke: w.choke,
            health: w.metricValue,
            status: w.status,
            colorTheme: w.colorTheme
        })).sort((a, b) => b.flowRate - a.flowRate)
    });
});

// WIDS
app.get('/api/wids', (req, res) => {
    res.json({
        success: true,
        field: "Baghewala Deep Heavy Oil Platform Delta-9",
        timestamp: new Date().toISOString(),
        annulusPressureA: "42 psi (Nominal < 100 psi)",
        annulusPressureB: "14 psi (Zero migration)",
        annulusPressureC: "2 psi",
        acousticLiquidLevel: "1,840m from surface",
        tubingIntegrity: "Passed (Hydrostatic Test 3,500 psi)",
        casingIntegrity: "Passed (Multi-Finger Caliper Log < 3% wear)",
        cathodicProtectionPotential: "-865 mV vs CSE (Protected)",
        dhsvTest: "DHSV-04 Zero Leakage Verified",
        surfaceSafetyValve: "SSV Actuator Response 1.8s (Nominal < 4.0s)"
    });
});

// Reports for all 15 wells
app.get('/api/reports', (req, res) => {
    const reports = wellsData.map((well) => {
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

        return {
            id: `REP-${well.id.replace(' ', '-')}`,
            wellId: well.id,
            wellName: well.name,
            title: title,
            category: category,
            priority: priority,
            date: "Today, 18:30 UTC",
            fileSize: "2.8 MB",
            author: "PETRO-AI Surveillance Engine v5.1",
            healthIndex: well.displayMetric,
            flowRate: well.flowRateDisplay,
            choke: well.choke,
            bhp: `${well.bhp} psi`,
            tubingHeadPressure: `${well.tubingPressure} psi`,
            casingPressure: `${well.casingPressure} psi`,
            temperature: `${well.temperature}°F`,
            viscosity: `${well.viscosity} cP`,
            waterCut: well.waterCut,
            gor: well.gor,
            steamInjected: `${well.steamInjectedBbl.toLocaleString()} bbl`,
            oilGravity: `${well.oilGravityAPI}° API`,
            executiveSummary: well.diagnosis,
            anomaliesLog: well.alerts.map(a => `${a.time} - ${a.text}`),
            recommendedActions: well.id === 'WELL 0005' ? [
                "Reduce Sucker Rod Pump speed from 6.8 SPM to 4.2 SPM immediately to prevent rod buckling.",
                "Execute 2,400 bbl cyclic steam stimulation (CSS) batch to drop heavy crude viscosity below 80 cP.",
                "Re-run dynagraph surface card after thermal soak."
            ] : [
                "Maintain optimal choke bean size and monitor separator backpressure.",
                "Scheduled acoustic fluid level surveillance in 72 hours."
            ]
        };
    });

    res.json({ success: true, count: reports.length, reports });
});

// Download CSV for single well
app.get('/api/reports/:id/download.csv', (req, res) => {
    const rawId = req.params.id.toUpperCase().replace('REP-', '').replace('-', ' ').trim();
    const well = wellsData.find(w => w.id === rawId || w.id.replace(' ', '') === rawId.replace(' ', '')) || wellsData[0];

    const filename = `PetroFlow_${well.id.replace(' ', '_')}_Telemetry_Report.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    let csv = "Timestamp_UTC,Well_ID,Well_Name,Status,Type,FlowRate_bpd,Pressure_psi,Temperature_F,Viscosity_cP,WaterCut_pct,GOR_scf_bbl,Choke,HealthIndex,Power_MW\n";
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
        const timeStr = new Date(now - i * 3600000).toISOString();
        const flow = Math.round(well.flowRate + (Math.sin(i) * 35));
        const press = Math.round(well.pressure + (Math.cos(i) * 4));
        const temp = Math.round((well.temperature + Math.sin(i * 0.5) * 0.8) * 10) / 10;
        csv += `${timeStr},${well.id},"${well.name}",${well.status},${well.type},${flow},${press},${temp},${well.viscosity},"${well.waterCut}","${well.gor}","${well.choke}",${well.displayMetric},${well.power}\n`;
    }

    res.send(csv);
});

// Download consolidated CSV for ALL wells
app.get('/api/reports/download/all.csv', (req, res) => {
    const filename = `PetroFlow_All_15_Wells_Consolidated_SCADA_Report.csv`;
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    let csv = "Well_ID,Well_Name,Type,Status,FlowRate_bpd,Pressure_psi,Temperature_F,Viscosity_cP,WaterCut,GOR,Choke,Health_Index,BHP_psi,Power_MW\n";
    wellsData.forEach(w => {
        csv += `${w.id},"${w.name}",${w.type},${w.status},${w.flowRate},${w.pressure},${w.temperature},${w.viscosity},"${w.waterCut}","${w.gor}","${w.choke}",${w.displayMetric},${w.bhp},${w.power}\n`;
    });

    res.send(csv);
});

// Alerts
app.get('/api/alerts', (req, res) => {
    const allAlerts = [];
    wellsData.forEach(w => {
        if (w.alerts) {
            w.alerts.forEach(a => {
                allAlerts.push({ wellId: w.id, ...a });
            });
        }
    });
    res.json({ success: true, count: allAlerts.length, alerts: allAlerts });
});

app.post('/api/alerts/acknowledge', (req, res) => {
    const { alertId } = req.body;
    let found = false;
    wellsData.forEach(w => {
        if (w.alerts) {
            const idx = w.alerts.findIndex(a => a.id === alertId);
            if (idx !== -1) {
                w.alerts.splice(idx, 1);
                found = true;
            }
        }
    });
    res.json({ success: true, acknowledged: found });
});

// SSE Stream
app.get('/api/stream', (req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
    });
    res.write('data: {"connected": true}\n\n');

    const clientId = Date.now();
    sseClients.push({ id: clientId, res });

    req.on('close', () => {
        sseClients = sseClients.filter(c => c.id !== clientId);
    });
});

// ==========================================
// COMPREHENSIVE PETRO-AI CHATBOT ENGINE
// ==========================================

function handlePetroAIChat(question) {
    const q = (question || "").toLowerCase().trim();

    // 1. GREETINGS (Hi, Hello, Namaste, Good morning, etc.)
    const greetings = ["hi", "hello", "hey", "namaste", "good morning", "good afternoon", "good evening", "kaise ho", "kya haal", "hola", "sup", "greetings"];
    const isGreeting = greetings.some(g => q === g || q.startsWith(g + " ") || q.endsWith(" " + g));
    if (isGreeting && q.length < 25) {
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
    for (const well of wellsData) {
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
• **Active Alarms:** ${well.alerts.length > 0 ? well.alerts.map(a => a.text).join('; ') : 'Zero threshold alarms. System healthy.'}`;
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

    // 7. General Field Status Query (Hindi / English)
    if (q.includes("sab") || q.includes("saare") || q.includes("kaisa") || q.includes("sthiti") || q.includes("haal") || q.includes("field status") || q.includes("production")) {
        const prodWells = wellsData.filter(w => w.type === 'production');
        const healthyCount = wellsData.filter(w => w.status === 'ACTIVE').length;
        const totalBpd = prodWells.reduce((a, b) => a + b.flowRate, 0);
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
• *"WELL 0005 ka issue kya hai?"*
• *"WELL 0003 ka data dikhao"*
• *"Total field production kitni hai?"*`;
}

app.post('/api/chat', async (req, res) => {
    try {
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ error: "Question is required." });
        }

        const answer = handlePetroAIChat(question);
        
        setTimeout(() => {
            res.json({
                success: true,
                answer: answer,
                timestamp: new Date().toISOString()
            });
        }, 250);
    } catch (err) {
        console.error("Chat error:", err);
        res.status(500).json({ error: "Failed to process chat query." });
    }
});

// SPA catch-all
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        // Don't send index.html for CSS, JS, images, fonts, etc.
        if (path.extname(req.path)) {
            return res.status(404).end();
        }

        return res.sendFile(path.join(__dirname, 'index.html'));
    }
    next();
});

// Start Server
app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` PETROFLOW BACKEND RUNNING WITH 15 WELLS`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Chatbot: SOR, CSS, Greetings & 15 Wells Armed`);
    console.log(`===============================================`);
});
