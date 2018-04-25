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
      display: block;
      outline: none;
      padding: 0 6px;
      margin-left: 17px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    :host([aria-selected="true"])::after {
      background-color: #E0E0E0;
    }

    :host(:focus)::after {
      background-color: var(--active-background-color);
    }

    :host(:focus) {
      color: var(--active-color);
    }

    :host([aria-selected="true"])::after,
    :host(:focus)::after {
      z-index: -1;
      position: absolute;
      left: 0;
      right: 0;
      content: "\\2002";
    }
  </style>

  <slot></slot>
`;

class XTreeItem extends HTMLElement {
  constructor() {
    super();

    const sr = this.attachShadow({ mode: 'closed' });
    sr.appendChild(tmpl.content.cloneNode(true));
  }

  connectedCallback() {
    this.tabIndex = -1;
    this.setAttribute('role', 'treeitem');
  }
}

customElements.define('x-treeitem', XTreeItem);

export default XTreeItem;
