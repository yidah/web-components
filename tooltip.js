// 1. We need to extend from HTMLElement base class
// and pass super() in the constructor
// that will initialize the contructor of the base clase
class Tooltip extends HTMLElement {
  // component logic
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipText = 'Default value';
    this._tooltipIcon;

    // Allow us to work with Shadow DOM so styles in the light (real) DOM do not affect our component
    this.attachShadow({ mode: 'open' });

    // Allow us to set styles without the need to add a template to the html (real DOM)
    // this in turn makes our component easy to use in other apps
    // shadowRoot gets created with the line above this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            div{
                font-weight: normal;
                background-color:black;
                color:white;
                position: absolute;
                top: 1.5rem;
                left: 0.75rem;
                z-index: 10;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0,0,0,0.26);
            }

            .highlight{
              background-color:red;
            }
            
            :host(.important){
              background:var(--color-primary, #ccc);
              padding:0.15rem;

            }

            :host-context(p){
              font-weight:bold;
            }

            ::slotted(.highlight){s
              border-bottom:1px dotted red;
            }

            .icon {
              background:black;
              color:white;
              padding: 0.15rem 0.5rem;
              text-align:center;
              border-radius:50%
            }

        </style>
        <slot>Slot to put something between component tags otherwise this text by default</slot>
        <span class="icon">?</span>
    `;
    // IMPORTANT NOTE: By default content in slots are not part of the shadow DOM but the light one (real one)
    // add default styles using seudo :: slotted 
    // :host to add styles to the custom element itself (<kbty-tooltip></kbty-tooltip>) :host-context to add styles to the custom element depending its position (inisde or outside paragraph etc)
    // but keep in mind they will be overwrite for styles in the light DOM
  
  }
  // this function let us access the DOM
  connectedCallback() {
    // Defining attributes for our custom element (here as we need to access the DOM)
    if (this.hasAttribute('text')) {
      this._tooltipText = this.getAttribute('text');
    }

    // Create elments programatically. Styles can be assigned programatically too
    this._tooltipIcon = this.shadowRoot.querySelector('span');
    this._tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    this._tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.style.position = 'relative';

  }

  // Watch for changes in the attributes. IMPORTANT add observedAttributes 
  attributeChangedCallback(name, oldValue, newValue){
    // console.log(name,oldValue,newValue);
    if(oldValue === newValue){
      return;
    }
    if (name=== 'text'){
      this._tooltipText = newValue;
    }

  }

  // only add to the array the properties you need to watch for changes
  static get observedAttributes(){
    return ['text'];
  }

  // triggers when the element gets removed from the DOM
  disconnectedCallback(){
    console.log('The listeners will be removed');
    // Note this clean job is as example this does not remove the listeners we created because we use the function binds
    this._tooltipIcon.removeEventListener('mouseenter',this._showTooltip);
    this._tooltipIcon.removeEventListener('mouseleave',this._hideTooltip);
    console.log('The listeners have been removed');

  }

  // _indicates it is private method that should not be called (if I want I can access as private methods do not exist in JavaScript)
  _showTooltip() {
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = this._tooltipText;
    this.shadowRoot.appendChild(this._tooltipContainer);
  }

  _hideTooltip() {
    this.shadowRoot.removeChild(this._tooltipContainer);
  }
}

// 2.Register custom elements
// a. custom tag name, always with - to differenciate from normal html tags
// we could have the company name or abbreviation in the first part of the name
// b. class that holds the logic for my component
customElements.define('kbty-tooltip', Tooltip);
