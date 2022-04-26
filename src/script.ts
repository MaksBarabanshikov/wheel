interface ISegment {
    id?: number,
    amount: number,
    text: string,
    color?: string
    hide: boolean
}

let wheelSegments: ISegment[] = []

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

const wheelHeadIcons = (): void => {
    const wheelList = document.querySelector<HTMLElement>('#wheelList')!,
        wheelShuffle = document.querySelector<HTMLElement>('#wheelShuffle')!,
        wheelSort = document.querySelector<HTMLElement>('#wheelSort')!,
        wheelTrash = document.querySelector<HTMLElement>('#wheelTrash')!

    wheelShuffle.addEventListener('click',(): void => {
        wheelSegments.sort(() => Math.random() - 0.5)
        wheelCreateSegments()
    })

    wheelSort.addEventListener('click', (event: Event ): void => {
        const target = event.target as Element

        if (target.classList.contains('sorted')) {
            wheelSegments.sort((a: ISegment, b:ISegment) => a.text > b.text? -1 : 1)
            target.classList.remove('sorted')
        } else {
            wheelSegments.sort((a: ISegment, b:ISegment) => a.text > b.text? 1 : -1)
            target.classList.add('sorted')
        }


        wheelCreateSegments()
    })

    wheelTrash.addEventListener('click', () => {
        wheelSegments.length = 0
        wheelCreateSegments()
        console.log(wheelSegments)
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
        headInput.value = ''
        headAmount.value = "1"

        headInput.focus()
        wheelCreateSegments()
    })
}

wheelCreateSegments()
wheelTabs()
wheelHeadIcons()
wheelAddSegment()


