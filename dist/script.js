"use strict";
let wheelSegments = [];
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
const wheelHeadIcons = () => {
    const wheelList = document.querySelector('#wheelList'), wheelShuffle = document.querySelector('#wheelShuffle'), wheelSort = document.querySelector('#wheelSort'), wheelTrash = document.querySelector('#wheelTrash');
    wheelShuffle.addEventListener('click', () => {
        wheelSegments.sort(() => Math.random() - 0.5);
        wheelCreateSegments();
    });
    wheelSort.addEventListener('click', (event) => {
        const target = event.target;
        if (target.classList.contains('sorted')) {
            wheelSegments.sort((a, b) => a.text > b.text ? -1 : 1);
            target.classList.remove('sorted');
        }
        else {
            wheelSegments.sort((a, b) => a.text > b.text ? 1 : -1);
            target.classList.add('sorted');
        }
        wheelCreateSegments();
    });
    wheelTrash.addEventListener('click', () => {
        wheelSegments.length = 0;
        wheelCreateSegments();
        console.log(wheelSegments);
    });
};
const wheelCreateSegments = () => {
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
        headInput.value = '';
        headAmount.value = "1";
        headInput.focus();
        wheelCreateSegments();
    });
};
wheelCreateSegments();
wheelTabs();
wheelHeadIcons();
wheelAddSegment();
//# sourceMappingURL=script.js.map