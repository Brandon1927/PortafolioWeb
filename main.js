// ── Cursor personalizado ──
        const glow   = document.getElementById('cursorGlow');
        const ring   = document.getElementById('cursorRing');
        const dot    = document.getElementById('cursorDot');
        const canvas = document.getElementById('cursorTrail');
        const ctx    = canvas.getContext('2d');

        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        window.addEventListener('resize', () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
        let glowX  = mouseX, glowY  = mouseY;
        let ringX  = mouseX, ringY  = mouseY;
        let isDown = false;

        // Trail: array de puntos recientes
        const trail = [];
        const TRAIL_LEN = 22;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            // punto central instantáneo
            dot.style.left = mouseX + 'px';
            dot.style.top  = mouseY + 'px';
            trail.push({ x: mouseX, y: mouseY });
            if (trail.length > TRAIL_LEN) trail.shift();
        });

        document.addEventListener('mousedown', () => {
            isDown = true;
            ring.classList.add('pressed');
            dot.classList.add('pressed');
        });
        document.addEventListener('mouseup', () => {
            isDown = false;
            ring.classList.remove('pressed');
            dot.classList.remove('pressed');
        });

        // Hover en elementos clicables → cursor magnético
        document.querySelectorAll('a, button, .proyecto-card').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
        });

        function drawTrail() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (trail.length < 2) return;
            for (let i = 1; i < trail.length; i++) {
                const t = i / trail.length;
                const alpha = t * 0.55;
                const width = t * 3.5;
                ctx.beginPath();
                ctx.moveTo(trail[i-1].x, trail[i-1].y);
                ctx.lineTo(trail[i].x, trail[i].y);
                ctx.strokeStyle = `rgba(56, 217, 245, ${alpha})`;
                ctx.lineWidth   = width;
                ctx.lineCap     = 'round';
                ctx.stroke();
            }
            // bola luminosa al final del trail
            const last = trail[trail.length - 1];
            const grad = ctx.createRadialGradient(last.x, last.y, 0, last.x, last.y, 10);
            grad.addColorStop(0,   'rgba(56,217,245,0.55)');
            grad.addColorStop(1,   'rgba(56,217,245,0)');
            ctx.beginPath();
            ctx.arc(last.x, last.y, 10, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }

        function animate() {
            // Glow grande (lerp lento)
            glowX += (mouseX - glowX) * 0.07;
            glowY += (mouseY - glowY) * 0.07;
            glow.style.left = glowX + 'px';
            glow.style.top  = glowY + 'px';

            // Anillo exterior (lerp medio)
            ringX += (mouseX - ringX) * 0.18;
            ringY += (mouseY - ringY) * 0.18;
            ring.style.left = ringX + 'px';
            ring.style.top  = ringY + 'px';

            drawTrail();
            requestAnimationFrame(animate);
        }
        animate();

        // Partículas
        const container = document.getElementById('particles');
        for (let i = 0; i < 55; i++) {
            const p = document.createElement('div');
            p.classList.add('particle');
            p.style.left = Math.random() * 100 + '%';
            p.style.top  = Math.random() * 100 + '%';
            p.style.animationDelay    = Math.random() * 6 + 's';
            p.style.animationDuration = (4 + Math.random() * 5) + 's';
            p.style.width = p.style.height = (1 + Math.random() * 2.5) + 'px';
            p.style.opacity = 0.1 + Math.random() * 0.5;
            container.appendChild(p);
        }

        // ── Acordeón proyectos ──
        document.querySelectorAll('.proyecto-card').forEach(card => {
            card.addEventListener('click', () => {
                const isOpen = card.classList.contains('open');
                document.querySelectorAll('.proyecto-card').forEach(c => c.classList.remove('open'));
                if (!isOpen) card.classList.add('open');
            });
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
                const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
                card.style.setProperty('--mx', x + '%');
                card.style.setProperty('--my', y + '%');
            });
        });