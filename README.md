# <x-treeview>

A set of elements implementing a treeview:

- `<x-treeview>` The view itself
- `<x-treegroup>` A group of items
- `<x-treeitem>` A leaf node

## Features

### Keyboard navigation
- up/down: previous/next item
- right: expand a group
- left: collapse a group
- home: first item
- end: last item
- keypad \*: expand all groups
- enter: toggle group

### Mouse navigation
- double click to toggle
- click on toggle (+/-) to expand

## Usage

The standard usage of the component is as follows:

```html
<x-treeview>
  <x-treeitem>Leaf</x-treeitem>
  <x-treegroup>
    <x-treegroup>Empty Group</x-treegroup>
    <x-treegroup>
      Nested Group
      <x-treeitem>Leaf</x-treeitem>
    <x-treegroup>
  </x-treegroup>
<x-treeview>
```

A group may start as collapsed by declaring it with `aria-expanded="false"`.

```html
<x-treegroup aria-expanded="false">
  Group Label
  <x-treeitem>Leaf</x-treeitem>
</x-treegroup>
```

### custom items/groups

The `<x-treegroup>` and `<x-treeitem>` implementations are fairly barebones. You may want to implement more sophisticated custom elements for your groups or items. The `<x-treeview>` component can be used with other DOM elements for items/groups, given the following:

- items/groups have `role="treeitem"`
- items/groups have `tabindex="-1"`
- groups have an `aria-expanded="true"` or `aria-expanded="false"` attribute, depending on whether the group is expanded or not

### `<x-treegroup>` content

Additional items can be included as a child of a group by wrapping the group's children in an element with `role="group"` or if the element has `role="separator"`. Any additional content will become a part of the group's label.

```html
<x-treegroup>
  <span>:)</span> Group label
  <x-treeitem>First</x-treeitem>
  <div role="separator"></div>
  <x-itreeitem>Second</x-treeitem>
</x-treegroup>
```

## Accessibility Note

Due to the nature of shadow-dom, in order for some (all?) screen readers to properly announce group counts, you need to wrap any items belonging to a group with role="group" as follows:

```html
<x-treegroup>
  Group Label
  <div role="group">
    <x-treeitem>Leaf</x-treeitem>
    ...
  </div>
</x-treegroup>
```

## Requirements

- Element.createShadowRoot
- Element.closest
- CustomEvent constructor


This is not an official Google product.
