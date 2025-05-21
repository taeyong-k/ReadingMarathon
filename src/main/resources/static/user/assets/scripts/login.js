const $loginForm = document.getElementById('loginForm');
const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');

$loginForm.onsubmit = (e) => { // 로그인 버튼 클릭
    e.preventDefault();
    
    const $emailLabel = $loginForm.querySelector('.--object-label:has(input[name="email"])');
    const $passwordLabel = $loginForm.querySelector('.--object-label:has(input[name="password"])');
    const $labels = [$emailLabel, $passwordLabel];
    
    $labels.forEach(($label) => $label.setValid(true));

    if ($loginForm['email'].value === '') { // 이메일 유효성 체크
        $emailLabel.setValid(false, '이메일을 입력해 주세요.');
        $loginForm['email'].focus();
        return;
    }
    if (!emailRegex.test($loginForm['email'].value)) {
        $emailLabel.setValid(false, `유효하지 않은 이메일 형식입니다.
        이메일을 다시 확인해 주세요.`);
        $loginForm['email'].focus();
        $loginForm['email'].select();
        return;
    } // 이메일 유효성 체크

    if ($loginForm['password'].value === '') { // 비밀번호 유효성 체크
        $passwordLabel.setValid(false, '비밀번호를 입력해 주세요.');
        $loginForm['password'].focus();
        return;
    }
    if (!passwordRegex.test($loginForm['password'].value)) {
        $passwordLabel.setValid(false, '유효하지 않은 비밀번호 형식입니다.\n비밀번호를 다시 확인해 주세요.');
        $loginForm['password'].focus();
        $loginForm['password'].select();
        return;
    } // 비밀번호 유효성 체크

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $loginForm['email'].value);
    formData.append('password', $loginForm['password'].value);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.showSimpleOk('로그인', '로그인 중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.');
            return;
        }
        const  response = JSON.parse(xhr.responseText);
        switch (response['result']) {
            case 'failure_no_account':
                dialog.showSimpleOk('로그인',
                    '존재하지 않는 계정입니다.\n확인 버튼을 클릭하면 회원가입 페이지로 이동합니다.',
                    {
                        onOkCallback: () => location.href = '/user/register'
                    });
                break;
            case 'success': // 진행 중인 마라톤이 있을 시 마라톤 페이지, 아닐 경우 검색 페이지로 이동
                const redirectUrl = response.redirect || '/search';
                location.href = redirectUrl;
                break;
            default:
                dialog.showSimpleOk('로그인', '이메일 혹은 비밀번호가 올바르지 않습니다.\n다시 확인해 주세요.', () => $loginForm['email'].focus());
        }
    };
    xhr.open('POST', '/user/login');
    xhr.send(formData);
}

// 아이디 기억하기
$(document).ready(() => {
    // 로그인 페이지 진입 시 cookie를 가져옴
    let cookieId = getCookie("key");

    // 저장된 cookie가 있다면
    if (cookieId != '') {
        $("#email").val(cookieId);
        $("#remember").attr("checked", true);
    }

    // cookie 불러오기
    function getCookie(key) {
        key = key + "=";
        let cookieData = document.cookie;
        let firstCookie = cookieData.indexOf(key);
        let cookieValue = "";

        if (firstCookie != -1) {
            firstCookie += key.length;
            let endCookie = cookieData.indexOf(';', firstCookie);
            if (endCookie == -1) {
                endCookie = cookieData.length;
                cookieValue = cookieData.substring(firstCookie, endCookie);
            }
        }
        return unescape(cookieValue);
    }

    // cookie 설정
    // key = cookie 불러올때 사용 할 값
    // value = 저장할 id 값
    // day = 유지할 날짜
    function setCookie(key, value, day) {
        let currentTime = new Date();
        currentTime.setDate(currentTime.getDate() + day);
        let cookieValue = escape(value) + ((day == null) ? "" : "; expires=" + currentTime.toGMTString());
    }

    // cookie 삭제
    function deleteCookie(key) {
        let currentTime = new Date();
        //현재 시간에서 1일을 빼서 없는 시간으로 만듦
        currentTime.setDate(currentTime.getDate() - 1);
        document.cookie = key + "=" + ";expires=" + currentTime.toGMTString();
    }

    // button을 통한 submit에서 입력한 id를 cookie에 설정하고 form을 submit하도록 변경
    $('#loginButton').click(() => {
        if ($('#remember').is(':checked')) {
            setCookie("key", $("email").val(), 3);
        } else {
            deleteCookie("key");
        }
        document.form.submit();
    })
});