---
id: version-0.8.0-dependency-injection
title: Dependency Injection
original_id: dependency-injection
---

We are supporting dependency injection via the `IServiceProvider` interface. Since Hot Chocolate supports scoped services the service provider is passed in with the request. If you are using Hot Chocolate with ASP.NET core or ASP.NET classic then you do not have to think about how to setup dependency injection because we have already done that for you.

If you have a CLR-type representation of your schema type than you can inject services as field resolver arguments. Injection of services as field resolver arguments should be your preferred choice since many of the services only have a request life time.

```csharp
public class Query
{
    public string Bar([Service]MyCustomService service)
    {
        return "foo";
    }
}
```

You are also able to inject parts from your field resolver context like the schema as field resolver argument.

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
If you want to inject `HttpContext` as constructor argument you have to ensure that your type is not a singleton or use the `IHttpContextAccessor`.

```csharp
public class Query
{
    public string Bar([Service]HttpContext httpContext)
    {
        return "foo";
    }
}
```
