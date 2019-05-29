---
id: introduction
title: Introduction
---

Hot Chocolate is a .net GraphQL server platform that can help you build a GraphQL layer over your existing and new infrastructure.

Our API will let you start very quickly with pre-built templates that let you start in seconds.

## Features

1. Code-First approach

   Use your favorite .Net language to define your schema.

   ```csharp
   public class Query
   {
       public string Hello() => "World!";
   }

   var schema = SchemaBuilder.New()
       .AddQueryType<Query>()
       .Create();

   var executor = schema.MakeExecutable();

   Console.WriteLine(executor.Execute("{ hello }"));
   ```

   [Learn more](code-first.md)

2. Schema-First approach

   Use the GraphQL schema definition language to define your schema and bind simple methods or whole types to it.

   ```csharp
   public class QueryResolver
   {
      public string Hello() => "World!";
   }

   var schema = SchemaBuilder.New()
       .AddDocumentFromString("type Query { hello: String! }")
       .BindResolver<QueryResolver>()
       .Create();

   var executor = schema.MakeExecutable();

   Console.WriteLine(executor.Execute("{ hello }"));
   ```

   [Learn more](schema-first.md)

3. Mixed approach

   The mixed approach or the "what ever makes you happy" approach lets you mix and match everything. With the _Hot Chocolate_ `SchemaBuilder` you can declare types however you want. Define a type schema-first and extend that same type with code-first.

   ```csharp
   public class QueryResolver
   {
      public string Hello() => "World!";
   }

   public class QueryTypeExtension
      : ObjectTypeExtension
   {
        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor.Name("Query");
            descriptor.Field("foo").Resolver(() => "bar");
        }
   }

   var schema = SchemaBuilder.New()
       .AddDocumentFromString("type Query { hello: String! }")
       .AddType<QueryTypeExtension>()
       .BindResolver<QueryResolver>()
       .Create();

   var executor = schema.MakeExecutable();

   Console.WriteLine(executor.Execute("{ hello foo }"));
   ```

   [Learn more](schema.md)

4. Scalar Type Support

   We provide built-in support for GraphQL defined Scalar Types. Moreover, you can also define your own scalar types to make your schemas even richer.

   [Learn more](custom-scalar-types.md)

5. Support for DataLoader

   We have baked-in support for data loaders which makes batching and caching for faster query requests a breeze.

   ```csharp
   public class PersonResolvers
   {
      public Task<Person> GetPerson(string id, IResolverContext context, [Service]IPersonRepository repository)
      {
        return context.BatchDataLoader<string, Person>("personByIdBatch", keys => repository.GetPersonBatchAsync(keys)).LoadAsync(id);
      }
   }
   ```

   [Learn more](dataloaders.md)

6. Custom Directives

   Implement your own directives and change the execution behaviour of your types.

   ```graphql
   type Query {
     employee(employeeId: String!): Employee
       @httpGet(url: "http://someserver/persons/$employeeId")
   }

   type Employee @json {
     name: String
     address: String
   }
   ```

   [Learn more](directive.md)

7. Authorization Directives

   Use ASP.net Core policies on your fields to enable field base authorization.

   ```graphql
   type Query {
     employee(employeeId: String!): Employee
   }

   type Employee @authorize(policy: "Everyone") {
     name: String
     address: String @authorize(policy: "HumanResources")
   }
   ```

   [Learn more](authorization.md)

8. Subscriptions

   Subscriptions allow GraphQL clients to observe specific events and receive updates from the server in real-time.

   [Learn more](subscription.md)

9. Schema Stitching

   Schema stitching will give you the capability to build small GraphQL services and stitch them together into one rich schema. This gives you flexibility in your development process and confidence once you are ready to deploy. Update only parts of your schema without the need to deploy always everything.

   [Learn more](stitching.md)

10. GraphQL Server

We support ASP.Net Core and ASP.Net Classic and constantly update these implementations. Hosting our GraphQL server with one of there frameworks is as easy as eating pie :)

Furthermore, you can host _Hot Chocolate_ as an Azure Function or AWS Lambda.

[Learn more](aspnet.md)

11. dotnet CLI Templates

In order to get you even faster started we are providing templates for the dotnet CLI which lets you setup a .net GraphQL server in less than 10 seconds.

[Learn more](dotnet-cli.md)
