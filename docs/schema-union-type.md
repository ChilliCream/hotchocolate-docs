---
id: schema-union-type
title: Union Type
---

The union type represents a set of object types. This means that by using a union as a field type we can say that the return object will be one of the object types specified in the union types set.

```GraphQL
union FooOrBar = Foo | Bar
```

