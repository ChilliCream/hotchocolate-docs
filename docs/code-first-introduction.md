---
id: code-first-introduction
title: Introduction
---

GraphQL basically specifies six type kinds excluding ListType and NonNullType:

- [Object Type](https://graphql.org/learn/schema/#object-types-and-fields)
- [Interface Type](https://graphql.org/learn/schema/#interfaces)
- [Union Type](https://graphql.org/learn/schema/#union-types)
- [Enum Type](https://graphql.org/learn/schema/#enumeration-types)
- [Scalar Type](https://graphql.org/learn/schema/#scalar-types)
- [Input Object Type](https://graphql.org/learn/schema/#input-types)

When describing your GraphQL API code-first you are starting with your existing code which is just common .net code. In order to give your types the right context in an GraphQL schema or more precisly to infer the GraphQL schema types from your .net APIs we are wrapping them into a generic types that correlate to the corresponding schema type kind.

Lets say we have a simpel .net type `Foo` that has one method `GetBar()` which returns a `System.String`:

```csharp
public class Foo
{
    public string GetBar() => "Some Result";
}
```

We cann add this type to our schema by registering it like the following:

```csharp
var schema = Schema.Create(c =>
{
  c.RegisterType<ObjectType<Foo>>();
})
```

By wrapping `Foo` as `ObjectType<Foo>` we essentially told the schema that `Foo` is an object type and the schema will try to infer the rest of this type automatically. So, without much effort we now have a GraphQL Schema that looks like this:

```graphql
type Foo {
  bar: String
}
```

In order declare our intention more precise the schema configuration API alows us to specify what we actually mean by using descriptors. The explict declaration takes in this case precedence over the auto-configuration. Moreover, we are also able to deactivate the auto-configuration completely.

There are basically to ways to describe our types explicitly. For smaller declarations we can pass into the constructor of a schema type a configuration delegate that specifies the schema type.

```csharp
var schema = Schema.Create(c =>
{
  c.RegisterType(new ObjectType<Foo>(d => d.Name("SuperFoo"));
})
```

Since, we would end up with a very long chain if you had to specify more than just the name you can also inherit from ObjectType<Foo> and override the Configure method.

```csharp
public class FooType : ObjectType<Foo>
{
    protected override void Configure(IObjectDescriptor<Foo> desc)
    {
        desc.Name("SuperFoo");
        desc.Field(t => t.Bar).Type<NonNullType<StringType>>();
    }
}
```

```graphql
type SuperFoo {
  bar: String!
}
```

Moreover, we can add additional fields that our .net type does not contain:

```csharp
public class FooType : ObjectType<Foo>
{
    protected override void Configure(IObjectDescriptor<Foo> desc)
    {
        desc.Name("SuperFoo");
        desc.Field(t => t.Bar).Type<NonNullType<StringType>>();
        desc.Field("NewField").Type<IntType>().Resolver(() => "hello"));
    }
}
```

For more help on the configuration of the specific types checkout the specific type descriptor help pages:

- [Object Type Descriptor](code-first-object-typemd)
- [Interface Type Descriptor](code-first-interface-typemd)
- [Union Type Descriptor](cf-union-type.md)
- [Enum Type Descriptor](code-first-enum-type.md)
- [Input Object Type Descriptor](cf-input-object-type.md)
