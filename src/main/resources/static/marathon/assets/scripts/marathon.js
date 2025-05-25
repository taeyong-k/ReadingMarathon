const $situationForm = document.getElementById('situationForm')

$situationForm['giveUp'].onclick = (e) =>
{
    e.preventDefault();
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300)
        {

            return;
        }
        const response = JSON.parse(xhr.responseText)
        switch (response['result'])
        {
            case 'success':
                dialog.showSimpleOk('마라톤 포기', '마라톤이 정상적으로 포기 되었습니다. 검색창으로 돌아갑니다.')
                location.href = '/marathon/main';
                break;
            case 'failure':
                dialog.showSimpleOk('마라톤 포기','정보가 잘못되어 포기가 되지 않았습니다. 다시 정보를 확인해 주세요.')
                break;
            default:
                dialog.showSimpleOk('마라톤 포기','알 수 없는 오류로 인해 포기가 되었습니다. 잠시 후 다시 시도해 주세요.')

        }
    };
    xhr.open('DELETE','/situation/giveUp');
    xhr.send();
}

$situationForm['back'].addEventListener('click', () =>
{
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300)
        {
            return;
        }
    };
    xhr.open('POST','/marathon/situation');
    xhr.send(formData);
})