---
id: example-break
title: Break
---

A `Break` forces `Column`s inside a `Row` to split into new rows even if the `Column`s do not
exceed in size.

## Code

```html
<Container>
  <Row>
    <Column size="3">Top</Column>
    <Break />
    <Column size="3">Bottom</Column>
  </Row>
</Container>
```

## Preview

<iframe src="https://codesandbox.io/embed/j22zqr1m95?hidenavigation=1&initialpath=%2Fbreak&view=preview" class="example" sandbox="allow-scripts allow-same-origin"></iframe>
