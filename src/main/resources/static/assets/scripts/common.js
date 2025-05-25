HTMLElement.VISIBLE_CLASS = '-visible';

/**
 * 요소에서 클래스를 제거하여 숨깁니다.
 * @returns {HTMLElement} */

HTMLElement.prototype.hide = function ()
{
    this.classList.remove(HTMLElement.VISIBLE_CLASS);
    return this;
}

/**
 * 요소에 '-visible' 클래스를 추가하여 보이게 합니다.
 * @returns {HTMLElement} */
HTMLElement.prototype.show = function ()
{
    this.classList.add(HTMLElement.VISIBLE_CLASS);
    return this;
}

HTMLElement.INVALID_CLASS = '-invalid'

/**
 * @param {boolean} b
 * @param {String|undefined} warningText
 * @return {HTMLElement}
 */
HTMLLabelElement.prototype.setValid = function (b, warningText = undefined)
{
    if (b === true)
    {
        this.classList.remove(HTMLElement.INVALID_CLASS);
    }
    else if (b === false)
    {
        const $warning = this.querySelector(':scope > .---warning');
        if ($warning != null && warningText != null)
        {
            $warning.innerText = warningText
        }
        this.classList.add(HTMLElement.INVALID_CLASS);
    }
    return this;
}

class Dialog
{
    /**
     * @private
     * @type {HTMLElement} */
    #$element

    /**
     * @private
     * @type {HTMLElement} */
    #$modals = []

    constructor()
    {
        let $element = document.body.querySelector('.--dialog');
        if ($element == null)
        {
            $element = document.createElement('div');
            $element.classList.add('--dialog');
            document.body.insertAdjacentElement('afterbegin', $element);
        }
        this.#$element = $element;
    }

    /**
     * @param {HTMLElement} $modal
     * @return {boolean} */
    hide($modal)
    {
        const index = this.#$modals.indexOf($modal)
        if (index < 0)
        {
            return false;
        }
        this.#$modals.splice(index, 1);
        if (this.#$modals.length === 0)
        {
            this.#$element.hide();
        }
        $modal.hide();
        setTimeout(() => $modal.remove(), 1000);
        return true;
    }

    /**
     * @param {{
     *  title: string,
     *  content: string,
     *  buttons?:
     *  {
     *      caption: string,
     *      color?: 'blue'|'gray'|'green'|'red',
     *      onclick?: function(HTMLElement?)
     *  }[],
     *  isContentHtml?: boolean,
     *  delay?: number
     * }} args
     * @return {HTMLElement}
     */
    show(args)
    {
        const $title = document.createElement('div');
        $title.classList.add('---title');
        $title.innerText = args.title;

        const $content = document.createElement('div');
        $content.classList.add('---content');
        if (args.isContentHtml === true)
        {
            $content.innerHTML = args.content;
        }
        else
        {
            $content.innerText = args.content;
        }
        const $modal = document.createElement('div');
        $modal.classList.add('---modal');
        $modal.append($title, $content);
        if (args.buttons != null && args.buttons.length > 0)
        {
            const $buttonContainer = document.createElement('div');
            $buttonContainer.classList.add('---button-container');
            for (const button of args.buttons)
            {
                const $button = document.createElement('button');
                $button.classList.add('--object-button', `-color-${button.color ?? 'gray'}`, '---button');
                $button.setAttribute('type','button');
                $button.innerText = button.caption;
                if (typeof button.onclick === 'function')
                {
                    $button.addEventListener('click', () => button.onclick($modal));
                }
                $buttonContainer.append($button);
            }
            $modal.append($buttonContainer);
        }
        this.#$element.append($modal);
        this.#$modals.push($modal)
        setTimeout(() =>
        {
            this.#$element.show();
            $modal.show();
        }, args.delay ?? 50);
        return $modal;

    }

    /**
     *
     * @param {String} title
     * @param {String} content
     * @param {{
     *     buttonCaption?: String,
     *     buttonColor?: 'blue'| 'gray'|'green'|'red'
     *     isContentHtml?: boolean,
     *     delay?: number,
     *     onOkCallback?: function(HTMLElement?)
     * }?} args
     */
    showSimpleOk(title, content, args = undefined)
    {
        args ??= {};
        return this.show({
            title: title,
            content: content,
            buttons: [
                {
                    caption:args.buttonCaption ?? '확인',
                    color: args.buttonColor ?? 'green',
                    onclick: ($modal) =>
                    {
                        if (typeof args.onOkCallback === 'function')
                        {
                            args.onOkCallback($modal);
                        }
                        this.hide($modal);
                    }
                }
            ],
            isContentHtml: args.isContentHtml,
            delay: args.delay
        });
    }
}

//                      defer: 콘텐츠가 다 로딩 된 후 작동한다 랑 같은 속성 느낌(지금 당장엔)
window.addEventListener('DOMContentLoaded', () =>
{
    window.dialog = new Dialog(); // window. -> 전역변수 느낌 선언.
})
