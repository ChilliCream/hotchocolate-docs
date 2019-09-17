---
id: version-9.0.0-conventions
title: Conventions
original_id: conventions
---

When you build a schema with _Hot Chocolate_ we have a lot of conventions in place that let you infer the type structure and more from existing .NET types. These conventions are provided through the `DefaultNamingConventions` class and the `DefaultTypeInspector` class.

`DefaultNamingConventions` handles how things are named (e.g. lower-camel-case) or where to fetch the description of member.
`DefaultTypeInspector` on the other hand inspects the types and will infer the structure of the types.

If we wanted for example to introduce custom attributes instead of our GraphQL\* attributes than we could inherit from those two classes and overwrite what we want to change. In order to provide the schema builder with our new conventions class all we had to do is to register our convention instances with our dependency injection provider.

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddSingleton<INamingConventions, MyNamingConventions>();

    services.AddGraphQL(sp => SchemaBuiler.New()
        .AddQueryType<Foo>()
        .AddServices(sp)
        .Create());
}
```
