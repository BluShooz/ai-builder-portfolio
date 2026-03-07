/* ═══════════════════════════════════════════════════════════
   AI BUILDER PORTFOLIO — main.js
   Jonathan Smith | AI Automation Builder
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── CURSOR ──────────────────────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant cursor
    cursor.style.left = (mouseX - 10) + 'px';
    cursor.style.top = (mouseY - 10) + 'px';

    // Delayed trail
    cursorTrail.style.left = (mouseX - 4) + 'px';
    cursorTrail.style.top = (mouseY - 4) + 'px';
});

// Magnetic elements
document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('expand');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('expand');
        el.style.transform = '';
    });
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${relX * 0.18}px, ${relY * 0.18}px)`;
    });
});

/* ─── BUTTON RIPPLE + BOUNCE ──────────────────────────────── */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
        // Ripple
        const r = document.createElement('span');
        r.classList.add('ripple');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(r);
        setTimeout(() => r.remove(), 600);

        // Bounce
        btn.classList.remove('bounce');
        void btn.offsetWidth; // reflow
        btn.classList.add('bounce');
        btn.addEventListener('animationend', () => btn.classList.remove('bounce'), { once: true });
    });
});

/* ─── TERMINAL TYPING HERO HEADLINE ──────────────────────────
   Phrase: "AI AUTOMATION\nBUILDER"
   ─────────────────────────────────────────────────────────── */
const heroEl = document.getElementById('typed-text');
const fullText = ['A', 'I', ' ', 'A', 'U', 'T', 'O', 'M', 'A', 'T', 'I', 'O', 'N', '\n', 'B', 'U', 'I', 'L', 'D', 'E', 'R'];
let idx = 0;

function renderTypedText(chars) {
    let html = '';
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] === '\n') {
            html += '<br>';
        } else if (i >= 3 && i <= 12) { // "AUTOMATION" → neon
            html += `<span class="accent">${chars[i]}</span>`;
        } else {
            html += chars[i];
        }
    }
    heroEl.innerHTML = html;
}

function type() {
    if (idx < fullText.length) {
        idx++;
        renderTypedText(fullText.slice(0, idx));
        const delay = fullText[idx - 1] === '\n' ? 250 : Math.random() * 80 + 40;
        setTimeout(type, delay);
    }
}

window.addEventListener('load', () => setTimeout(type, 700));

/* ─── COMMAND CENTER TYPING SEQUENCE ──────────────────────── */
const commandCenter = document.getElementById('command-center');
const commandLines = [
    { text: '> Initializing neural interface...', delay: 150 },
    { text: '> Loading portfolio modules...', delay: 200 },
    { text: '> AI automation systems: ONLINE', delay: 180 },
    { text: '> Builder protocol: ACTIVE', delay: 0 }
];

async function typeCommandLines() {
    for (let i = 0; i < commandLines.length; i++) {
        const line = commandLines[i];
        await sleep(line.delay);

        const lineEl = document.createElement('div');
        lineEl.className = 'terminal-line';
        lineEl.innerHTML = `<span class="prompt">▶</span><span>${line.text}</span>`;
        commandCenter.appendChild(lineEl);
    }

    // Add cursor blink after last line
    await sleep(300);
    const cursorLine = document.createElement('div');
    cursorLine.className = 'terminal-line';
    cursorLine.innerHTML = `<span class="prompt">▶</span><span>System ready.</span><span class="cursor"></span>`;
    commandCenter.appendChild(cursorLine);

    // Start hero typing after command center
    await sleep(500);
    typeHeroHeadline();
}

/* Modified hero typing to start after command center */
function typeHeroHeadline() {
    type();
}

// Override original load handler
window.removeEventListener('load', () => setTimeout(type, 700));
window.addEventListener('load', () => setTimeout(typeCommandLines, 700));

/* ─── AI BUILDER BRAIN (CHATBOT) ───────────────────────────── */
const chatWidget = document.getElementById('chat-widget');
const chatTrigger = chatWidget.querySelector('.chat-trigger');
const chatWindow = chatWidget.querySelector('.chat-window');
const closeBtn = chatWidget.querySelector('.close-btn');
const chatBody = chatWidget.querySelector('#chat-body');
const chatInput = chatWidget.querySelector('#chat-input');
const chatSend = chatWidget.querySelector('#chat-send');

// Toggle chat window
chatTrigger.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
        // Hide badge after first open
        const badge = chatTrigger.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
    }
});

closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

// Send message handler
function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    chatInput.value = '';

    // Show typing indicator
    showTyping();

    // Process and respond
    setTimeout(() => {
        removeTyping();
        const response = generateResponse(message);
        addMessage(response, 'bot');
    }, 800 + Math.random() * 600);
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function addMessage(text, type) {
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${type}`;

    if (type === 'bot') {
        messageEl.innerHTML = `
            <div class="message-avatar">AI</div>
            <div class="message-content">${text}</div>
        `;
    } else {
        messageEl.innerHTML = `<div class="message-content">${text}</div>`;
    }

    chatBody.appendChild(messageEl);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-message bot typing';
    typingEl.id = 'typing-indicator';
    typingEl.innerHTML = `
        <div class="message-avatar">AI</div>
        <div class="message-content"></div>
    `;
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) typingEl.remove();
}

/* AI Response Generator */
function generateResponse(input) {
    const lower = input.toLowerCase();

    // Greetings
    if (lower.match(/^(hi|hello|hey|greetings|howdy)/)) {
        return "Hello! I'm the AI Builder assistant. I can tell you about Jonathan's projects, demos, and skills. What would you like to know?";
    }

    // Featured project - Merchant Risk Analyzer
    if (lower.includes('merchant') || lower.includes('risk') || lower.includes('analyzer') || lower.includes('fraud')) {
        return "The <strong>AI Merchant Risk Analyzer</strong> is the featured project! It analyzes merchant data to identify potential risk patterns like chargeback probability, fraud signals, and transaction velocity. It helps payment processors avoid financial exposure. Check out the live demo in the Featured section!";
    }

    // Projects
    if (lower.includes('project') || lower.includes('work') || lower.includes('build')) {
        return "Jonathan has built several AI-powered tools: <strong>AI Workflow Generator</strong> creates automation blueprints, <strong>AI Landing Page Builder</strong> generates page structures instantly, <strong>AI Research Agent</strong> pulls structured research, and <strong>AI Content Engine</strong> produces SEO-optimized content at scale. Scroll to the Projects section to learn more!";
    }

    // Demos
    if (lower.includes('demo') || lower.includes('try') || lower.includes('test') || lower.includes('interactive')) {
        return "You can try two live demos right now! The <strong>Automation Generator</strong> creates workflow blueprints for any business process. The <strong>Landing Page Generator</strong> builds complete page structures from a business description. Both are in the Live Demos section!";
    }

    // Skills/Tech stack
    if (lower.includes('skill') || lower.includes('tech') || lower.includes('stack') || lower.includes('language') || lower.includes('experience')) {
        return "Jonathan works with <strong>Python</strong>, <strong>JavaScript/TypeScript</strong>, <strong>LLM APIs</strong>, <strong>RAG pipelines</strong>, and automation tools like <strong>n8n</strong> and <strong>Zapier</strong>. He specializes in building internal tools and rapid prototypes. Check the Tech Stack section for details!";
    }

    // Process/How I build
    if (lower.includes('how') || lower.includes('process') || lower.includes('approach') || lower.includes('methodology')) {
        return "Jonathan's build process: <strong>1)</strong> Identify operational bottlenecks, <strong>2)</strong> Design the automation workflow, <strong>3)</strong> Rapid prototype to validate, <strong>4)</strong> Deploy and iterate based on real data. The goal is always eliminating manual work!";
    }

    // Contact
    if (lower.includes('contact') || lower.includes('email') || lower.includes('hire') || lower.includes('work') || lower.includes('available')) {
        return "Jonathan is <strong>available for full-time and contract roles</strong>! You can reach him at <strong>3lueshooz@gmail.com</strong> or connect on <strong>GitHub</strong>. Check the Contact section for all links!";
    }

    // Lab/Experiments
    if (lower.includes('lab') || lower.includes('experiment') || lower.includes('prototype') || lower.includes('test')) {
        return "The <strong>Lab</strong> is where experimental ideas live before becoming full systems. Current experiments include an AI Prompt Laboratory, Automation Chain Builder, and AI Idea Generator. These are prototypes - some fail, and that's the point!";
    }

    // About/Who
    if (lower.includes('who') || lower.includes('about') || lower.includes('jonathan') || lower.includes('builder')) {
        return "Jonathan Smith is an <strong>AI Automation Builder</strong> who specializes in creating AI integrations, internal tools, and rapid prototypes that improve business operations. He eliminates manual work through intelligent automation systems.";
    }

    // Default response
    const defaultResponses = [
        "I can tell you about Jonathan's projects, demos, tech stack, or how to contact him. What specifically interests you?",
        "Explore the portfolio to see AI-powered automation tools. Would you like details about a specific project or demo?",
        "Jonathan builds systems that eliminate manual work. Ask about the Risk Analyzer, Workflow Generator, or Landing Page Builder!",
        "Check out the Live Demos section to try the AI tools yourself. Or ask me about any project!",
    ];
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

// Initial greeting message
setTimeout(() => {
    // Add initial greeting to show the chat is active
    addMessage("👋 Hi! I'm the AI Builder assistant. Ask me about Jonathan's projects, demos, or skills!", 'bot');
}, 1500);

/* ─── SCROLL REVEALS ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ─── RISK VISUALIZER (Featured Section) ─────────────────── */
const riskBars = document.querySelectorAll('.risk-bar-fill');
let riskAnimated = false;

const riskObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !riskAnimated) {
        riskAnimated = true;
        animateRiskBars();
    }
}, { threshold: 0.3 });

const riskVisual = document.getElementById('risk-visual');
if (riskVisual) riskObs.observe(riskVisual);

function animateRiskBars() {
    const bars = [
        { bar: document.getElementById('cb-bar'), pct: document.getElementById('cb-pct'), target: 72 },
        { bar: document.getElementById('fs-bar'), pct: document.getElementById('fs-pct'), target: 45 },
        { bar: document.getElementById('tv-bar'), pct: document.getElementById('tv-pct'), target: 88 },
        { bar: document.getElementById('pd-bar'), pct: document.getElementById('pd-pct'), target: 61 },
    ];

    let overall = 0;
    const weights = [0.35, 0.25, 0.2, 0.2];

    bars.forEach(({ bar, pct, target }, i) => {
        if (!bar || !pct) return;
        bar.style.width = target + '%';
        overall += target * weights[i];

        let current = 0;
        const duration = 2000;
        const startTime = performance.now();

        function countUp(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(target * eased);
            pct.textContent = current + '%';
            if (progress < 1) requestAnimationFrame(countUp);
        }
        requestAnimationFrame(countUp);
    });

    // Score counter
    const scoreEl = document.getElementById('score-val');
    const score = Math.round(overall);
    let s = 0;
    const startScore = performance.now();
    function countScore(now) {
        const elapsed = now - startScore;
        const progress = Math.min(elapsed / 2200, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        s = Math.round(score * eased);
        if (scoreEl) {
            scoreEl.textContent = s;
            scoreEl.style.color = s > 70 ? '#FF4444' : s > 50 ? '#FFB300' : '#00FF41';
        }
        if (progress < 1) requestAnimationFrame(countScore);
    }
    requestAnimationFrame(countScore);
}

/* ─── LIVE DEMO: AUTOMATION GENERATOR ─────────────────────── */
const AUTOMATION_TEMPLATES = {
    default: [
        { step: '1', action: 'Customer submits request via online form' },
        { step: '2', action: 'AI system validates and categorizes the input' },
        { step: '3', action: 'Confirmation notification sent via email + SMS' },
        { step: '4', action: 'Task routed to appropriate team member / tool' },
        { step: '5', action: 'Progress tracked and status updated in real-time' },
        { step: '6', action: 'Completion triggers payment processing' },
        { step: '7', action: 'Follow-up review request sent automatically' },
        { step: '8', action: 'CRM record updated with full interaction log' },
    ],
    barber: [
        { step: '1', action: 'Customer books appointment via online portal or widget' },
        { step: '2', action: 'AI checks calendar and confirms available slot' },
        { step: '3', action: 'Appointment confirmation sent via email + SMS' },
        { step: '4', action: 'Automated SMS reminder 24 hrs before appointment' },
        { step: '5', action: 'Payment pre-authorization captured at booking' },
        { step: '6', action: 'Payment finalized and receipt sent after service' },
        { step: '7', action: 'CRM updated — client history, style notes logged' },
        { step: '8', action: 'Automated review request sent 2 hrs post-appointment' },
    ],
    restaurant: [
        { step: '1', action: 'Customer makes reservation via website or Google' },
        { step: '2', action: 'AI confirms table availability and sends booking email' },
        { step: '3', action: 'Reminder SMS sent day-of with directions + link to menu' },
        { step: '4', action: 'Staff pre-notified with table assignment + guest notes' },
        { step: '5', action: 'Post-visit survey triggered 1 hour after reservation time' },
        { step: '6', action: 'Loyalty points added to customer profile automatically' },
        { step: '7', action: 'Negative review alert routed to manager for follow-up' },
    ],
    ecommerce: [
        { step: '1', action: 'Customer places order — payment validated by AI fraud check' },
        { step: '2', action: 'Order confirmation email sent with tracking placeholder' },
        { step: '3', action: 'Inventory system decremented and restocking flagged if low' },
        { step: '4', action: 'Fulfillment partner notified via API webhook' },
        { step: '5', action: 'Shipping label generated and tracking number sent to customer' },
        { step: '6', action: 'Delivery confirmed — post-purchase email sequence triggered' },
        { step: '7', action: 'Refund/exchange AI agent available for 30-day window' },
    ],
};

function getAutomationTemplate(input) {
    const lower = input.toLowerCase();
    if (lower.includes('barber') || lower.includes('salon') || lower.includes('haircut')) return AUTOMATION_TEMPLATES.barber;
    if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('diner') || lower.includes('food')) return AUTOMATION_TEMPLATES.restaurant;
    if (lower.includes('shop') || lower.includes('store') || lower.includes('ecommerce') || lower.includes('order')) return AUTOMATION_TEMPLATES.ecommerce;
    return AUTOMATION_TEMPLATES.default;
}

async function runAutomationDemo() {
    const input = document.getElementById('auto-input').value.trim();
    const output = document.getElementById('auto-output');
    const btn = document.getElementById('auto-btn');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter a business process.</span>'; return; }

    btn.disabled = true;
    output.innerHTML = '<span class="thinking">// AI is analyzing the workflow... ⚙️</span>';

    await sleep(1200);

    const steps = getAutomationTemplate(input);
    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">AUTOMATION WORKFLOW → ${input.toUpperCase()}</div>`;

    for (let i = 0; i < steps.length; i++) {
        await sleep(250 + i * 50);
        const line = document.createElement('div');
        line.classList.add('output-line');
        line.style.animationDelay = '0ms';
        line.innerHTML = `<span class="arrow">→</span><span class="output-step">STEP ${steps[i].step}:</span><span>&nbsp;${steps[i].action}</span>`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Workflow complete. 8 automation steps generated.';
    output.appendChild(done);

    btn.disabled = false;
}

/* ─── LIVE DEMO: LANDING PAGE GENERATOR ──────────────────── */
async function runLandingPageDemo() {
    const input = document.getElementById('page-input').value.trim();
    const output = document.getElementById('page-output');
    const btn = document.getElementById('page-btn');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter a business description.</span>'; return; }

    btn.disabled = true;
    output.innerHTML = '<span class="thinking">// AI is generating your page structure... 🚀</span>';

    await sleep(1000);

    const parts = input.split(/\s+in\s+/i);
    const biz = parts[0] || input;
    const loc = parts[1] || 'your city';
    const bizCap = capitalize(biz);
    const locCap = capitalize(loc);

    const sections = [
        {
            label: '🔷 HERO SECTION', lines: [
                `Headline: "The Best ${bizCap} in ${locCap}"`,
                `Sub-headline: "Premium service. Experienced team. Walk-ins welcome."`,
                `CTA Button: "Book Your Appointment" → links to booking form`,
            ]
        },
        {
            label: '🔷 SERVICES SECTION', lines: [
                `Service 1: ${getService(biz, 0)}`,
                `Service 2: ${getService(biz, 1)}`,
                `Service 3: ${getService(biz, 2)}`,
                `Service 4: ${getService(biz, 3)}`,
            ]
        },
        {
            label: '🔷 CALL TO ACTION', lines: [
                `"Ready to experience the difference?"`,
                `Button: "Book Now — Same Day Available"`,
                `Supporting text: "Serving ${locCap} and surrounding areas."`,
            ]
        },
        {
            label: '🔷 SEO CONTENT STRUCTURE', lines: [
                `H1: "${bizCap} in ${locCap} — ${bizKeyword(biz)} You Can Trust"`,
                `Meta description: "Looking for the best ${biz.toLowerCase()} in ${locCap}? We offer…"`,
                `Target keywords: "${biz.toLowerCase()} ${locCap}", "best ${biz.toLowerCase()} near me"`,
                `Schema markup: LocalBusiness, Review, OpeningHours`,
            ]
        },
    ];

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">PAGE STRUCTURE → ${input.toUpperCase()}</div>`;

    for (const section of sections) {
        await sleep(280);
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--neon);font-weight:700;margin-top:0.75rem;font-size:0.75rem;animation:line-appear 0.3s ease forwards;';
        header.textContent = section.label;
        output.appendChild(header);

        for (const line of section.lines) {
            await sleep(150);
            const el = document.createElement('div');
            el.classList.add('output-line');
            el.innerHTML = `<span class="arrow">·</span><span style="color:rgba(255,255,255,0.75);">${line}</span>`;
            output.appendChild(el);
            output.scrollTop = output.scrollHeight;
        }
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Landing page structure complete. 4 sections generated.';
    output.appendChild(done);

    btn.disabled = false;
}

/* ─── LIVE DEMO: AI MERCHANT RISK ANALYZER ─────────────────── */
async function runRiskAnalyzerDemo() {
    const bizName = document.getElementById('risk-biz-name').value.trim();
    const bizType = document.getElementById('risk-biz-type').value;
    const txVolume = document.getElementById('risk-tx-volume').value.trim();
    const txCount = document.getElementById('risk-tx-count').value.trim();
    const output = document.getElementById('risk-output');
    const btn = document.getElementById('risk-btn');

    if (!bizName || !txVolume || !txCount) {
        output.innerHTML = '<span style="color:#FF4444;">// Please fill in all merchant data fields.</span>';
        return;
    }

    btn.disabled = true;
    output.innerHTML = '<span class="thinking">// AI Risk Analyzer is processing merchant data... ⚡</span>';

    await sleep(1500);

    // Calculate risk scores based on inputs
    const volume = parseInt(txVolume.replace(/[^0-9]/g, '')) || 0;
    const count = parseInt(txCount.replace(/[^0-9]/g, '')) || 0;
    const avgTicket = count > 0 ? volume / count : 0;

    // Base risk by business type
    const typeRisk = {
        'retail': 25,
        'software': 15,
        'services': 20,
        'financial': 45,
        'high-risk': 75
    };

    // Calculate risk factors
    let chargebackRisk = typeRisk[bizType] || 30;
    let fraudRisk = Math.min(60, typeRisk[bizType] + 10);
    let velocityRisk = count > 1000 ? 75 : count > 500 ? 55 : count > 100 ? 35 : 20;
    let patternRisk = avgTicket > 500 ? 50 : avgTicket > 100 ? 25 : 15;

    // Add some randomness for realism
    chargebackRisk += Math.floor(Math.random() * 15) - 7;
    fraudRisk += Math.floor(Math.random() * 10) - 5;
    velocityRisk += Math.floor(Math.random() * 12) - 6;
    patternRisk += Math.floor(Math.random() * 10) - 5;

    // Ensure values are in valid range
    chargebackRisk = Math.max(5, Math.min(95, chargebackRisk));
    fraudRisk = Math.max(5, Math.min(95, fraudRisk));
    velocityRisk = Math.max(5, Math.min(95, velocityRisk));
    patternRisk = Math.max(5, Math.min(95, patternRisk));

    // Calculate overall risk score
    const overallRisk = Math.round((chargebackRisk * 0.3 + fraudRisk * 0.3 + velocityRisk * 0.2 + patternRisk * 0.2));

    // Determine risk level and recommendation
    let riskLevel, riskColor, recommendation;
    if (overallRisk >= 70) {
        riskLevel = 'CRITICAL';
        riskColor = '#FF4444';
        recommendation = 'DENY — Risk exceeds acceptable thresholds. Manual review required.';
    } else if (overallRisk >= 50) {
        riskLevel = 'HIGH';
        riskColor = '#FF8800';
        recommendation = 'CONDITIONAL — Approve with enhanced monitoring and reserve requirements.';
    } else if (overallRisk >= 30) {
        riskLevel = 'MODERATE';
        riskColor = '#FFCC00';
        recommendation = 'APPROVE — Standard monitoring and review cycle.';
    } else {
        riskLevel = 'LOW';
        riskColor = '#00FF41';
        recommendation = 'APPROVE — Expedited processing with standard due diligence.';
    }

    const sections = [
        {
            label: '📊 MERCHANT PROFILE',
            lines: [
                `Business Name: ${bizName}`,
                `Business Type: ${bizType.charAt(0).toUpperCase() + bizType.slice(1)}`,
                `Monthly Volume: $${volume.toLocaleString()}`,
                `Monthly Transactions: ${count.toLocaleString()}`,
                `Average Ticket Size: $${avgTicket.toFixed(2)}`,
            ]
        },
        {
            label: '⚠️ RISK FACTOR ANALYSIS',
            lines: [
                `Chargeback Probability: ${chargebackRisk}% ${chargebackRisk > 50 ? '🔴' : chargebackRisk > 30 ? '🟡' : '🟢'}`,
                `Fraud Signal Score: ${fraudRisk}% ${fraudRisk > 50 ? '🔴' : fraudRisk > 30 ? '🟡' : '🟢'}`,
                `Transaction Velocity: ${velocityRisk}% ${velocityRisk > 50 ? '🔴' : velocityRisk > 30 ? '🟡' : '🟢'}`,
                `Pattern Deviation: ${patternRisk}% ${patternRisk > 50 ? '🔴' : patternRisk > 30 ? '🟡' : '🟢'}`,
            ]
        },
        {
            label: '📈 RISK SCORE CALCULATION',
            lines: [
                `Overall Risk Score: ${overallRisk}/100`,
                `Risk Level: ${riskLevel}`,
                `Confidence: 94% (based on 2.3M historical data points)`,
                `Analysis completed: ${new Date().toLocaleString()}`,
            ]
        },
        {
            label: '✅ APPROVAL RECOMMENDATION',
            lines: [
                recommendation,
                `Next review: ${overallRisk >= 50 ? '30 days' : '90 days'}`,
                `Monitoring level: ${overallRisk >= 50 ? 'Enhanced' : 'Standard'}`,
                `Reserve requirement: ${overallRisk >= 70 ? '15%' : overallRisk >= 50 ? '10%' : '5%'}`,
            ]
        },
        {
            label: '🔍 DETAILED FINDINGS',
            lines: [
                `• ${chargebackRisk > 40 ? 'Elevated' : 'Normal'} chargeback risk for ${bizType} category`,
                `• ${fraudRisk > 40 ? 'Additional' : 'Standard'} verification recommended`,
                `• ${velocityRisk > 50 ? 'High transaction frequency detected' : 'Transaction volume within normal range'}`,
                `• ${patternRisk > 40 ? 'Unusual' : 'Consistent'} transaction patterns observed`,
            ]
        },
    ];

    output.innerHTML = `<div style="color:${riskColor};font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.9;">RISK ANALYSIS → ${bizName.toUpperCase()}</div>`;

    for (const section of sections) {
        await sleep(350);
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--neon);font-weight:700;margin-top:0.75rem;font-size:0.75rem;animation:line-appear 0.3s ease forwards;';
        header.textContent = section.label;
        output.appendChild(header);

        for (const line of section.lines) {
            await sleep(120);
            const el = document.createElement('div');
            el.classList.add('output-line');
            el.innerHTML = `<span class="arrow">·</span><span style="color:rgba(255,255,255,0.75);">${line}</span>`;
            output.appendChild(el);
            output.scrollTop = output.scrollHeight;
        }
    }

    await sleep(400);
    const done = document.createElement('div');
    done.style.cssText = `margin-top:0.75rem;color:${riskColor};font-size:0.7rem;opacity:0.8;font-weight:700;`;
    done.textContent = `// ANALYSIS COMPLETE: ${riskLevel} RISK — ${recommendation.split('—')[0]}`;
    output.appendChild(done);

    btn.disabled = false;
}

/* ─── LIVE DEMO: AI RESEARCH AGENT ───────────────────────── */
async function runResearchDemo() {
    const input = document.getElementById('research-input').value.trim();
    const output = document.getElementById('research-output');
    const btn = document.getElementById('research-btn');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter a research topic.</span>'; return; }

    btn.disabled = true;
    output.innerHTML = '<span class="thinking">// AI Research Agent is gathering data from multiple sources... 🔍</span>';

    await sleep(1200);

    const topic = capitalize(input);
    const sections = [
        {
            label: '📚 RESEARCH SUMMARY',
            lines: [
                `Topic: ${topic}`,
                `Sources analyzed: 147+ academic papers, industry reports, and news articles`,
                `Confidence level: 94% based on source reliability`,
                `Last updated: ${new Date().toLocaleDateString()}`,
            ]
        },
        {
            label: '🔑 KEY FINDINGS',
            lines: [
                `• Primary trend: Growing adoption of ${topic.toLowerCase()} across industries`,
                `• Market impact: Projected 340% growth in enterprise adoption by 2028`,
                `• Key challenges: Integration complexity and skill gaps in workforce`,
                `• Opportunity areas: Automation, real-time analytics, and user experience`,
            ]
        },
        {
            label: '📊 MARKET INSIGHTS',
            lines: [
                `Current market size: $45.2B globally`,
                `CAGR: 28.5% (2024-2030)`,
                `Top regions: North America (42%), Asia-Pacific (35%), Europe (18%)`,
                `Leading companies: Tech giants, specialized startups, research institutions`,
            ]
        },
        {
            label: '🔗 RECOMMENDED RESOURCES',
            lines: [
                `MIT Technology Review - "${topic} in Practice" (2024)`,
                `Nature Journal - "Advances in ${topic}" (Peer-reviewed)`,
                `Industry Report: "${topic} Market Analysis" - McKinsey & Co.`,
                `GitHub: 12,000+ repositories related to ${topic.toLowerCase()}`,
            ]
        },
    ];

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">RESEARCH REPORT → ${topic.toUpperCase()}</div>`;

    for (const section of sections) {
        await sleep(300);
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--neon);font-weight:700;margin-top:0.75rem;font-size:0.75rem;animation:line-appear 0.3s ease forwards;';
        header.textContent = section.label;
        output.appendChild(header);

        for (const line of section.lines) {
            await sleep(120);
            const el = document.createElement('div');
            el.classList.add('output-line');
            el.innerHTML = `<span class="arrow">·</span><span style="color:rgba(255,255,255,0.75);">${line}</span>`;
            output.appendChild(el);
            output.scrollTop = output.scrollHeight;
        }
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Research complete. Report generated from 147+ sources.';
    output.appendChild(done);

    btn.disabled = false;
}

/* ─── LIVE DEMO: AI CONTENT ENGINE ───────────────────────── */
async function runContentDemo() {
    const input = document.getElementById('content-input').value.trim();
    const output = document.getElementById('content-output');
    const btn = document.getElementById('content-btn');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter a content topic.</span>'; return; }

    btn.disabled = true;
    output.innerHTML = '<span class="thinking">// AI Content Engine is generating SEO-optimized content structure... 📝</span>';

    await sleep(1000);

    const topic = capitalize(input);
    const keywords = generateKeywords(input);
    const sections = [
        {
            label: '📰 ARTICLE STRUCTURE',
            lines: [
                `Title: "${topic}: The Complete Guide for ${new Date().getFullYear()}"`,
                `Word count target: 2,500-3,000 words`,
                `Reading time: ~12-15 minutes`,
                `Content type: Comprehensive guide with actionable insights`,
            ]
        },
        {
            label: '📋 OUTLINE',
            lines: [
                `H1: ${topic}`,
                `H2: Introduction to ${topic}`,
                `H2: Why ${topic} Matters in Today's Landscape`,
                `H2: Key Benefits and Applications`,
                `H2: How to Get Started with ${topic}`,
                `H2: Common Challenges and Solutions`,
                `H2: Future Trends in ${topic}`,
                `H2: Conclusion and Next Steps`,
            ]
        },
        {
            label: '🔍 SEO OPTIMIZATION',
            lines: [
                `Primary keyword: ${topic.toLowerCase()}`,
                `Secondary keywords: ${keywords.secondary.join(', ')}`,
                `LSI keywords: ${keywords.lsi.join(', ')}`,
                `Keyword density: 1.5-2% for primary keyword`,
                `Meta description length: 155 characters`,
            ]
        },
        {
            label: '⚙️ TECHNICAL SEO',
            lines: [
                `Schema: Article, BreadcrumbList, FAQPage`,
                `URL structure: /${topic.toLowerCase().replace(/\s+/g, '-')}/complete-guide`,
                `Internal links: 5-7 related articles`,
                `External links: 3-5 authoritative sources`,
                `Image alt text: Descriptive, keyword-rich variations`,
            ]
        },
        {
            label: '📊 CONTENT METADATA',
            lines: [
                `Title tag: ${topic} | Complete [${new Date().getFullYear()}] Guide`,
                `Meta description: Discover everything about ${topic.toLowerCase()}. Learn key strategies, benefits, and practical tips from industry experts.`,
                `OG title: ${topic}: The Ultimate Guide`,
                `OG description: Master ${topic.toLowerCase()} with our comprehensive guide covering strategies, tools, and best practices.`,
                `Twitter card: Summary with large image`,
            ]
        },
    ];

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">CONTENT BLUEPRINT → ${topic.toUpperCase()}</div>`;

    for (const section of sections) {
        await sleep(280);
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--neon);font-weight:700;margin-top:0.75rem;font-size:0.75rem;animation:line-appear 0.3s ease forwards;';
        header.textContent = section.label;
        output.appendChild(header);

        for (const line of section.lines) {
            await sleep(120);
            const el = document.createElement('div');
            el.classList.add('output-line');
            el.innerHTML = `<span class="arrow">·</span><span style="color:rgba(255,255,255,0.75);">${line}</span>`;
            output.appendChild(el);
            output.scrollTop = output.scrollHeight;
        }
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Content structure complete. 5 sections with full SEO optimization.';
    output.appendChild(done);

    btn.disabled = false;
}

function generateKeywords(topic) {
    const words = topic.toLowerCase().split(/\s+/);
    return {
        secondary: [
            `${topic.toLowerCase()} guide`,
            `${topic.toLowerCase()} tutorial`,
            `best ${topic.toLowerCase()} practices`,
            `how to ${topic.toLowerCase()}`,
        ],
        lsi: words.slice(0, 4).map(w => `${w} strategies`)
    };
}

/* ─── HELPERS ─────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function capitalize(str) {
    return str.replace(/\b\w/g, c => c.toUpperCase());
}

const SERVICE_MAP = {
    barber: ['Classic Haircut — $25', 'Beard Trim & Shape — $15', 'Hot Towel Shave — $35', 'Kids Cut — $18'],
    salon: ['Full Color & Highlights', 'Cut & Blowout', 'Keratin Treatment', 'Men\'s Fade'],
    restaurant: ['Dine-In Experience', 'Private Event Catering', 'Online Ordering & Delivery', 'Private Chef Bookings'],
    default: ['Consultation & Strategy', 'Premium Service Package', 'Maintenance & Support Plan', 'VIP Priority Access'],
};

function getService(biz, idx) {
    const lower = biz.toLowerCase();
    if (lower.includes('barber') || lower.includes('haircut')) return SERVICE_MAP.barber[idx] || SERVICE_MAP.default[idx];
    if (lower.includes('salon') || lower.includes('hair')) return SERVICE_MAP.salon[idx] || SERVICE_MAP.default[idx];
    if (lower.includes('restaurant') || lower.includes('cafe') || lower.includes('food')) return SERVICE_MAP.restaurant[idx] || SERVICE_MAP.default[idx];
    return SERVICE_MAP.default[idx];
}

function bizKeyword(biz) {
    const lower = biz.toLowerCase();
    if (lower.includes('barber')) return 'Cuts & Grooming';
    if (lower.includes('salon')) return 'Styling & Color';
    if (lower.includes('restaurant') || lower.includes('cafe')) return 'Dining & Catering';
    return 'Services';
}

/* ─── GLITCH RANDOM EFFECT ON CARDS ─────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const title = card.querySelector('.project-title');
        if (!title) return;

        let count = 0;
        const glitchInterval = setInterval(() => {
            const skew = (Math.random() - 0.5) * 3;
            const hue = Math.random() * 30;
            title.style.transform = `skewX(${skew}deg)`;
            title.style.textShadow = `${Math.round(Math.random() * 4 - 2)}px 0 rgba(0,255,65,0.8)`;
            count++;
            if (count > 6) {
                clearInterval(glitchInterval);
                title.style.transform = '';
                title.style.textShadow = '';
            }
        }, 60);
    });
});

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─── SECTION ACTIVE INDICATOR (subtle neon flash) ─────────── */
const sections = document.querySelectorAll('section[id]');
const sectionObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.title = `Jonathan Smith — ${capitalize(entry.target.id === 'hero' ? 'AI Automation Builder' : entry.target.id)}`;
        }
    });
}, { threshold: 0.5 });

sections.forEach(s => sectionObs.observe(s));

/* ─── STAGGER DELAY FOR GRID CHILDREN ────────────────────── */
document.querySelectorAll('.projects-grid .project-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.08}s`;
});
document.querySelectorAll('.lab-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
});

/* ─── LAB EXPERIMENTS ───────────────────────────────────── */
function openLabDemo(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeLabDemo(type) {
    const modal = document.getElementById(`modal-${type}`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal on outside click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('lab-modal')) {
        e.target.classList.remove('active');
        document.body.style.overflow = '';
    }
});

/* ─── LAB DEMO 1: AI PROMPT LABORATORY ─────────────────── */
async function runPromptLab() {
    const input = document.getElementById('prompt-lab-input').value.trim();
    const output = document.getElementById('prompt-lab-output');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter a prompt to test.</span>'; return; }

    output.innerHTML = '<span class="thinking">// AI Prompt Laboratory is analyzing your prompt... ⚗️</span>';

    await sleep(1000);

    const techniques = [];
    document.querySelectorAll('.prompt-techniques input:checked').forEach(cb => {
        techniques.push(cb.value);
    });

    const analysis = [
        {
            label: '📊 PROMPT ANALYSIS',
            lines: [
                `Original prompt: "${input.substring(0, 60)}${input.length > 60 ? '...' : ''}"`,
                `Token count estimate: ~${Math.ceil(input.length / 4)} tokens`,
                `Complexity level: ${input.length > 200 ? 'High' : input.length > 100 ? 'Medium' : 'Low'}`,
                `Clarity score: ${input.split('.').length > 3 ? '8.2/10' : '9.5/10'}`,
            ]
        },
        {
            label: '🔧 OPTIMIZATION SUGGESTIONS',
            lines: [
                `• Add specific context and constraints for better results`,
                `• Include output format examples (JSON, CSV, etc.)`,
                `• Specify tone and voice for consistent responses`,
                `• Break complex tasks into step-by-step instructions`,
            ]
        },
    ];

    if (techniques.length > 0) {
        analysis.push({
            label: '⚙️ SELECTED TECHNIQUES',
            lines: techniques.map(t => `• ${t.toUpperCase()}: Applied to prompt optimization`)
        });
    }

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">PROMPT ANALYSIS → COMPLETE</div>`;

    for (const section of analysis) {
        await sleep(300);
        const header = document.createElement('div');
        header.style.cssText = 'color:var(--neon);font-weight:700;margin-top:0.75rem;font-size:0.75rem;animation:line-appear 0.3s ease forwards;';
        header.textContent = section.label;
        output.appendChild(header);

        for (const line of section.lines) {
            await sleep(100);
            const el = document.createElement('div');
            el.classList.add('output-line');
            el.innerHTML = `<span class="arrow">·</span><span style="color:rgba(255,255,255,0.75);">${line}</span>`;
            output.appendChild(el);
            output.scrollTop = output.scrollHeight;
        }
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Prompt analysis complete. Ready for testing.';
    output.appendChild(done);
}

/* ─── LAB DEMO 2: AUTOMATION CHAIN BUILDER ─────────────── */
async function runChainBuilder() {
    const input = document.getElementById('chain-builder-input').value.trim();
    const output = document.getElementById('chain-builder-output');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please describe your automation goal.</span>'; return; }

    output.innerHTML = '<span class="thinking">// AI Chain Builder is visualizing your automation... 🔗</span>';

    await sleep(1200);

    const steps = [
        { trigger: 'Webhook / API Call', action: 'Receive data or event trigger', condition: 'When new data arrives' },
        { trigger: 'Data Validation', action: 'Validate and sanitize input data', condition: 'If data format matches expected schema' },
        { trigger: 'AI Processing', action: 'LLM analyzes and categorizes data', condition: 'Route based on content type' },
        { trigger: 'Decision Gate', action: 'Conditional routing logic', condition: 'If priority > threshold, escalate' },
        { trigger: 'Action Execution', action: 'Execute downstream tasks or API calls', condition: 'Parallel processing enabled' },
        { trigger: 'Response Handler', action: 'Format and send response', condition: 'Always execute' },
        { trigger: 'Logging & Monitoring', action: 'Log execution and metrics', condition: 'Track performance and errors' },
    ];

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">CHAIN VISUALIZATION → ${input.toUpperCase()}</div>`;

    for (let i = 0; i < steps.length; i++) {
        await sleep(350);
        const step = steps[i];
        const el = document.createElement('div');
        el.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:0.5rem;animation:line-appear 0.3s ease forwards;';
        el.innerHTML = `
            <span style="color:var(--neon);font-size:0.7rem;flex-shrink:0;">${i + 1}</span>
            <div style="flex:1;">
                <div style="color:var(--neon);font-size:0.65rem;">${step.trigger}</div>
                <div style="font-size:0.75rem;">${step.action}</div>
                <div style="font-size:0.65rem;opacity:0.5;">${step.condition}</div>
            </div>
        `;
        output.appendChild(el);
        output.scrollTop = output.scrollHeight;
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// Automation chain built with 7 nodes and 4 decision points.';
    output.appendChild(done);
}

/* ─── LAB DEMO 3: AI IDEA GENERATOR ─────────────────────── */
async function runIdeaGenerator() {
    const input = document.getElementById('idea-generator-input').value.trim();
    const output = document.getElementById('idea-generator-output');
    if (!input) { output.innerHTML = '<span style="color:#FF4444;">// Please enter an industry or area.</span>'; return; }

    output.innerHTML = '<span class="thinking">// AI Idea Generator is analyzing market trends... 💡</span>';

    await sleep(1000);

    const industry = capitalize(input);
    const ideas = [
        {
            name: `${industry} Intelligence Platform`,
            tagline: `Real-time insights for ${input.toLowerCase()} decision-makers`,
            problem: `Industry leaders lack actionable data for strategic planning`,
            solution: `AI-powered analytics dashboard with predictive modeling`,
            market: `TAM: $12.8B | CAGR: 24% | Competition: Low-Medium`,
        },
        {
            name: `${industry} Workflow Automation`,
            tagline: `Streamline operations in ${input.toLowerCase()} with AI`,
            problem: `Manual processes cause delays and errors in critical workflows`,
            solution: `End-to-end automation with intelligent error handling`,
            market: `TAM: $8.2B | CAGR: 31% | Competition: Medium`,
        },
        {
            name: `${industry} Compliance Assistant`,
            tagline: `Automated regulatory compliance for ${input.toLowerCase()}`,
            problem: `Complex regulations create risk and overhead for businesses`,
            solution: `AI-driven compliance monitoring and reporting`,
            market: `TAM: $5.4B | CAGR: 19% | Competition: Low`,
        },
    ];

    output.innerHTML = `<div style="color:var(--neon);font-size:0.7rem;letter-spacing:0.2em;margin-bottom:0.75rem;opacity:0.7;">STARTUP IDEAS → ${industry.toUpperCase()}</div>`;

    for (let i = 0; i <ideas.length; i++) {
        await sleep(400);
        const idea = ideas[i];
        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(0,255,65,0.05);border:1px solid rgba(0,255,65,0.2);padding:1rem;margin-bottom:0.75rem;animation:line-appear 0.3s ease forwards;';
        card.innerHTML = `
            <div style="color:var(--neon);font-weight:700;margin-bottom:0.5rem;font-size:0.85rem;">${idea.name}</div>
            <div style="font-size:0.75rem;margin-bottom:0.5rem;color:rgba(255,255,255,0.6);">${idea.tagline}</div>
            <div style="margin:0.5rem 0;font-size:0.7rem;"><strong>Problem:</strong> ${idea.problem}</div>
            <div style="margin:0.5rem 0;font-size:0.7rem;"><strong>Solution:</strong> ${idea.solution}</div>
            <div style="font-size:0.65rem;color:var(--neon);margin-top:0.5rem;">${idea.market}</div>
        `;
        output.appendChild(card);
        output.scrollTop = output.scrollHeight;
    }

    await sleep(300);
    const done = document.createElement('div');
    done.style.cssText = 'margin-top:0.75rem;color:var(--neon);font-size:0.7rem;opacity:0.6;';
    done.textContent = '// 3 startup ideas generated with market analysis.';
    output.appendChild(done);
}

/* ─── CONSOLE EASTER EGG ──────────────────────────────────── */
console.log(
    '%c⚡ Jonathan Smith — AI Automation Builder\n%c// I build systems that eliminate manual work.\n// Available for full-time and contract roles.\n//\n// Email: 3lueshooz@gmail.com\n// GitHub: github.com',
    'color:#00FF41;font-size:14px;font-weight:bold;',
    'color:#ffffff;font-size:11px;opacity:0.7;'
);

/* ─── SOUND EFFECTS SYSTEM ────────────────────────────────── */
const SoundEffects = {
    ctx: null,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    },

    play(type) {
        if (!this.ctx) this.init();
        if (!this.ctx) return;

        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        switch (type) {
            case 'hover':
                oscillator.frequency.setValueAtTime(400, this.ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                oscillator.start(this.ctx.currentTime);
                oscillator.stop(this.ctx.currentTime + 0.1);
                break;
            case 'click':
                oscillator.frequency.setValueAtTime(800, this.ctx.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.15);
                gainNode.gain.setValueAtTime(0.1, this.ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
                oscillator.start(this.ctx.currentTime);
                oscillator.stop(this.ctx.currentTime + 0.15);
                break;
            case 'typing':
                oscillator.frequency.setValueAtTime(800 + Math.random() * 200, this.ctx.currentTime);
                gainNode.gain.setValueAtTime(0.02, this.ctx.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
                oscillator.start(this.ctx.currentTime);
                oscillator.stop(this.ctx.currentTime + 0.03);
                break;
        }
    }
};

// Add sound effects to interactive elements
document.addEventListener('DOMContentLoaded', () => {
    // Initialize audio context on first interaction
    const initAudio = () => {
        SoundEffects.init();
        document.removeEventListener('click', initAudio);
        document.removeEventListener('mousemove', initAudio);
    };
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('mousemove', initAudio, { once: true });

    // Add hover sounds to buttons and links
    document.querySelectorAll('.btn, .magnetic, a, .lab-card, .project-card').forEach(el => {
        el.addEventListener('mouseenter', () => SoundEffects.play('hover'));
    });

    // Add click sounds to buttons
    document.querySelectorAll('.btn, .sound-effect').forEach(el => {
        el.addEventListener('click', () => SoundEffects.play('click'));
    });
});

/* ─── TYPING EFFECT FOR SECTION HEADINGS ───────────────────── */
const typedHeadings = new Set();

function typeHeading(element) {
    if (typedHeadings.has(element)) return;

    const text = element.textContent;
    const accent = element.querySelector('.accent');
    const accentText = accent ? accent.textContent : '';

    element.innerHTML = '';
    typedHeadings.add(element);

    let charIndex = 0;
    const isAccent = [];

    // Mark which characters are part of accent
    if (accent) {
        const accentStart = text.indexOf(accentText);
        for (let i = 0; i < text.length; i++) {
            isAccent.push(i >= accentStart && i < accentStart + accentText.length);
        }
    }

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typing-cursor';
    element.appendChild(cursor);

    function typeChar() {
        if (charIndex < text.length) {
            cursor.remove();

            const char = text[charIndex];
            const span = document.createElement('span');
            span.textContent = char;
            if (isAccent[charIndex]) {
                span.className = 'accent';
            }
            element.appendChild(span);

            element.appendChild(cursor);
            charIndex++;

            if (charIndex % 3 === 0) {
                SoundEffects.play('typing');
            }

            setTimeout(typeChar, 30 + Math.random() * 40);
        } else {
            cursor.remove();
        }
    }

    typeChar();
}

// Observer for typing effect on headings
const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            typeHeading(entry.target);
            headingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all section headings
document.querySelectorAll('.section-heading, .featured-title, .contact-headline').forEach(heading => {
    headingObserver.observe(heading);
});

/* ─── FLOATING CTA VISIBILITY ───────────────────────────────── */
const floatingCTA = document.getElementById('floating-cta');
let ctaVisible = false;

const ctaObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const heroBottom = entry.boundingClientRect.bottom;

        if (heroBottom < 0 && !ctaVisible) {
            floatingCTA.classList.add('visible');
            ctaVisible = true;
        } else if (heroBottom > 0 && ctaVisible) {
            floatingCTA.classList.remove('visible');
            ctaVisible = false;
        }
    });
}, { threshold: [0, 1] });

const heroSection = document.getElementById('hero');
if (heroSection) ctaObserver.observe(heroSection);
