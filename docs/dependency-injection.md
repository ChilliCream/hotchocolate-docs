---
id: dependency-injection
title: Dependency Injection
---

We are supporting dependency injection via the IServiceProvider-interface.

In order to hook up your dependency injection of choice with the GraphQL schema, register the service provider like the following:

```csharp
var schema = Schema.Create(c =>
{
    c.RegisterServiceProvider(myServiceProvider);
});
```

This will allow you to inject services into the schema types as well as in the internal .net types.

```csharp
public class FooType
    : ObjectType
{
    private readonly MyCustomService _myCustomService;

    public FooType(MyCustomService myCustomService)
    {
        _myCustomService = myCustomService;
    }

    protected abstract void Configure(IObjectTypeDescriptor desc)
    {
        desc.Field("bar").Resolver(() => _myCustomService.GetBar());
    }
}
```

Services are also available through the resolver context:

```csharp
public class FooType
    : ObjectType
{
    protected abstract void Configure(IObjectTypeDescriptor desc)
    {
        desc.Field("bar").Resolver(c => c.Service<MyCustomService>().GetBar());
    }
}
```