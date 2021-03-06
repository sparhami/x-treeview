/*
@license
Copyright 2015 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const tmpl = document.createElement('template');
tmpl.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      outline: none;
    }

    #label {
      padding: 0 2px;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    #items {
      order: 1;
      margin-left: 6px;
    }

    #toggler::before {
      padding: 4px;
      font-family: monospace;
    }

    :host([aria-selected="true"]) #label::after {
      background-color: #E0E0E0;
    }

    :host(:focus) #label::after {
      background-color: var(--active-background-color);
    }

    :host(:focus) #label {
      color: var(--active-color);
    }

    :host([aria-selected="true"]) #label::after,
    :host(:focus) #label::after {
      z-index: -1;
      position: absolute;
      left: 0;
      right: 0;
      content: "\\2002";
    }

    :host([aria-expanded="false"]) #items {
      display: none;
    }

    :host([aria-expanded="true"]) #toggler::before {
      content: '-';
    }

    :host([aria-expanded="false"]) #toggler::before {
      content: '+';
    }
  </style>

  <div id='items' role='group'>
    <slot></slot>
  </div>
  <div id='label'>
    <span id='toggler'></span>
    <slot name="title"></slot>
  </div>
`;

class XTreeGroup extends HTMLElement {
  constructor() {
    super();

    const sr = this.attachShadow({ mode: 'closed' });
    sr.appendChild(tmpl.content.cloneNode(true));
    const toggler = sr.getElementById('toggler');

    toggler.addEventListener('click', this.handleClick.bind(this));
  }

  connectedCallback() {
    this.tabIndex = -1;
    this.setAttribute('role', 'treeitem');
    this.setAttribute('aria-expanded', this.isExpanded());
  }

  isExpanded() {
    return this.getAttribute('aria-expanded') !== 'false';
  }

  setExpanded(expanded) {
    this.setAttribute('aria-expanded', expanded);
  }

  handleClick() {
    this.setExpanded(!this.isExpanded());
  }
}

customElements.define('x-treegroup', XTreeGroup);

export default XTreeGroup;
