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

/* ─── CONSOLE EASTER EGG ──────────────────────────────────── */
console.log(
    '%c⚡ Jonathan Smith — AI Automation Builder\n%c// I build systems that eliminate manual work.\n// Available for full-time and contract roles.\n//\n// Email: 3lueshooz@gmail.com\n// GitHub: github.com',
    'color:#00FF41;font-size:14px;font-weight:bold;',
    'color:#ffffff;font-size:11px;opacity:0.7;'
);
