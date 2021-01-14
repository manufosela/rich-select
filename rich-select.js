import {
  LitElement,
  html,
  css
} from 'lit-element';


/**
 * `rich-option`
 * RichOption
 *
 * @customElement rich-option
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

class RichOption extends LitElement {
  static get is() {
    return 'rich-option';
  }

  static get properties() {
    return {
      selected: {
        type: String
      },
      considered: {
        type: String
      },
      disabled: {
        type: String
      },
      value: {
        type: String
      },
      title: {
        type: String
      },
      record: {
        type: String
      },
      content: {
        type: String
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }
    `;
  }

  constructor() {
    super();
  }

  connectedCallback() {
    if (this.slot !== 'option') {
      this.slot = '';
    }
    this._upgradeProperty('selected');
    this._upgradeProperty('considered');
    this._upgradeProperty('disabled');
    this.shadowRoot.innerHTML = this.innerHTML;
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.parentNode) {
      if (this.parentNode._transcend) {
        const val = this._haveValidParent() && !this.disabled;
        if (this.selected && val) {
          this.parentNode._transcend(this);
        }
        if (this.considered && val) {
          this.parentNode._consider(this);
          if (this.disabled) {
            this.selected = !1;
            this.considered = !1;
          }
        }
      }
    }
  }

  set selected(val) {
    if (val) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }
  get selected() {
    return this.hasAttribute('selected');
  }
  set considered(val) {
    if (val) {
      this.setAttribute('considered', '');
    } else {
      this.removeAttribute('considered');
    }
  }
  get considered() {
    return this.hasAttribute('considered');
  }
  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  get disabled() {
    return this.hasAttribute('disabled');
  }
  set value(val) {
    if (val) {
      this.setAttribute('value', val);
    } else {
      this.removeAttribute('value');
    }
  }
  get value() {
    if (this.hasAttribute('value')) {
      return this.getAttribute('value');
    }
    const val = this.innerText.trim();
    return (val || this.title);
  }
  set title(val) {
    if (val) {
      this.setAttribute('title', val);
    } else {
      this.removeAttribute('title');
    }
  }
  get title() {
    return this.hasAttribute('title') ? this.getAttribute('title') : '';
  }
  set record(val) {
    if (val) {
      this.setAttribute('record', val);
    } else {
      this.removeAttribute('record');
    }
  }
  get record() {
    return this.hasAttribute('record') ? this.getAttribute('record') : this.title;
  }
  set slot(val) {
    this.setAttribute('slot', 'option');
  }
  get slot() {
    return this.hasAttribute('slot') ? this.getAttribute('slot') : '';
  }
  get content() {
    return this.title ? this.title : this.innerHTML;
  }

  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      let val = this[prop];
      delete this[prop];
      this[prop] = val;
    }
  }

  _haveValidParent() {
    return !!this.parentNode && this.parentNode.tagName === 'RICH-SELECT';
  }
}

window.customElements.define(RichOption.is, RichOption);

/**
 * `rich-select`
 * RichSelect
 *
 * @customElement rich-select
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

class RichSelect extends LitElement {
  static get is() {
    return 'rich-select';
  }

  static get properties() {
    return {
      value: {
        type: String
      },
      expanded: {
        type: Boolean
      },
      disabled: {
        type: Boolean
      }
    };
  }

  static get styles() {
    return css`
    /** CSS VARIABLES
      --selectOptions-max-height
      --selectOptions-shadow
      --selectOptions-background
      --selectOptions-border
      --selectOptions-zIndex
      --animated-time
      --input-outline
      --input-margin
      --input-width
      --input-border-width
      --input-border-color
      --input-border-style
      --input-font
      --input-padding
      --input-color
      --input-background
      QUEDAN MAS...
     */
      :host {
        display: inline-block;
        position: relative;
        user-select: none;
        outline-width: 0px;
        text-align: justify;
        width: var(--rich-select-width, auto);
      }
      #caller {
        display: flex;
        padding: var(--caller-padding, 3px 6px);
        background: var(--caller-background, #fff);
        color: var(--caller-color, inherit);
        white-space: nowrap;
        box-shadow: var(--caller-shadow, 0px 0px 2px #666, inset 0px 0px 5px 0px #eee);
        border-radius: var(--caller-border-radius, 3px);
        height: inherit;
        width: inherit;
        align-items: center;
      }
      #caller :first-child{ 
        position: relative;
        width: inherit;
        overflow-x: hidden;
      }
      :host([disabled]) #caller {
        color: var(--caller-disabled-color, #aaa);
        background: var(--caller-disabled-background, #eee);
      }
      :host(:not([disabled])) #caller:hover{
        cursor: var(--caller-hover-cursor, pointer);
        background: var(--caller-hover-background, #fcfcfc);
        color: var(--caller-hover-color, #000);
      }
      :host(:not([disabled]):focus) #caller{
        outline: var(--caller-focus-outline, rgb(229, 151, 0) auto 1px);
      }
      :host([arrow]) #arrow {
        line-height: 20px;
        font-size: var(--arrow-font-size, 18px);
        margin: var(--arrow-margin, 0px 3px);
        color: var(--arrow-color, #000);
      }
      :host([arrow]):host([expanded]) #arrow > span {
        transform: rotate(-90deg);
        left: 0px;
        top: 0px;
      }    
      :host([arrow]) #arrow > span {
        position: relative;
        display: block;
        top: 0px;
        left: 3.5px;
        transform: rotate(90deg);
      }
      :host([animated]) #arrow > span {
        transition: transform var(--animated-time, 0.15s) linear;
      }
      :host(:not([arrow])) #arrow {
        display: none;
      }
      #selectOptions {
        max-height: var(--selectOptions-max-height, auto);
        overflow-y: auto;
        position: fixed;
        box-shadow: var(--selectOptions-shadow, 0px 0px 6px #ccc);
        background: var(--selectOptions-background, #fff);
        border: var(--selectOptions-border, 1px solid #ccc);
        z-index: var(--selectOptions-zIndex, 3);
        transition: visibility 0s linear var(--animated-time, 0.15s), opacity var(--animated-time, 0.15s) linear;
      }
      :host([animated]):host(:not([expanded])) #selectOptions {
        visibility: hidden;
        opacity: 0;
      }
      :host([animated]):host([expanded]) #selectOptions {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
      }
      #holder {
        overflow-y: auto;
      }
      :host(:not([search])) #search{
        display: none;
      }
      #search {
        line-height: normal;
      }
      #search input[type=text]{
        outline: var(--input-outline, 0px solid #aaa);
        margin: var(--input-margin, 0px);
        width: var(--input-width, 98%);
        border-width: var(--input-border-width, 0px 0px 1px 0px);
        border-color: var(--input-border-color, #ccc);
        border-style: var(--input-border-style, solid);
        font: var(--input-font, 12pt arial);
        padding: var(--input-padding, 2px 1%);
        color: var(--input-color, #000);
        background: var(--input-background, #fff);
      }
      ::slotted(rich-option), rich-option{
        display: block;
        cursor: pointer;
        padding: var(--option-padding, 3px 6px);
        border: var(--option-border, none);
        border-bottom: var(--option-border-bottom, none);
        border-top: var(--option-border-top, none);
        border-left: var(--option-border-left, none);
        border-right: var(--option-border-right, none);
        height: 20px;
        color:#000;
        line-height: normal;
        transition: all 0.1s linear;
      }
      ::slotted(rich-option:last-child), rich-option:last-child{
        border: var(--option-last-border, none);
        border-bottom: var(--option-last-border-bottom, none);
        border-top: var(--option-last-border-top, none);
        border-left: var(--option-last-border-left, none);
        border-right: var(--option-last-border-right, none);
      }
      ::slotted(rich-option:hover) {
        background: var(--option-hover-background, #fff);
        color: var(--option-hover-color, #000);
      }
      ::slotted(rich-option[hidden]){
        display: none;
      }
      ::slotted([disabled]){
        background: var(--option-disabled-background, #f9f9f9);
        color: var(--option-disabled-color, #ddd);
      }
      ::slotted(:not([considered])):hover {
        background: rgba(238, 238, 238, 0.767);
      }
      ::slotted(rich-option[considered]){
        background: var(--option-active-background, #0080ff);
        color: var(--option-active-color, #000);
      }
      ::slotted(rich-option[selected]){
        background: var(--option-selected-background, #eee);
        color: var(--option-selected-color, #000);
      }
      :host-context(.dark){
        color: #e5c070;
      }
      :host-context(.dark) #caller{
        background: #282c34;
        box-shadow: 0px 0px 2px #000, inset 0px 0px 5px 0px #21252b;
      }
      :host-context(.dark:not([disabled])) #caller:hover{
        background: #21252b;
        color: #e5c070;
      }
      :host-context(.dark[arrow]) #arrow {
        color: #e5c070;
      }
      :host-context(.dark) #selectOptions {
        box-shadow: 0px 0px 6px #000;
        background: #282c34;
        border: 1px solid #000;
      }
      :host-context(.dark) #search input[type=text]{
        border-color: #666;
        background: #282c34;
        color: #e5c070;
      }
      :host-context(.dark) ::slotted([disabled]){
        background: #32363e; color: #4e5562;
      }
      :host-context(.dark) ::slotted(rich-option[considered]){
        background: #e5c070; color: #282c34;
      }
      :host-context(.dark) ::slotted(rich-option[selected]:not([considered])){
        background: #373c44; color: #89bd55;
      }
    `;
  }

  constructor() {
    super();
    this._onSlotChange = this._onSlotChange.bind(this);
    this._onCallerClick = this._onCallerClick.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this.objKeyCodes = {
      ENTER: 13,
      ESC: 27,
      ARROW_LEFT: 37,
      ARROW_UP: 38,
      ARROW_RIGHT: 39,
      ARROW_DOWN: 40,
      HOME: 36,
      END: 35
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('blur', this._onBlur);
    this.addEventListener('mousedown', this._onMouseDown);
    this.addEventListener('mouseup', this._onMouseUp);
    this.addEventListener('keydown', this._onKeyDown);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.caller.removeEventListener('click', this._onCallerClick);
    this.input.removeEventListener('keyup', this._onKeyUp);
    this.removeEventListener('blur', this._onBlur);
    this.removeEventListener('mousedown', this._onMouseDown);
    this.removeEventListener('mouseup', this._onMouseUp);
    this.removeEventListener('keydown', this._onKeyDown);
  }

  firstUpdated() {
    this._optionSlot = this.shadowRoot.querySelector('slot[name=option]');
    this.caller = this.shadowRoot.querySelector('#caller');
    this.chosen = this.caller.firstElementChild;
    this.arrowElm = this.caller.children[1];
    this.selectOptions = this.shadowRoot.querySelector('#selectOptions');
    this.searchElm = this.selectOptions.firstElementChild;
    this.input = this.searchElm.firstElementChild;
    this.holder = this.selectOptions.children[1];
    this._animated = this.hasAttribute('animated');
    this._optionSlot.addEventListener('slotchange', this._onSlotChange.bind(this));
    this.caller.addEventListener('click', this._onCallerClick.bind(this));
    this.input.addEventListener('keyup', this._onKeyUp);
    document.addEventListener('scroll', () => {
      if (this.expanded) {
        this.expanded = false;
        this.focus();
      }
    });

    if (!this._animated) {
      this._setHidden(true);
    }
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (this.expanded) {
      this._expand();
    } else {
      this._collapse();
    }
    if (this.disabled) {
      this.blur();
      this.setAttribute('tabindex', '-1');
    } else {
      this.setAttribute('tabindex', 0);
    }
  }

  set value(val) {
    if (typeof val === 'string' || typeof val === 'number') {
      const allValidOptions = this._allValidOptions();
      for (let validOption of allValidOptions) {
        if (validOption.value === val) {
          return void(validOption.selected = true);
        }
      }
    }
  }
  get value() {
    return this._selectedOption ? this._selectedOption.value : '';
  }
  set expanded(val) {
    if (val) {
      this.setAttribute('expanded', '');
    } else {
      this.removeAttribute('expanded');
    }
  }
  get expanded() {
    return this.hasAttribute('expanded');
  }
  set disabled(val) {
    if (val) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }
  get disabled() {
    return this.hasAttribute('disabled');
  }

  _onSlotChange() {
    this._initializing();
  }
  _onCallerClick() {
    this._toggle();
  }
  _onMouseDown(ev) {
    let opt = ev.target.closest('rich-option');
    if (this._isValidAndEnabled(opt)) {
      opt.considered = true;
    }
  }
  _onMouseUp(val) {
    const opt = val.target.closest('rich-option');
    if (this._isValidAndEnabled(opt)) {
      this._select(opt);
      this.expanded = false;
    }
  }

  _expandedOption(ev, opt) {
    ev.preventDefault();
    if (this.expanded && opt) {
      opt.considered = true;
    } else {
      this._select(opt);
    }
  }

  _onKeyDown(ev) {
    let opt;
    switch (ev.keyCode) {
      case this.objKeyCodes.HOME:
        this._expandedOption(ev, this._firstOption());
        break;
      case this.objKeyCodes.ARROW_UP:
        this._expandedOption(ev, this._previousOption());
        break;
      case this.objKeyCodes.ARROW_DOWN:
        this._expandedOption(ev, this._nextOption());
        break;
      case this.objKeyCodes.END:
        this._expandedOption(ev, this._lastOption());
        break;
      case this.objKeyCodes.ESC:
        ev.preventDefault();
        this.expanded = false;
        this.focus();
        break;
      case this.objKeyCodes.ENTER:
        ev.preventDefault();
        if (this.expanded) {
          if (this._consideredOption) {
            this._select(this._consideredOption);
            this.expanded = false;
            this.focus();
          } else {
            this.expanded = true;
          }
        }
        break;
      default:
        if (!this.expanded) {
          if (this.validateKeyCode(ev.keyCode)) {
            this.input.focus();
            this.expanded = true;
          }
        }
    }
  }
  _onKeyUp(ev) {
    if (ev.target.value !== this._searchContent) {
      this._searching(ev.target.value.trim().toLowerCase());
      this._searchContent = ev.target.value;
    }
  }
  _onBlur() {
    this.expanded = false;
  }

  _getSelected(allOptions) {
    for (let option of allOptions) {
      if (option.hasAttribute('selected')) {
        return option;
      }
    }
    return null;
  }

  _initializing() {
    const allOptions = this._allOptions();
    this._selectedOption = this._getSelected(allOptions);
    if (!this._selectedOption && allOptions.length) {
      this._firstOption().selected = true;
    }
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
    this.options = allOptions;
    this.chosen.innerHTML = this.querySelector('rich-option[selected]').innerHTML;
  }

  _expand() {
    this._setHidden(false);
    this._attachSelectOptionsToCaller();
    this.input.focus();
    if (this._selectedOption) {
      this._selectedOption.scrollIntoView({
        block: 'center'
      });
    }
  }
  _collapse() {
    this._setHidden(true);
    this._releaseSelectOptions();
    if (this._consideredOption) {
      this._consideredOption.considered = false;
      this._consideredOption = null;
    }
    this._resetSearch();
  }
  _setHidden(val) {
    if (!this._animated) {
      this.selectOptions.hidden = val;
    }
  }
  _toggle() {
    this.expanded = !this.expanded;
  }
  _select(val) {
    if (this._isValidAndEnabled(val) && val !== this._selectedOption) {
      val.selected = true;
      this._createChangeEvent();
    }
  }
  _transcend(val) {
    if (this._isValidAndEnabled(val) && this._selectedOption !== val) {
      if (this._selectedOption) {
        this._selectedOption.selected = false;
      }
      this._selectedOption = val;
      if (this.chosen) {
        this.chosen.innerHTML = val.content;
      }
    }
  }
  _consider(val) {
    if (this._isValidOption(val) && this._consideredOption !== val) {
      if (this._consideredOption) {
        this._consideredOption.considered = false;
      }
      this._consideredOption = val;
      val.scrollIntoView({
        block: 'nearest'
      });
    }
  }
  _searching(val) {
    let resultRecord;
    let resultOpt;
    let opt;
    for (opt of this.options) {
      if (this._isValidOption(opt)) {
        resultRecord = (opt.record.toLowerCase().indexOf(val) === -1);
      }
      resultOpt = (opt.innerText.toLowerCase().indexOf(val) === -1);
      opt.hidden = resultOpt && resultRecord;
    }
    if (!this._isValidAndEnabledAndVisible(this._consideredOption) && !this._isValidAndEnabledAndVisible(this._selectedOption)) {
      const option = this._firstOption();
      if (option) {
        option.considered = true;
      }
    }
  }
  _resetSearch() {
    if (this.input.value) {
      this.input.value = '';
      this._searchContent = '';
      for (let option of this.options) {
        option.hidden = false;
      }
    }
  }
  _isValidOption(val) {
    return val instanceof RichOption && val.tagName === 'RICH-OPTION';
  }
  _isValidAndEnabled(val) {
    return this._isValidOption(val) && !val.disabled;
  }
  _isValidAndEnabledAndVisible(val) {
    return this._isValidAndEnabled(val) && !val.hidden;
  }
  _allOptions() {
    return Array.from(this.children);
  }
  _allValidOptions() {
    return Array.from(this.querySelectorAll('rich-option:not([hidden]):not([disabled])'));
  }
  _firstOption() {
    return this.querySelector('rich-option:not([disabled]):not([hidden])');
  }
  _nextOption() {
    const option = this._consideredOption || this._selectedOption;
    if (!this._isValidAndEnabled(option) || option.hidden) {
      return this._firstOption();
    }
    for (let el = option.nextElementSibling; el;) {
      if (!el.hidden && this._isValidAndEnabled(el)) {
        return el;
      }
      el = el.nextElementSibling;
    }
  }
  _previousOption() {
    const option = this._consideredOption || this._selectedOption;
    if (!this._isValidAndEnabled(option) || option.hidden) {
      return this._lastOption();
    }
    for (let opt = option.previousElementSibling; opt;) {
      if (!opt.hidden && this._isValidAndEnabled(opt)) {
        return opt;
      }
      opt = opt.previousElementSibling;
    }
  }
  _lastOption() {
    const option = this._allValidOptions();
    return Object.values(option)[option.length - 1];
  }
  _attachSelectOptionsToCaller() {
    const posCaller = this.caller.getBoundingClientRect();
    const posSelectOptions = this.selectOptions.getBoundingClientRect();
    const topCaller = posCaller.top;
    const offsetHeight = window.innerHeight - posCaller.bottom;
    const o = topCaller + posCaller.height;
    const s = offsetHeight + posCaller.height;
    this.selectOptions.style.minWidth = posCaller.width + 'px';
    if (offsetHeight < posSelectOptions.height) {
      if (topCaller > offsetHeight) {
        this.selectOptions.style.bottom = s + 'px';
        if (topCaller < posSelectOptions.height) {
          this.holder.style.maxHeight = topCaller - this.searchElm.clientHeight - 10 + 'px';
        }
      } else {
        this.selectOptions.style.top = o + 'px';
        this.holder.style.maxHeight = offsetHeight - this.searchElm.clientHeight - 10 + 'px';
      }
    } else {
      this.selectOptions.style.top = o + 'px';
      if (posSelectOptions.right > window.innerWidth) {
        this.selectOptions.style.right = '0px';
      }
      if (posSelectOptions.left < 0) {
        this.selectOptions.style.left = '0px';
      }
    }
  }
  _releaseSelectOptions() {
    this.holder.style.maxHeight = 'none';
    this.selectOptions.style.top = 'auto';
    this.selectOptions.style.bottom = 'auto';
    this.selectOptions.style.left = 'auto';
    this.selectOptions.style.right = 'auto';
  }
  _createChangeEvent() {
    const event = new CustomEvent('change', {
      target: this,
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  validateKeyCode(keyCode) {
    return keyCode > 47 && keyCode < 58 || keyCode === 32 || keyCode > 64 && keyCode < 91 || keyCode > 95 && keyCode < 112 || keyCode > 185 && keyCode < 193 || keyCode > 218 && keyCode < 223;
  }

  render() {
    return html`
      <div id="caller">
        <span id="chosen"></span>
        <span id="arrow">
          <span>&#8250;</span>
        </span>
      </div>
      <section id="selectOptions">
        <div id="search">
          <input type="text" spellcheck="false" tabindex="-1">
        </div>
        <div id="holder">
          <slot name="option" maxlength="20"></slot>
        </div>
      </section>
    `;
  }
}

window.customElements.define(RichSelect.is, RichSelect);