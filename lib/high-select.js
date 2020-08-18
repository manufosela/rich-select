customElements.define("high-select", class extends HTMLElement {
    static get observedAttributes() {
      return ["expanded", "disabled"]
    }
    set value(t) {
      if ("string" == typeof t || "number" == typeof t) {
        const e = this._allValidOptions();
        for (let i of e)
          if (i.value == t) return void(i.selected = !0)
      }
    }
    get value() {
      return this._selectedOption ? this._selectedOption.value : ""
    }
    set expanded(t) {
      Boolean(t) ? this.setAttribute("expanded", "") : this.removeAttribute("expanded")
    }
    get expanded() {
      return this.hasAttribute("expanded")
    }
    set disabled(t) {
      Boolean(t) ? this.setAttribute("disabled", "") : this.removeAttribute("disabled")
    }
    get disabled() {
      return this.hasAttribute("disabled")
    }
    constructor() {
      super(), this._onSlotChange = this._onSlotChange.bind(this), this._onCallerClick = this._onCallerClick.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this.attachShadow({
        mode: "open"
      }), this.shadowRoot.appendChild(i.content.cloneNode(!0)), this._optionSlot = this.shadowRoot.querySelector("slot[name=option]"), this.caller = this.shadowRoot.querySelector("#caller"), this.chosen = this.caller.firstElementChild, this.arrowElm = this.caller.children[1], this.bigot = this.shadowRoot.querySelector("#bigot"), this.searchElm = this.bigot.firstElementChild, this.input = this.searchElm.firstElementChild, this.holder = this.bigot.children[1], this._animated = this.hasAttribute("animated"), this._optionSlot.addEventListener("slotchange", this._onSlotChange), this.caller.addEventListener("click", this._onCallerClick), this.input.addEventListener("keyup", this._onKeyUp), document.addEventListener("scroll", function() {
        this.expanded && (this.expanded = !1, this.focus())
      }.bind(this)), this._animated || this._setHidden(!0)
    }
    connectedCallback() {
      this.addEventListener("blur", this._onBlur), this.addEventListener("mousedown", this._onMouseDown), this.addEventListener("mouseup", this._onMouseUp), this.addEventListener("keydown", this._onKeyDown), customElements.whenDefined("high-option").then(t => {
        this._initializing()
      })
    }
    disconnectedCallback() {
      this.caller.removeEventListener("click", this._onCallerClick), this.input.removeEventListener("keyup", this._onKeyUp), this.removeEventListener("blur", this._onBlur), this.removeEventListener("mousedown", this._onMouseDown), this.removeEventListener("mouseup", this._onMouseUp), this.removeEventListener("keydown", this._onKeyDown)
    }
    attributeChangedCallback() {
      this.expanded ? this._expand() : this._collapse(), this.disabled ? (this.blur(), this.setAttribute("tabindex", "-1")) : this.setAttribute("tabindex", 0)
    }
    _onSlotChange() {
      this._initializing()
    }
    _onCallerClick() {
      this._toggle()
    }
    _onMouseDown(t) {
      let e = t.target.closest("high-option");
      this._isValidAndEnabled(e) && (e.considered = !0)
    }
    _onMouseUp(t) {
      const e = t.target.closest("high-option");
      this._isValidAndEnabled(e) && (this._select(e), this.expanded = !1)
    }
    _onKeyDown(i) {
      let n;
      switch (i.keyCode) {
        case t.HOME:
          i.preventDefault(), (n = this._firstOption()) && (this.expanded ? n.considered = !0 : this._select(n));
          break;
        case t.ARROW_UP:
          i.preventDefault(), (n = this._previousOption()) && (this.expanded ? n.considered = !0 : this._select(n));
          break;
        case t.ARROW_DOWN:
          i.preventDefault(), (n = this._nextOption()) && (this.expanded ? n.considered = !0 : this._select(n));
          break;
        case t.END:
          i.preventDefault(), (n = this._lastOption()) && (this.expanded ? n.considered = !0 : this._select(n));
          break;
        case t.ESC:
          i.preventDefault(), this.expanded = !1, this.focus();
          break;
        case t.ENTER:
          i.preventDefault(), this.expanded ? this._consideredOption && (this._select(this._consideredOption), this.expanded = !1, this.focus()) : this.expanded = !0;
          break;
        default:
          this.expanded || e(i.keyCode) && (this.input.focus(), this.expanded = !0)
      }
    }
    _onKeyUp(t) {
      t.target.value !== this._searchContent && (this._searching(t.target.value.trim().toLowerCase()), this._searchContent = t.target.value)
    }
    _onBlur() {
      this.expanded = !1
    }
    _initializing() {
      const t = this._allOptions();
      !this._selectedOption && t.length && (this._firstOption().selected = !0), this.hasAttribute("tabindex") || this.setAttribute("tabindex", "0"), this.options = t
    }
    _expand() {
      this._setHidden(!1), this._attachBigotToCaller(), this.input.focus(), this._selectedOption && this._selectedOption.scrollIntoView({
        block: "center"
      })
    }
    _collapse() {
      this._setHidden(!0), this._releaseBigot(), this._consideredOption && (this._consideredOption.considered = !1, this._consideredOption = null), this._resetSearch()
    }
    _setHidden(t) {
      this._animated || (this.bigot.hidden = t)
    }
    _toggle() {
      this.expanded = !this.expanded
    }
    _select(t) {
      this._isValidAndEnabled(t) && t !== this._selectedOption && (t.selected = !0, this._createChangeEvent())
    }
    _transcend(t) {
      this._isValidAndEnabled(t) && this._selectedOption !== t && (this._selectedOption && (this._selectedOption.selected = !1), this._selectedOption = t, this.chosen.innerHTML = t.content)
    }
    _consider(t) {
      this._isValidOption(t) && this._consideredOption !== t && (this._consideredOption && (this._consideredOption.considered = !1), this._consideredOption = t, t.scrollIntoView({
        block: "nearest"
      }))
    }
    _searching(t) {
      let e, i, n;
      for (n of this.options) this._isValidOption(n) && (e = -1 === n.record.toLowerCase().indexOf(t)), i = -1 === n.innerText.toLowerCase().indexOf(t), n.hidden = i && e;
      if (!this._isValidAndEnabledAndVisible(this._consideredOption) && !this._isValidAndEnabledAndVisible(this._selectedOption)) {
        const t = this._firstOption();
        t && (t.considered = !0)
      }
    }
    _resetSearch() {
      if (this.input.value) {
        this.input.value = "", this._searchContent = "";
        for (let t of this.options) t.hidden = !1
      }
    }
    _isValidOption(t) {
      return t instanceof n && "high-option" === t.tagName.toLowerCase()
    }
    _isValidAndEnabled(t) {
      return this._isValidOption(t) && !t.disabled
    }
    _isValidAndEnabledAndVisible(t) {
      return this._isValidAndEnabled(t) && !t.hidden
    }
    _allOptions() {
      return Array.from(this.children)
    }
    _allValidOptions() {
      return Array.from(this.querySelectorAll("high-option:not([hidden]):not([disabled])"))
    }
    _firstOption() {
      return this.querySelector("high-option:not([disabled]):not([hidden])")
    }
    _nextOption() {
      const t = this._consideredOption || this._selectedOption;
      if (!this._isValidAndEnabled(t) || t.hidden) return this._firstOption(); {
        let e = t.nextElementSibling;
        for (; e;) {
          if (!e.hidden && this._isValidAndEnabled(e)) return e;
          e = e.nextElementSibling
        }
      }
    }
    _previousOption() {
      const t = this._consideredOption || this._selectedOption;
      if (!this._isValidAndEnabled(t) || t.hidden) return this._lastOption(); {
        let e = t.previousElementSibling;
        for (; e;) {
          if (!e.hidden && this._isValidAndEnabled(e)) return e;
          e = e.previousElementSibling
        }
      }
    }
    _lastOption() {
      const t = this._allValidOptions();
      return Object.values(t)[t.length - 1]
    }
    _attachBigotToCaller() {
      const t = this.caller.getBoundingClientRect(),
        e = this.bigot.getBoundingClientRect(),
        i = t.top,
        n = window.innerHeight - t.bottom,
        o = i + t.height,
        s = n + t.height;
      this.bigot.style.minWidth = t.width + "px", n < e.height ? i > n ? (this.bigot.style.bottom = s + "px", i < e.height && (this.holder.style.maxHeight = i - this.searchElm.clientHeight - 10 + "px")) : (this.bigot.style.top = o + "px", this.holder.style.maxHeight = n - this.searchElm.clientHeight - 10 + "px") : this.bigot.style.top = o + "px", e.right > window.innerWidth && (this.bigot.style.right = "0px"), e.left < 0 && (this.bigot.style.left = "0px")
    }
    _releaseBigot() {
      this.holder.style.maxHeight = "none", this.bigot.style.top = "auto", this.bigot.style.bottom = "auto", this.bigot.style.left = "auto", this.bigot.style.right = "auto"
    }
    _createChangeEvent() {
      const t = new CustomEvent("change", {
        target: this,
        bubbles: !0
      });
      this.dispatchEvent(t)
    }
  });

  class n extends HTMLElement {
    static get observedAttributes() {
      return ["selected", "considered", "disabled"]
    }
    set selected(t) {
      Boolean(t) ? this.setAttribute("selected", "") : this.removeAttribute("selected")
    }
    get selected() {
      return this.hasAttribute("selected")
    }
    set considered(t) {
      Boolean(t) ? this.setAttribute("considered", "") : this.removeAttribute("considered")
    }
    get considered() {
      return this.hasAttribute("considered")
    }
    set disabled(t) {
      Boolean(t) ? this.setAttribute("disabled", "") : this.removeAttribute("disabled")
    }
    get disabled() {
      return this.hasAttribute("disabled")
    }
    set value(t) {
      t ? this.setAttribute("value", t) : this.removeAttribute("value")
    }
    get value() {
      if (this.hasAttribute("value")) return this.getAttribute("value"); {
        const t = this.innerText.trim().toLowerCase();
        return t || this.title
      }
    }
    set title(t) {
      t ? this.setAttribute("title", t) : this.removeAttribute("title")
    }
    get title() {
      return this.hasAttribute("title") ? this.getAttribute("title") : ""
    }
    set record(t) {
      t ? this.setAttribute("record", t) : this.removeAttribute("record")
    }
    get record() {
      return this.hasAttribute("record") ? this.getAttribute("record") : this.title
    }
    set slot(t) {
      this.setAttribute("slot", "option")
    }
    get slot() {
      return this.hasAttribute("slot") ? this.getAttribute("slot") : ""
    }
    get content() {
      return this.title ? this.title : this.innerHTML
    }
    constructor() {
      super()
    }
    connectedCallback() {
      "option" !== this.slot && (this.slot = ""), this._upgradeProperty("selected"), this._upgradeProperty("considered"), this._upgradeProperty("disabled")
    }
    attributeChangedCallback() {
      const t = this._haveValidParent() && !this.disabled;
      this.selected && t && this.parentNode._transcend(this), this.considered && t && this.parentNode._consider(this), this.disabled && (this.selected = !1, this.considered = !1)
    }
    _upgradeProperty(t) {
      if (this.hasOwnProperty(t)) {
        let e = this[t];
        delete this[t], this[t] = e
      }
    }
    _haveValidParent() {
      return !!this.parentNode && "high-select" === this.parentNode.tagName.toLowerCase()
    }
  }
  customElements.define("high-option", n)
