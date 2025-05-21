const $registerForm = document.getElementById('registerForm');
const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');
const nicknameRegex = new RegExp('^([\\da-zA-Z가-힣]{2,10})$');

$registerForm.onsubmit = (e) =>
{
    e.preventDefault();
    $registerForm['email'].style.filter = '';
    $registerForm['email'].nextElementSibling.style.filter = '';
    $registerForm['nickname'].style.filter = '';
    $registerForm['nickname'].nextElementSibling.style.filter = '';
    ['email', 'password', 'passwordCheck', 'nickname'].forEach((name) => $registerForm[name].setValid(true))
    // $registerForm['email'].setValid(true);
    // $registerForm['password'].setValid(true);
    // $registerForm['passwordCheck'].setValid(true);
    // $registerForm['nickname'].setValid(true);
    if ($registerForm['email'].value === '')
    {
        $registerForm['email'].focusAndSelect().setValid(false).nextElementSibling.innerText = '이메일을 입력해 주세요.';
        return;
    }
    if (!emailRegex.test($registerForm['email'].value))
    {
        // $registerForm['email'].nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
        $registerForm['email']
            .focusAndSelect()
            .setValid(false)
            .nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
        // prototype에서 return this로 input 자체를 뱉어내도록 설정했기 때문에 이러한 메소드가 가능하다.
        return;
    }
    if ($registerForm['password'].value === '')
    {
        $registerForm['password'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 입력해 주세요.';
        return;
    }
    if (!passwordRegex.test($registerForm['password'].value))
    {
        $registerForm['password'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 비밀번호입니다.';
        return;
    }
    if ($registerForm['passwordCheck'].value === '')
    {
        $registerForm['passwordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 한번 더 입력해 주세요.';
        return;
    }
    if ($registerForm['password'].value !== $registerForm['passwordCheck'].value)
    {
        $registerForm['passwordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호가 일치하지 않습니다.';
        return;
    }
    if ($registerForm['nickname'].value === '')
    {
        $registerForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '닉네임을 입력해 주세요.';
        return;
    }
    if (!nicknameRegex.test($registerForm['nickname'].value))
    {
        $registerForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 닉네임입니다.';
        return;
    }
    if (!$registerForm['agreeTerm'].checked)
    {
        dialog.showSimpleOk('회원가입', '서비스 이용약관을 읽고 동의해 주세요.', () =>
        {
            $registerForm['agreeTerm'].parentElement.scrollIntoView({
                behavior: 'smooth', // 스무스하게
                block: 'center' // 수직 가운데 위치
            })
        })
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email',$registerForm['email'].value);
    formData.append('password',$registerForm['password'].value);
    formData.append('nickname',$registerForm['nickname'].value);

    if ($registerForm['birth'].value !== '')
    {
        formData.append('birth',$registerForm['birth'].value);
    }
    formData.append('isMarketingChecked', $registerForm['agreeMarketing'].checked);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE)
        {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300)
        {
            dialog.showSimpleOk('회원가입',`[${xhr.status}] 회원가입 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.`);
            return;
        }
        const response = JSON.parse(xhr.responseText)
        switch (response['result'])
        {
            case 'failure_email_not_available':
                dialog.showSimpleOk('회원가입', `입력하신 이메일 "${$registerForm['email'].value}은/는 이미 사용중입니다.`,() =>
                {
                    $registerForm['email'].scrollIntoView(
                        {
                            behavior: 'smooth',
                            block: 'center'
                        });
                });
                break;
            case 'failure_nickname_not_available':
                dialog.showSimpleOk('회원가입', `입력하신 닉네임 "${$registerForm['nickname'].value}은/는 이미 사용중입니다.`,() =>
                {
                    $registerForm['nickname'].scrollIntoView(
                        {
                            behavior: 'smooth',
                            block: 'center'
                        });
                });
                break;
            case 'success':
                dialog.showSimpleOk('회원가입', '회원가입해 주셔서 감사합니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.', () => location.href = '/user/login');
                break;
            default:
                dialog.showSimpleOk('회원가입', '알 수 없는 이유로 회원가입에 실패하였습니다. 잠시 후 다시 시도해 주세요.')
        }
    };
    xhr.open('POST','/user/register');
    xhr.send(formData);

};


// focusout -> 빠져나갈때 발동하는 이벤트 리스너 방식
$registerForm['email'].addEventListener('focusout', () =>
{
    $registerForm['email'].style.filter = ''; // 초록색으로 바꾼걸 초기화(빨간색) 시켜주는 로직
    $registerForm['email'].nextElementSibling.style.filter = ''; // 초록색으로 바꾼걸 초기화(빨간색) 시켜주는 로직
    $registerForm['email'].setValid(true);
    if ($registerForm['email'].value === '')
    {
        $registerForm['email'].setValid(false).nextElementSibling.innerText = '이메일을 입력해 주세요.';
        return;
    }
    if (!emailRegex.test($registerForm['email'].value))
    {
        // $registerForm['email'].nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
        $registerForm['email']
            .setValid(false)
            .nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
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
            $registerForm['email'].setValid(false).nextElementSibling.innerText = '사용할 수 있는 이메일입니다.';
            $registerForm['email'].style.filter = 'hue-rotate(135deg)';
            $registerForm['email'].nextElementSibling.style.filter = 'hue-rotate(135deg)';
        }
        else
        {
            $registerForm['email'].setValid(false).nextElementSibling.innerText = '이미 사용중인 이메일입니다.';
        }
        
    };
    xhr.open('GET',`/user/email-check?email=${$registerForm['email'].value}`);
    xhr.send();
})

// focusout -> 빠져나갈때 발동하는 이벤트 리스너 방식
$registerForm['nickname'].addEventListener('focusout', () =>
{
    $registerForm['nickname'].style.filter = '';
    $registerForm['nickname'].nextElementSibling.style.filter = '';
    $registerForm['nickname'].setValid(true);
    if ($registerForm['nickname'].value === '')
    {
        $registerForm['nickname'].setValid(false).nextElementSibling.innerText = '닉네임을 입력해 주세요.';
        return;
    }
    if (!nicknameRegex.test($registerForm['nickname'].value))
    {
        // $registerForm['nickname'].nextElementSibling.innerText = '올바르지 않은 이메일입니다.';
        $registerForm['nickname']
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
            $registerForm['nickname'].setValid(false).nextElementSibling.innerText = '사용할 수 있는 닉네임입니다.';
            $registerForm['nickname'].style.filter = 'hue-rotate(135deg)';
            $registerForm['nickname'].nextElementSibling.style.filter = 'hue-rotate(135deg)';
        }
        else
        {
            $registerForm['nickname'].setValid(false).nextElementSibling.innerText = '이미 사용중인 닉네임입니다.';
        }

    };
    xhr.open('GET',`/user/nickname-check?nickname=${$registerForm['nickname'].value}`);
    xhr.send();
})