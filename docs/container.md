---
id: container
title: Container
---

A `Container` is the most outer component in the grid system. A `Container` should only contain
`Row`s to avoid appearance issues. A `Container` contains one or more `Row`s. Below you will see a
little code example to get an idea of how the grid system is structured.

```html
<Container>
  <Row>
    <Column />
  </Row>
</Container>
```

The `Container` is an optinal component within the grid system. This means the following example is
valid as well.

```html
<Row>
  <Column />
</Row>
```

## Properties

All properties are optional.

### fluid

Determines whether the `Container` has a fixed width or fills the complete width. This property has
no effect if `fullscreen` is set to `true`.

* Type: `boolean`
* Default: `false`
* Possible Values: `false` or `true`

**Example**

```tsx
<Container fluid={true}>
  <Row>
    <Column />
  </Row>
</Container>
```

### fullscreen

Determinse wether the `Container` will fill the complete width and height.

* Type: `boolean`
* Default: `false`
* Possible Values: `false` or `true`

**Example**

```tsx
<Container fullscreen={true}>
  <Row>
    <Column />
  </Row>
</Container>
```

### width

Specifies the `Container` width. The `width` can be overriden by the `ThemeProvider` for
consistency purposes. The `width` has no effect if `fluid` or `fullscreen` is set to `true`.

* Type: `BreakpointValues<number>`
* Default: `{ sm: 540, md: 720, lg: 960, xl: 1140 }`
* Possible Values: e.g. `{ sm: 400, md: 600, lg: 800, xl: 1000 }`

**Example**

```tsx
<Container width={{ sm: 400, md: 600, lg: 800, xl: 1000 }}>
  <Row>
    <Column />
  </Row>
</Container>
```
