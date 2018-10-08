---
id: directive-middleware
title: Middleware
---

## Introduction

Directives provide a way in GraphQL to add annotations to the type system or query elements. These annotations can be used to provide meta data for code generators or even to change the execution behavior of the query engine on a GraphQL server.

You can specify a directive by inehriting from `DirectiveType`:

```csharp
public class MyDirective
    : DirectiveType
{
    protected override void Configure(IDirectiveTypeDescriptor descriptor)
    {
        descriptor.Name("my");
        descriptor.Location(DirectiveLocation.Field);
    }
}
```

In order to use a directive it has to be registered with the schema.

```csharp
Schema.Create(c => 
{
    c.RegisterDirective<MyDirective>();
});
```

GraphQL specifies three directives in the spec (skip, include and depricated) which are always registered with your schema.

The skip and include directives can be used in queries to in- or exclude fields from your query.

```graphql
query foo($hideField: Boolean = false){
    hello @skip(if: $hideField)
}
```

## Typed Arguments

Directive can have arguments that can be used to make them more flexible. So, if we had a directive like the following:

```csharp
public class MyDirective
    : DirectiveType
{
    protected override void Configure(IDirectiveTypeDescriptor descriptor)
    {
        descriptor.Name("my");
        descriptor.Argument("name").Type<NonNullType<StringType>>();
        descriptor.Location(DirectiveLocation.Object);
    }
}
```

We could associate the `MyDirective` with an object like this:

```csharp
public class FooType
    : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Name("Foo");
        descriptor.Directive("my", new StringValue("bar"));
        ...
    }
}
```

Since, adding a directive with its name and some values is not optimal because the name could change and you do not now the argument structure we have added a generic directive type.

The generic directive type declares the .net type that represents a directive instance.

```csharp
public class MyDirectiveType
    : DirectiveType<MyDirective>
{
    protected override void Configure(IDirectiveTypeDescriptor descriptor)
    {
        descriptor.Name("my");
        ...
    }
}

public class MyDirective
{
    public string Name { get; set; }
}
```

The generic directive type works similar to the generic input object type. The directive descriptor will automatically try to discover any properties and expose those as arguments.

So, with our new directive in place we could add now add it to our object type like the following:

```csharp
public class FooType
    : ObjectType
{
    protected override void Configure(IObjectTypeDescriptor descriptor)
    {
        descriptor.Name("Foo");
        descriptor.Directive(new MyDirective { Name = "bar" });
        ...
    }
}
```

## Middleware

What makes directive with Hot Cocolate very useful is the ability to associate a middleware with a dirctive that overwrites / alternates the default field resolver behaviour of a field.

In order to add a middleware to a directive you could declare it with the descriptor as a delegate.

```csharp
public class MyDirectiveType
    : DirectiveType<MyDirective>
{
    protected override void Configure(IDirectiveTypeDescriptor descriptor)
    {
        descriptor.Name("my");
        descriptor.Location(DirectiveLocation.Object);
        descriptor.Middleware(next => context =>
        {
            context.Result = "Bar";
            return next.Invoke();
        })
    }
}

public class MyDirective
{
    public string Name { get; set; }
}
```

In GraphQL the directive order is significant and with our middlewares we use the order of directives to create a middleware pipeline through which the results flow.

