---
id: tutorial-01-gettingstarted
title: Getting Started
---

In this section, you will setup the project for your GraphQL server and implement your first GraphQL query. In the end, we’ll talk theory for a bit and learn about the GraphQL schema.

## Creating the project

The quickest way to create a GraphQL server with _Hot Chocolate_ is to use our server template. But in this tutorial you will build a _Hot Chocolate_ GraphQL server from the ground up in order to learn how the components interconnect.

Open your terminal, navigate to a location of your choice and run the following commands:

<!--DOCUSAURUS_CODE_TABS-->
<!-- bash -->
```bash
mkdir twitter-service
cd twitter-service
mkdir src
cd src
```
<!--END_DOCUSAURUS_CODE_TABS-->

This creates a directory for our GraphQL server project and adds the `src` directory which will hold the code files.
Next up you will have to create a solution file and a server project.

In your terminal run the following command to create the solution file and create a minimal ASP.net server project:

<!--DOCUSAURUS_CODE_TABS-->
<!-- bash -->
```bash
dotnet new web -n Server

cd ..
dotnet new sln -n Demo
dotnet sln add src/Server
```
<!--END_DOCUSAURUS_CODE_TABS-->

Now that we have created our server project lets add _Hot Chocolate_.

Get back in your terminal and run the following command to add the _HotChocolate.AspNetCore_ package:

<!--DOCUSAURUS_CODE_TABS-->
<!-- bash -->
```bash
dotnet add src/Server package HotChocolate.AspNetCore
dotnet restore
```
<!--END_DOCUSAURUS_CODE_TABS-->

The _HotChocolate.AspNetCore_ package contains the ASP.net core middleware for hot chocolate and also includes the _Hot Chocolate_ query engine as a dependency.  This package basically provides all we need to get started.

## Configuring the GraphQL server

So, in order to configure our server lets open the `src/Server/Startup.cs` and rewrite the `ConfigureServices` method like the following:

<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddGraphQL(services =>
    {
        // we will add our config here later
    });
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

`AddGraphQL` adds an executable schema to our services and this makes it available to our middleware.

In order to create a valid schema we need to have at least a query type. So, lets introduce a new class called `Query` that shall contain one Property `Hello` which shall return the `string` `world`.

Create a new file `src/Server/Query.cs` and add the following code:

<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```csharp
namespace Server
{
    public class Query
    {
        public string Hello => "World";
    }
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

Now lets register this type as our query type with the GraphQL schema.

<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddGraphQL(services =>
        SchemaBuilder.New()
            .AddServices(services)
            .AddQueryType<Query>()
            .Create());
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

With this we have finally a valid schema that we could now serve up with our middleware. In order to run our server we now just have to add the middleware.

For that replace the `Configure` method in `src/Server/Startup.cs` with the following code:

<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseGraphQL();
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

`app.UseGraphQL()` adds our middleware to the server and will by default use the schema that we have setup with our dependency injection.

In order to write queries and execute them it would be practical if our server also serves up _Playground_. Lets add another package to our server for that.

Return to your terminal and run the following commands:

<!--DOCUSAURUS_CODE_TABS-->
<!-- bash -->
```bash
dotnet add src/Server package HotChocolate.AspNetCore.Playground
dotnet restore
```
<!--END_DOCUSAURUS_CODE_TABS-->

Now that we have added the _Playground_ package we need to add the _Playground_ middleware to our server. For we have to add one more line of code to our `src/Server/Startup.cs`.

<!--DOCUSAURUS_CODE_TABS-->
<!-- C# -->
```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    if (env.IsDevelopment())
    {
        app.UseDeveloperExceptionPage();
    }

    app.UseGraphQL();
    app.UsePlayground();
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

## Testing the server

Since we have now a UI that can execute queries against our server lets start our server and fire up our first GraphQL query:

<!--DOCUSAURUS_CODE_TABS-->
<!-- bash -->
```bash
dotnet watch --project src/Server/ run
```
<!--END_DOCUSAURUS_CODE_TABS-->s

This `watch` command will compile and run our server. Every time a code file changes the `watch` command will recompile our server so we do not have to worry about compiling all the time. The server will per default be hosted on `http://localhost:5000`. GraphiQL will be served under `http://localhost:5000/playground`.

Since every thing should be running now lets open a browser and navigate to `http://localhost:5000/playground`.

/// Playground image


Lets write our first query. GraphQL queries describe the request that you want to execute as well as the data that you want. GraphQL has three well-known root types `Query`, `Mutation` and `Subscription`. `Query` basically represents  .....



```GraphQL
{
    hello
}
```

```json
{
  "data": {
    "hello": "World"
  }
}
```
