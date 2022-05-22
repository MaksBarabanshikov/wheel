"use strict";
let wheelSegments = [];
let wheelResults = [];
const colors = [
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
];
let wheelSegmentItems;
let wheel = document.querySelector('.wheel');
let trigger = document.querySelector('.wheel__play');
const wheelList = document.querySelector('.wheel__list');
const plug = [
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
];
let notHide = [];
let segmentNotHide = wheelSegments.filter(segment => !segment.hide);
let segmentSlice = 360 / segmentNotHide.length;
const spinClass = 'is-spinning';
const selectedClass = 'selected';
let rotation = 0;
let prizeNodes;
function uniqueId() {
    return Math.random().toString(16).slice(2);
}
const wheelTabs = () => {
    const tabs = document.querySelectorAll('.side__tab'), tabsBody = document.querySelectorAll('.side__body');
    tabs.forEach((el) => {
        el.addEventListener('click', selectTab);
    });
    wheelResultCounter();
    function selectTab(event) {
        const side = document.querySelector('.side');
        event.preventDefault();
        tabs.forEach(item => {
            item.classList.remove('side__tab_active');
        });
        this.classList.add('side__tab_active');
        selectTabBody(this.dataset.tabName);
        if (this.dataset.tabName === 'tab-results') {
            side.classList.add('side_result');
        }
        else {
            side.classList.remove('side_result');
        }
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
    const side = document.querySelector('.side');
    wheelList.addEventListener('click', wheelModal);
    wheelShuffle.addEventListener('click', () => {
        wheelSegments.sort(() => Math.random() - 0.5);
        wheelCreateSegments();
        setupWheel();
    });
    wheelSort.addEventListener('click', (event) => {
        const target = event.target;
        const selectedTabResult = side.classList.contains('side_result');
        function sort(elem) {
            if (target.classList.contains('sorted')) {
                elem.sort((a, b) => a.text > b.text ? -1 : 1);
                target.classList.remove('sorted');
            }
            else {
                elem.sort((a, b) => a.text > b.text ? 1 : -1);
                target.classList.add('sorted');
            }
        }
        if (selectedTabResult) {
            sort(wheelResults);
        }
        else {
            sort(wheelSegments);
            wheelCreateSegments();
            setupWheel();
        }
    });
    wheelTrash.addEventListener('click', () => {
        const selectedTabResult = side.classList.contains('side_result');
        function clearList(elem) {
            elem.length = 0;
        }
        if (selectedTabResult) {
            const bodyResults = document.querySelector('.tab-results');
            clearList(wheelResults);
            bodyResults.innerHTML = 'Пусто';
            wheelResultCounter();
        }
        else {
            clearList(wheelSegments);
            wheelSegmentCounter();
            wheelCreateSegments();
            setupWheel();
        }
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
        setupWheel();
    }
    wheelEntries.querySelectorAll('.hide_button')
        .forEach((btn, index) => {
        btn.addEventListener('click', (event) => {
            const target = event.target;
            !target.classList.contains('fa-eye-slash') ?
                target.className = 'fas fa-eye-slash fa-lg hide_button' :
                target.className = 'fas fa-eye fa-lg hide_button';
            wheelSegments[index].hide = !wheelSegments[index].hide;
            setupWheel();
            wheelSegments[index].hide ?
                wheelSegmentItems[index].classList.add('side__item_hide') :
                wheelSegmentItems[index].classList.remove('side__item_hide');
        });
    });
    wheelEntries.querySelectorAll('.remove_button')
        .forEach((btn, index) => {
        btn.addEventListener('click', () => {
            wheelSegments.splice(index, 1);
            wheelSegmentCounter();
            setupWheel();
            wheelCreateSegments();
        });
    });
    wheelEntries.querySelectorAll('input')
        .forEach(item => {
        item.addEventListener('input', editArr, true);
    });
};
const wheelAddSegment = () => {
    const headInput = document.querySelector('#wheelMainInput');
    const headAmount = document.querySelector('#wheelMainAmount');
    const btn = document.querySelector('#wheelAddSegment');
    function addSegment() {
        if (headInput.value) {
            wheelSegments = [...wheelSegments, {
                    id: uniqueId(),
                    amount: parseInt(headAmount.value),
                    text: headInput.value,
                    hide: false
                }];
            headInput.value = '';
            headAmount.value = "1";
            headInput.focus();
            wheelSegmentCounter();
            wheelCreateSegments();
            setupWheel();
        }
    }
    function keyUpAdd(event) {
        if (event.key === 'Enter') {
            addSegment();
        }
    }
    btn.addEventListener('click', addSegment);
    headInput.addEventListener('keyup', keyUpAdd);
};
const wheelSegmentCounter = () => {
    let counter = document.querySelector('.side__entries_counter');
    counter.innerHTML = wheelSegments.length.toString();
    if (wheelSegments.length) {
        counter.style.display = "block";
    }
    else {
        counter.style.display = "none";
    }
};
const wheelResultCounter = () => {
    let resultsCounter = document.querySelector('.side__counter');
    resultsCounter.innerHTML = wheelResults.length.toString();
    if (wheelResults.length) {
        resultsCounter.style.display = "block";
    }
    else {
        resultsCounter.style.display = "none";
    }
};
const addSelectResult = (result) => {
    console.log("win", result);
    const body = document.querySelector('.tab-results');
    let check = true;
    const resultHtml = (item) => {
        if (item.inc) {
            return `<div class="side__item">
                            <div class="side__text">
                                ${item.text}
                                <span id="wheelResult_${item.id}" class="side__inc">
                                    + ${item.value}
                                </span>
                            </div>
                         </div>
        `;
        }
        return `<div class="side__item">
                            <div class="side__text">
                                ${item.text}
                            </div>
                         </div>
        `;
    };
    const resultUpdateHtml = () => {
        body.innerHTML = '';
        if (wheelResults.length) {
            wheelResults.map((item) => {
                body.innerHTML += resultHtml(item);
            });
        }
        else if (wheelResults.length === 0) {
            console.log("пусто");
            body.innerHTML = 'Пусто';
        }
    };
    if (result) {
        if (wheelResults.length) {
            wheelResults.map(item => {
                if ((item.id === (result === null || result === void 0 ? void 0 : result.id)) && (item.inc && result.inc)) {
                    console.log("if ", item);
                    item.value++;
                    check = false;
                }
            });
            if (check) {
                console.log(check);
                wheelResults = [...wheelResults, result];
            }
        }
        else {
            wheelResults = [...wheelResults, result];
        }
    }
    wheelResultCounter();
    resultUpdateHtml();
};
const wheelDisabledBtn = (btn) => {
    btn.disabled ? btn.disabled = false : btn.disabled = true;
};
const modalOpen = (modal) => {
    if (modal) {
        const modalActive = document.querySelector('.wheel-modal_open');
        modalActive ? modalClose(modalActive) : null;
        modal.classList.add('wheel-modal_open');
    }
};
const modalClose = (modal) => {
    let modalInputReadonly = document.querySelector('.wheel-modal__input-readonly');
    if (modalInputReadonly) {
        modalInputReadonly.remove();
    }
    modal.classList.remove('wheel-modal_open');
};
const wheelModal = () => {
    const modal = document.querySelector('#wheelModal');
    const modalCloseButton = document.querySelectorAll('.wheel-modal_close');
    const modalAddBtn = document.querySelector('.wheel-modal__button_add');
    let modalInput = document.querySelector('.wheel-modal__input');
    let modalInputEdit = document.querySelector('.wheel-modal__input-editable');
    let modalInputReadonly = document.querySelector('.wheel-modal__input-readonly');
    let arr = [...wheelSegments];
    modalOpen(modal);
    if (wheelSegments.length > 0) {
        if (modalInputReadonly === null) {
            const div = document.createElement('div');
            div.className = 'wheel-modal__input-readonly';
            div.innerHTML = '';
            wheelSegments.map(item => {
                div.innerHTML += wheelCreateHTML(item);
            });
            modalInput.insertBefore(div, modalInputEdit);
            const inputs = div.querySelectorAll('.wheel-modal__input_item');
            function newTextSegment(segment, input) {
                segment.text = input.value;
                modalAddBtn.removeEventListener('click', newTextSegment.bind);
            }
            inputs.forEach(input => {
                arr.map(segment => {
                    if (segment.id === input.id) {
                        input.addEventListener('input', newTextSegment.bind(null, segment, input));
                    }
                });
            });
        }
    }
    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => modalClose(modal));
        });
    }
    function wheelCreateHTML(item) {
        return `
            <input class="wheel-modal__input_item" id="${item.id}" type="text" value="${item.text}"/> 
        `;
    }
    function addElements() {
        let arr = [];
        modalInputEdit.childNodes.forEach(item => {
            if (item.textContent) {
                wheelSegments = [...wheelSegments, {
                        id: uniqueId(),
                        amount: 1,
                        text: item.textContent,
                        hide: false
                    }];
            }
        });
        modalInputEdit.innerHTML = "";
        wheelCreateSegments();
        setupWheel();
        modalAddBtn.removeEventListener('click', addElements);
    }
    modalAddBtn.addEventListener('click', addElements);
};
const winModal = (win, selected, winText) => {
    const modal = document.querySelector('#wheelModalWin'), modalCloseButton = document.querySelectorAll('.wheel-modal_close'), text = modal.querySelector('.wheel-modal__title'), btnAdd = modal.querySelector('.wheel-modal__button_ok'), btnRemove = modal.querySelector('.wheel-modal__button_remove'), btnHide = modal.querySelector('.wheel-modal__button_hide'), btnInc = modal.querySelector('.wheel-modal__button_inc');
    console.log(win.id, win.text);
    modalOpen(modal);
    text.innerHTML = winText;
    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => {
                modalClose(modal);
            });
        });
    }
    function addHandler() {
        const result = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        };
        addSelectResult(result);
        removeListener();
    }
    function hideHandler() {
        const result = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        };
        addSelectResult(result);
        win.hide = true;
        wheelCreateSegments();
        setupWheel();
        removeListener();
    }
    function removeHandler() {
        const result = {
            id: win.id,
            text: winText,
            value: 1,
            inc: false
        };
        addSelectResult(result);
        wheelSegments = wheelSegments.filter(segment => !(segment === win));
        wheelCreateSegments();
        setupWheel();
        removeListener();
    }
    function incHandler() {
        const result = {
            id: win.id,
            text: winText,
            value: 1,
            inc: true
        };
        addSelectResult(result);
        removeListener();
    }
    function removeListener() {
        btnAdd.removeEventListener('click', addHandler);
        btnRemove.removeEventListener('click', removeHandler);
        btnHide.removeEventListener('click', hideHandler);
        btnInc.removeEventListener('click', incHandler);
    }
    btnAdd.addEventListener('click', addHandler);
    btnRemove.addEventListener('click', removeHandler);
    btnHide.addEventListener('click', hideHandler);
    btnInc.addEventListener('click', incHandler);
};
const wheelCreateSegmentsNodes = () => {
    const segmentOffset = Math.floor(180 / segmentNotHide.length);
    wheelList.innerHTML = '';
    segmentNotHide.forEach((segment, index) => {
        const rotation = ((segmentSlice * index) * -1) - segmentOffset;
        if (!segment.hide) {
            wheelList.insertAdjacentHTML("beforeend", `<li class="wheel__item" style="--rotate: ${rotation}deg">
                        <span>${segment.text}</span>
                     </li>
                    `);
        }
    });
};
const wheelCreateSegmentsColor = () => {
    wheelList.setAttribute("style", `background: repeating-conic-gradient(
      from -90deg,
      ${colors.map((color, i) => `${color} 0 ${(100 / segmentNotHide.length) * (segmentNotHide.length - i)}%`)
        .reverse()}
    );`);
};
const spinertia = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const selectSegment = () => {
    let curSegment = rotation + 270;
    curSegment > 360 ? curSegment %= 360 : null;
    const selected = Math.floor(curSegment / segmentSlice);
    prizeNodes[selected].classList.add(selectedClass);
    winModal(notHide[selected], selected, prizeNodes[selected].textContent.replace(/\s+/g, ' ').trim());
};
const setupWheel = () => {
    notHide = wheelSegments.filter(segment => !segment.hide);
    if (!notHide.length) {
        segmentNotHide = plug.filter(segment => !segment.hide);
        segmentSlice = 360 / segmentNotHide.length;
    }
    else {
        segmentNotHide = wheelSegments.filter(segment => !segment.hide);
        segmentSlice = 360 / segmentNotHide.length;
    }
    wheelCreateSegmentsColor();
    wheelCreateSegmentsNodes();
    prizeNodes = wheel.querySelectorAll('.wheel__item');
};
trigger.addEventListener('click', () => {
    wheelDisabledBtn(trigger);
    rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
    prizeNodes.forEach(win => win.classList.remove(selectedClass));
    wheel.classList.add(spinClass);
    wheelList.style.setProperty("--rotate", rotation.toString());
});
wheelList.addEventListener('transitionend', () => {
    rotation %= 360;
    selectSegment();
    wheel.classList.remove(spinClass);
    wheelList.style.setProperty("--rotate", rotation.toString());
    wheelDisabledBtn(trigger);
});
wheelCreateSegments();
wheelTabs();
wheelHeadIcons();
wheelAddSegment();
setupWheel();
//# sourceMappingURL=script.js.map