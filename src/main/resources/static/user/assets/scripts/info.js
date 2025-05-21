const $infoForm = document.getElementById('infoForm');
const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');
const nicknameRegex = new RegExp('^([\\da-zA-Z가-힣]{2,10})$');

$infoForm.onsubmit = (e) =>
{
    e.preventDefault();
    $infoForm['nickname'].style.filter = '';
    $infoForm['nickname'].nextElementSibling.style.filter = '';
    ['currentPassword','newPassword','newPasswordCheck','nickname'].forEach((name) => $infoForm[name].setValid(true))
    // $infoForm['email'].setValid(true);
    // $infoForm['password'].setValid(true);
    // $infoForm['passwordCheck'].setValid(true);
    // $infoForm['nickname'].setValid(true);
    if ($infoForm['currentPassword'].value === '')
    {
        $infoForm['currentPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 입력해 주세요.';
        return;
    }
    if (!passwordRegex.test($infoForm['currentPassword'].value))
    {
        $infoForm['currentPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 비밀번호입니다.';
        return;
    }

    if ($infoForm['newPassword'].value !== '')
    {
        if (!passwordRegex.test($infoForm['newPassword'].value))
        {
            $infoForm['newPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 비밀번호입니다.';
            return;
        }
        if ($infoForm['currentPassword'].value === $infoForm['newPasswordCheck'].value)
        {
            $infoForm['newPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '현재 비밀번호와 같습니다.';
            return;
        }
        if ($infoForm['newPasswordCheck'].value === '')
        {
            $infoForm['newPasswordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 한번 더 입력해 주세요'
            return;
        }

    }
    if ($infoForm['newPassword'].value !== $infoForm['newPasswordCheck'].value)
    {
        $infoForm['newPasswordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호가 일치하지 않습니다.';
        return;
    }

    if ($infoForm['nickname'].value === '')
    {
        $infoForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '닉네임을 입력해 주세요.';
        return;
    }
    if (!nicknameRegex.test($infoForm['nickname'].value))
    {
        $infoForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 닉네임입니다.';
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('currentPassword', $infoForm['currentPassword'].value)
    formData.append('nickname',$infoForm['nickname'].value)
    if ($infoForm['birth'].value !== '')
    {
        formData.append('birth',$infoForm['birth'].value)
    }
    if ($infoForm['newPassword'].value !== '')
    {
        formData.append('newPassword',$infoForm['newPassword'].value)
    }
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300)
        {
            dialog.showSimpleOk('개인정보 수정', `[${xhr.status}] 개인정보를 수정하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.`)
            return;
        }
        const response = JSON.parse(xhr.responseText)
        switch (response['result'])
        {
            case 'failure_nickname_not_available':
                dialog.showSimpleOk('개인정보 수정', `입력하신 닉네임 "${$infoForm['nickname'].value}"은/는 이미 사용 중입니다.`, () => $infoForm['nickname'].focusAndSelect());
                break;
            case 'failure+password_mismatch':
                dialog.showSimpleOk('개인정보 수정', '입력하신 비밀번호가 일치하지 않습니다.', () => $infoForm['currentPassword'].focusAndSelect());
                break;
            case 'failure_password_same':
                dialog.showSimpleOk('개인정보 수정', '수정하고자 하는 신규 비밀번호와 현재 비밀번호가 같습니다.', () => $infoForm['newPassword'].focusAndSelect());
                break;
            case 'failure_session_expired':
                dialog.showSimpleOk('개인정보 수정', '세션이 만료되었습니다. 다시 로그인해 주세요.', () => location.href = '/user/login');
                break;
            case 'success':
                dialog.showSimpleOk('개인정보 수정', '개인정보를 성공적으로 수정하였습니다.', () => location.reload());
                break;
            default:
                dialog.showSimpleOk('개인정보 수정', '알 수 없는 이유로 개인정보를 수정하지 못하였습니다. 잠시 후 다시 시도해 주세요.');
        }
    };
    xhr.open('PATCH','/user/info');
    xhr.send(formData);

};

// focusout -> 빠져나갈때 발동하는 이벤트 리스너 방식
$infoForm['nickname'].addEventListener('focusout', () =>
{
    $infoForm['nickname'].style.filter = '';
    $infoForm['nickname'].nextElementSibling.style.filter = '';
    $infoForm['nickname'].setValid(true);
    if ($infoForm['nickname'].value === '')
    {
        $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '닉네임을 입력해 주세요.';
        return;
    }
    if (!nicknameRegex.test($infoForm['nickname'].value))
    {
        // $infoForm['nickname'].nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
        $infoForm['nickname']
            .setValid(false)
            .nextElementSibling.innerText = '올바르지 않은 닉네임입니다.';
        // prototype에서 return this로 input 자체를 뱉어내도록 설정했기 때문에 이러한 메소드가 가능하다.
        return;
    }
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
        const response = JSON.parse(xhr.responseText);
        if (response['result'] === true)
        {
            $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '사용할 수 있는 닉네임입니다.';
            $infoForm['nickname'].style.filter = 'hue-rotate(135deg)';
            $infoForm['nickname'].nextElementSibling.style.filter = 'hue-rotate(135deg)';
        }
        else
        {
            $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '이미 사용중인 닉네임입니다.';
        }

    };
    xhr.open('GET',`/user/nickname-check?nickname=${$infoForm['nickname'].value}`);
    xhr.send();
})