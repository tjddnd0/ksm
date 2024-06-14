import { LitElement, html, css } from 'lit-element';

class MyElement extends LitElement {
    static styles = css`
button {
background-color: lightblue;
}
`;

    handleClick() {
        alert('Button clicked!');
    }

    render() {
        return html`
<button @click="${this.handleClick}">Click me</button>
`;
    }
}

alert('ddd');