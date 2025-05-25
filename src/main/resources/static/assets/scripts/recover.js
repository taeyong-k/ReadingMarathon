const $recoverForm = document.getElementById('recoverForm')
const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');
const nicknameRegex = new RegExp('^([\\da-zA-Z가-힣]{2,10})$');

$recoverForm.onsubmit = (e) =>
{
    e.preventDefault();
    if ($recoverForm['type'].value ==='')
    {
        return;
    }
}

$recoverForm['type'].forEach(($input) =>
{
    // forEach 돌릴수 있는 이유: name이 type인 input이 여러개라서 $recoverForm['type']은 (유사)배열임.
    $input.addEventListener('input', () =>
    {
        if ($recoverForm['type'].value === 'email')
        {
            // 선택한 라디오가 email 이면
            $recoverForm['emailRecoverNickname'].value = '';
            $recoverForm['emailRecoverNickname'].focus();
        }
        else if ($recoverForm['type'].value === 'password')
        {
            // 선택한 라디오가 password 이면
            $recoverForm['passwordRecoverEmail'].value = '';
            $recoverForm['passwordRecoverNickname'].value = '';
            $recoverForm['passwordRecoverPassword'].value = '';
            $recoverForm['passwordRecoverPasswordCheck'].value = '';

        }
    });
});

$recoverForm.onsubmit = (e) => {
    e.preventDefault()
    if ($recoverForm['type'].value === '') {
        return;
    }
    if ($recoverForm['type'].value === 'email') {
        $recoverForm['emailRecoverNickname'].setValid(true);
        if ($recoverForm['emailRecoverNickname'].value === '') {
            $recoverForm['emailRecoverNickname'].setValid(false).focusAndSelect().nextSibling.innerText = '닉네임을 입력해 주세요.';
            return
        }

    if (!nicknameRegex.test($recoverForm['emailRecoverNickname'].value)) {
        $recoverForm['emailRecoverNickname'].setValid(false).focusAndSelect().nextSibling.innerText = '올바른 닉네임을 입력해 주세요.';
        return
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('nickname', $recoverForm['emailRecoverNickname'].value)
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.showSimpleOk('이메일 찾기', `[${xhr.status}] 요청을 처리하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.`)
            return;
        }
        const response = JSON.parse(xhr.responseText)
        switch (response['result']) {
            case 'success':
                dialog.showSimpleOk('이메일 찾기', `요청한 닉네임 "${$recoverForm['emailRecoverNickname'].value}에 대한 회원의 이메일은 "${response['email']}"입니다.`, () => {
                    $recoverForm.reset();
                })
                break;
            default:
                dialog.showSimpleOk('이메일 찾기', `요청한 닉네임 "${$recoverForm['emailRecoverNickname'].value}"에 대한 회원 정보를 찾을 수 없습니다.`, () => {$recoverForm['emailRecoverNickname'].focusAndSelect();})
        }
    };
    xhr.open('POST', '/user/recover-email');
    xhr.send(formData);

    } else if ($recoverForm['type'].value === 'password') {
        $recoverForm['passwordRecoverEmail'].setValid(true);
        $recoverForm['passwordRecoverNickname'].setValid(true);
        $recoverForm['passwordRecoverPassword'].setValid(true);
        $recoverForm['passwordRecoverPasswordCheck'].setValid(true);
        if ($recoverForm['passwordRecoverEmail'].value === '') {
            $recoverForm['passwordRecoverEmail'].setValid(false).focusAndSelect().nextElementSibling.innerText = '이메일을 입력해 주세요.'
            return
        }

        if (!emailRegex.test($recoverForm['passwordRecoverEmail'].value)) {
            $recoverForm['passwordRecoverNickname'].setValid(false).focusAndSelect().nextElementSibling.innerText = '올바른 이메일을 입력해 주세요.'
            return
        }

        if ($recoverForm['passwordRecoverNickname'].value === '') {
            $recoverForm['passwordRecoverNickname'].setValid(false).focusAndSelect().nextElementSibling.innerText = '닉네임을 입력해 주세요.'
            return
        }

        if (!nicknameRegex.test($recoverForm['passwordRecoverNickname'].value)) {
            $recoverForm['passwordRecoverNickname'].setValid(false).focusAndSelect().nextElementSibling.innerText = '올바른 닉네임을 입력해 주세요.'
            return
        }
        if ($recoverForm['passwordRecoverPassword'].value === '') {
            $recoverForm['passwordRecoverPassword'].setValid(false).focusAndSelect().nextElementSibling.innerText = '비밀번호를 입력해 주세요.'
            return
        }

        if (!passwordRegex.test($recoverForm['passwordRecoverPassword'].value)) {
            $recoverForm['passwordRecoverPassword'].setValid(false).focusAndSelect().nextElementSibling.innerText = '비밀번호를 한 번 더 입력해주세요'
            return
        }
        if ($recoverForm['passwordRecoverPassword'].value !== $recoverForm['passwordRecoverPasswordCheck'].value) {
            $recoverForm['passwordRecoverPasswordCheck'].setValid(false).focusAndSelect().nextElementSibling.innerText = '비밀번호가 일치하지 않습니다.'
            return
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('email',$recoverForm['passwordRecoverEmail'].value);
        formData.append('nickname',$recoverForm['passwordRecoverNickname'].value);
        formData.append('password',$recoverForm['passwordRecoverPassword'].value);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE)
            {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300)
            {
                dialog.showSimpleOk('비밀번호 재설정', `[${xhr.status}] 요청을 처리하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.`)
                return;
            }
            const response = JSON.parse(xhr.responseText)
            switch (response['result'])
            {
                case 'success':
                    dialog.showSimpleOk('비밀번호 재설정',`비밀번호를 성공적으로 재설정하였습니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.`, () => location.href = '/user/login');
                    break;
                default:
                    dialog.showSimpleOk('비밀번호 재설정', `입력하신 이메일 및 닉네임에 대해 일치하는 회원을 찾지 못하였습니다. 정보를 다시 확인해 주세요.`, () => $recoverForm['passwordRecoverEmail'].focusAndSelect());
            }
        };
        xhr.open('POST',"/user/recover-password");
        xhr.send(formData);

    }
};