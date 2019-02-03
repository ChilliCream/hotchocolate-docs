---
id: custom-context
title: Custom Context Data
---

When implementing custom middlewares it can be useful to be able to store custom context data. This could be to build up a cache or other state data. Hot Chocolate has two types of context data that you can use.

## Global Context Data

The global custom context data is a thread-safe dictionary that is available in the `IQueryContext` and in the `IResolverContext`. This means you are able to share context data between query middleware components and field middleware components.

```csharp
builder.User(context => {
    context.ContextData["foo"] = "bar";
});
```

## Scoped Context Data

The scoped context data dictionary is only available in the `IResolverContext` and is represented by an immutable dictionary. It basically allows you to aggregate state for your sub field resolvers. Let`s say you have the following query:

```graphql
{
  a {
      b {
          c
      }
  }
  d {
      e {
          f
      }
  }
}
```

If the `a`-resolver would put something in the scoped context it's sub-tree could access that information. This means, `b` and `c` could access the data but not `d`, `e` and `f`.

This is how you store data in the scoped context data:

```csharp
context.ScopedContextData = context.ScopedContextData.SetItem("foo", "bar");
```