const $situation = document.getElementById('situationForm');
const $list = $situation.querySelector(':scope > .wrapper > .container.info > .list');
const $content = $situation.querySelector(':scope > .wrapper > .--object-area > .---content');
$content.innerHTML = ''; // 초기화
$content.style.display = 'none';

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () => {
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status < 200 || xhr.status >= 300) {
        alert(`[${xhr.status}] 책을 불러오지 못하였습니다. 잠시 후 다시 시도해 주세요.`);
        return;
    }

    const books = JSON.parse(xhr.responseText);
    $list.innerHTML = ``;

    books.forEach((book) => {
        // 체크박스 리스트에 항목 생성
        const item = document.createElement('label');
        item.classList.add('--object-field', 'item');
        item.innerHTML = `
            <span class="---caption">${book.title}</span>
            <input name="book" type="checkbox" value="${book.isbn}">
        `;
        $list.appendChild(item);

        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', () => {
            renderSelectedBooks(books);
        });
    });
};

function renderSelectedBooks(books) {
    $content.innerHTML = ''; // 초기화
    const selectedBooks = [];
    $list.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
        selectedBooks.push(input.value);
    });

    if (selectedBooks.length === 0) {
        $content.style.display = 'none';
        return;
    }

    $content.style.display = 'block';

    selectedBooks.forEach((isbn, index) => {
        const book = books.find(b => b.isbn === isbn);
        if (!book) return;

        // 3개마다 새로운 그룹 생성
        if (index % 3 === 0) {
            const bookWrapper = document.createElement('div');
            bookWrapper.classList.add('book-wrapper');
            $content.appendChild(bookWrapper);
        }

        const lastWrapper = $content.querySelector('.book-wrapper:last-child');
        const bookElement = document.createElement('div');
        bookElement.classList.add('books');
        bookElement.setAttribute('data-isbn', book.isbn);
        bookElement.innerHTML = `
            <div class="container">
                <h4 class="subtitle">${book.title}</h4>
                <button class="--object-button -color-green" type="button" value="taza">완료</button>
            </div>
            <img class="image" src="${book.thumbnail}" alt="">
            <div class="book-info">
                <span class="---caption">제목: ${book.title}</span>
                <span class="---caption">저자: ${book.author}</span>
                <span class="---caption">ISBN: ${book.isbn}</span>
                <span class="---caption">출판사: ${book.publisher}</span>
            </div>
        `;
        lastWrapper.appendChild(bookElement);
    });
}

xhr.open('GET', '/marathon/situation');
xhr.send();
