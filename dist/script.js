"use strict";
let wheelSegments = [
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
];
let wheelSegmentItems;
const wheelTabs = () => {
    const tabs = document.querySelectorAll('.side__tab'), tabsBody = document.querySelectorAll('.side__body');
    tabs.forEach((el) => {
        el.addEventListener('click', selectTab);
    });
    function selectTab(event) {
        const side = document.querySelector('.side');
        event.preventDefault();
        tabs.forEach(item => {
            item.classList.remove('side__tab_active');
        });
        this.classList.add('side__tab_active');
        selectTabBody(this.dataset.tabName);
        this.dataset.tabName === 'tab-results' ?
            side.classList.add('side_result') :
            side.classList.remove('side_result');
    }
    function selectTabBody(tabName) {
        tabsBody.forEach(item => {
            item.classList.contains(tabName) ?
                item.classList.add('side__body_active') :
                item.classList.remove('side__body_active');
        });
    }
};
const wheelCreateSegments = () => {
    console.log('true');
    const wheelEntries = document.querySelector('#wheelEntries');
    const wheelSegmentHtml = (item, index) => {
        return `
            <div class="side__item ${item.hide ? 'side__item_hide' : ''}">
               <input name="${index}" type="text" class="side__number" value="${item.amount}"/>
               <input name="${index}" type="text" class="side__text" value="${item.text}"/>
               <div class="side__buttons">
                <i class="${!item.hide ? 'fas fa-eye fa-lg hide_button' : 'fas fa-eye-slash fa-lg hide_button'}"></i>
                <i class="fas fa-times fa-lg remove_button"></i>
               </div>
            </div>
        `;
    };
    const wheelUpdateHtml = () => {
        wheelEntries.innerHTML = '';
        wheelSegments.map((item, index) => {
            wheelEntries.innerHTML += wheelSegmentHtml(item, index);
        });
    };
    wheelUpdateHtml();
    wheelSegmentItems = wheelEntries.querySelectorAll('.side__item');
    function editArr() {
        this.className === 'side__number' ?
            wheelSegments[this.name].amount = parseInt(this.value) :
            wheelSegments[this.name].text = this.value;
        console.log(wheelSegments);
    }
    wheelEntries.querySelectorAll('.hide_button')
        .forEach((btn, index) => {
        btn.addEventListener('click', (event) => {
            const target = event.target;
            !target.classList.contains('fa-eye-slash') ?
                target.className = 'fas fa-eye-slash fa-lg hide_button' :
                target.className = 'fas fa-eye fa-lg hide_button';
            wheelSegments[index].hide = !wheelSegments[index].hide;
            wheelSegments[index].hide ?
                wheelSegmentItems[index].classList.add('side__item_hide') :
                wheelSegmentItems[index].classList.remove('side__item_hide');
        });
    });
    wheelEntries.querySelectorAll('.remove_button')
        .forEach((btn, index) => {
        btn.addEventListener('click', () => {
            wheelSegments.splice(index, 1);
            wheelCreateSegments();
            console.log(wheelSegments);
        });
    });
    wheelEntries.querySelectorAll('input')
        .forEach(item => {
        item.addEventListener('change', editArr, true);
    });
};
const wheelAddSegment = () => {
    const headInput = document.querySelector('#wheelMainInput');
    const headAmount = document.querySelector('#wheelMainAmount');
    const btn = document.querySelector('#wheelAddSegment');
    btn.addEventListener('click', () => {
        wheelSegments = [...wheelSegments, {
                amount: parseInt(headAmount.value),
                text: headInput.value,
                hide: false
            }];
        wheelCreateSegments();
    });
};
wheelCreateSegments();
wheelTabs();
wheelAddSegment();
//# sourceMappingURL=script.js.map