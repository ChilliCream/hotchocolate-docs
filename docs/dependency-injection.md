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

It is important to know that services injected into schmea types have to be singleton. So their lifetime must be until the schema is disposed.

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

If you have a clr-type representation of your schema type than you can also inject services as field resolver arguments. Injection of services as field resolver arguments should be your prefered choice since many of the services only have a request life time.

```csharp
public class Query
{
    public string Bar([Service]MyCustomService service)
    {
        return "foo";
    }
}
```

You are also able to inject parts from your field resolver context like the schem as field resolver argument.

```csharp
public class Query
{
    public string Bar(ISchema schema, [Service]MyCustomService service)
    {
        return "foo";
    }
}
```

Moreover, you have access to the `HttpContext` through field resolver argument injection. You should only inject `HttpContext` as field resolver argument since the lifetime of `HttpContext` is bound to a single request.
If you want to inject `HttpContext` as constructor argument you have to ensure that your type is not a singleton.

```csharp
public class Query
{
    public string Bar([Service]HttpContext httpContext)
    {
        return "foo";
    }
}
```
