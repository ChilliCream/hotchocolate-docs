---
id: cs-object-type
title: Object Type
---

The object type is the most prominent type in GraphQL. There are currently two ways to describe an object type with the code-first approach.

## ObjectType\<T\>

The first approach is by using the generic object type class which lets you specify an entity type that shall represent your schema type in .net. The object type descriptor will then try to automatically infer the GraphQL schema type from your .net type.

```csharp
public class Query
{
  public string GetHello() => "World";
}

public class QueryType
  : ObjectType<Query>
{

}
```

```graphql
type Query {
  hello: String
}
```

In order to specify you intend more explicitly you can opt to use the `IObjectTypeDescriptor<Query>` that is accessible by overriding the configure method of the `QueryType`.

```csharp
public class Query
{
  public string GetHello() => "World";
}

public class QueryType
  : ObjectType<Query>
{
    protected override void Configure(IObjectTypeDescriptor<Query> desc)
    {
        desc.Field(t => t.GetHello()).Type<NonNullType<StringType>>();
    }
}
```

```graphql
type Query {
  hello: String!
}
```

## Object Type Descriptoren

The following table shows the object type descriptor options:

| Name                                                      | Description                                                                                    |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Name(string name)                                         | Defines the name of the object type. |
| Description(string description)                           | Defines the description of the object type that will be accessible through the introspection. |
| Interface\<T\>()                                          | Specifies an interface type that is implemented by this object type. |
| IsOfType(IsOfType isOfType)                               | Defines a function that specifies if a specific resolver type is of the specified object type. |
| BindFields(BindingBehavior bindingBehavior)               | Specifies the field binding behaviour. |
| Field\<TValue\>(Expression\<Func\<T, TValue\>\> propertyOrMethod) | Specifies field configuration of a method or property decalred in T. |
| Field(string name)                                        | Specifies a field that does not exist in T. |

### Name

The object type descriptor will by default resolve the name of the schema type from the provided type argument. If the type is anotated with the GraphQLNameAttribute than the name attribute will take precedence over the type name. The explicitly specified name will take precedence over both.

Example name from type:

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{

}
```

```graphql
type Bar {
  foo: String
}
```

Example name from attribute:

```csharp
[GraphQLName("Foo")]
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{

}
```

```graphql
type Foo {
  foo: String
}
```



Example explicit name:

```csharp
[GraphQLName("Foo")]
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Name("Foo123");
    }
}
```

```graphql
type Foo123 {
  foo: String
}
```

### Description

The description of a type will provide an additional text that describes a type to the schema introspection. This is useful with tools like GraphiQL. GraphQL descriptions are defined using the Markdown syntax (as specified by [CommonMark](http://commonmark.org)).

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Description("Lorem ipsum dolor sit amet, consectetur adipiscing elit...");
    }
}
```

```graphql
"""
Lorem ipsum dolor sit amet, consectetur adipiscing elit...
"""
type Bar {
  foo: String
}
```

### IsOfType

The object type descriptor will by default use an instance of approach to figure out if a resolver result is of a certain object type. In some cases when you either have no explicit type binding or you use a .net net type in multiple schema types it is necessary to specify a IsOfType delegate that determines the type of a resolver result.

```csharp
public class Bar
{
  public string Foo { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.IsOfType((context, result) => result is string s && s == "bar");
    }
}
```

### BindFields

The object type descriptor will by default scan the provided entity type for additional fields. In some cases you might want to specify all the fields explicitly in order to have a more predictable schema. You might not want that a property or method that you add to your types automatically shows up in your schema. In those cases you can change the field bining behaviour to explicit.

```csharp
public class Bar
{
  public string Foo1 { get; set; }
  public string Foo2 { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.BindFields(BindingBehaviour.Explicit);
        desc.Field(t => t.Foo1);
    }
}
```

```graphql
type Bar {
  foo1: String
}
```

### Field

There are two ways to define fields. First you can specify a field configuration by pointing to a property or method that is declared in your .net type.

```csharp
public class Bar
{
  public string Xyz { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Field(t => t.Xyz).Name("foo");
    }
}
```

```graphql
type Bar {
  foo: String
}
```

Second, you can define fields that do not have any representation in your .net type.

```csharp
public class Bar
{
  public string Xyz { get; set; }
}

public class BarType
  : ObjectType<Bar>
{
    protected override void Configure(IObjectTypeDescriptor<Bar> desc)
    {
        desc.Field("foo").Resolver(() => "hello world");
    }
}
```

```graphql
type Bar {
  xyz: String
  foo: String
}
```

The field descriptor options are described in more detail [here](CS_Object_Type_Field_Configuration.md).

## ObjectType

The second approach to describe object types is with the non-generic object type. The non-generic type does not necessarily have a fixed .net type binding. This means that you have more flexibility in defining your schema type and how the data flows through the query engine.

```csharp
public class BarType
  : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor desc)
    {
        desc.Field("foo").Resolver(() => "hello world");
    }
}
```

```graphql
type Bar {  
  foo: String
}
```

Compared to the generic descriptor interface you are loosing the generic field descriptor that is able to bind a field to a .net property or method.
