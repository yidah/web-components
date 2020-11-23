class ConfirmLink extends HTMLAnchorElement {
  connectedCallback() {
    this.addEventListener('click', (event) => {
      if (!confirm('Do you really want to leave?')) {
        event.preventDefault();
      }
    });
  }
}

// As we did not extend the normal HTMLElement but an specific elment then we need 
// to pass the element tag
customElements.define('kbty-confirm-link', ConfirmLink, {extends:'a'});