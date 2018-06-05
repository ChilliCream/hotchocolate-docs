---
id: column
title: Column
---

A `Column` is the smallest entity within the grid system and can contain any component even a
`Container` or `Row` to create nested grids. Below you will see it in action.

```html
<Container>
  <Row>
    <Column>Outer column left</Column>
    <Column>
      <Container>
        <Row>
          <Column>Inner column left</Column>
          <Column>Inner column right</Column>
        </Row>
      </Container>
    </Column>
  </Row>
</Container>
```

## Properties

All properties are optional.

### alignSelf

Aligns `Column`s inside a `Row` and overrides the `alignItems` value of the current `Row`.
If the `size` of a `Column` is set to `none` then the value of `alignSelf` is ignored.

* Type: `BreakpointValue<ColumnAlignSelf>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"baseline"`, `"center"`, `"flex-end"`, `"flex-start"` or `"stretch"`
  * Multi Value: e.g. `{ sm: "center", lg: "flex-start" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column alignSelf="flex-end" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column alignSelf={{ xs: "flex-end", md: "center" }} />
  </Row>
</Container>
```

### flex

Specifies how a `Column` will grow or shrink so as to fit the space available in its `Row`.

* Type: `BreakpointValue<ColumnFlex>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"grow"`, `"none"` or `"shrink"`
  * Multi Value: e.g. `{ sm: "grow", lg: "shrink" }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column flex="grow" />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column flex={{ xs: "shrink", md: "none", lg: "grow" }} />
  </Row>
</Container>
```

### offset

Moves `Column`s to the right.

* Type: `BreakpointValue<ColumnOffset>`
* Default: `undefined`
* Possible Values:
  * Single Value: `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10` or `11`
  * Multi Value: e.g. `{ sm: 1, lg: 5, xl: 8 }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column flex={3} />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column flex={{ xs: 2, md: 6, lg: 8 }} />
  </Row>
</Container>
```

### order

Specifies the order used to lay out a `Column` in its `Row`. `Column`s within the same `Row` are
laid out in ascending order according to their order values. `Column`s with the same order value
are laid out in the order in which they appear in the source code.

* Type: `BreakpointValue<ColumnOrder>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"first"`, `"last"`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11` or `12`
  * Multi Value: e.g. `{ sm: "first", xl: 5 }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column flex={4} />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column flex={{ xs: "last", md: 3, lg: "first" }} />
  </Row>
</Container>
```

### size

Specifies the size of a `Column` within the same `Row`.

* Type: `BreakpointValue<ColumnSize>`
* Default: `undefined`
* Possible Values:
  * Single Value: `"auto"`, `"none"`, `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`, `10`, `11` or `12`
  * Multi Value: e.g. `{ sm: "none", md: 5 }`

**Single Value Example**

```tsx
<Container>
  <Row>
    <Column flex={7} />
  </Row>
</Container>
```

**Multi Value Example**

```tsx
<Container>
  <Row>
    <Column flex={{ sm: "auto", xl: 1 }} />
  </Row>
</Container>
```
