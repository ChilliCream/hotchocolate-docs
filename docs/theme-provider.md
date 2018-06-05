---
id: theme-provider
title: ThemeProvider
---

The `ThemeProvider` helps to change default settings for the whole grid system. For example if you
do not like the way how breakpoints are configured you could create your own breakpoint map. The
default berakpoint map is configured as the Bootstrap V4.1 grid system. Please see below.

<!-- prettier-ignore -->
```json
{
  xs: 0,   // from 0 to 575
  sm: 576, // from 576 to 767
  md: 768, // from 768 to 991
  lg: 992, // from 992 to 1199
  xl: 1200 // from 1200 to endless
}
```

The `ThemeProvider` can be nested but there a some warnings you should keep in mind to avoid
appearance issues.

* Do not use the `ThemeProvider` directly inside a `Container` or `Row`.
* Only wrap a `Row` if there is no direct `Container` parent component.

Please see the following examples.

## Examples

### Example with Container

```html
// Bad
<Container>
  <ThemeProvider>
    <Row>
      <Column />
    </Row>
  <ThemeProvider>
</Container>

// Good
<ThemeProvider>
  <Container>
    <Row>
      <Column />
    </Row>
  </Container>
<ThemeProvider>
```

### Example without Container

```html
// Bad
<AnyComponentButNotContainer>
  <Row>
    <ThemeProvider>
      <Column />
    <ThemeProvider>
  </Row>
</AnyComponentButNotContainer>

// Good
<AnyComponentButNotContainer>
  <ThemeProvider>
    <Row>
      <Column />
    </Row>
  <ThemeProvider>
</AnyComponentButNotContainer>
```

### Example with nested ThemeProvider

```html
// Good
<ThemeProvider>
  <Container>
    <Row>
      <Column>
        <ThemeProvider>
          <Row>
            <Column />
          </Row>
        <ThemeProvider>
      </Column>
    </Row>
  </Container>
<ThemeProvider>
```

## Properties

All properties are optional.

### theme

Specifies the theme which should be applied.

* Type: `Theme`
* Default:

```json
{
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  containerWidth: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140
  },
  gutterWidth: 30
}
```
