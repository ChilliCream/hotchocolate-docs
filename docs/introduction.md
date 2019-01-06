---
id: introduction
title: Introduction
---

Hot Chocolate is a new .net GraphQL server platform that can help you build a GraphQL layer over your existing and new infrastructure.

Our API will let you start very quickly with pre-built templates that let you start in seconds.

## Features

1. Code-First approach

    Use C# to define your schema in a strong typed way.

    [Learn more](code-first.md)

1. Schema-First approach

    Use the GraphQL syntax to define your schema and bind simple methods or whole types to your GraphQL types.

    [Learn more](schema-first.md)

1. Scalar Type Support

    We provide built-in support for GraphQL defined Scalar Types. You can also define your own scalar types to make your schemas even richer.

    [Learn more](custom-scalar-types.md)

1. Support for DataLoader

    We have baked-in support for data loaders which makes batching and caching for faster query requests a breeze.

    [Learn more](dataloaders.md)

1. Custom Directives

    Implement your own directives and change the execution behaviour of your types.

    ```graphql
    type Query {
        employee(employeeId: String!) : Employee @httpGet(url: "http://someserver/persons/$employeeId")
    }

    type Employee @json {
        name: String
        address: String
    }
    ```

    [Learn more](directive.md)

1. Authorization Directives

    Use ASP.net Core policies on your fields to enable field base authorization.

    ```graphql
    type Query {
        employee(employeeId: String!) : Employee
    }

    type Employee @authorize(policy: "Everyone") {
        name: String
        address: String @authorize(policy: "HumanResources")
    }
    ```

    [Learn more](authorization.md)

1. Subscriptions

    [Learn more](code-first-subscription.md)

1. dotnet CLI Templates

    In order to get you even faster started we are providing templates for the dotnet CLI which lets you setup a .net GraphQL server in les than 10 seconds.

    [Learn more](dotnet-cli.md)
