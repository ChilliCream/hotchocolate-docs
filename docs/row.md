---
id: row
title: Row
---

A `Row` splits `Column`s into vertical oriented boxes. A `Row` should only contain `Column`s to
avoid appearance issues. A `Row` contains one or more `Column`s and will break to a new line if one
or more `Column`s exceed in size. Below you will see a code example to get an idea of how it should
look like.

```html
<Container>
  <Row>
    <Column />
  </Row>
</Container>
```

## Properties

All properties are optional.

### alignContent

Defines how the space between and around `Column`s inside a `Row` is distributed.

* Type: `BreakpointValue<RowAlignContent>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"center"`, `"flex-end"`, `"flex-start"`, `"space-around"`, `"space-between"` or `"stretch"`
  * Multi Value: e.g. `{ md: "center", xl: "space-around" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column alignContent="flex-start" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column alignContent={{ xs: "space-around", md: "stretch" }} />
  </Row>
</Container>
```

### alignItems

Defines how the space between and around `Column`s inside a `Row` is distributed. It works like
`justifyContent` but in the perpendicular direction.

* Type: `BreakpointValue<RowAlignItems>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"baseline"`, `"center"`, `"flex-end"`, `"flex-start"` or `"stretch"`
  * Multi Value: e.g. `{ xs: "center", md: "baseline" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column alignItems="flex-start" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column alignItems={{ xs: "baseline", lg: "stretch" }} />
  </Row>
</Container>
```

### direction

Specifies how `Column`s are placed in a `Row`.

* Type: `BreakpointValue<RowDirection>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"column"`, `"column-reverse"`, `"row"` or `"row-reverse"`
  * Multi Value: e.g. `{ sm: "column", md: "row" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column direction="column-reverse" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column direction={{ xs: "row", xl: "row-reverse" }} />
  </Row>
</Container>
```

### justifyContent

Defines how the space between and around `Column`s inside a `Row` is distributed.

* Type: `BreakpointValue<RowJustifyContent>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"center"`, `"flex-end"`, `"flex-start"`, `"space-around"` or `"space-between"`
  * Multi Value: e.g. `{ sm: "center", lg: "flex-start" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column justifyContent="center" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column justifyContent={{ sm: "flex-start", xl: "space-between" }} />
  </Row>
</Container>
```

### noGutter

Determines whether the gutter is disabled.

* Type: `BreakpointValue<boolean>`
* Default: `false`
* Possible Values:
  * Single Value: `false` or `true`
  * Multi Value: e.g. `{ xs: true, sm: false }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column noGutter="true" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column noGutter={{ sm: true, xl: false }} />
  </Row>
</Container>
```

### wrap

Specifies whether `Column`s are forced into a single line or can be wrapped onto multiple lines.
If wrapping is allowed, this property also enables you to control the direction in which lines are
stacked.

* Type: `BreakpointValue<RowWrap>`
* Default: `wrap`
* Possible Values:
  * Single Value: `"nowrap"`, `"wrap"` or `"wrap-reverse"`
  * Multi Value: e.g. `{ md: "wrap", lg: "nowrap" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column wrap="wrap-reverse" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column wrap={{ sm: "wrap", md: "nowrap" }} />
  </Row>
</Container>
```
