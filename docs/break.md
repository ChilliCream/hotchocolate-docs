---
id: break
title: Break
---

A `Break` forces `Column`s inside a `Row` to split into new rows even if the `Column`s do not
exceed in size. A `Break` should not contain any children and has no properties at all.
Below you will see how it works.

```html
<Container>
  <Row>
    <Column size="3">Top</Column>
    <Break />
    <Column size="3">Bottom</Column>
  </Row>
</Container>
```

The example above will translate into the following.

<iframe src="https://codesandbox.io/embed/j22zqr1m95?hidenavigation=1&initialpath=%2Fbreak&view=preview" class="example" sandbox="allow-scripts allow-same-origin"></iframe>
