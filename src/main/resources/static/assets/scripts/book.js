const $situation = document.getElementById('situationForm')

const $list = $situation.querySelector(':scope > .wrapper > .container.info > .list')

const xhr = new XMLHttpRequest();
xhr.onreadystatechange = () =>
{
    if (xhr.readyState !== XMLHttpRequest.DONE) return;
    if (xhr.status < 200 || xhr.status >= 300)
    {
        alert(`[${xhr.status}] 책을 불러오지 못하였습니다. 잠시 후 다시 시도해 주세요.`);
        return;
    }
    const books = JSON.parse(xhr.responseText);
    console.log(books)
    // books.forEach(($bookData) =>
    // {
    //     console.log($bookData.title)
    //     console.log($bookData.isbn)
    //     console.log($bookData.autthor)
    //     console.log($bookData.publisher)
    //     console.log($bookData.thumbnail)
    // })

    $list.innerHTML = ``
    books.forEach(($bookData) =>
    {
        const item = document.createElement('label')
        item.classList.add('--object-field','item')
        item.innerHTML += `
            <span class="---caption">${$bookData.title}</span>
            <input name="book" type="checkbox" value="${$bookData.isbn}">
        `
        $list.appendChild(item)

        const checkbox = item.querySelector('input[type="checkbox"]');

        const $content = $situation.querySelector(':scope > .wrapper > .--object-area > .---content')
        $content.style.display = 'none'
        checkbox.addEventListener('change', (event) =>
        {
            if (event.target.checked)
            {
                $content.style.display = 'block'
            }
            else
            {
                $content.style.display = 'none'
            }
        })

        if ($content)
        {
            for (let i = 0; i < books.length; i += 3 ) {
                const $bookWrapper = document.createElement('div')
                $bookWrapper.classList.add('book-wrapper')
                for (let j = 0; j < i + 3 && j < books.length; j++) {
                    const $books = document.createElement('div')
                    $books.classList.add('books')
                    $books.innerHTML += `
                  <div class="container">
                        <h4 class="subtitle">${$bookData.title}</h4>
                        <button class="--object-button -color-green" type="button" value="taza">완료</button>
                  </div>
                  <img class="image" src="${$bookData.thumbnail}" alt="">
                  <div class="book-info">
                    <span class="---caption">제목: ${$bookData.title}</span>
                    <span class="---caption">저자: ${$bookData.author}</span>
                    <span class="---caption">ISBN: ${$bookData.isbn}</span>
                    <span class="---caption">출판사: ${$bookData.publisher}</span>
                  </div>
                `
                    $bookWrapper.appendChild($books)
                }
                $content.appendChild($bookWrapper)
            }
        }
    })
}
xhr.open('GET','/marathon/situation-books');
xhr.send();