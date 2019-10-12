---
id: version-9.0.0-authorization
title: Authorization
original_id: authorization
---

## Authentication

GraphQL as defined by the spec does not specify how a user has to authenticate against a schema in order to execute queries and retrieve data. Authentication in ASP.NET core and ASP.NET classic is a solved problem domain. So, there are several ways to provide authentication support to an ASP.NET API.

So, in order to opt-in one of those solutions just add an authentication middleware to your server and your API is protected.

## Authorization

Authorization on the other hand is something Hot Chocolate can provide some value to by introducing an `@authorize`-directive.

The `@authorize`-directive basically is our `AuthorizeAttribute`. You can annotate this directive to `ObjectType`s or field definitions in order to add authorization behaviour to them.

But let's start at the beginning with this. In order to add authorization capabilities to your schema add the following package to your project:

```bash
dotnet add package HotChocolate.AspNetCore.Authorization
```

In order to use the `@authorize`-directive we have to register it like the following:

```csharp
SchemaBuilder.New()
  ...
  .AddAuthorizeDirectiveType()
  ...
  .Create();
```

Once you have done that you can add the `@authorize`-directive to object type definitions or field definitions.

The `@authorize`-directive on a field definition takes precedence over one that is added on the object type definition.

Schema-First:

```graphql
type Person @authorize {
  name: String!
  address: Address!
}
```

Code-First:

```csharp
public class PersonType : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Authorize();
        descriptor.Field(t => t.Address).Authorize();
    }
}
```

If we just add the `@authorize`-directive without specifying any arguments the authorize middleware will basically just enforces that a user is authenticated.

If no user is authenticated the field middleware will raise a GraphQL error and the field value is set to null. If the field is a non-null field the standard GraphQL non-null violation rule is applied like with any other GraphQL error.

### Roles

In many case role based authorization is sufficient and was already available with ASP.NET on the .NET Framework.

Moreover, role base authorization is setup quickly and does not need any other setup then providing the roles.

Schema-First:

```graphql
type Person @authorize(roles: "foo") {
  name: String!
  address: Address! @authorize(roles: ["foo", "bar"])
}
```

Code-First:

```csharp
public class PersonType : ObjectType<Person>
{
    protected override Configure(IObjectTypeDescriptor<Person> descriptor)
    {
        descriptor.Authorize(new [] {"foo"});
        descriptor.Field(t => t.Address).Authorize(new [] {"foo", "bar"});
    }
}
```

### Authorization Policies

If you are using ASP.NET core then you can also opt-in using authorization policies.

So taking our example from earlier we are instead of providing a role just provide a policy name:

```graphql
type Person @authorize(policy: "AllEmployees") {
  name: String!
  address: Address! @authorize(policy: "SalesDepartment")
}
```

In the above example the name field is accessible to all users that fall under the `AllEmployees` policy, whereas the directive on the address field takes precedence over the `@authorize`-directive on the object type definition. This means that only users that fall under the `SalesDepartment` policy can access the address field.

It is important to note that _policy-based authorization_ is only available with ASP.NET core. So, if you are working with ASP.NET classic or if you just want a simple role based authorization you can still use our `@authorize`-directive with the roles argument.

```graphql
type Person @authorize(roles: "ContentEditor") {
  name: String!
  address: Address! @authorize(roles: ["ContentEditor", "ContentReader"])
}
```

The `@authorize`-directive is repeatable, that means that you are able to chain the directives and only if all annotated conditions are true will you gain access to the data of the annotated field.

```graphql
type Person {
  name: String!
  address: Address!
    @authorize(policy: "AllEmployees")
    @authorize(policy: "SalesDepartment")
    @authorize(roles: "FooBar")
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

> **Important**: we are passing the resolver context as resource to the policy so that you have access to all the data of your resolver.

The `@authorize`-directive essentially uses the provided policy and runs it against the `ClaimsPrinciple` that is associated with the current request.

More about policy-based authorization can be found in the Microsoft Documentation:
[Policy-based authorization in ASP.NET Core | Microsoft Docs](https://docs.microsoft.com/en-us/aspnet/core/security/authorization/policies?view=aspnetcore-2.1)

## Query Requests

Our query middleware creates a request and passes the request with additional meta-data to the query-engine. For example we provide a property called `ClaimsIdentity` that contains the user associated with the current request. These meta-data or custom request properties can be used within a field-middleware like the authorize middleware to change the default execution off a field resolver.

So, you could use an authentication-middleware in ASP.NET core to add all the user meta-data that you need to your claim-identity or you could hook some code in our middleware and add additional meta-data or even modify the `ClaimsPrincipal`.

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
