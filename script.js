"use strict";
const appWheel = () => {
    let wheelSegments;
    !localStorage.localWheelSegment ? wheelSegments = [] : wheelSegments = JSON.parse(localStorage.getItem('localWheelSegment'));
    let wheelResults;
    !localStorage.localWheelResult ? wheelResults = [] : wheelResults = JSON.parse(localStorage.getItem('localWheelResult'));
    let IS_AMOUNT;
    !localStorage.localWheelAmount ? IS_AMOUNT = false : IS_AMOUNT = JSON.parse(localStorage.getItem('localWheelAmount'));
    const wheelCheckboxAmount = document.querySelector("#wheelCheckBox");
    wheelCheckboxAmount.checked = IS_AMOUNT;
    let colors = [
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
    const hideAllBtn = document.querySelector('#wheelHideAll');
    const resetIncAllBtn = document.querySelector('#wheelResetIncAll');
    const wheelModalRemoveBtn = document.querySelector('#wheelRemoveBtn');
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
    let currentSlice = 0;
    const spinClass = 'is-spinning';
    const selectedClass = 'selected';
    let rotation = 0;
    let prizeNodes;
    let tickerMusic;
    const buttonMusic = () => {
        let audio = document.querySelector("#wheelMusicButton").play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error);
        });
    };
    const tickMusic = () => {
        let audio = document.querySelector("#wheelMusicTick").play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error);
        });
    };
    const winMusic = () => {
        let audio = document.querySelector("#wheelMusicWin").play();
        audio.then(function () {
        }).catch(function (error) {
            console.log(error);
        });
    };
    function uniqueId() {
        return Math.random().toString(16).slice(2);
    }
    const updateLocalSegment = () => {
        localStorage.setItem('localWheelSegment', JSON.stringify(wheelSegments));
    };
    const updateLocalResult = () => {
        localStorage.setItem('localWheelResult', JSON.stringify(wheelResults));
    };
    const updateLocalAmount = () => {
        localStorage.setItem('localWheelAmount', JSON.stringify(IS_AMOUNT));
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
        const wheelList = document.querySelector('#wheelList'), wheelShuffle = document.querySelector('#wheelShuffle'), wheelSort = document.querySelector('#wheelSort'), wheelTrash = document.querySelector('#wheelTrash'), wheelSortResult = document.querySelector('#wheelSortResult'), wheelCurListResult = document.querySelector('#wheelCurListResult'), wheelTrashResult = document.querySelector('#wheelTrashResult'), wheelSortIncResult = document.querySelector('#wheelSortIncResult'), buttons = document.querySelectorAll('.side__icons_btn');
        const side = document.querySelector('.side');
        buttons.forEach(btn => {
            btn.addEventListener('click', function () {
                const curBtn = this.id;
                buttons.forEach(button => {
                    curBtn !== button.id ? button.classList.remove('sorted') : null;
                });
            });
        });
        wheelList.addEventListener('click', wheelModal);
        wheelShuffle.addEventListener('click', () => {
            wheelSegments.sort(() => Math.random() - 0.5);
            wheelCreateSegments();
            setupWheel();
        });
        wheelSort.addEventListener('click', () => {
            const sort = () => {
                let numbers = wheelSegments.filter((item) => typeof item.text === "number");
                let strings = wheelSegments.filter((item) => typeof item.text === "string");
                if (wheelSort.classList.contains('sorted')) {
                    numbers.sort((a, b) => b.text - a.text);
                    strings.sort((a, b) => a.text > b.text ? -1 : 1);
                    wheelSegments = numbers.concat(strings);
                    wheelSort.classList.remove('sorted');
                }
                else {
                    numbers.sort((a, b) => a.text - b.text);
                    strings.sort((a, b) => a.text < b.text ? -1 : 1);
                    wheelSegments = numbers.concat(strings);
                    wheelSort.classList.add('sorted');
                }
                wheelCreateSegments();
                setupWheel();
            };
            sort();
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
        wheelSortResult.addEventListener('click', () => {
            const sort = () => {
                let numbers = wheelResults.filter((item) => typeof item.text === "number");
                let strings = wheelResults.filter((item) => typeof item.text === "string");
                if (wheelSortResult.classList.contains('sorted')) {
                    numbers.sort((a, b) => b.text - a.text);
                    strings.sort((a, b) => a.text > b.text ? -1 : 1);
                    wheelResults = numbers.concat(strings);
                    wheelSortResult.classList.remove('sorted');
                }
                else {
                    numbers.sort((a, b) => a.text - b.text);
                    strings.sort((a, b) => a.text < b.text ? -1 : 1);
                    wheelResults = numbers.concat(strings);
                    wheelSortResult.classList.add('sorted');
                }
                addSelectResult();
            };
            sort();
        });
        wheelCurListResult.addEventListener('click', () => {
            wheelResults.sort((a, b) => a.date - b.date);
            addSelectResult();
        });
        wheelTrashResult.addEventListener('click', () => {
            wheelResults.length = 0;
            addSelectResult();
        });
        wheelSortIncResult.addEventListener('click', () => {
            let isInc = wheelResults.filter(result => result.inc);
            let noInc = wheelResults.filter(result => !result.inc);
            if (wheelSortIncResult.classList.contains('sorted')) {
                isInc.sort((a, b) => a.value - b.value);
                wheelResults = isInc.concat(noInc);
                addSelectResult();
                wheelSortIncResult.classList.remove('sorted');
            }
            else {
                isInc.sort((a, b) => b.value - a.value);
                wheelResults = isInc.concat(noInc);
                addSelectResult();
                wheelSortIncResult.classList.add('sorted');
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
            this.value = this.value.replace(/[^\d]/g, '');
            if (!(parseInt(this.value) >= 1 && parseInt(this.value) <= 50)) {
                parseInt(this.value) < 1 ? this.value = '1' : null;
                parseInt(this.value) > 50 ? this.value = '50' : null;
            }
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
        headAmount.addEventListener('input', function () {
            this.value = this.value.replace(/[^\d]/g, '');
            if (!(parseInt(this.value) >= 1 && parseInt(this.value) <= 50)) {
                parseInt(this.value) < 1 ? this.value = '1' : null;
                parseInt(this.value) > 50 ? this.value = '50' : null;
            }
        });
    };
    const wheelSegmentCounter = () => {
        wheelCheckAmount();
        const wheelShuffle = document.querySelector('#wheelShuffle'), wheelSort = document.querySelector('#wheelSort'), wheelTrash = document.querySelector('#wheelTrash');
        const lockBtn = () => {
            wheelShuffle.disabled = true;
            wheelSort.disabled = true;
        };
        const unlockBtn = () => {
            wheelShuffle.disabled = false;
            wheelSort.disabled = false;
        };
        const btnLockFn = () => {
            if (wheelSegments.length > 1) {
                unlockBtn();
            }
            else {
                lockBtn();
            }
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
            wheelTrash.disabled = false;
        }
        else {
            counter.style.display = "none";
            wheelTrash.disabled = true;
        }
        btnLockFn();
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
        else {
            wheelList.className = `wheel__list ${xl}`;
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
        const wheelSortResult = document.querySelector('#wheelSortResult'), wheelCurListResult = document.querySelector('#wheelCurListResult'), wheelTrashResult = document.querySelector('#wheelTrashResult'), wheelSortIncResult = document.querySelector('#wheelSortIncResult');
        if (wheelResults.length) {
            resultsCounter.style.display = "flex";
            resultsCounter.innerHTML = wheelResults.length.toString();
            wheelTrashResult.disabled = false;
        }
        else {
            resultsCounter.style.display = "none";
            wheelTrashResult.disabled = true;
        }
        if (wheelResults.length >= 2) {
            wheelSortResult.disabled = false;
            wheelCurListResult.disabled = false;
            wheelSortIncResult.disabled = false;
        }
        else {
            wheelSortResult.disabled = true;
            wheelCurListResult.disabled = true;
            wheelSortIncResult.disabled = true;
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
        let modalInputEdit = document.querySelector('.wheel-modal__input-editable');
        modalInputEdit.value = '';
        modalOpen(modal);
        const wheelCreateHTML = (item) => {
            return `${item}\n`;
        };
        if (wheelSegments.length > 0) {
            wheelSegments.map(item => {
                if (!item.copy) {
                    const str = String(item.text);
                    modalInputEdit.value += wheelCreateHTML(str);
                }
            });
        }
        if (modalCloseButton.length > 0) {
            modalCloseButton.forEach(btn => {
                btn.addEventListener('click', () => modalClose(modal));
            });
        }
        const addSegment = () => {
            let segments = modalInputEdit.value.split('\n').filter(segment => segment !== '');
            wheelSegments.length = 0;
            segments.map(segment => {
                if (parseInt(segment)) {
                    const number = parseInt(segment);
                    wheelSegments = [...wheelSegments, {
                            id: uniqueId(),
                            amount: 1,
                            text: number,
                            hide: false,
                            copy: false
                        }];
                }
                else {
                    const string = segment;
                    wheelSegments = [...wheelSegments, {
                            id: uniqueId(),
                            amount: 1,
                            text: string,
                            hide: false,
                            copy: false
                        }];
                }
            });
            wheelSegmentCounter();
            wheelCreateSegments();
            setupWheel();
            modalAddBtn.removeEventListener('click', addSegment);
        };
        modalAddBtn.addEventListener('click', addSegment);
    };
    const winModal = (win, selected, winText) => {
        const modal = document.querySelector('#wheelModalWin'), modalCloseButton = document.querySelectorAll('.wheel-modal_close'), text = modal.querySelector('.wheel-modal__title'), btnAdd = modal.querySelector('.wheel-modal__button_ok'), btnRemove = modal.querySelector('.wheel-modal__button_remove'), btnHide = modal.querySelector('.wheel-modal__button_hide'), btnInc = modal.querySelector('.wheel-modal__button_inc');
        winMusic();
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
                inc: false,
                date: Date.now()
            };
            addSelectResult(result);
            removeListener();
        }
        function hideHandler() {
            const result = {
                id: win.id,
                text: winText,
                value: 1,
                inc: false,
                date: Date.now()
            };
            addSelectResult(result);
            wheelSegments.filter(segment => segment.id === win.id).map(segment => segment.hide = true);
            wheelCreateSegments();
            wheelSegmentCounter();
            setupWheel();
            removeListener();
        }
        function removeHandler() {
            const result = {
                id: win.id,
                text: winText,
                value: 1,
                inc: false,
                date: Date.now()
            };
            addSelectResult(result);
            wheelSegments = wheelSegments.filter(segment => !(segment.id === win.id));
            wheelCreateSegments();
            wheelSegmentCounter();
            setupWheel();
            removeListener();
        }
        function incHandler() {
            const result = {
                id: win.id,
                text: winText,
                value: 1,
                inc: true,
                date: Date.now()
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
            else if (wheelSegments.length <= 16) {
                colors = [...curColors];
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
        if (!notHide.length) {
            winModal(plug[selected], selected, text);
        }
        else {
            winModal(notHide[selected], selected, text);
        }
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
        wheelAddColors();
        wheelCreateSegmentsColor();
        wheelCreateSegmentsNodes();
        updateLocalSegment();
        prizeNodes = wheel.querySelectorAll('.wheel__item');
    };
    const runTickerMusic = () => {
        const wheelListStyles = window.getComputedStyle(wheelList);
        const values = wheelListStyles.transform.split("(")[1].split(")")[0].split(",");
        const a = values[0];
        const b = values[1];
        let prizeSlice;
        let rad = Math.atan2(Number(b), Number(a));
        rad < 0 ? rad += (1.5 * Math.PI) : null;
        if (notHide.length) {
            prizeSlice = 360 / notHide.length;
        }
        else {
            prizeSlice = 360 / plug.length;
        }
        const angle = Math.floor(rad * (180 / Math.PI));
        const slice = Math.floor(angle / prizeSlice);
        if (currentSlice !== slice) {
            tickMusic();
            currentSlice = slice;
        }
        console.log(slice);
        tickerMusic = requestAnimationFrame(runTickerMusic);
    };
    trigger.addEventListener('click', () => {
        const side = document.querySelector('.side');
        const inputs = side.querySelectorAll('input');
        const buttons = side.querySelectorAll('button');
        buttonMusic();
        inputs.forEach(input => {
            input.readOnly = true;
        });
        buttons.forEach(btn => {
            btn.disabled = true;
        });
        wheelDisabledBtn(trigger);
        rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
        prizeNodes.forEach(win => win.classList.remove(selectedClass));
        wheel.classList.add(spinClass);
        wheelList.style.setProperty("--rotate", rotation.toString());
        runTickerMusic();
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
            btn.disabled = false;
        });
    });
    wheelCheckboxAmount.addEventListener('click', () => {
        IS_AMOUNT = !IS_AMOUNT;
        setupSide(IS_AMOUNT);
        updateLocalAmount();
    });
    hideAllBtn.addEventListener('click', () => {
        if (hideAllBtn.classList.contains('hidden')) {
            hideAllBtn.children[0].className = 'fas fa-eye-slash fa-lg';
            hideAllBtn.classList.remove("hidden");
            wheelSegments.map(item => item.hide = false);
        }
        else {
            hideAllBtn.children[0].className = 'fas fa-eye fa-lg';
            hideAllBtn.classList.add("hidden");
            wheelSegments.map(item => item.hide = true);
        }
        wheelCheckAmount();
        wheelSegmentCounter();
        wheelCreateSegments();
        setupWheel();
    });
    resetIncAllBtn.addEventListener('click', () => {
        wheelResults.filter(result => result.inc).map(result => result.value = 1);
        addSelectResult();
    });
    wheelModalRemoveBtn.addEventListener('click', () => {
        const modal = document.querySelector('#wheelModalWin');
        const icon = wheelModalRemoveBtn.children[0];
        if (modal.classList.contains('wheel-modal_remove-active')) {
            icon.className = 'fas fa-minus-circle';
            modal.classList.remove('wheel-modal_remove-active');
        }
        else {
            icon.className = 'fas fa-plus-circle';
            modal.classList.add('wheel-modal_remove-active');
        }
    });
    setupSide(IS_AMOUNT);
    wheelCreateSegments();
    wheelTabs();
    wheelHeadIcons();
    wheelAddSegment();
};
appWheel();
//# sourceMappingURL=script.js.map