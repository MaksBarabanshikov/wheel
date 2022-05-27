"use strict";
const appWheel = () => {
    let wheelSegments;
    !localStorage.localWheelSegment ? wheelSegments = [] : wheelSegments = JSON.parse(localStorage.getItem('localWheelSegment'));
    let wheelResults;
    !localStorage.localWheelResult ? wheelResults = [] : wheelResults = JSON.parse(localStorage.getItem('localWheelResult'));
    let IS_AMOUNT = true;
    const wheelCheckboxAmount = document.querySelector("#wheelCheckBox");
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
    const curColors = [...colors];
    let wheelSegmentItems;
    let wheel = document.querySelector('.wheel');
    let trigger = document.querySelector('.wheel__play');
    const wheelList = document.querySelector('.wheel__list');
    const plug = [
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
    const updateLocalSegment = () => {
        localStorage.setItem('localWheelSegment', JSON.stringify(wheelSegments));
    };
    const updateLocalResult = () => {
        localStorage.setItem('localWheelResult', JSON.stringify(wheelResults));
    };
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
            function sort() {
                let numbers = wheelSegments.filter((item) => typeof item.text === "number");
                let strings = wheelSegments.filter((item) => typeof item.text === "string");
                if (target.classList.contains('sorted')) {
                    numbers.sort((a, b) => b.text - a.text);
                    strings.sort((a, b) => a.text > b.text ? -1 : 1);
                    wheelSegments = numbers.concat(strings);
                    target.classList.remove('sorted');
                }
                else {
                    numbers.sort((a, b) => a.text - b.text);
                    strings.sort((a, b) => a.text < b.text ? -1 : 1);
                    wheelSegments = numbers.concat(strings);
                    target.classList.add('sorted');
                }
                wheelCreateSegments();
                setupWheel();
            }
            const resultSort = () => {
                let numbers = wheelResults.filter((item) => typeof item.text === "number");
                let strings = wheelResults.filter((item) => typeof item.text === "string");
                if (target.classList.contains('sorted')) {
                    numbers.sort((a, b) => b.text - a.text);
                    strings.sort((a, b) => a.text > b.text ? -1 : 1);
                    wheelResults = numbers.concat(strings);
                    target.classList.remove('sorted');
                }
                else {
                    numbers.sort((a, b) => a.text - b.text);
                    strings.sort((a, b) => a.text < b.text ? -1 : 1);
                    wheelResults = numbers.concat(strings);
                    target.classList.add('sorted');
                }
                addSelectResult();
            };
            selectedTabResult ? resultSort() : sort();
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
        const wheelSegmentHtml = (item) => {
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
        `;
        };
        const wheelUpdateHtml = () => {
            wheelEntries.innerHTML = '';
            wheelSegments.map((item) => {
                if (!item.copy) {
                    wheelEntries.innerHTML += wheelSegmentHtml(item);
                }
            });
        };
        wheelUpdateHtml();
        wheelSegmentItems = wheelEntries.querySelectorAll('.side__item');
        function editAmount() {
            const segmentAmount = parseInt(this.value);
            if (segmentAmount && segmentAmount > 0 && segmentAmount < 51) {
                wheelSegments.find(segment => segment.id === this.name && !segment.copy).amount = parseInt(this.value);
                wheelSegmentCounter();
                setupWheel();
            }
        }
        function editText() {
            wheelSegments
                .filter(segment => segment.id === this.name)
                .map(segment => segment.text = this.value);
            setupWheel();
        }
        wheelEntries.querySelectorAll('.hide_button')
            .forEach((btn, index) => {
            btn.addEventListener('click', (event) => {
                const target = event.currentTarget;
                const children = target.children[0];
                !children.classList.contains('fa-eye-slash') ?
                    children.className = 'fas fa-eye-slash fa-lg' :
                    children.className = 'fas fa-eye fa-lg';
                const id = wheelSegments[index].id;
                if (IS_AMOUNT) {
                    wheelSegments.map(segment => segment.id === id ? segment.hide = !segment.hide : null);
                }
                else {
                    wheelSegments.map(segment => segment.id === id && !segment.copy ? segment.hide = !segment.hide : null);
                }
                wheelSegmentCounter();
                setupWheel();
                wheelSegments[index].hide ?
                    wheelSegmentItems[index].classList.add('side__item_hide') :
                    wheelSegmentItems[index].classList.remove('side__item_hide');
            });
        });
        wheelEntries.querySelectorAll('.remove_button')
            .forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const id = wheelSegments[index].id;
                wheelSegments = wheelSegments.filter(segment => segment.id !== id);
                wheelSegmentCounter();
                setupWheel();
                wheelCreateSegments();
            });
        });
        wheelEntries.querySelectorAll('.side__number')
            .forEach(item => {
            item.addEventListener('input', editAmount);
        });
        wheelEntries.querySelectorAll('.side__text')
            .forEach(item => {
            item.addEventListener('input', editText);
        });
    };
    const wheelAddSegment = () => {
        const headInput = document.querySelector('#wheelMainInput');
        const headAmount = document.querySelector('#wheelMainAmount');
        const btn = document.querySelector('#wheelAddSegment');
        function addSegment() {
            if (headInput.value) {
                let headInputValue = headInput.value;
                const headAmountValue = parseInt(headAmount.value);
                if (Number(headInputValue)) {
                    headInputValue = Number(headInputValue);
                }
                if (headAmountValue < 51 && headAmountValue > 0) {
                    wheelSegments = [...wheelSegments, {
                            id: uniqueId(),
                            amount: headAmountValue,
                            text: headInputValue,
                            hide: false,
                            copy: false
                        }];
                    headInput.value = '';
                    headAmount.value = "1";
                    headInput.focus();
                    wheelCheckAmount();
                    wheelSegmentCounter();
                    wheelCreateSegments();
                    setupWheel();
                }
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
        wheelCheckAmount();
        const wheelShuffle = document.querySelector('#wheelShuffle'), wheelSort = document.querySelector('#wheelSort'), wheelTrash = document.querySelector('#wheelTrash');
        const lockBtn = () => {
            wheelShuffle.disabled = true;
            wheelSort.disabled = true;
            wheelTrash.disabled = true;
        };
        const unlockBtn = () => {
            wheelShuffle.disabled = false;
            wheelSort.disabled = false;
            wheelTrash.disabled = false;
        };
        let counterSegment;
        let counter = document.querySelector('.side__entries_counter');
        if (IS_AMOUNT) {
            counterSegment = wheelSegments.filter(segment => !segment.hide);
        }
        else {
            counterSegment = wheelSegments.filter(segment => !segment.hide && !segment.copy);
        }
        counter.innerHTML = counterSegment.length.toString();
        if (counterSegment.length) {
            counter.style.display = "flex";
            unlockBtn();
        }
        else {
            counter.style.display = "none";
            lockBtn();
        }
        wheelAddColors();
        wheelCheckCountSegments();
    };
    const wheelCheckCountSegments = () => {
        const xl = "wheel__list_xl";
        const lg = "wheel__list_lg";
        const md = "wheel__list_md";
        const sm = "wheel__list_sm";
        const xs = "wheel__list_xs";
        const length = wheelSegments.length;
        if (length > 0) {
            if (length <= 12) {
                wheelList.className = `wheel__list ${xl}`;
            }
            if (length > 12) {
                wheelList.className = `wheel__list ${lg}`;
            }
            if (length > 24) {
                wheelList.className = `wheel__list ${md}`;
            }
            if (length > 32) {
                wheelList.className = `wheel__list ${sm}`;
            }
            if (length > 40) {
                wheelList.className = `wheel__list ${xs}`;
            }
        }
    };
    const wheelCheckAmount = () => {
        let arr = wheelSegments.filter(segment => !segment.copy);
        arr.filter(segment => (segment.amount > 1 && !segment.copy));
        arr.map(segment => {
            let amount = segment.amount;
            while (amount !== 1) {
                arr.push(Object.assign(Object.assign({}, segment), { copy: true, amount: 1 }));
                --amount;
            }
        });
        wheelSegments = arr;
    };
    const setupSide = (isAmounts) => {
        const side = document.querySelector(".side");
        if (isAmounts) {
            side.classList.remove("side_amount-off");
            wheelSegments.filter(segment => !segment.copy);
        }
        else {
            side.classList.add("side_amount-off");
        }
        setupWheel();
        addSelectResult();
        wheelSegmentCounter();
    };
    const wheelResultCounter = () => {
        let resultsCounter = document.querySelector('.side__counter');
        if (wheelResults.length) {
            resultsCounter.style.display = "flex";
            resultsCounter.innerHTML = wheelResults.length.toString();
        }
        else {
            resultsCounter.style.display = "none";
        }
        updateLocalResult();
    };
    const addSelectResult = (result) => {
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
                body.innerHTML = 'Пусто';
            }
        };
        if (result) {
            if (wheelResults.length) {
                wheelResults.map(item => {
                    if ((item.id === (result === null || result === void 0 ? void 0 : result.id)) && (item.inc && result.inc)) {
                        item.value++;
                        check = false;
                    }
                });
                if (check) {
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
            modalInputEdit.childNodes.forEach(item => {
                if (item.textContent) {
                    if (parseInt(item.textContent)) {
                        const number = parseInt(item.textContent);
                        wheelSegments = [...wheelSegments, {
                                id: uniqueId(),
                                amount: 1,
                                text: number,
                                hide: false,
                                copy: false
                            }];
                    }
                    else {
                        const string = item.textContent;
                        wheelSegments = [...wheelSegments, {
                                id: uniqueId(),
                                amount: 1,
                                text: string,
                                hide: false,
                                copy: false
                            }];
                    }
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
        modalOpen(modal);
        text.innerHTML = String(winText);
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
            wheelSegments.filter(segment => segment.id === win.id).map(segment => segment.hide = true);
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
            wheelSegments = wheelSegments.filter(segment => !(segment.id === win.id));
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
                        <span class="wheel__item_text">${segment.text}</span>
                     </li>
                    `);
            }
        });
    };
    const wheelAddColors = () => {
        if (wheelSegments.length) {
            if (wheelSegments.length > colors.length) {
                let length = wheelSegments.length;
                while (length >= colors.length) {
                    colors.push(...curColors);
                    --length;
                }
            }
        }
    };
    const wheelCreateSegmentsColor = () => {
        wheelList.setAttribute("style", `background: repeating-conic-gradient(
      from -90deg,
      ${colors.map((color, i) => {
            return `${color} 0 ${(100 / segmentNotHide.length) * (segmentNotHide.length - i)}%`;
        }).reverse()}
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
        let text = prizeNodes[selected].textContent.replace(/\s+/g, ' ').trim();
        if (parseInt(text)) {
            text = parseInt(text);
        }
        prizeNodes[selected].classList.add(selectedClass);
        winModal(notHide[selected], selected, text);
    };
    const setupWheel = () => {
        notHide = wheelSegments.filter(segment => !segment.hide);
        if (!notHide.length) {
            segmentNotHide = plug.filter(segment => !segment.hide);
            segmentSlice = 360 / segmentNotHide.length;
        }
        else {
            if (!IS_AMOUNT) {
                segmentNotHide = wheelSegments.filter(segment => !segment.hide && !segment.copy);
                segmentSlice = 360 / segmentNotHide.length;
            }
            else {
                segmentNotHide = wheelSegments.filter(segment => !segment.hide);
                segmentSlice = 360 / segmentNotHide.length;
            }
        }
        wheelCreateSegmentsColor();
        wheelCreateSegmentsNodes();
        updateLocalSegment();
        prizeNodes = wheel.querySelectorAll('.wheel__item');
    };
    trigger.addEventListener('click', () => {
        const side = document.querySelector('.side');
        const inputs = side.querySelectorAll('input');
        const buttons = side.querySelectorAll('button');
        inputs.forEach(input => {
            input.readOnly = true;
        });
        buttons.forEach(btn => {
            wheelDisabledBtn(btn);
        });
        wheelDisabledBtn(trigger);
        rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
        prizeNodes.forEach(win => win.classList.remove(selectedClass));
        wheel.classList.add(spinClass);
        wheelList.style.setProperty("--rotate", rotation.toString());
    });
    wheelList.addEventListener('transitionend', () => {
        const side = document.querySelector('.side');
        const inputs = side.querySelectorAll('input');
        const buttons = side.querySelectorAll('button');
        rotation %= 360;
        selectSegment();
        wheel.classList.remove(spinClass);
        wheelList.style.setProperty("--rotate", rotation.toString());
        wheelDisabledBtn(trigger);
        inputs.forEach(input => {
            input.readOnly = false;
        });
        buttons.forEach(btn => {
            wheelDisabledBtn(btn);
        });
    });
    wheelCheckboxAmount.addEventListener('click', () => {
        IS_AMOUNT = !IS_AMOUNT;
        setupSide(IS_AMOUNT);
    });
    setupSide(IS_AMOUNT);
    wheelCreateSegments();
    wheelTabs();
    wheelHeadIcons();
    wheelAddSegment();
};
appWheel();
//# sourceMappingURL=script.js.map