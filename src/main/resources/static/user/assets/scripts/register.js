const $registerForm = document.getElementById('registerForm');
const $infoContainer = $registerForm.querySelector(`:scope > .container.info`);
const $completeContainer = $registerForm.querySelector(`:scope > .container.complete`);
const $containers = [$infoContainer, $completeContainer];

const emailRegex = new RegExp('^(?=.{8,50}$)([\\da-z\\-_.]{4,})@([\\da-z][\\da-z\\-]*[\\da-z]\\.)?([\\da-z][\\da-z\\-]*[\\da-z])\\.([a-z]{2,15})(\\.[a-z]{2,3})?$');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');
const nicknameRegex = new RegExp('^([\\da-zA-Z가-힣]{2,10})$');

let currentStep = 0;

$registerForm['email'].addEventListener('input', () => {
    $registerForm['emailCheckButton'].removeAttribute('disabled');
});
$registerForm['nickname'].addEventListener('input', () => {
    $registerForm['nicknameCheckButton'].removeAttribute('disabled');
});

// 이메일 유효성 체크 이벤트
$registerForm['emailCheckButton'].addEventListener('click', () => {
    console.log("duplicate check")
    const $emailLabel = $registerForm.querySelector(`.--object-label:has(input[name="email"])`);

    if ($registerForm['email'].value === '') {
        $emailLabel.setValid(false, '이메일을 입력해 주세요.');
        $registerForm['email'].focus();
        return;
    }
    if (!emailRegex.test($registerForm['email'].value)) {
        $emailLabel.setValid(false, '유효하지 않은 이메일 형식입니다.');
        $registerForm['email'].focus();
        $registerForm['email'].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', $registerForm['email'].value)

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.showSimpleOk('이메일 중복 확인', '요청을 처리하는 도중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.')
            return;
        }
        const response = JSON.parse(xhr.responseText);
        switch (response.result) {
            case 'failure_email_not_available' :
                $emailLabel.setValid(false, '이미 사용 중인 이메일입니다.');
                $registerForm['email'].focus();
                break;
            case 'success':
                dialog.show({
                    title: '이메일 중복 확인',
                    content: `입력하신 '${$registerForm['email'].value}'은/는 사용가능합니다.\n이 이메일을 사용할까요?`,
                    buttons: [
                        {caption: '아니요', onclick: ($modal) => dialog.hide($modal)},
                        {
                            caption: '네',
                            color: 'green',
                            onclick: ($modal) => {
                                dialog.hide($modal);
                                $registerForm['emailCheckButton'].setDisabled(true);
                                $emailLabel.setValid(true);
                            }
                        }
                    ]
                });
                break;
            default:
                dialog.showSimpleOk('이메일 중복 확인', '이메일 중복을 확인하지 못하였습니다.\n잠시 후 다시 시도해 주세요.');
        }
    };
    xhr.open('POST', '/user/email-check');
    xhr.send(formData);
}); // 이메일 유효성 체크 이벤트

// 닉네임 유효성 체크 이벤트
$registerForm['nicknameCheckButton'].addEventListener('click', () => {
    const $nicknameLabel = $registerForm.querySelector(`.--object-label:has(input[name="nickname"])`);

    if ($registerForm['nickname'].value === '') {
        $nicknameLabel.setValid(false, '닉네임을 입력해 주세요.');
        $registerForm['nickname'].focus();
        return;
    }
    if (!nicknameRegex.test($registerForm['nickname'].value)) {
        $nicknameLabel.setValid(false, '유효하지 않은 닉네임 형식입니다.');
        $registerForm['nickname'].focus();
        $registerForm['nickname'].select();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('nickname', $registerForm['nickname'].value)

    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.showSimpleOk('닉네임 중복 확인', '요청을 처리하는 도중 오류가 발생하였습니다.\n잠시 후 다시 시도해 주세요.')
            return;
        }
        const response = JSON.parse(xhr.responseText);
        switch (response.result) {
            case 'failure_nickname_not_available' :
                $nicknameLabel.setValid(false, '이미 사용 중인 닉네임입니다.');
                $registerForm['nickname'].focus();
                break;
            case 'success':
                dialog.show({
                    title: '닉네임 중복 확인',
                    content: `입력하신 '${$registerForm['nickname'].value}'은/는 사용가능합니다.
                    이 닉네임을 사용할까요?`,
                    buttons: [
                        {caption: '아니요', onclick: ($modal) => dialog.hide($modal)},
                        {
                            caption: '네',
                            color: 'green',
                            onclick: ($modal) => {
                                dialog.hide($modal);
                                $registerForm['nicknameCheckButton'].setDisabled(true);

                                $nicknameLabel.setValid(true);
                            }
                        }
                    ]
                });
                break;
            default:
                dialog.showSimpleOk('닉네임 중복 확인', `닉네임 중복을 확인하지 못하였습니다.
                잠시 후 다시 시도해 주세요.`);
        }
    };
    xhr.open('POST', '/user/nickname-check');
    xhr.send(formData);
}); // 닉네임 유효성 체크 이벤트

// 회원가입 버튼 클릭 이벤트
$registerForm.onsubmit = (e) => {
    e.preventDefault();

    // $registerForm['email'].style.filter = '';
    // $registerForm['nickname'].style.filter = '';
    // $registerForm['password'].style.filter = '';
    // $registerForm['birth'].style.filter = '';
    // $registerForm['email'].setValid(true);
    // $registerForm['nickname'].setValid(true);
    // $registerForm['password'].setValid(true);
    // $registerForm['birth'].setValid(true);

    if (currentStep === 0) { // 화원가입 정보입력창
        const $emailLabel = $registerForm.querySelector(`.--object-label:has(input[name="email"])`);
        const $nicknameLabel = $registerForm.querySelector(`.--object-label:has(input[name="nickname"])`);
        const $passwordLabel = $registerForm.querySelector(`.--object-label:has(input[name="password"])`);
        const $birthLabel = $registerForm.querySelector(`.--object-label:has(input[name="birth"])`);
        const $labels = [$emailLabel, $passwordLabel, $nicknameLabel, $birthLabel];

        $labels.forEach(($label) => $label.setValid(true));

        if (!$registerForm['emailCheckButton'].hasAttribute ('disabled')) { // 이메일 유효성 체크
            $emailLabel.setValid(false, '이메일 중복 체크를 완료해 주세요.');
            $registerForm['email'].focus();
            return;
        }
        if ($registerForm['email'].value === '') {
            $emailLabel.setValid(false, '이메일을 입력해 주세요.');
            $registerForm['email'].focus();
            return;
        }
        if (!emailRegex.test($registerForm['email'].value)) {
            $emailLabel.setValid(false, '유효하지 않은 이메일 형식입니다.');
            $registerForm['email'].focus();
            $registerForm['email'].select();
            return;
        } // 이메일 유효성 체크

        if ($registerForm['password'].value === '') { // 비밀번호 유효성 체크
            $passwordLabel.setValid(false, '비밀번호를 입력해 주세요.');
            $registerForm['password'].focus();
            return;
        }
        if (!passwordRegex.test($registerForm['password'].value)) {
            $passwordLabel.setValid(false, '유효하지 않은 비밀번호 형식입니다.');
            $registerForm['password'].focus();
            $registerForm['password'].select();
            return;
        }
        if ($registerForm['passwordCheck'].value === '') {
            $passwordLabel.setValid(false, '비밀번호를 한 번 더 입력해 주세요.');
            $registerForm['passwordCheck'].focus();
            return;
        }
        if ($registerForm['password'].value !== $registerForm['passwordCheck'].value) {
            $passwordLabel.setValid(false,'비밀번호가 일치하지 않습니다.');
            $registerForm['passwordCheck'].focus();
            $registerForm['passwordCheck'].select();
            return;
        } // 비밀번호 유효성 체크



        if (!$registerForm['nicknameCheckButton'].hasAttribute('disabled')) { // 닉네임 유효성 체크
            $nicknameLabel.setValid(false, '닉네임 중복 체크를 완료해 주세요.');
            $registerForm['nickname'].focus();
            return;
        }
        if ($registerForm['nickname'].value === '') {
            $nicknameLabel.setValid(false, '닉네임을 입력해 주세요.');
            $registerForm['nickname'].focus();
            return;
        }
        if (!nicknameRegex.test($registerForm['nickname'].value)) {
            $nicknameLabel.setValid(false, '유효하지 않은 닉네임 형식입니다.');
            $registerForm['nickname'].focus();
            $registerForm['nickname'].select();
            return;
        } // 닉네임 유효성 체크

        if ($registerForm['birth'].value === '') { // 생년월일/성별 유효성 체크
            $birthLabel.setValid(false, '생년월일을 선택해 주세요.');
            $registerForm['birth'].focus();
            return;
        }

        const birthDate = new Date($registerForm['birth'].value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log(birthDate);
        console.log(today.toISOString());

        if (birthDate > today) {
            $birthLabel.setValid(false, '미래의 날짜는 선택 할 수 없습니다.');
            $registerForm['birth'].focus();
            return;
        }

        if ($registerForm['gender'.value ==='']) {
            $birthLabel.setValid(false, '성별을 선택해 주세요.');
            return;
        } // 생년월일/성별 유효성 체크

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('email', $registerForm['email'].value);
        formData.append('password', $registerForm['password'].value);
        formData.append('nickname', $registerForm['nickname'].value);
        formData.append('birth', $registerForm['birth'].value);
        formData.append('gender', $registerForm['gender'].value);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                dialog.showSimpleOk('회원가입', `요청을 처리하는 도중 오류가 발생하였습니다.
                잠시후 다시 시도해 주세요.`);
                return;
            }
            const response = JSON.parse(xhr.responseText);
            switch (response.result) {
                case 'failure_email_not_available' :
                    dialog.showSimpleOk('회원가입', `입력하신 '${$registerForm['email'].value}'은/는 이미 사용 중입니다.`);
                    break;
                case 'failure_nickname_not_available':
                    dialog.showSimpleOk('회원가입', `입력하신 '${$registerForm['nickname'].value}'은/는 이미 사용 중입니다.`);
                    break;
                case 'success':
                    currentStep++;
                    $registerForm.dispatchEvent(new Event('submit'));
                    break;
                default:
                    dialog.showSimpleOk('회원가입', `회원가입에 실패하였습니다.
                    잠시 후 다시 시도해 주세요.`);
            }
        };
        xhr.open('POST', '/user/register');
        xhr.send(formData);
        return;
    }

    switch (currentStep) {
        case 0:
            break;
        case 1:
            $registerForm.querySelector(`a[href="/user/login"]`).style.display = 'none'; //취소버튼
            $registerForm['submit'].querySelector(`:scope > .---caption`).innerText = '로그인';
            $registerForm['submit'].addEventListener('click', () => {
                location.href = '/user/login';
            });
            document.getElementById('registerImg').style.display = 'none';
            document.getElementById('completeImg').style.display = 'block';
            break;
        default:
            location.href = '/user/login';
            return;
    }
    $containers.forEach(($container) => $container.classList.remove('-visible'));
    $containers[currentStep].classList.add('-visible');
}; // 회원가입 버튼 이벤트


// TODO 로그인 후 마라톤 시작 여부에 따라 창 이동
// TODO 회원가입
// TODO 로그인 되어있는 상태일때 회원가입, 로그인창 제거