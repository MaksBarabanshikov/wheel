//=============interface==============

interface ISegment {
    id: string,
    amount?: number,
    text: string,
    color?: string
    hide: boolean
}

interface IResult {
    id: string
    text: string
    value: number
    inc: boolean
}

//=============variables==============

let wheelSegments: ISegment[] = []
let wheelResults: IResult[] = []

const colors: Array<string> = [
    "#F7A326",
    "#f6c42d",
    "#F8E754",
    "#CEDB53",
    "#97C662",
    "#63B567",
    "#25A195",
    "#23BFD3",
    "#25AFEE",
    "#42A2EE",
    "#5A69BB",
    "#7953BC",
    "#A645B7",
    "#E53D76",
    "#EE5D52",
    "#F86E43",
]

let wheelSegmentItems: NodeListOf<Element>

let wheel = document.querySelector<HTMLElement>('.wheel')!
let trigger = document.querySelector<HTMLButtonElement>('.wheel__play')!

const wheelList = document.querySelector<HTMLElement>('.wheel__list')!
const plug: ISegment[] = [
    {
        id: uniqueId(),
        text: "1",
        hide: false
    },
    {
        id: uniqueId(),
        text: "2",
        hide: false
    },
    {
        id: uniqueId(),
        text: "3",
        hide: false
    },
    {
        id: uniqueId(),
        text: "4",
        hide: false
    },
    {
        id: uniqueId(),
        text: "5",
        hide: false
    },
    {
        id: uniqueId(),
        text: "6",
        hide: false
    },
    {
        id: uniqueId(),
        text: "7",
        hide: false
    },
    {
        id: uniqueId(),
        text: "8",
        hide: false
    },
    {
        id: uniqueId(),
        text: "9",
        hide: false
    },
    {
        id: uniqueId(),
        text: "10",
        hide: false
    },
]
let notHide: ISegment[] = []

// на сколько секторов нарезаем круг

let segmentNotHide = wheelSegments.filter(segment => !segment.hide)
let segmentSlice = 360 / segmentNotHide.length;

// css классы для событий

const spinClass = 'is-spinning'
const selectedClass = 'selected'

// угол вращения

let rotation = 0

// переменная для текстовых подписей

let prizeNodes: NodeListOf<Element>

function uniqueId(): string {
    return Math.random().toString(16).slice(2)
} // unique value for wheel segment

//=============side==============

const wheelTabs = (): void => {
    const tabs = document.querySelectorAll<HTMLAnchorElement>('.side__tab')!,
        tabsBody = document.querySelectorAll<HTMLDivElement>('.side__body')
    tabs.forEach((el: HTMLAnchorElement) => {
        el.addEventListener('click', selectTab)
    })

    wheelResultCounter()

    function selectTab(this: HTMLAnchorElement, event: MouseEvent): void {
        const side = document.querySelector<HTMLDivElement>('.side')!

        event.preventDefault()
        tabs.forEach(item => {
            item.classList.remove('side__tab_active')
        })
        this.classList.add('side__tab_active')
        selectTabBody(this.dataset.tabName!)

        if (this.dataset.tabName === 'tab-results') {
            side.classList.add('side_result')
        } else {
            side.classList.remove('side_result')
        }


    }

    function selectTabBody(tabName: string): void {
        tabsBody.forEach(item => {
            item.classList.contains(tabName) ?
                item.classList.add('side__body_active') :
                item.classList.remove('side__body_active')
        })
    }
}

const wheelHeadIcons = (): void => {
    const wheelList = document.querySelector<HTMLElement>('#wheelList')!,
        wheelShuffle = document.querySelector<HTMLElement>('#wheelShuffle')!,
        wheelSort = document.querySelector<HTMLElement>('#wheelSort')!,
        wheelTrash = document.querySelector<HTMLElement>('#wheelTrash')!
    const side = document.querySelector<HTMLElement>('.side')!
    wheelList.addEventListener('click', wheelModal)

    wheelShuffle.addEventListener('click', (): void => {
        wheelSegments.sort(() => Math.random() - 0.5)
        wheelCreateSegments()
        setupWheel()
    })

    wheelSort.addEventListener('click', (event: Event): void => {
        const target = event.target as Element
        const selectedTabResult = side.classList.contains('side_result')

        function sort(elem: ISegment[] | IResult[]) {
            if (target.classList.contains('sorted')) {
                elem.sort((a: ISegment | IResult, b: ISegment | IResult) => a.text > b.text ? -1 : 1)
                target.classList.remove('sorted')
            } else {
                elem.sort((a: ISegment | IResult, b: ISegment | IResult) => a.text > b.text ? 1 : -1)
                target.classList.add('sorted')
            }
        }

        if (selectedTabResult) {
            sort(wheelResults)
        } else {
            sort(wheelSegments)
            wheelCreateSegments()
            setupWheel()
        }
    })

    wheelTrash.addEventListener('click', (): void => {
        const selectedTabResult = side.classList.contains('side_result')

        function clearList(elem: ISegment[] | IResult[]) {
            elem.length = 0
        }

        if (selectedTabResult) {
            const bodyResults: Element = document.querySelector<HTMLDivElement>('.tab-results')!
            clearList(wheelResults)
            bodyResults.innerHTML = 'Пусто'
            wheelResultCounter()
        } else {
            clearList(wheelSegments)
            wheelSegmentCounter()
            wheelCreateSegments()
            setupWheel()
        }
    })
}

const wheelCreateSegments = (): void => {
    const wheelEntries = document.querySelector<HTMLElement>('#wheelEntries')!

    const wheelSegmentHtml = (item: any, index: number): string => {
        return `
            <div class="side__item ${item.hide ? 'side__item_hide' : ''}">
               <input name="${index}" type="text" class="side__number" value="${item.amount}"/>
               <input name="${index}" type="text" class="side__text" value="${item.text}"/>
               <div class="side__buttons">
                <i class="${!item.hide ? 'fas fa-eye fa-lg hide_button' : 'fas fa-eye-slash fa-lg hide_button'}"></i>
                <i class="fas fa-times fa-lg remove_button"></i>
               </div>
            </div>
        `
    }

    // шаблон сегмента
    const wheelUpdateHtml = (): void => {
        wheelEntries.innerHTML = ''
        wheelSegments.map((item, index) => {
            wheelEntries.innerHTML += wheelSegmentHtml(item, index)
        })
    }

    wheelUpdateHtml()

    wheelSegmentItems = wheelEntries.querySelectorAll('.side__item')!

    function editArr(this: HTMLInputElement) {
        this.className === 'side__number' ?
            wheelSegments[<any>this.name].amount = parseInt(this.value) :
            wheelSegments[<any>this.name].text = this.value
        setupWheel()
    }

    // hide segment

    wheelEntries.querySelectorAll('.hide_button')
        .forEach((btn, index: number) => {
            btn.addEventListener('click', (event: Event) => {
                // change icon
                const target = event.target as Element
                !target.classList.contains('fa-eye-slash') ?
                    target.className = 'fas fa-eye-slash fa-lg hide_button' :
                    target.className = 'fas fa-eye fa-lg hide_button'

                //hide segment

                wheelSegments[index].hide = !wheelSegments[index].hide
                setupWheel()
                wheelSegments[index].hide ?
                    wheelSegmentItems[index].classList.add('side__item_hide') :
                    wheelSegmentItems[index].classList.remove('side__item_hide')
            })
        })

    // delete segment
    wheelEntries.querySelectorAll('.remove_button')
        .forEach((btn, index: number) => {
            btn.addEventListener('click', () => {
                wheelSegments.splice(index, 1)
                wheelSegmentCounter()
                setupWheel()
                wheelCreateSegments()
            })
        })

    // edit wheelEntries

    wheelEntries.querySelectorAll('input')!
        .forEach(item => {
            item.addEventListener('input', editArr, true)
        })
}

const wheelAddSegment = (): void => {
    const headInput = document.querySelector<HTMLInputElement>('#wheelMainInput')!
    const headAmount = document.querySelector<HTMLInputElement>('#wheelMainAmount')!
    const btn = document.querySelector<HTMLButtonElement>('#wheelAddSegment')!

    function addSegment() {
        if (headInput.value) {
            wheelSegments = [...wheelSegments, {
                id: uniqueId(),
                amount: parseInt(headAmount.value),
                text: headInput.value,
                hide: false
            }]
            headInput.value = ''
            headAmount.value = "1"

            headInput.focus()
            wheelSegmentCounter()
            wheelCreateSegments()
            setupWheel()
        }
    }

    function keyUpAdd(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            addSegment()
        }
    }

    btn.addEventListener('click', addSegment)
    headInput.addEventListener('keyup', keyUpAdd)
}

const wheelSegmentCounter = (): void => {
    let counter = document.querySelector<HTMLDivElement>('.side__entries_counter')!

    counter.innerHTML = wheelSegments.length.toString()

    if (wheelSegments.length) {
        counter.style.display = "block"
    } else {
        counter.style.display = "none"
    }

    wheelAddColors()
}

// =================result===============

const wheelResultCounter = (): void => {
    let resultsCounter = document.querySelector<HTMLDivElement>('.side__counter')!

    resultsCounter.innerHTML = wheelResults.length.toString()

    if (wheelResults.length) {
        resultsCounter.style.display = "block"
    } else {
        resultsCounter.style.display = "none"
    }
}

const addSelectResult = (result?: IResult): void => {
    console.log("win",result)
    const body = document.querySelector<HTMLElement>('.tab-results')!
    let check: boolean = true
    const resultHtml = (item: IResult): string => {
        if (item.inc) {
            return `<div class="side__item">
                            <div class="side__text">
                                ${item.text}
                                <span id="wheelResult_${item.id}" class="side__inc">
                                    + ${item.value}
                                </span>
                            </div>
                         </div>
        `
        }
        return `<div class="side__item">
                            <div class="side__text">
                                ${item.text}
                            </div>
                         </div>
        `
    }
    const resultUpdateHtml = (): void => {
        body.innerHTML = ''
        if (wheelResults.length) {
            wheelResults.map((item:IResult) => {
                body.innerHTML += resultHtml(item)
            })
        } else if (wheelResults.length === 0){
            console.log("пусто")
            body.innerHTML = 'Пусто'
        }

    }
    if (result) {
        if (wheelResults.length) {
            wheelResults.map(item => {
                if ((item.id === result?.id) && (item.inc && result.inc)) {
                    console.log("if ",item)
                    item.value++
                    check = false
                }
            })
            if (check) {
                console.log(check)
                wheelResults = [...wheelResults, result]
            }
        } else {
            wheelResults = [...wheelResults, result]
        }
    }
    wheelResultCounter()
    resultUpdateHtml()
}

//===============btnHandler===========

const wheelDisabledBtn = (btn: HTMLButtonElement): void => {
    btn.disabled ? btn.disabled = false : btn.disabled = true
}

// //=============modal==============

const modalOpen = (modal: HTMLElement): void => {
    if (modal) {
        const modalActive = document.querySelector<HTMLElement>('.wheel-modal_open')
        modalActive ? modalClose(modalActive) : null
        modal.classList.add('wheel-modal_open')
    }
}

const modalClose = (modal: HTMLElement): void => {
    let modalInputReadonly = document.querySelector<HTMLElement>('.wheel-modal__input-readonly')
    if (modalInputReadonly) {
        modalInputReadonly.remove()
    }
    modal.classList.remove('wheel-modal_open')
}

const wheelModal = (): void => {
    const modal = document.querySelector<HTMLDivElement>('#wheelModal')!
    const modalCloseButton = document.querySelectorAll<HTMLButtonElement>('.wheel-modal_close')!
    const modalAddBtn = document.querySelector<HTMLButtonElement>('.wheel-modal__button_add')!
    let modalInput = document.querySelector<HTMLElement>('.wheel-modal__input')!
    let modalInputEdit = document.querySelector<HTMLElement>('.wheel-modal__input-editable')!
    let modalInputReadonly = document.querySelector<HTMLElement>('.wheel-modal__input-readonly')
    let arr:ISegment[] = [...wheelSegments]

    modalOpen(modal)

    if (wheelSegments.length > 0) {
        if (modalInputReadonly === null) {
            const div = document.createElement('div')
            div.className = 'wheel-modal__input-readonly'
            div.innerHTML = ''
            wheelSegments.map(item => {
                div.innerHTML += wheelCreateHTML(item)
            })
            modalInput.insertBefore(div, modalInputEdit)
            const inputs = div.querySelectorAll<HTMLInputElement>('.wheel-modal__input_item')

            function newTextSegment(segment: ISegment, input: HTMLInputElement) {
                segment.text = input.value
                modalAddBtn.removeEventListener('click', newTextSegment.bind)
            }
            inputs.forEach(input => {
                arr.map(segment => {
                    if (segment.id === input.id) {
                        input.addEventListener('input', newTextSegment.bind(null ,segment, input))
                    }
                })

            })
        }
    }

    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => modalClose(modal))
        })
    }

    function wheelCreateHTML(item: any): string {
        return `
            <input class="wheel-modal__input_item" id="${item.id}" type="text" value="${item.text}"/> 
        `
    }

    function addElements() {
        let arr:ISegment[] = []
        modalInputEdit.childNodes.forEach(item => {
            if (item.textContent) {
                wheelSegments = [...wheelSegments, {
                    id: uniqueId(),
                    amount: 1,
                    text: item.textContent,
                    hide: false
                }]
            }
        })
        modalInputEdit.innerHTML = ""
        wheelCreateSegments()
        setupWheel()
        modalAddBtn.removeEventListener('click', addElements)
    }

    modalAddBtn.addEventListener('click', addElements)
}

const winModal = (win: ISegment, selected: number, winText: string): void => {
    const modal = document.querySelector<HTMLDivElement>('#wheelModalWin')!,
        modalCloseButton = document.querySelectorAll<HTMLButtonElement>('.wheel-modal_close')!,
        text = modal.querySelector<HTMLHeadElement>('.wheel-modal__title')!,
        btnAdd = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_ok')!,
        btnRemove = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_remove')!,
        btnHide = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_hide')!,
        btnInc = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_inc')!

    console.log(win.id, win.text)
    modalOpen(modal)

    text.innerHTML = winText

    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => {
                modalClose(modal)
            })
        })
    }

    function addHandler() {
        const result: IResult = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        }

        addSelectResult(result)
        removeListener()
    }

    function hideHandler() {
        const result: IResult = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        }
        addSelectResult(result)
        win.hide = true
        wheelCreateSegments()
        setupWheel()
        removeListener()
    }

    function removeHandler() {
        const result: IResult = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        }
        addSelectResult(result)
        wheelSegments = wheelSegments.filter(segment => !(segment === win))
        wheelCreateSegments()
        setupWheel()
        removeListener()
    }

    function incHandler() {
        const result: IResult = {
            id: win.id,
            text: winText,
            value: 1,
            inc: true
        }
        addSelectResult(result)
        removeListener()
    }

    function removeListener() {
        btnAdd.removeEventListener('click', addHandler)
        btnRemove.removeEventListener('click', removeHandler)
        btnHide.removeEventListener('click', hideHandler)
        btnInc.removeEventListener('click', incHandler)
    }

    btnAdd.addEventListener('click', addHandler)

    btnRemove.addEventListener('click', removeHandler)

    btnHide.addEventListener('click', hideHandler)

    btnInc.addEventListener('click', incHandler)
}

//=============wheel==============

const wheelCreateSegmentsNodes = (): void => {
    // на какое расстояние смещаем сектора друг относительно друга
    const segmentOffset = Math.floor(180 / segmentNotHide.length)
    wheelList.innerHTML = ''
    segmentNotHide.forEach((segment: ISegment, index: number) => {
        const rotation = ((segmentSlice * index) * -1) - segmentOffset
        if (!segment.hide) {
            wheelList.insertAdjacentHTML(
                "beforeend",
                `<li class="wheel__item" style="--rotate: ${rotation}deg">
                        <span>${segment.text}</span>
                     </li>
                    `
            )
        }
    })
}

const wheelAddColors = (): void => {
    if (wheelSegments.length && wheelSegments.length % 16 === 0) {
        colors.push(...colors)
    }
}
wheelAddColors()

const wheelCreateSegmentsColor = (): void => {
    // устанавливаем нужное значение стиля у элемента spinner
    wheelList.setAttribute(
        "style",
        `background: repeating-conic-gradient(
      from -90deg,
      ${
            colors.map((color, i) => {
                return `${color} 0 ${(100 / segmentNotHide.length) * (segmentNotHide.length - i)}%`
            } ).reverse()
        }
    );`
    );
}

const spinertia = (min: number, max: number): number => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const selectSegment = (): void => {
    let curSegment = rotation + 270
    curSegment > 360 ? curSegment %= 360 : null
    const selected = Math.floor(curSegment / segmentSlice)
    prizeNodes[selected].classList.add(selectedClass)
    winModal(
        notHide[selected],
        selected,
        prizeNodes[selected].textContent!.replace(/\s+/g, ' ').trim()
    )
}

const setupWheel = (): void => {
    notHide = wheelSegments.filter(segment => !segment.hide)
    if (!notHide.length) {
        segmentNotHide = plug.filter(segment => !segment.hide)
        segmentSlice = 360 / segmentNotHide.length;
    } else {
        segmentNotHide = wheelSegments.filter(segment => !segment.hide)
        segmentSlice = 360 / segmentNotHide.length;
    }
    wheelCreateSegmentsColor()
    wheelCreateSegmentsNodes()

    prizeNodes = wheel.querySelectorAll('.wheel__item')
}

// отслеживаем нажатие на кнопку

trigger.addEventListener('click', () => {
    // делаем её недоступной для нажатия
    wheelDisabledBtn(trigger)
    // задаём начальное вращение колеса
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000))
    // убираем прошлый приз
    prizeNodes.forEach(win => win.classList.remove(selectedClass))
    // добавляем колесу класс is-spinning, с помощью которого реализуем нужную отрисовку
    wheel.classList.add(spinClass)
    // через CSS говорим секторам, как им повернуться
    wheelList.style.setProperty("--rotate", rotation.toString())
})

// отслеживаем остановку колеса
wheelList.addEventListener('transitionend', () => {
    rotation %= 360

    selectSegment()

    wheel.classList.remove(spinClass)

    wheelList.style.setProperty("--rotate", rotation.toString())

    wheelDisabledBtn(trigger)
})

//=============start==============

wheelCreateSegments()
wheelTabs()
wheelHeadIcons()
wheelAddSegment()
setupWheel()




