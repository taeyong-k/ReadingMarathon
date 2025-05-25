// DOM이 다 만들어진 후에 JS 실행하려고 (에러 방지)
document.addEventListener("DOMContentLoaded", () => {
    const $searchForm = document.getElementById("searchForm");
    const $label = $searchForm.querySelector('.--object-label');
    const $searchContent = $searchForm.querySelector('.content');
    const $searchInput = $searchForm.querySelector('input[name="search"]');
    const $userMenu = document.getElementById("user-menu");
    const $userRegister = $userMenu.querySelector('.user-register');
    const $userLogin = $userMenu.querySelector('.user-login');

    const selectedBooks = []; // 선택된 책들을 저장하는 배열

    const isLogin = document.body.dataset.loginCheck === 'true';

    if (isLogin) {
        if ($userRegister) $userRegister.style.display = 'none';

        if ($userLogin) {
            $userLogin.textContent = '로그아웃';
            $userLogin.href = '/user/logout';

            $userLogin.replaceWith($userLogin.cloneNode(true));
            const $newUserLogin = document.querySelector('.user-login');

            $newUserLogin.addEventListener('click', (e) => {
                e.preventDefault();

                fetch('/user/logout', {
                    method: 'POST'  // POST로 바꿈
                })
                    .then(() => {
                        document.body.dataset.loginCheck = 'false';
                        $userLogin.textContent = '로그인';
                        $userLogin.href = '/user/login';
                        if ($userRegister) $userRegister.style.display = '';
                        location.reload();
                    })
                    .catch(err => {
                        console.error('로그아웃 실패:', err);
                    });
            });
        }
    } else {
        if ($userRegister) $userRegister.style.display = '';
        if ($userLogin) {
            $userLogin.textContent = '로그인';
            $userLogin.href = '/user/login';
        }
    }

    // 폼 제출 시 실행되는 함수
    $searchForm.onsubmit = (e) => {
        e.preventDefault();

        const keyword = $searchInput.value.trim();
        if (!keyword) {
            $label.classList.add('-invalid');
            $searchInput.classList.add('-invalid');
            $searchInput.focus();
            $searchInput.select();

            $searchContent.innerHTML = '검색어를 입력해주세요.';
            $searchContent.classList.add('empty');
            return;
        }

        $label.classList.remove('-invalid');
        $searchInput.classList.remove('-invalid');
        searchBook(keyword);
    };

    // fetch로 카카오 책 API 요청
    function searchBook(keyword) {
        const size = 10;
        let page = 1;
        let allBooks = [];

        const REST_API_KEY = config.apikey;
        $searchContent.innerHTML = "<p>검색 중입니다...</p>";

        function fetchPage() {
            const url = `https://dapi.kakao.com/v3/search/book?query=${encodeURIComponent(keyword)}&target=title&page=${page}&size=${size}`;

            fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `KakaoAK ${REST_API_KEY}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data.result === 'error') {
                        dialog.showSimpleOk('마라톤 시작', '마라톤을 시작하려면 로그인이 필요합니다.\n로그인 페이지로 이동합니다.', () => {
                            window.location.href = '/user/login';
                        });
                        return;
                    }

                    allBooks = allBooks.concat(data.documents);

                    if (!data.meta.is_end && page < 5) {
                        page++;
                        fetchPage();
                    } else {
                        console.log(allBooks);
                        displayBooks(allBooks);
                    }
                })
                .catch(err => {
                    console.error('검색 에러:', err);
                    $searchContent.innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
                });
        }

        fetchPage();
    }

    const $cartList = document.getElementById('cart-list');
    $searchContent.classList.add('empty');

    // 책 목록 표시 및 선택 기능 추가
    function displayBooks(books) {
        $searchContent.innerHTML = '';

        if (books.length === 0) {
            $label.classList.add('-invalid');
            $searchInput.classList.add('-invalid');
            $searchInput.focus();
            $searchInput.select();

            $searchContent.innerHTML = '잘못된 검색어 입니다.';
            $searchContent.classList.add('empty');
            return;
        }

        // 책 목록 표시
        books.forEach(book => {
            $searchContent.classList.remove('empty');

            const year = book.datetime.slice(0, 4);
            const $item = document.createElement('div');
            $item.classList.add('book-item');
            $item.innerHTML = `
                <img src="${book.thumbnail}" alt="책 표지" class="book-thumbnail">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <span class="book-author">저자: ${book.authors.join(', ') || '정보 없음'}</span>
                    <span class="book-publisher">출판사: ${book.publisher || '정보 없음'}</span>
                    <span class="book-status">상태: ${book.status || '정보 없음'}</span>
                    <span class="book-datetime">출판연도: ${year || '출판연도 없음'}</span>
                </div>
            `;

            // 선택/해제 기능 추가
            $item.addEventListener('click', () => {
                const index = selectedBooks.findIndex(b => b.title === book.title);

                if (index !== -1) {                     // 배열에 이미 있다면 → 선택 해제
                    selectedBooks.splice(index, 1);
                    $item.classList.remove('selected');
                } else {                                // 배열에 없으면 → 선택 추가
                    selectedBooks.push(book);
                    $item.classList.add('selected');
                }

                updateCartList();
                console.log('선택된 책:', selectedBooks);
            });

            $searchContent.appendChild($item);  // 화면에 추가
        });
    }

    const $cartCount = document.querySelector('.cart-count');
    $cartList.innerHTML = '선택한 책이 없습니다.';

    // cart 목록 표시 & cart 개수 표시
    function updateCartList() {
        $cartList.innerHTML = '';

        if (selectedBooks.length === 0) {
            $cartList.innerHTML = '선택한 책이 없습니다.';
            $cartCount.classList.remove('-visible');
            return;
        }

        selectedBooks.forEach((book, index) => {
            const $cartItem = document.createElement('div');        // 책 리스트 생성
            $cartItem.classList.add('cart-item');

            const $bootTitle = document.createElement('span');      // 책 제목 스판 생성
            $bootTitle.classList.add('book-title');
            $bootTitle.textContent = `📖 ${book.title}`;

            const $deleteButton = document.createElement('button'); // 삭제 버튼 생성
            $deleteButton.classList.add('delete-button');
            $deleteButton.type = 'button';
            $deleteButton.innerText = `삭제`;

            $deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();    // 부모 이벤트 전파 방지 (선택/해제 토글 방지)

                const $cartItems = $searchContent.querySelectorAll('.book-item');


                selectedBooks.splice(index, 1);     // 배열에서 책 제거

                $cartItems.forEach(item => {
                    const $titleElem = item.querySelector('.book-title');
                    if ($titleElem && $titleElem.textContent.includes(book.title)) {
                        item.classList.remove('selected');
                    }
                });

                updateCartList();
            });

            $cartItem.appendChild($bootTitle);
            $cartItem.appendChild($deleteButton);
            $cartList.appendChild($cartItem);
        });

        $cartCount.classList.add('-visible');
        $cartCount.textContent = selectedBooks.length;
    }

    const $cartButton = document.querySelector('.cart-button');

    $cartButton.addEventListener('click', () => {
        $cartList.classList.toggle('-visible');
    });


    const $menu = document.getElementById('menu');
    const $menuStartBtn = $menu.querySelector('.start-button');

    $menuStartBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!isLogin) {
            dialog.show({
                title: '로그인 필요',
                content: '마라톤을 시작하려면 로그인이 필요합니다\n로그인창으로 이동할까요?',
                buttons: [
                    {
                        caption: '예',
                        color: 'green',
                        onclick: ($modal) => {
                            dialog.hide($modal);
                            location.href = '/user/login';
                        }
                    },
                    {
                        caption: '아니요',
                        color: 'gray',
                        onclick: ($modal) => {
                            dialog.hide($modal);
                        }
                    }
                ]
            });
            return;
        }

        const selectedCount = selectedBooks.length;
        if (selectedBooks.length === 0) {
            dialog.showSimpleOk('마라톤 시작', '시작할 책을 선택해 주세요.', () => $searchInput.focus());
            return;
        }

        if (selectedCount < 3) {
            dialog.showSimpleOk('마라톤 시작', '책을 최소 3권 이상 선택해야 시작할 수 있습니다.');
            return;
        }

        function getCourseLevel(count) {
            if (count >= 3 && count <= 5) return '초급';
            if (count > 5 && count <= 10) return '중급';
            if (count > 10 && count <= 20) return '상급';
            if (count > 20) return '마스터';
            return null;
        }

        dialog.show({
            title: '독서 마라톤🏃',
            content: `${selectedBooks.map(book => book.title).join('\n')}\n\n📚 ${getCourseLevel(selectedBooks.length)} 코스로 시작할까요?`,
            buttons: [
                {
                    caption: '예',
                    color: 'green',
                    onclick: ($modal) => {
                        dialog.hide($modal);

                        // 모달 확인 이후에만 서버에 요청
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        selectedBooks.forEach(book => {
                            const isbn = book.isbn.split(" ")[1] || book.isbn;
                            formData.append('isbn[]', isbn);
                            formData.append('title[]', book.title);
                            formData.append('author[]', book.authors.join(', '));
                            formData.append('publisher[]', book.publisher || '정보 없음');
                            formData.append('status[]', book.status || '정보 없음');
                            formData.append('year[]', book.datetime?.slice(0, 4) || '출판연도 없음');
                            formData.append('thumbnail[]', book.thumbnail || '');
                        });

                        xhr.onreadystatechange = () => {
                            if (xhr.readyState !== XMLHttpRequest.DONE) return;

                            if (xhr.status < 200 || xhr.status >= 300) {
                                dialog.showSimpleOk('마라톤 시작', `[${xhr.status}] 요청 처리 중 오류가 발생했습니다.`);
                                return;
                            }

                            const response = JSON.parse(xhr.responseText);

                            switch (response['result']) {
                                case 'failure_already_active':
                                    dialog.showSimpleOk('마라톤 시작', '이미 진행중인 마라톤이 있습니다.');
                                    break;
                                case 'failure_session_expired':
                                    dialog.showSimpleOk('마라톤 시작', '세션이 만료되었습니다. 다시 로그인 해주세요.');
                                    break;
                                case 'failure_insufficient_books':
                                    dialog.showSimpleOk('마라톤 시작', '책을 최소 3권 이상 선택해야 합니다.');
                                    break;
                                case 'failure_invalid_book_data':
                                    dialog.showSimpleOk('마라톤 시작', '책 정보가 올바르지 않습니다. 다시 확인해주세요.');
                                    break;
                                case 'success':
                                    location.href = '/marathon/TEST';
                                    break;
                                default:
                                    dialog.showSimpleOk('마라톤 시작', '알 수 없는 오류가 발생했습니다.');
                                    break;
                            }
                        };

                        xhr.open('POST', '/marathon/main');
                        xhr.send(formData);
                    }
                },
                {
                    caption: '아니요',
                    color: 'gray',
                    onclick: ($modal) => {
                        dialog.hide($modal); // 아무 동작 없음
                    }
                }
            ]
        });
    });


});