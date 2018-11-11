---
id: authorization
title: Code-first
---

Authorization is provided through the `@authorize`-directive.

In order to add authorization capabilities to your schema add the following package to your project:

```bash
dotnet add package HotChocolate.AspNetCore.Authorization
```

Once you have added the package register the `@authorize`-directive type with the schema:

```csharp
Schema.Create(c =>
{
    ...

    c.RegisterAuthorizeDirectiveType();

    ...
});
```

 You can add the `@authorize`-directive to object definitions or field definitions. 

Schema-First:

```graphql
type Person @authorize(policy: "AllEmployees") {
    name: String!
    address: Address! @authorize(policy: "SalesDepartment")
}
```

Code-First:

```csharp
public class PersonType : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Directive(new AuthorizeDirective("AllEmployees"));
        descriptor.Field(t => t.Address).Directive(new AuthorizeDirective("SalesDepartment"));
    }
}
```

Code-First with Attributes:

```csharp
[AuthorizeDirective("AllEmployees")]
public class Preson 
{
    public string Name { get; set; }

    [AuthorizeDirective("SalesDepartment")]
    public Address Address { get; set; }
}

```

 The `@authorize`-directive on a field definition takes presidence over one that is provided on the type definition.

