// ─── NAVIGATION ───
// Maps page names to their HTML files
const pageMap = {
    home: 'index.html',
    expertise: 'pass.html',
    services: 'services.html',
    hcm: 'hcm.html',
    about: 'about.html',
    accelerators: 'hcmaccelerators.html',
    faq: 'faq.html',
    platform: 'intforge.html',
    payforge: 'payforge.html',
    ai: 'ai.html',
    oicinsights: 'oicinsights.html',
    oicnotes: 'oicnotes.html'
};

function navigate(page) {
    const file = pageMap[page];
    if (file) window.location.href = file;
}

// ─── MARK ACTIVE NAV LINK ───
(function() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    for (const [key, file] of Object.entries(pageMap)) {
        if (file === path || (path === '' && file === 'index.html')) {
            const el = document.getElementById('nav-' + key);
            if (el) el.classList.add('active');
        }
    }
})();

// ─── HEADER SCROLL ───
const _header = document.getElementById('mainHeader');
if (_header) {
    window.addEventListener('scroll', () => {
        _header.classList.toggle('scrolled', window.scrollY > 20);
    });
}

// ─── DESKTOP DROPDOWNS (click to open, click outside to close, hover to highlight) ───
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    dropdowns.forEach(function(dropdown) {
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');
        if (!trigger) return;

        // Hover — highlight trigger only, do NOT open menu
        dropdown.addEventListener('mouseenter', function() {
            trigger.classList.add('hovered');
        });
        dropdown.addEventListener('mouseleave', function() {
            trigger.classList.remove('hovered');
        });

        // Click — toggle open/close
        trigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            dropdowns.forEach(d => d.classList.remove('open'));
            if (!isOpen) dropdown.classList.add('open');
        });
    });

    // Click outside — close all
    document.addEventListener('click', function() {
        dropdowns.forEach(d => d.classList.remove('open'));
    });
});

// ─── MOBILE MENU ───
function toggleMenu() {
    const m = document.getElementById('mobileMenu');
    if (m) m.classList.toggle('active');
}
function toggleMobileProducts(e) {
    e.preventDefault();
    const sub = document.getElementById('mobileProductSub');
    const chevron = document.getElementById('prodChevron');
    if (!sub) return;
    const open = sub.style.display !== 'none';
    sub.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? '' : 'rotate(180deg)';
}
function toggleMobileAccelerators(e) {
    e.preventDefault();
    const sub = document.getElementById('mobileAccSub');
    const chevron = document.getElementById('accChevron');
    if (!sub) return;
    const open = sub.style.display !== 'none';
    sub.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? '' : 'rotate(180deg)';
}
function toggleMobileInsights(e) {
    e.preventDefault();
    const sub = document.getElementById('mobileInsSub');
    const chevron = document.getElementById('insChevron');
    if (!sub) return;
    const open = sub.style.display !== 'none';
    sub.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? '' : 'rotate(180deg)';
}
function toggleMobileServices(e) {
    e.preventDefault();
    const sub = document.getElementById('mobileAccSvc');
    const chevron = document.getElementById('svcChevron');
    if (!sub) return;
    const open = sub.style.display !== 'none';
    sub.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? '' : 'rotate(180deg)';
}

// ─── MODAL ───
function openModal() {
    document.getElementById('contactModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('contactModal').style.display = 'none';
    document.body.style.overflow = '';
}
window.addEventListener('click', e => {
    const modal = document.getElementById('contactModal');
    if (e.target === modal) closeModal();
});

// ─── FAQ ───
document.addEventListener('click', e => {
    const q = e.target.closest('.faq-question');
    if (!q) return;
    const item = q.parentElement;
    const isOpen = item.classList.contains('faq-open');
    document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('faq-open');
        i.querySelector('.faq-toggle').textContent = '+';
    });
    if (!isOpen) {
        item.classList.add('faq-open');
        q.querySelector('.faq-toggle').textContent = '−';
    }
});

// ─── INTERSECTION OBSERVER (REVEAL) ───
function triggerReveals() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('active')) observer.observe(el);
    });
}
triggerReveals();

// ─── FORM ───
const _form = document.querySelector('#contactForm');
if (_form) {
    _form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = _form.querySelector('button');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST', body: new FormData(_form)
            });
            const data = await res.json();
            if (data.success) {
                closeModal();
                alert('Message sent successfully! We will get back to you soon.');
                _form.reset();
            } else {
                alert('Error sending. Please try again.');
            }
        } catch(err) {
            alert('Network error. Please try again.');
        }
        btn.innerHTML = orig;
        btn.disabled = false;
    });
}

// ─── HERO CANVAS ───
function initCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const COUNT = 88, MAX_D = 148, SPD = 0.15;
    const mouse = { x: -9999, y: -9999 };
    function rand(a, b) { return Math.random() * (b - a) + a; }
    function resize() { const hero = canvas.parentElement; W = canvas.width = hero.offsetWidth; H = canvas.height = hero.offsetHeight; }
    function mkP() { return { x: rand(0,W), y: rand(0,H), vx: rand(-SPD,SPD), vy: rand(-SPD,SPD), r: rand(1.8,3.2), op: rand(0.35,0.72) }; }
    function init() { resize(); particles = []; for(let i=0;i<COUNT;i++) particles.push(mkP()); }
    function loop() {
        ctx.clearRect(0,0,W,H);
        for (let k=0;k<particles.length;k++){
            const p=particles[k];
            const mdx=mouse.x-p.x, mdy=mouse.y-p.y, md=Math.sqrt(mdx*mdx+mdy*mdy);
            if(md<130&&md>0){ p.x+=mdx/md*0.28; p.y+=mdy/md*0.28; }
            p.x+=p.vx; p.y+=p.vy;
            if(p.x<-12) p.x=W+12; if(p.x>W+12) p.x=-12;
            if(p.y<-12) p.y=H+12; if(p.y>H+12) p.y=-12;
        }
        for(let i=0;i<particles.length;i++){
            for(let j=i+1;j<particles.length;j++){
                const a=particles[i], b=particles[j];
                const dx=a.x-b.x, dy=a.y-b.y, dist=Math.sqrt(dx*dx+dy*dy);
                if(dist<MAX_D){ ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.strokeStyle='rgba(103,232,249,'+(1-dist/MAX_D)*0.2+')'; ctx.lineWidth=0.85; ctx.stroke(); }
            }
        }
        for(let k=0;k<particles.length;k++){ const p=particles[k]; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(165,243,252,'+p.op+')'; ctx.fill(); }
        requestAnimationFrame(loop);
    }
    const hero = canvas.parentElement;
    hero.addEventListener('mousemove', e => { const r=canvas.getBoundingClientRect(); mouse.x=e.clientX-r.left; mouse.y=e.clientY-r.top; });
    hero.addEventListener('mouseleave', () => { mouse.x=-9999; mouse.y=-9999; });
    window.addEventListener('resize', () => { resize(); particles.forEach(p => { if(p.x>W) p.x=rand(0,W); if(p.y>H) p.y=rand(0,H); }); });
    init(); loop();
}
if (document.getElementById('heroCanvas')) initCanvas();
