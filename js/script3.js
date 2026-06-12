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

    // 섭리역사와 사연 페이지 - 3번째 메뉴(index 2) 활성화, 서브메뉴 없음
    function setDefaultSubBar() {
        navItems.forEach(i => i.classList.remove('active'));
        navItems[2].classList.add('active');
        subBar.innerHTML = '';
    }

    navItems.forEach(item => {
        const subMenu = item.querySelector('.sub-menu');

        item.addEventListener('mouseenter', () => {
            clearTimeout(leaveTimer);
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
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
                    if (idx === 0) a.classList.add('active');
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
                setDefaultSubBar();
            }, 150);
        });
    }

    // 페이지 로드 시 기본 서브바 (섭리역사와 사연은 서브메뉴 없음)
    setDefaultSubBar();

    // ── 헤더 검색 ──
    const input = document.querySelector('.search-box input');
    const btn   = document.querySelector('.search-btn');
    if (input && btn) {
        const go = () => { const q = input.value.trim(); if (q) alert(`"${q}" 검색 중...`); };
        btn.addEventListener('click', go);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    }

    // ── 게시판 전체 체크박스 ──
    const checkAll = document.getElementById('checkAll');
    const chkItems = document.querySelectorAll('.chk-item');

    if (checkAll && chkItems.length > 0) {
        checkAll.addEventListener('change', function() {
            chkItems.forEach(cb => cb.checked = this.checked);
        });
        chkItems.forEach(item => {
            item.addEventListener('change', () => {
                checkAll.checked = [...chkItems].every(cb => cb.checked);
            });
        });
    }

    // ── 게시판 검색 ──
    const boardSearchBtn   = document.querySelector('.board-search button');
    const boardSearchInput = document.querySelector('.board-search input');
    if (boardSearchBtn && boardSearchInput) {
        const search = () => {
            const q = boardSearchInput.value.trim();
            if (q) alert(`"${q}" 검색 중...`);
        };
        boardSearchBtn.addEventListener('click', search);
        boardSearchInput.addEventListener('keydown', e => { if (e.key === 'Enter') search(); });
    }

    // ── 페이지네이션 클릭 ──
    const pageLinks = () => document.querySelectorAll('.pagination a[data-page]');

    function setActivePage(num) {
        const allNums = [...pageLinks()].map(a => +a.dataset.page);
        const total   = Math.max(...allNums);
        pageLinks().forEach(a => {
            a.classList.toggle('active', +a.dataset.page === num);
        });
        const prevBtn  = document.querySelector('.page-prev');
        const nextBtn  = document.querySelector('.page-next');
        const firstBtn = document.querySelector('.page-first');
        const lastBtn  = document.querySelector('.page-last');

        if (prevBtn)  { prevBtn.style.opacity  = num <= 1     ? '0.3' : '1'; prevBtn.style.pointerEvents  = num <= 1     ? 'none' : 'auto'; }
        if (nextBtn)  { nextBtn.style.opacity  = num >= total ? '0.3' : '1'; nextBtn.style.pointerEvents  = num >= total ? 'none' : 'auto'; }
        if (firstBtn) { firstBtn.style.opacity = num <= 1     ? '0.3' : '1'; firstBtn.style.pointerEvents = num <= 1     ? 'none' : 'auto'; }
        if (lastBtn)  { lastBtn.style.opacity  = num >= total ? '0.3' : '1'; lastBtn.style.pointerEvents  = num >= total ? 'none' : 'auto'; }
    }

    pageLinks().forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            setActivePage(+a.dataset.page);
        });
    });

    document.querySelector('.page-first')?.addEventListener('click', e => {
        e.preventDefault();
        setActivePage(1);
    });

    document.querySelector('.page-prev')?.addEventListener('click', e => {
        e.preventDefault();
        const cur = +document.querySelector('.pagination a.active')?.dataset.page || 1;
        if (cur > 1) setActivePage(cur - 1);
    });

    document.querySelector('.page-next')?.addEventListener('click', e => {
        e.preventDefault();
        const nums = [...pageLinks()].map(a => +a.dataset.page);
        const cur  = +document.querySelector('.pagination a.active')?.dataset.page || 1;
        if (cur < Math.max(...nums)) setActivePage(cur + 1);
    });

    document.querySelector('.page-last')?.addEventListener('click', e => {
        e.preventDefault();
        const nums = [...pageLinks()].map(a => +a.dataset.page);
        setActivePage(Math.max(...nums));
    });

    setActivePage(1);

    // ── 방송보기 버튼 ──
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const wasActive = this.classList.contains('active');
            this.closest('.watch-btns').querySelectorAll('.watch-btn')
                .forEach(b => b.classList.remove('active'));
            if (!wasActive) {
                this.classList.add('active');
                window.location.href = this.getAttribute('href');
            }
        });
    });

});