document.addEventListener('DOMContentLoaded', () => {

    // ── 로그아웃 / 마이페이지 버튼 토글 ──
    const logoutBtn  = document.querySelector('.btn-logout');
    const mypageBtn  = document.querySelector('.btn-mypage');

    function toggleLoginButtons(e) {
        e.preventDefault();
        logoutBtn?.classList.toggle('active');
        mypageBtn?.classList.toggle('inactive');
    }

    logoutBtn?.addEventListener('click', toggleLoginButtons);
    mypageBtn?.addEventListener('click', toggleLoginButtons);

    // ── 서브바 & 네비게이션 제어 ──
    const navWrap  = document.querySelector('.nav-wrap');
    const subBar   = document.getElementById('subBar');
    const navItems = document.querySelectorAll('.nav-item');
    let leaveTimer = null;

    // ★ 초기 상태 설정: 예배 메뉴 active + 서브바 표시
    navItems[0].classList.add('active');

    setTimeout(() => {
        subBar.classList.add('show');
        subBar.innerHTML = '';

        const itemRect = navItems[0].getBoundingClientRect();
        const navRect  = navWrap.getBoundingClientRect();
        subBar.style.left = (itemRect.left - navRect.left) + 'px';

        const initSubMenu = navItems[0].querySelector('.sub-menu');
        if (initSubMenu) {
            initSubMenu.querySelectorAll('li a').forEach((link, idx) => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.textContent;
                if (idx === 0) a.classList.add('active');
                subBar.appendChild(a);
            });
        }
    }, 0);

    navItems.forEach(item => {
        const subMenu = item.querySelector('.sub-menu');

        item.addEventListener('mouseenter', () => {
            clearTimeout(leaveTimer);
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            subBar.classList.add('show');
            subBar.innerHTML = '';

            const itemRect = item.getBoundingClientRect();
            const navRect  = navWrap.getBoundingClientRect();
            subBar.style.left = (itemRect.left - navRect.left) + 'px';

            if (subMenu) {
                const links = subMenu.querySelectorAll('li a');
                links.forEach((link, idx) => {
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.textContent;
                    subBar.appendChild(a);
                });
            }
        });
    });

    if (subBar) {
        subBar.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
        subBar.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                subBar.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }

    if (navWrap) {
        navWrap.addEventListener('mouseleave', () => {
            leaveTimer = setTimeout(() => {
                navItems.forEach(i => i.classList.remove('active'));
                navItems[0].classList.add('active');
                subBar.classList.add('show');
                subBar.innerHTML = '';

                const itemRect = navItems[0].getBoundingClientRect();
                const navRect  = navWrap.getBoundingClientRect();
                subBar.style.left = (itemRect.left - navRect.left) + 'px';

                ['주일예배','수요예배','새벽말씀','설교영상','은하수 예배'].forEach((txt, idx) => {
                    const a = document.createElement('a');
                    a.href = '#'; a.textContent = txt;
                    if (idx === 0) a.classList.add('active');
                    subBar.appendChild(a);
                });
            }, 150);
        });
    }

    // ── 검색 바 ──
    const input = document.querySelector('.search-box input');
    const btn   = document.querySelector('.search-btn');
    if (input && btn) {
        const go = () => { const q = input.value.trim(); if (q) alert(`"${q}" 검색 중...`); };
        btn.addEventListener('click', go);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    }
});