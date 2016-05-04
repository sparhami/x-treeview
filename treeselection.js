/**
 * @license
 * Copyright 2015 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const attachTreeSelection = (function() {
  const filter = {
    acceptNode: function(node) {
      const role = node.getAttribute('role');

      if (role === 'treeitem') {
        return NodeFilter.FILTER_ACCEPT;
      }

      return NodeFilter.FILTER_SKIP;
    }
  };

  function isExpandedGroup(el) {
    return el.getAttribute('aria-expanded') === 'true';
  }

  function isGroup(el) {
    return el.hasAttribute('aria-expanded');
  }

  function setExpanded(el, expanded) {
    el.setAttribute('aria-expanded', expanded);
  }

  function setSelected(el, selected) {
    const evtName = selected ? 'selected' : 'deselected';

    el.tabIndex = selected ? 0 : -1;
    el.setAttribute('aria-selected', selected);
    el.dispatchEvent(new CustomEvent(evtName, {
      bubbles: true 
    }));
  }

  function toggleExpanded(el) {
    if (isGroup(el)) {
      setExpanded(el, !isExpandedGroup(el));
    }
  }

  function first(walker) {
    walker.currentNode = walker.root;
    walker.nextNode();
    walker.currentNode.focus();
  }

  function last(walker) {
    walker.currentNode = walker.root;
    while(walker.lastChild() && isExpandedGroup(walker.currentNode));
    walker.currentNode.focus();
  }

  function handleBoundary(walker, forward, wrap) {
    if (forward == wrap) {
      first(walker);
    } else {
      last(walker);
    }
  }

  function next(walker, wrap, trap) {
    if (walker.currentNode === walker.root) {
      first(walker);
    } else if (trap) {
      if (!walker.nextSibling() && wrap) {
        while(walker.previousSibling());
      }
    } else if (isExpandedGroup(walker.currentNode)) {
      walker.firstChild();
    } else {
      while(!walker.nextSibling()) {
        if (!walker.parentNode()) {
          handleBoundary(walker, true, wrap);
          break;
        }
      }
    }

    walker.currentNode.focus();
  }

  function previous(walker, wrap, trap) {
    if (walker.currentNode === walker.root) {
      last(walker);
    } else if (trap) {
      if (!walker.previousSibling() && wrap) {
        while(walker.nextSibling());
      }
    } else if (!walker.previousSibling()) {
      if (!walker.parentNode()) {
        handleBoundary(walker, false, wrap);
      }
    } else {
      while(isExpandedGroup(walker.currentNode) && walker.lastChild());
    }

    walker.currentNode.focus();
  }

  function rightArrow(walker) {
    if (!isGroup(walker.currentNode)) {
      return;
    }

    setExpanded(walker.currentNode, true);
    walker.firstChild();
    walker.currentNode.focus();
  }

  function leftArrow(walker) {
    if (isExpandedGroup(walker.currentNode)) {
      setExpanded(walker.currentNode, false);
    } else {
      walker.parentNode();
    }

    walker.currentNode.focus();
  }

  function expandAll(walker) {
    const groups = walker.root.querySelectorAll('[aria-expanded]');
    for (let i = 0; i < groups.length; i += 1) {
      setExpanded(groups[i], true);
    }
  }

  return function(el, config) {
    const { wrap, trap } = config || {};
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, filter);
    let selected = walker.root;

    el.addEventListener('keydown', function(e) {
      let handled = true;

      switch (e.keyCode) {
        case 13: // enter
          toggleExpanded(walker.currentNode);
          break;
        case 35: // end
          last(walker);
          break;
        case 36: // home
          first(walker);
          break;
        case 37: // left
          leftArrow(walker);
          break;
        case 38: // up
          previous(walker, wrap, trap);
          break;
        case 39: // right
          rightArrow(walker);
          break;
        case 40: // down
          next(walker, wrap, trap);
          break;
        case 106: // keypad *
          expandAll(walker);
          break;
        default:
          handled = false;
          break;
      }

      if (handled) {
        e.preventDefault();
      }
    });

    el.addEventListener('focus', function(e) {
      const item = e.target.closest('[role="treeitem"]');

      if (!item || item === selected) {
        return;
      }

      if (selected) {
        setSelected(selected, false);
      }

      walker.currentNode = selected = item;
      setSelected(selected, true);
    }, true);

    el.addEventListener('dblclick', function(e) {
      const item = e.target.closest('[role="treeitem"]');

      if (!item) {
        return;
      }

      toggleExpanded(item);      
      e.stopPropagation();
    });
  }
})();
