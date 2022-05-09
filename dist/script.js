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
        text: "1",
        hide: false
    },
    {
        text: "2",
        hide: false
    },
    {
        text: "3",
        hide: false
    },
    {
        text: "4",
        hide: false
    },
    {
        text: "5",
        hide: false
    },
];
let segmentNotHide = wheelSegments.filter(segment => !segment.hide);
let segmentSlice = 360 / segmentNotHide.length;
const spinClass = 'is-spinning';
const selectedClass = 'selected';
let rotation = 0;
let prizeNodes;
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
    wheelList.addEventListener('click', wheelModal, true);
    wheelShuffle.addEventListener('click', () => {
        wheelSegments.sort(() => Math.random() - 0.5);
        wheelCreateSegments();
        setupWheel();
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
        setupWheel();
    });
    wheelTrash.addEventListener('click', () => {
        wheelSegments.length = 0;
        wheelCreateSegments();
        setupWheel();
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
            setupWheel();
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
    function addSegment() {
        if (headInput.value) {
            wheelSegments = [...wheelSegments, {
                    amount: parseInt(headAmount.value),
                    text: headInput.value,
                    hide: false
                }];
            headInput.value = '';
            headAmount.value = "1";
            headInput.focus();
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
const wheelResultCounter = () => {
    let resultsCounter = document.querySelector('.side__counter');
    resultsCounter.innerHTML = wheelResults.length.toString();
};
const createResultsItem = () => {
    const bodyResults = document.querySelector('.tab-results');
    bodyResults.innerHTML = '';
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
    wheelResults.map((item) => {
        bodyResults.innerHTML += resultHtml(item);
    });
    console.log("результат", wheelResults);
};
const addSelectResult = (result) => {
    const counter = document.querySelector(`#wheelResult_${result.id}`);
    console.log('select:', result);
    if (counter && result.inc) {
        console.log('counter && result.inc:', counter && result.inc);
        wheelResults.map(item => {
            if (item.id === result.id) {
                ++item.value;
                counter.innerHTML = `+ ${item.value}`;
            }
        });
    }
    else {
        wheelResults = [...wheelResults, result];
        createResultsItem();
        wheelResultCounter();
    }
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
    modalOpen(modal);
    if (wheelSegments.length > 0) {
        let modalInputReadonly = document.querySelector('.wheel-modal__input-readonly');
        if (modalInputReadonly === null) {
            const div = document.createElement('div');
            div.className = 'wheel-modal__input-readonly';
            div.innerHTML = '';
            wheelSegments.map(item => {
                div.innerHTML += wheelCreateHTML(item);
            });
            modalInput.insertBefore(div, modalInputEdit);
        }
    }
    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => modalClose(modal));
        });
    }
    function wheelCreateHTML(item) {
        return `
            <div>${item.text}</div> 
        `;
    }
    modalAddBtn.addEventListener('click', () => {
        modalInputEdit.childNodes.forEach(item => {
            if (item.textContent) {
                if (item.textContent)
                    wheelSegments = [...wheelSegments, {
                            amount: 1,
                            text: item.textContent,
                            hide: false
                        }];
            }
        });
        modalInputEdit.innerHTML = "";
        wheelCreateSegments();
        setupWheel();
    });
};
const winModal = (win, selected) => {
    const modal = document.querySelector('#wheelModalWin'), modalCloseButton = document.querySelectorAll('.wheel-modal_close'), text = modal.querySelector('.wheel-modal__title'), btnAdd = modal.querySelector('.wheel-modal__button_ok'), btnRemove = modal.querySelector('.wheel-modal__button_remove'), btnHide = modal.querySelector('.wheel-modal__button_hide'), btnInc = modal.querySelector('.wheel-modal__button_inc');
    let result = {
        id: selected,
        text: prizeNodes[selected].textContent,
        value: 1,
        inc: false
    };
    modalOpen(modal);
    text.innerHTML = prizeNodes[selected].textContent;
    if (modalCloseButton.length > 0) {
        modalCloseButton.forEach(btn => {
            btn.addEventListener('click', () => {
                modalClose(modal);
            });
        });
    }
    function addHandler() {
        console.log('add:', result);
        addSelectResult(result);
        wheelCreateSegments();
        setupWheel();
        removeListener();
    }
    function hideHandler() {
        addSelectResult(result);
        console.log(win);
        win.hide = true;
        wheelCreateSegments();
        setupWheel();
        removeListener();
    }
    function removeHandler() {
        addSelectResult(result);
        wheelSegments = wheelSegments.filter(segment => !(segment === win));
        wheelCreateSegments();
        setupWheel();
        removeListener();
    }
    function incHandler() {
        console.log("click");
        console.log(result);
        result.inc = true;
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
    winModal(wheelSegments[selected], selected);
    console.log('win', wheelSegments[selected], prizeNodes[selected]);
};
const setupWheel = () => {
    const notHide = wheelSegments.filter(segment => !segment.hide);
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