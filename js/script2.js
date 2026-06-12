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

    // 현재 페이지가 교육 페이지인지 확인
    const isEduPage = !!document.querySelector('.sidebar-contact-box');

    // 기본 복원용 서브바 세팅 함수 (교육 페이지면 교육, 아니면 예배)
    function setDefaultSubBar() {
        subBar.classList.add('show');
       if (isEduPage) {
    navItems.forEach(i => i.classList.remove('active'));
    navItems[1].classList.add('active');
    subBar.innerHTML = '';
    const itemRect = navItems[1].getBoundingClientRect();
    const navRect  = navWrap.getBoundingClientRect();
    subBar.style.left = (itemRect.left - navRect.left) + 'px';
    ['명설교','기타말씀','은혜말씀','새노래','성경학교','교리말씀'].forEach((txt, idx) => {
        const a = document.createElement('a');
        a.href = '#'; a.textContent = txt;
        if (idx === 0) a.classList.add('active');   // ★ 추가
        subBar.appendChild(a);
    });
} else {
            navItems.forEach(i => i.classList.remove('active'));
            navItems[0].classList.add('active');
            subBar.innerHTML = '';
            ['주일예배','수요예배','새벽말씀','설교영상','은하수 예배'].forEach((txt, idx) => {
                const a = document.createElement('a');
                a.href = '#'; a.textContent = txt;
                if (idx === 0) a.classList.add('active');
                subBar.appendChild(a);
            });
        }
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

    // 페이지 로드 시 기본 서브바 표시
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

    // ── 사이드바 메뉴 클릭 ──
    document.querySelectorAll('.sidebar-menu li').forEach(li => {
        li.addEventListener('click', () => {
            document.querySelectorAll('.sidebar-menu li').forEach(i => i.classList.remove('active'));
            li.classList.add('active');
        });
    });

    // ── 페이지네이션 클릭 ──
    const pageLinks = () => document.querySelectorAll('.pagination a[data-page]');

    function setActivePage(num) {
        const total = Math.max(...[...pageLinks()].map(a => +a.dataset.page));
        pageLinks().forEach(a => {
            a.classList.toggle('active', +a.dataset.page === num);
        });
        document.querySelector('.page-prev').style.opacity      = num <= 1     ? '0.3' : '1';
        document.querySelector('.page-prev').style.pointerEvents = num <= 1     ? 'none' : 'auto';
        document.querySelector('.page-next').style.opacity      = num >= total ? '0.3' : '1';
        document.querySelector('.page-next').style.pointerEvents = num >= total ? 'none' : 'auto';
    }

    pageLinks().forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            setActivePage(+a.dataset.page);
        });
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

    setActivePage(1);

    // ── 방송보기 버튼 (교육 페이지) ──
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const wasActive = this.classList.contains('active');
            // 같은 행의 모든 버튼 active 해제
            this.closest('.watch-btns').querySelectorAll('.watch-btn')
                .forEach(b => b.classList.remove('active'));
            // 클릭한 버튼 토글 + 페이지 이동
            if (!wasActive) {
                this.classList.add('active');
                window.location.href = this.getAttribute('href');
            }
        });
    });

});