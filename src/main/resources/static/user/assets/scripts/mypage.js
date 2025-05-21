const $infoForm = document.getElementById('infoForm');
const passwordRegex = new RegExp('^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\'",<.>/?]{8,50})$');
const nicknameRegex = new RegExp('^([\\da-zA-Z가-힣]{2,10})$');
const originalNickname = $infoForm['nickname'].defaultValue; // 타임리프로 채운 기존 닉네임 값

window.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.select-button, .delect-button, .infoDelect-button');
    const visibleDivs = document.querySelectorAll('[class*="-visible"]');

    toggleButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            // 버튼에 따라 어떤 div를 보여줄지 결정
            let targetDiv = null;

            if (button.classList.contains('select-button')) {
                targetDiv = document.querySelector('.--object-div-select');
            } else if (button.classList.contains('delect-button')) {
                targetDiv = document.querySelector('.--object-div-delect');
            } else if (button.classList.contains('infoDelect-button')) {
                targetDiv = document.querySelector('.--object-div-infoDelect');
            }

            if (targetDiv) {
                // 모든 -visible 클래스 z-index 초기화
                visibleDivs.forEach(div => {
                    div.style.zIndex = '0';
                });

                // 선택된 div만 z-index: 1
                targetDiv.style.zIndex = '1';
            }
        });
    });
});

$infoForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 스타일 초기화
    $infoForm['nickname'].style.filter = '';
    $infoForm['nickname'].nextElementSibling.style.filter = '';
    ['currentPassword', 'newPassword', 'newPasswordCheck', 'nickname'].forEach(name => $infoForm[name].setValid(true));

    // 현재 비밀번호 유효성
    if ($infoForm['currentPassword'].value === '') {
        $infoForm['currentPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 입력해 주세요.';
        return;
    }
    if (!passwordRegex.test($infoForm['currentPassword'].value)) {
        $infoForm['currentPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 비밀번호입니다.';
        return;
    }

    // 새 비밀번호 유효성
    if ($infoForm['newPassword'].value !== '') {
        if (!passwordRegex.test($infoForm['newPassword'].value)) {
            $infoForm['newPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 비밀번호입니다.';
            return;
        }
        if ($infoForm['currentPassword'].value === $infoForm['newPassword'].value) {
            $infoForm['newPassword'].focusAndSelect().setValid(false).nextElementSibling.innerText = '현재 비밀번호와 같습니다.';
            return;
        }
        if ($infoForm['newPasswordCheck'].value === '') {
            $infoForm['newPasswordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호를 한번 더 입력해 주세요';
            return;
        }
        if ($infoForm['newPassword'].value !== $infoForm['newPasswordCheck'].value) {
            $infoForm['newPasswordCheck'].focusAndSelect().setValid(false).nextElementSibling.innerText = '비밀번호가 일치하지 않습니다.';
            return;
        }
    }

    // 닉네임 검사 (바뀐 경우만)
    const changedNickname = $infoForm['nickname'].value !== originalNickname;
    if (changedNickname) {
        if ($infoForm['nickname'].value === '') {
            $infoForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '닉네임을 입력해 주세요.';
            return;
        }
        if (!nicknameRegex.test($infoForm['nickname'].value)) {
            $infoForm['nickname'].focusAndSelect().setValid(false).nextElementSibling.innerText = '올바르지 않은 닉네임입니다.';
            return;
        }
    }

    // FormData 구성
    const formData = new FormData();
    formData.append('email', $infoForm['email'].value);
    formData.append('birth', $infoForm['birth'].value);
    formData.append('currentPassword', $infoForm['currentPassword'].value);
    formData.append('nickname', $infoForm['nickname'].value);
    if ($infoForm['newPassword'].value !== '') {
        formData.append('newPassword', $infoForm['newPassword'].value);
    }

    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', '/user/mypage');
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        if (xhr.status < 200 || xhr.status >= 300) {
            dialog.showSimpleOk('개인정보 수정', `[${xhr.status}] 개인정보를 수정하는 도중 오류가 발생하였습니다.`);
            return;
        }

        const response = JSON.parse(xhr.responseText);
        switch (response.result) {
            case 'failure_nickname_not_available':
                dialog.showSimpleOk('개인정보 수정', `입력하신 닉네임 "${$infoForm['nickname'].value}"은/는 이미 사용 중입니다.`, () => $infoForm['nickname'].focusAndSelect());
                break;
            case 'failure_password_mismatch':
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
    xhr.send(formData);
});

// 닉네임 중복 검사 (바뀐 경우에만 실행)
$infoForm['nickname'].addEventListener('focusout', () => {
    $infoForm['nickname'].style.filter = '';
    $infoForm['nickname'].nextElementSibling.style.filter = '';
    $infoForm['nickname'].setValid(true);

    if ($infoForm['nickname'].value === originalNickname) return; // 기존 닉네임이면 검사 안 함

    if ($infoForm['nickname'].value === '') {
        $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '닉네임을 입력해주세요.';
        return;
    }
    if (!nicknameRegex.test($infoForm['nickname'].value)) {
        $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '올바르지 않은 닉네임입니다.';
        return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/user/nickname-check?nickname=${encodeURIComponent($infoForm['nickname'].value)}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        if (xhr.status < 200 || xhr.status >= 300) return;

        const response = JSON.parse(xhr.responseText);
        if (response.result === true) {
            $infoForm['nickname'].setValid(true).nextElementSibling.innerText = '사용할 수 있는 닉네임입니다.';
            $infoForm['nickname'].style.filter = 'hue-rotate(135deg)';
            $infoForm['nickname'].nextElementSibling.style.filter = 'hue-rotate(135deg)';
        } else {
            $infoForm['nickname'].setValid(false).nextElementSibling.innerText = '이미 사용중인 닉네임입니다.';
        }
    };
    xhr.send();
});
