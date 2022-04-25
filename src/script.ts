interface ISegment {
    id?: number,
    amount: number,
    text: string,
    color?: string
    hide: boolean
}

let wheelSegments: ISegment[] = [
    {
        id: 1,
        amount: 1,
        text: "1",
        color: 'red',
        hide: true
    },
    {
        id: 2,
        amount: 1,
        text: "2",
        color: 'red',
        hide: false
    },
    {
        id: 3,
        amount: 1,
        text: "3",
        color: 'red',
        hide: false
    },
    {
        id: 4,
        amount: 1,
        text: "4",
        color: 'red',
        hide: false
    },
    {
        id: 5,
        amount: 1,
        text: "5",
        color: 'red',
        hide: false
    },
]

let wheelSegmentItems: NodeListOf<Element>

const wheelTabs = (): void => {
    const tabs = document.querySelectorAll<HTMLAnchorElement>('.side__tab')!,
        tabsBody = document.querySelectorAll<HTMLDivElement>('.side__body')

    tabs.forEach((el: HTMLAnchorElement) => {
        el.addEventListener('click', selectTab)
    })

    function selectTab(this: HTMLAnchorElement, event: MouseEvent): void {
        const side = document.querySelector<HTMLDivElement>('.side')!

        event.preventDefault()
        tabs.forEach(item => {
            item.classList.remove('side__tab_active')
        })
        this.classList.add('side__tab_active')
        selectTabBody(this.dataset.tabName!)

        this.dataset.tabName === 'tab-results' ?
            side.classList.add('side_result') :
            side.classList.remove('side_result')
    }

    function selectTabBody(tabName: string): void {
        tabsBody.forEach(item => {
            item.classList.contains(tabName) ?
                item.classList.add('side__body_active') :
                item.classList.remove('side__body_active')
        })
    }
}

const wheelCreateSegments = (): void => {
    console.log('true')
    const wheelEntries = document.querySelector<HTMLElement>('#wheelEntries')!

    const wheelSegmentHtml = (item: any, index: number): string => {
        return `
            <div class="side__item ${item.hide ? 'side__item_hide' : ''}">
               <input name="${index}" type="text" class="side__number" value="${item.amount}"/>
               <input name="${index}" type="text" class="side__text" value="${item.text}"/>
               <div class="side__buttons">
                <i class="${!item.hide? 'fas fa-eye fa-lg hide_button': 'fas fa-eye-slash fa-lg hide_button'}"></i>
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
        console.log(wheelSegments)
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
                wheelCreateSegments()
                console.log(wheelSegments)
            })
        })

    // edit wheelEntries

    wheelEntries.querySelectorAll('input')!
        .forEach(item => {
            item.addEventListener('change', editArr, true)
        })
}

const wheelAddSegment = (): void => {
    const headInput = document.querySelector<HTMLInputElement>('#wheelMainInput')!
    const headAmount = document.querySelector<HTMLInputElement>('#wheelMainAmount')!
    const btn = document.querySelector<HTMLButtonElement>('#wheelAddSegment')!

    btn.addEventListener('click', () => {
        wheelSegments = [...wheelSegments, {
            amount: parseInt(headAmount.value),
            text: headInput.value,
            hide: false
        }]

        wheelCreateSegments()
    })
}

wheelCreateSegments()
wheelTabs()
wheelAddSegment()


