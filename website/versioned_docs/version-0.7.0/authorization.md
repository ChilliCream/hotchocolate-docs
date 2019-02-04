---
id: version-0.7.0-authorization
title: Authorization
original_id: authorization
---

## Authentication

GraphQL as defined by the spec does not specify how a user has to authenticate against a schema in order to execute queries and retrieve data. Authentication in ASP.net core and ASP.net classic is a solved problem domain. So, there are several ways to provide authentication support to an ASP.net API.

So, in order to opt-in one of those solutions just add an authentication middleware to your server and your API is protected.

## Authorization

Authorization on the other hand is something that Hot Chocolate can provide some value to by introducing an `@authorize`-directive.

The `@authorize`-directive basically is our `AuthorizeAttribute`. You can annotate this directive to type or field definitions in order to add authorization policies to them.

But let's start at the beginning with this. In order to add authorization capabilities to your schema add the following package to your project:

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

Once you have done that you can add the `@authorize`-directive to object type definitions or field definitions.

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

The `@authorize`-directive on a field definition takes precedence over one that is added on the object type definition.

So taking our example from earlier:

```graphql
type Person @authorize(policy: "AllEmployees") {
    name: String!
    address: Address! @authorize(policy: "SalesDepartment")
}
```

The name field is accessible to all users that fall under the `AllEmployees` policy, whereas the directive on the address field takes precedence over the `@authorize`-directive on the object type definition. This means that only users can access the address field that fall under the `SalesDepartment` policy.

It is important to note that _policy-based authorization_ is only available with ASP.net core. So, if you are working with ASP.net classic or if you just want a simple role based authorization you can still use our `@authorize`-directive.

```graphql
type Person @authorize(roles: "ContentEditor") {
    name: String!
    address: Address! @authorize(roles: ["ContentEditor", "ContentReader"])
}
```

## Policy-based authorization in ASP.NET Core

Policy-based authorization in ASP.NET Core does not any longer prescribe you in which way you describe your requirements. Now, with policy-based authorization you could just say that a certain field can only be accessed if the user is 21 or older or that a user did provide his passport as evidence of his/her identity.

So, in order to define those requirements you define policies that essentially describe and validate your requirements and the rules that enforce them.

```csharp
services.AddAuthorization(options =>
{
    options.AddPolicy("HasCountry", policy =>
        policy.RequireAssertion(context =>
            context.User.HasClaim(c =>
                (c.Type == ClaimTypes.Country))));
});
```

The `@authorize`-directive essentially uses the provided policy and runs it against the `ClaimsPrinciple` that is associated with the current request.

More about policy-based authorization can be found in the Microsoft Documentation:
[Policy-based authorization in ASP.NET Core | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-2.1)

## Query Requests

Our query middleware creates a request and passes the request with additional meta-data to the query-engine. For example we provide a property called `ClaimsIdentity` that contains the user associated with the current request. These meta-data or custom request properties can be used within a field-middleware like the authorize middleware to change the default execution of a field resolver.

So, you could use an authentication-middleware in ASP.net core to add all the user meta-data that you need to your claim-identity or you could hook some code in our middleware and add additional meta-data or even modify the `ClaimsPrincipal`.

```csharp
app.UseGraphQL(new GraphQLMiddlewareOptions
{
    Path = "/graphql",
    OnCreateRequest = (c, r, p) =>
    {
        var identity = new ClaimsIdentity();
        identity.AddClaim(new Claim(ClaimTypes.Country, "us"));
        c.User.AddIdentity(identity);
        return Task.CompletedTask;
    }
});
```

The `OnCreateRequestAsync`-delegate can be used for many other things and is not really for authorization but can be useful in dev-scenarios where you want to simulate a certain user etc. or for a custom directive middleware.
