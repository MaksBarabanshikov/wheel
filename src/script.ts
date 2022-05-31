//=============interface==============

interface ISegment {
    id: string,
    amount: number,
    text: string | number,
    color?: string
    hide: boolean
    copy: boolean
}

interface IResult {
    id: string
    text: string | number
    value: number
    inc: boolean
    date: number
}

//=============variables==============
const appWheel = (): void => {
    // localStorage или значение по умолчанию
    let wheelSegments: ISegment[]
    !localStorage.localWheelSegment ? wheelSegments = [] : wheelSegments = JSON.parse(localStorage.getItem('localWheelSegment')!)
    let wheelResults: IResult[]
    !localStorage.localWheelResult ? wheelResults = [] : wheelResults = JSON.parse(localStorage.getItem('localWheelResult')!)

    let IS_AMOUNT: boolean
    !localStorage.localWheelAmount ? IS_AMOUNT = false : IS_AMOUNT = JSON.parse(localStorage.getItem('localWheelAmount')!)

    //checkbox количества
    const wheelCheckboxAmount: HTMLInputElement = document.querySelector("#wheelCheckBox")!
    wheelCheckboxAmount.checked = IS_AMOUNT
    // цвет секций
    let colors: Array<string> = [
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
    // изначальный массив
    const curColors: Array<string> = [...colors]

    const hideAllBtn = document.querySelector('#wheelHideAll')!
    const resetIncAllBtn = document.querySelector('#wheelResetIncAll')!
    const wheelModalRemoveBtn = document.querySelector('#wheelRemoveBtn')!

    let wheelSegmentItems: NodeListOf<Element>

    let wheel = document.querySelector<HTMLElement>('.wheel')!
    let trigger = document.querySelector<HTMLButtonElement>('.wheel__play')!

    const wheelList = document.querySelector<HTMLElement>('.wheel__list')!

    const plug: ISegment[] = [
        {
            id: uniqueId(),
            text: "1",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "2",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "3",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "4",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "5",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "6",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "7",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "8",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "9",
            hide: false,
            amount: 1,
            copy: false
        },
        {
            id: uniqueId(),
            text: "10",
            hide: false,
            amount: 1,
            copy: false
        },
    ]
    let notHide: ISegment[] = []

// на сколько секторов нарезаем круг

    let segmentNotHide = wheelSegments.filter(segment => !segment.hide)
    let segmentSlice = 360 / segmentNotHide.length;
    let currentSlice = 0

// css классы для событий

    const spinClass = 'is-spinning'
    const selectedClass = 'selected'

// угол вращения

    let rotation = 0

// переменная для текстовых подписей

    let prizeNodes: NodeListOf<Element>

    let tickerMusic

    //музыка

    const buttonMusic = ():void => {
        let audio = document.querySelector<HTMLAudioElement>("#wheelMusicButton")!.play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error)
        })
    }

    const tickMusic = ():void => {
        let audio = document.querySelector<HTMLAudioElement>("#wheelMusicTick")!.play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error)
        })
    }
    const winMusic = ():void => {
        let audio = document.querySelector<HTMLAudioElement>("#wheelMusicWin")!.play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error)
        })
    }


    function uniqueId(): string {
        return Math.random().toString(16).slice(2)
    } // unique value for wheel segment

//=============localStorage=============
    const updateLocalSegment = (): void => {
        localStorage.setItem('localWheelSegment', JSON.stringify(wheelSegments))
    }

    const updateLocalResult = (): void => {
        localStorage.setItem('localWheelResult', JSON.stringify(wheelResults))
    }

    const updateLocalAmount = (): void => {
        localStorage.setItem('localWheelAmount', JSON.stringify(IS_AMOUNT))
    }

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
        const wheelList = document.querySelector<HTMLButtonElement>('#wheelList')!,
            wheelShuffle = document.querySelector<HTMLButtonElement>('#wheelShuffle')!,
            wheelSort = document.querySelector<HTMLButtonElement>('#wheelSort')!,
            wheelTrash = document.querySelector<HTMLButtonElement>('#wheelTrash')!,
            wheelSortResult = document.querySelector<HTMLButtonElement>('#wheelSortResult')!,
            wheelCurListResult = document.querySelector<HTMLButtonElement>('#wheelCurListResult')!,
            wheelTrashResult = document.querySelector<HTMLButtonElement>('#wheelTrashResult')!,
            wheelSortIncResult = document.querySelector<HTMLButtonElement>('#wheelSortIncResult')!,
            buttons = document.querySelectorAll<HTMLButtonElement>('.side__icons_btn')!

        const side = document.querySelector<HTMLButtonElement>('.side')!

        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                const curBtn = this.id
                buttons.forEach(button => {
                    curBtn !== button.id ? button.classList.remove('sorted') : null
                })
            })
        })

        wheelList.addEventListener('click', wheelModal)

        wheelShuffle.addEventListener('click', (): void => {
            wheelSegments.sort(() => Math.random() - 0.5)
            wheelCreateSegments()
            setupWheel()
        })

        wheelSort.addEventListener('click', (): void => {

            const sort = () => {
                let numbers = wheelSegments.filter((item: ISegment) => typeof item.text === "number")
                let strings = wheelSegments.filter((item: ISegment) => typeof item.text === "string")

                if (wheelSort.classList.contains('sorted')) {
                    numbers.sort((a: ISegment, b: ISegment) => <number>b.text - <number>a.text)
                    strings.sort((a: ISegment, b: ISegment) => <string>a.text > <string>b.text ? -1 : 1)
                    wheelSegments = numbers.concat(strings)
                    wheelSort.classList.remove('sorted')
                } else {
                    numbers.sort((a: ISegment, b: ISegment) => <number>a.text - <number>b.text)
                    strings.sort((a: ISegment, b: ISegment) => <string>a.text < <string>b.text ? -1 : 1)
                    wheelSegments = numbers.concat(strings)
                    wheelSort.classList.add('sorted')
                }
                wheelCreateSegments()
                setupWheel()
            }

            sort()
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

        wheelSortResult.addEventListener('click', (): void => {
            const sort = () => {
                let numbers = wheelResults.filter((item: IResult) => typeof item.text === "number")
                let strings = wheelResults.filter((item: IResult) => typeof item.text === "string")

                if (wheelSortResult.classList.contains('sorted')) {
                    numbers.sort((a: IResult, b: IResult) => <number>b.text - <number>a.text)
                    strings.sort((a: IResult, b: IResult) => <string>a.text > <string>b.text ? -1 : 1)
                    wheelResults = numbers.concat(strings)
                    wheelSortResult.classList.remove('sorted')
                } else {
                    numbers.sort((a: IResult, b: IResult) => <number>a.text - <number>b.text)
                    strings.sort((a: IResult, b: IResult) => <string>a.text < <string>b.text ? -1 : 1)
                    wheelResults = numbers.concat(strings)
                    wheelSortResult.classList.add('sorted')
                }
                addSelectResult()
            }
            sort()
        })

        wheelCurListResult.addEventListener('click', (): void => {
            wheelResults.sort((a: IResult, b: IResult) => a.date - b.date)
            addSelectResult()
        })

        wheelTrashResult.addEventListener('click', (): void => {
            wheelResults.length = 0
            addSelectResult()
        })

        wheelSortIncResult.addEventListener('click', (): void => {
            let isInc = wheelResults.filter(result => result.inc)
            let noInc = wheelResults.filter(result => !result.inc)
            if (wheelSortIncResult.classList.contains('sorted')) {
                isInc.sort((a: IResult, b: IResult) => a.value - b.value)
                wheelResults = isInc.concat(noInc)
                addSelectResult()
                wheelSortIncResult.classList.remove('sorted')
            } else {
                isInc.sort((a: IResult, b: IResult) => b.value - a.value)
                wheelResults = isInc.concat(noInc)
                addSelectResult()
                wheelSortIncResult.classList.add('sorted')
            }
        })
    }

    const wheelCreateSegments = (): void => {
        const wheelEntries = document.querySelector<HTMLElement>('#wheelEntries')!

        const wheelSegmentHtml = (item: any): string => {
            return `
            <div class="side__item ${item.hide ? 'side__item_hide' : ''}">
               <input name="${item.id}" type="text" class="side__number" value="${item.amount}"/>
               <input name="${item.id}" type="text" class="side__text" value="${item.text}"/>
               <div class="side__buttons">
               <button class="hide_button">
                    <i class="${!item.hide ? 'fas fa-eye fa-lg' : 'fas fa-eye-slash fa-lg'}"></i>      
               </button>
               <button class="remove_button">
                               <i class="fas fa-times fa-lg"></i>
               </button>

               </div>
            </div>
        `
        }

        // шаблон сегмента
        const wheelUpdateHtml = (): void => {
            wheelEntries.innerHTML = ''
            wheelSegments.map((item) => {
                if (!item.copy) {
                    wheelEntries.innerHTML += wheelSegmentHtml(item)
                }
            })
        }

        wheelUpdateHtml()

        wheelSegmentItems = wheelEntries.querySelectorAll('.side__item')!

        function editAmount(this: HTMLInputElement) {
            this.value = this.value.replace(/[^\d]/g, '')
            if (!(parseInt(this.value) >= 1 && parseInt(this.value) <= 50)) {
                parseInt(this.value) < 1 ? this.value = '1' : null
                parseInt(this.value) > 50 ? this.value = '50' : null
            }
            const segmentAmount = parseInt(this.value)

            if (segmentAmount && segmentAmount > 0 && segmentAmount < 51) {
                wheelSegments.find(segment => segment.id === this.name && !segment.copy)!.amount = parseInt(this.value)
                wheelSegmentCounter()
                setupWheel()
            }
        }

        function editText(this: HTMLInputElement) {
            wheelSegments
                .filter(segment => segment.id === this.name)
                .map(segment => segment.text = this.value)
            setupWheel()
        }

        // hide segment

        wheelEntries.querySelectorAll('.hide_button')
            .forEach((btn, index: number) => {
                btn.addEventListener('click', (event: Event) => {
                    // change icon
                    const target = event.currentTarget as Element
                    const children = target.children[0]
                    !children.classList.contains('fa-eye-slash') ?
                        children.className = 'fas fa-eye-slash fa-lg' :
                        children.className = 'fas fa-eye fa-lg'
                    const id = wheelSegments[index].id
                    //hide segment
                    if (IS_AMOUNT) {
                        wheelSegments.map(segment => segment.id === id ? segment.hide = !segment.hide : null)
                    } else {
                        wheelSegments.map(segment => segment.id === id && !segment.copy ? segment.hide = !segment.hide : null)
                    }
                    wheelSegmentCounter()
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
                    const id = wheelSegments[index].id
                    wheelSegments = wheelSegments.filter(segment => segment.id !== id)

                    wheelSegmentCounter()
                    setupWheel()
                    wheelCreateSegments()
                })
            })

        // edit wheelEntries

        wheelEntries.querySelectorAll('.side__number')!
            .forEach(item => {
                item.addEventListener('input', editAmount)
            })

        wheelEntries.querySelectorAll('.side__text')!
            .forEach(item => {
                item.addEventListener('input', editText)
            })
    }

    const wheelAddSegment = (): void => {
        const headInput = document.querySelector<HTMLInputElement>('#wheelMainInput')!
        const headAmount = document.querySelector<HTMLInputElement>('#wheelMainAmount')!
        const btn = document.querySelector<HTMLButtonElement>('#wheelAddSegment')!

        function addSegment() {
            if (headInput.value) {
                let headInputValue: string | number = headInput.value
                const headAmountValue: number = parseInt(headAmount.value)
                if (Number(headInputValue)) {
                    headInputValue = Number(headInputValue)
                }
                if (headAmountValue < 51 && headAmountValue > 0) {
                    wheelSegments = [...wheelSegments, {
                        id: uniqueId(),
                        amount: headAmountValue,
                        text: headInputValue,
                        hide: false,
                        copy: false
                    }]
                    headInput.value = ''
                    headAmount.value = "1"

                    headInput.focus()
                    wheelCheckAmount()
                    wheelSegmentCounter()
                    wheelCreateSegments()
                    setupWheel()
                }
            }
        }

        function keyUpAdd(event: KeyboardEvent) {
            if (event.key === 'Enter') {
                addSegment()
            }
        }

        btn.addEventListener('click', addSegment)
        headInput.addEventListener('keyup', keyUpAdd)
        headAmount.addEventListener('input', function (this: HTMLInputElement) {
            this.value = this.value.replace(/[^\d]/g, '')
            if (!(parseInt(this.value) >= 1 && parseInt(this.value) <= 50)) {
                parseInt(this.value) < 1 ? this.value = '1' : null
                parseInt(this.value) > 50 ? this.value = '50' : null
            }
        })
    }

    const wheelSegmentCounter = (): void => {
        wheelCheckAmount()
        const wheelShuffle = document.querySelector<HTMLButtonElement>('#wheelShuffle')!,
            wheelSort = document.querySelector<HTMLButtonElement>('#wheelSort')!,
            wheelTrash = document.querySelector<HTMLButtonElement>('#wheelTrash')!

        const lockBtn = (): void => {
            wheelShuffle.disabled = true
            wheelSort.disabled = true
        }
        const unlockBtn = (): void => {
            wheelShuffle.disabled = false
            wheelSort.disabled = false
        }

        const btnLockFn = (): void => {
            if (wheelSegments.length > 1) {
                unlockBtn()
            } else {
                lockBtn()
            }
        }
        let counterSegment
        let counter = document.querySelector<HTMLDivElement>('.side__entries_counter')!

        if (IS_AMOUNT) {
            counterSegment = wheelSegments.filter(segment => !segment.hide)
        } else {
            counterSegment = wheelSegments.filter(segment => !segment.hide && !segment.copy)
        }

        counter.innerHTML = counterSegment.length.toString()
        if (counterSegment.length) {
            counter.style.display = "flex"
            wheelTrash.disabled = false
        } else {
            counter.style.display = "none"
            wheelTrash.disabled = true
        }

        btnLockFn()

        wheelAddColors()
        wheelCheckCountSegments()
    }

    const wheelCheckCountSegments = (): void => {
        const xl = "wheel__list_xl"
        const lg = "wheel__list_lg"
        const md = "wheel__list_md"
        const sm = "wheel__list_sm"
        const xs = "wheel__list_xs"
        const length: number = wheelSegments.length
        if (length > 0) {
            if (length <= 12) {
                wheelList.className = `wheel__list ${xl}`
            }
            if (length > 12) {
                wheelList.className = `wheel__list ${lg}`
            }
            if (length > 24) {
                wheelList.className = `wheel__list ${md}`
            }
            if (length > 32) {
                wheelList.className = `wheel__list ${sm}`
            }
            if (length > 40) {
                wheelList.className = `wheel__list ${xs}`
            }
        } else {
            wheelList.className = `wheel__list ${xl}`
        }
    }

    const wheelCheckAmount = (): void => {
        let arr: ISegment[] = wheelSegments.filter(segment => !segment.copy)

        arr.filter(segment => (segment.amount > 1 && !segment.copy))
        arr.map(segment => {
            let amount: number = segment.amount
            while (amount !== 1) {
                arr.push({...segment, copy: true, amount: 1})
                --amount
            }
        })
        wheelSegments = arr
    }

    const setupSide = (isAmounts: boolean) => {
        const side = document.querySelector<HTMLDivElement>(".side")!
        if (isAmounts) {
            side.classList.remove("side_amount-off")
            wheelSegments.filter(segment => !segment.copy)
        } else {
            side.classList.add("side_amount-off")
        }
        setupWheel()
        addSelectResult()
        wheelSegmentCounter()
    }

// =================result===============

    const wheelResultCounter = (): void => {
        let resultsCounter = document.querySelector<HTMLDivElement>('.side__counter')!
        const wheelSortResult = document.querySelector<HTMLButtonElement>('#wheelSortResult')!,
            wheelCurListResult = document.querySelector<HTMLButtonElement>('#wheelCurListResult')!,
            wheelTrashResult = document.querySelector<HTMLButtonElement>('#wheelTrashResult')!,
            wheelSortIncResult = document.querySelector<HTMLButtonElement>('#wheelSortIncResult')!
        if (wheelResults.length) {
            resultsCounter.style.display = "flex"
            resultsCounter.innerHTML = wheelResults.length.toString()
            wheelTrashResult.disabled = false
        } else {
            resultsCounter.style.display = "none"
            wheelTrashResult.disabled = true
        }

        if (wheelResults.length >= 2) {
            wheelSortResult.disabled = false
            wheelCurListResult.disabled = false
            wheelSortIncResult.disabled = false
        } else {
            wheelSortResult.disabled = true
            wheelCurListResult.disabled = true
            wheelSortIncResult.disabled = true
        }
        updateLocalResult()
    }

    const addSelectResult = (result?: IResult): void => {
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
                wheelResults.map((item: IResult) => {
                    body.innerHTML += resultHtml(item)
                })
            } else if (wheelResults.length === 0) {
                body.innerHTML = 'Пусто'
            }

        }
        if (result) {
            if (wheelResults.length) {
                wheelResults.map(item => {
                    if ((item.id === result?.id) && (item.inc && result.inc)) {
                        item.value++
                        check = false
                    }
                })
                if (check) {
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
        let modalInputEdit = document.querySelector<HTMLInputElement>('.wheel-modal__input-editable')!

        modalInputEdit.value = ''

        modalOpen(modal)
        const wheelCreateHTML = (item: any) => {
            return `${item}\n`
        }

        if (wheelSegments.length > 0) {
            wheelSegments.map(item => {
                if (!item.copy) {
                    const str = String(item.text)
                    modalInputEdit.value += wheelCreateHTML(str)
                }
            })
        }

        if (modalCloseButton.length > 0) {
            modalCloseButton.forEach(btn => {
                btn.addEventListener('click', () => modalClose(modal))
            })
        }

        const addSegment = (): void => {
            let segments = modalInputEdit.value.split('\n').filter(segment => segment !== '')
            wheelSegments.length = 0
            segments.map(segment => {
                if (parseInt(segment)) {
                    const number: number = parseInt(segment)
                    wheelSegments = [...wheelSegments, {
                        id: uniqueId(),
                        amount: 1,
                        text: number,
                        hide: false,
                        copy: false
                    }]
                } else {
                    const string: string = segment
                    wheelSegments = [...wheelSegments, {
                        id: uniqueId(),
                        amount: 1,
                        text: string,
                        hide: false,
                        copy: false
                    }]
                }
            })
            wheelSegmentCounter()
            wheelCreateSegments()
            setupWheel()
            modalAddBtn.removeEventListener('click', addSegment)
        }

        modalAddBtn.addEventListener('click', addSegment)
    }

    const winModal = (win: ISegment, selected: number, winText: string | number): void => {
        const modal = document.querySelector<HTMLDivElement>('#wheelModalWin')!,
            modalCloseButton = document.querySelectorAll<HTMLButtonElement>('.wheel-modal_close')!,
            text = modal.querySelector<HTMLHeadElement>('.wheel-modal__title')!,
            btnAdd = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_ok')!,
            btnRemove = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_remove')!,
            btnHide = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_hide')!,
            btnInc = modal.querySelector<HTMLButtonElement>('.wheel-modal__button_inc')!

        winMusic()

        modalOpen(modal)

        text.innerHTML = String(winText)

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
                inc: false,
                date: Date.now()
            }

            addSelectResult(result)
            removeListener()
        }

        function hideHandler() {
            const result: IResult = {
                id: win.id,
                text: winText,
                value: 1,
                inc: false,
                date: Date.now()
            }
            addSelectResult(result)
            wheelSegments.filter(segment => segment.id === win.id).map(segment => segment.hide = true)
            wheelCreateSegments()
            wheelSegmentCounter()
            setupWheel()
            removeListener()
        }

        function removeHandler() {
            const result: IResult = {
                id: win.id,
                text: winText,
                value: 1,
                inc: false,
                date: Date.now()
            }
            addSelectResult(result)
            wheelSegments = wheelSegments.filter(segment => !(segment.id === win.id))
            wheelCreateSegments()
            wheelSegmentCounter()
            setupWheel()
            removeListener()
        }

        function incHandler() {
            const result: IResult = {
                id: win.id,
                text: winText,
                value: 1,
                inc: true,
                date: Date.now()
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
                        <span class="wheel__item_text">${segment.text}</span>
                     </li>
                    `
                )
            }
        })
    }

    const wheelAddColors = (): void => {
        if (wheelSegments.length) {
            if (wheelSegments.length > colors.length) {
                let length = wheelSegments.length
                while (length >= colors.length) {
                    colors.push(...curColors)
                    --length
                }
            } else if (wheelSegments.length <= 16) {
                colors = [...curColors]
            }
        }
    }

    const wheelCreateSegmentsColor = (): void => {
        // устанавливаем нужное значение стиля у элемента spinner
        wheelList.setAttribute(
            "style",
            `background: repeating-conic-gradient(
      from -90deg,
      ${
                colors.map((color, i) => {
                    return `${color} 0 ${(100 / segmentNotHide.length) * (segmentNotHide.length - i)}%`
                }).reverse()
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
        let curSegment: number = rotation + 270
        curSegment > 360 ? curSegment %= 360 : null
        const selected: number = Math.floor(curSegment / segmentSlice)
        let text: any = prizeNodes[selected].textContent!.replace(/\s+/g, ' ').trim()

        if (parseInt(text)) {
            text = parseInt(text)
        }
        prizeNodes[selected].classList.add(selectedClass)
        if (!notHide.length) {
            winModal(
                plug[selected],
                selected,
                text
            )
        } else {
            winModal(
                notHide[selected],
                selected,
                text
            )
        }

    }

    const setupWheel = (): void => {
        notHide = wheelSegments.filter(segment => !segment.hide)
        if (!notHide.length) {
            segmentNotHide = plug.filter(segment => !segment.hide)
            segmentSlice = 360 / segmentNotHide.length;
        } else {
            if (!IS_AMOUNT) {
                segmentNotHide = wheelSegments.filter(segment => !segment.hide && !segment.copy)
                segmentSlice = 360 / segmentNotHide.length;
            } else {
                segmentNotHide = wheelSegments.filter(segment => !segment.hide)
                segmentSlice = 360 / segmentNotHide.length;
            }
        }

        wheelAddColors()
        wheelCreateSegmentsColor()
        wheelCreateSegmentsNodes()
        updateLocalSegment()

        prizeNodes = wheel.querySelectorAll('.wheel__item')
    }

    const runTickerMusic = () => {
        const wheelListStyles = window.getComputedStyle(wheelList)
        const values = wheelListStyles.transform.split("(")[1].split(")")[0].split(",");
        const a = values[0];
        const b = values[1];
        let prizeSlice
        let rad = Math.atan2(Number(b), Number(a))
        rad < 0? rad += (1.5 * Math.PI): null
        if (notHide.length) {
            prizeSlice = 360 / notHide.length
        } else {
            prizeSlice = 360 / plug.length
        }

        const angle = Math.floor(rad * (180 / Math.PI))

        const slice = Math.floor(angle / prizeSlice)

        if (currentSlice !== slice) {

            tickMusic()

            currentSlice = slice;
        }

        console.log(slice)

        tickerMusic = requestAnimationFrame(runTickerMusic);
    }

// отслеживаем нажатие на кнопку

    trigger.addEventListener('click', () => {
        const side = document.querySelector('.side')!
        const inputs = side.querySelectorAll<HTMLInputElement>('input')!
        const buttons = side.querySelectorAll<HTMLButtonElement>('button')!

        buttonMusic()

        inputs.forEach(input => {
            input.readOnly = true
        })

        buttons.forEach(btn => {
            btn.disabled = true
        })
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

        runTickerMusic()
    })

// отслеживаем остановку колеса
    wheelList.addEventListener('transitionend', () => {
        const side = document.querySelector('.side')!
        const inputs = side.querySelectorAll<HTMLInputElement>('input')!
        const buttons = side.querySelectorAll<HTMLButtonElement>('button')!

        rotation %= 360

        selectSegment()

        wheel.classList.remove(spinClass)

        wheelList.style.setProperty("--rotate", rotation.toString())

        wheelDisabledBtn(trigger)

        inputs.forEach(input => {
            input.readOnly = false
        })

        buttons.forEach(btn => {
            btn.disabled = false
        })
    })

// отслеживаем нажатие на чекбокс
    wheelCheckboxAmount.addEventListener('click', () => {
        IS_AMOUNT = !IS_AMOUNT
        setupSide(IS_AMOUNT)
        updateLocalAmount()
    })

    hideAllBtn.addEventListener('click', () => {
        if (hideAllBtn.classList.contains('hidden')) {
            hideAllBtn.children[0].className = 'fas fa-eye-slash fa-lg'
            hideAllBtn.classList.remove("hidden")
            wheelSegments.map(item => item.hide = false)
        } else {
            hideAllBtn.children[0].className = 'fas fa-eye fa-lg'
            hideAllBtn.classList.add("hidden")
            wheelSegments.map(item => item.hide = true)
        }

        wheelCheckAmount()
        wheelSegmentCounter()
        wheelCreateSegments()
        setupWheel()
    })

    resetIncAllBtn.addEventListener('click', () => {
        wheelResults.filter(result => result.inc).map(result => result.value = 1)
        addSelectResult()
    })

    wheelModalRemoveBtn.addEventListener('click', () => {
        const modal = document.querySelector('#wheelModalWin')!
        const icon = wheelModalRemoveBtn.children[0]
        if (modal.classList.contains('wheel-modal_remove-active')) {
            icon.className = 'fas fa-minus-circle'
            modal.classList.remove('wheel-modal_remove-active')
        } else {
            icon.className = 'fas fa-plus-circle'
            modal.classList.add('wheel-modal_remove-active')
        }
    })

//=============start==============
    setupSide(IS_AMOUNT)
    wheelCreateSegments()
    wheelTabs()
    wheelHeadIcons()
    wheelAddSegment()
}

appWheel()


