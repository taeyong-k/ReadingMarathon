const $loginForm = document.getElementById('loginForm');
const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');

$loginForm.onsubmit = (e) =>
{
    e.preventDefault();
    if ($loginForm['email'].value === '')
    {
        dialog.showSimpleOk('로그인', '이메일을 입력해 주세요.', () => $loginForm['email'].focusAndSelect());
        return;
    }
    if (!emailRegex.test($loginForm['email'].value))
    {
        dialog.showSimpleOk('로그인', '올바른 이메일을 입력해 주세요.', () => $loginForm['email'].focusAndSelect());
    }
    if ($loginForm['password'].value === '')
    {
        dialog.showSimpleOk('로그인', '비밀번호를 입력해 주세요.', () => $loginForm['password'].focusAndSelect());
        return;
    }
    if (!passwordRegex.test($loginForm['password'].value))
    {
        dialog.showSimpleOk('로그인', '올바른 비밀번호를 입력해 주세요.', () => $loginForm['password'].focusAndSelect());
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $loginForm['email'].value);
    formData.append('password', $loginForm['password'].value);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300)
        {
            dialog.showSimpleOk('로그인', `[${xhr.status}] 로그인 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.`);
            return;
        }
        const response = JSON.parse(xhr.responseText);
        switch (response['result'])
        {
            case 'failure_suspended':
                dialog.showSimpleOk('로그인', '해당 계정은 사용이 정지된 상태입니다 .고객센터를 통해 문의해 주세요.');
                break;
            case 'success':
                location.href = '/user/info'; // 로그인 성공 후 마이페이지로 이동
                break;
            default:
                dialog.showSimpleOk('로그인', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.', () => $loginForm['email'].focusAndSelect());
        }
    };
    xhr.open('POST','/user/login');
    xhr.send(formData);

};