---
id: stitching
title: Schema Stitching
---

What is schema stitching actually? Schema stitching is the capability to merge multiple GraphQL schemas into one schema that can be queried.

## Introduction

**So, for what is that useful?**

In our case we have lots of specialized services that serve data for specific problem domains. Some of these services are GraphQL services, some of them are REST services and yes sadly a little portion of those are still SOAP services.

With _Hot Chocolate_ schema stitching you are able to create a gateway that bundles all those services into one GraphQL schema.

**Is schema stitching basically just putting two schemas together?**

Just putting two schemas into one and avoid name collisions is simple. But what we want to achieve with schema stitching is one consistent schema.

_Hot Chocolate_ schema stitching allows us to really integrate services into one schema by folding types into one another and even renaming or removing parts.

With this we can create a consistent GraphQL schema that hides the implementation details of our backend services and provides the consumer of our endpoint with the capabillity to fetch the data they need with one call, no under- or over-fetching and most importantly no repeated fetching because you first needed to fetch that special id with which you now can then fetch this other thingy.

## Getting Started

In order to showcase how schema stitching works and what the problems are let us assume we have a service like twitter, where a user can post messages.

We have three teams working on internal micro-/domain-services that handle certain aspects.

The first service is handling message stream and has the following schema:

```graphql
type Query {
  messages(userId: ID!): [Message!]
  message(messageId: ID!): Message
}

type Mutation {
  newMessage(input: NewMessageInput!): NewMessagePayload!
}

type Message {
  id: ID!
  text: String!
  createdBy: ID!
  createdAt: DateTime!
  tags: [String!]
}

type NewMessageInput {
  text: String!
  tags: [String!]
}

type NewMessagePayload {
  message: Message
}
```

The second service is handling the users of the services and has the following schema:

```graphql
type Query {
  user(userId: ID!): User!
  users: [User!]
}

type Mutation {
  newUser(input: NewUserInput!): NewUserPayload!
  resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
}

type NewUserInput {
  username: String!
  password: String!
}

type ResetPasswordInput {
  username: String!
  password: String!
}

type NewUserPayload {
  user: User
}

type ResetPasswordPayload {
  user: User
}

type User {
  id: ID!
  username: String!
}
```

Last but not least we have a third service handling the message analytics. In our example case we keep it simple and our analytics services just tracks three different counters per message. The schema for this service looks like the following:

```graphql
type Query {
  analytics(messageId: ID!, type: CounterType!): MessageAnalytics
}

type MessageAnalytics {
  id: ID!
  messageId: ID!
  count: Int!
  type: CounterType!
}

enum CounterType {
  VIEWS
  LIKES
  REPLIES
}
```

With those three separate schemas our UI team would have to fetch from multiple endpoints. Even worse, in order to build a stream view that shows the message and the username who posted it they would have to first fetch the messages and could only then fetch the names of the users, after they have fetched all the messages they would have to do a separate call to fetch the users for each message. This is one of the very things GraphQL tries to solve.

## Setting up our server

Before we start with stitching intself lets get into how to setup our server.

Every _Hot Chocolate_ server can be a stitching server. In order to create a stitching server lets first use our dotnet cli template to create a plain _Hot Chocolate_ server.

If you do not have the _Hot Chocolate_ GraphQL server template installed execute first the following command.

```bash
dotnet new -i HotChocolate.Templates.Server
```

After that we will create a new folder and add a new server to that folder.

```bash
mkdir stitching-demo
cd stitching-demo
dotnet new graphql-server
```

With this we have now a functioning GraphQL server with a simple hello world example. In order to make this server a stitching server we have now to add the _Hot Chocolate_ stitching layer.

```bash
dotnet add package HotChocolate.Stitching
```

Now that our GraphQL server is ready we can configure the endpoints of our remote schemas.

> Remote schemas are what we call the GraphQL schemas that we want include into our merged schema. Remote schemas can be any GraphQL Spec compliant server (Apollo, Snagria, etc.) that serves its schema up over HTTP. Also we can include local schemas that we have created with the _Hot Chocolate_ .net API.

The endpoints are declared by using a named `HttpClient` via the HttpClient factory that is included with ASP.net core.

```csharp
services.AddHttpClient("messages", (sp, client) =>
{
  client.BaseAddress = new Uri("http://127.0.0.1:5050");
});
services.AddHttpClient("users", (sp, client) =>
{
  client.BaseAddress = new Uri("http://127.0.0.1:5051");
});
services.AddHttpClient("analytics", (sp, client) =>
{
  client.BaseAddress = new Uri("http://127.0.0.1:5052");
});
```

Now lets remove the parts from the server template that we don't need.

```csharp
services.AddDataLoaderRegistry();

services.AddGraphQL(sp => Schema.Create(c =>
{
    c.RegisterQueryType<Query>();
}));
```

## Stitching Builder

The stitching builder is the main API to configure a stiched GraphQL schema. In order to have a simple automerge we have just to provide all the necessary schema names and the stitching layer will fetch the remote schemas via introspection on the first call to the stitched schema.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"));
```

Since a stitched schema is the same then any other GraphQL schema we can configure custom types, custom middleware or other things with it.

In our example we are stitching together schemas that come with non-spec scalar types like `DateTime`. So, the stitching layer would report an error when stitching the above three schemas together since the `DateTime` scalar is unknown.

In order to declare this custom scalar we can register the extended scalar set like with a regular _Hot Chocolate_ GraphQL schema through the `AddSchemaConfiguration`-method on the stitching builder.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"))
  .AddSchemaConfiguration(c =>
  {
    c.RegisterExtendedScalarTypes();
  })
```

> For more information about our scalars can be found [here](custom-scalar-types.md).

With this in place our schema now looks like the following:

```graphql
type Query {
  messages(userId: ID!): [Message!]
  message(messageId: ID!): Message
  user(userId: ID!): User!
  users: [User!]
  analytics(messageId: ID!, type: CounterType!): MessageAnalytics
}

type Mutation {
  newMessage(input: NewMessageInput!): NewMessagePayload!
  newUser(input: NewUserInput!): NewUserPayload!
  resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
}

type Message {
  id: ID!
  text: String!
  createdBy: ID!
  createdAt: DateTime!
  tags: [String!]
}

type NewMessageInput {
  text: String!
  tags: [String!]
}

type NewMessagePayload {
  message: Message
}

type NewUserInput {
  username: String!
  password: String!
}

type ResetPasswordInput {
  username: String!
  password: String!
}

type NewUserPayload {
  user: User
}

type ResetPasswordPayload {
  user: User
}

type User {
  id: ID!
  username: String!
}

type MessageAnalytics {
  id: ID!
  messageId: ID!
  count: Int!
  type: CounterType!
}

enum CounterType {
  VIEWS
  LIKES
  REPLIES
}
```

We just achieved a simple schema merge without doing a lot. But honostly we would like to change some of the details. While the stitching result is nice what we want to do is to integrate it much more.

### Extending Types

So, the first thing that we would like to have is a new field on the query that is called `me`. The `me` fields should be the currently signed in user.

Further, the user type should expose the message stream of the user, this way we could fetch the messages of the signed in user like the following:

```graphql
{
  me {
    messages {
      text
      tags
    }
  }
}
```

In order to extend types in a stitched schema we can use the new GraphQL extend syntax that was introuced with the 2018 spec.

```graphql
extend type Query {
  me: User! @delegate(schema: "users", path: "user(id: $contextData:UserId)")
}

extend type User {
  messages: [Message!]
    @delegate(schema: "messages", path: "messages(userId: $fields:Id)")
}
```

With just that and no further code needed we have specified how the GraphQL stitching engine shall rewrite our schema.

Let us disect the above GraphQL SDL in order to understand what just happend.

First, let us have a look at the `Query` extensions. We declared a the field like we would do it in a schema-first approach. After that we annotated the field with the `delegate` directive. The delegate directive basically works like a middleware that will create a fetch on the specified schema.

The `path`-argument on the `delegate` directive specifies how to fetch the data. The selection path can have multiple levels. So if you wanted to fetch just the username you could do that like the following:

```graphql
user(id: $contextData:UserId).username
```

Moreover, we are using a special variable that can access the resolver context. Currently this variable has four scopes:

- Arguments

  Access arguments of the field: `$arguments:ArgumentName`

- Fields

  Access fields of the declaring type: `$fields:FieldName`

- ContextData

  Access properties of the request context data map: `$contextData:Key`

- ScopedContextData

  Access properties of the scoped field context data map: `$contextData:Key`

The context data can be used to map custom properties into our GraphQL resolvers. In our case we will use it to map the internal user ID from the user claims into our context data map. This allows us to have some kind of abstraction between the actual HttpRequest and the data that is needed to process a GraphQL request.

> We have documentation on how to add custom context data from your http request [here](custom-context.md)

OK, lets sum this up, with the `delegate` directive we are able to create powerfull stitching resolver without writing one line of c# code. We, are able to create powerful new types that make the API so much richer.

In order to get our extensions integrated we need to add the extensions to our stitching builder. Like with the schema we have multiple extension methods to load the GraphQL SDL from a file or a string etc.

In our case lets say we are loading int from a file called `Extensions.graphql`.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"))
  .AddExtensionsFromFile("./graphql/Extensions.graphql")
  .AddSchemaConfiguration(c =>
  {
    c.RegisterExtendedScalarTypes();
  })
```

No with all of this in place we our schema now looks like the following:

```graphql
type Query {
  me: User!
  messages(userId: ID!): [Message!]
  message(messageId: ID!): Message
  user(userId: ID!): User!
  users: [User!]
  analytics(messageId: ID!, type: CounterType!): MessageAnalytics
}

type Mutation {
  newMessage(input: NewMessageInput!): NewMessagePayload!
  newUser(input: NewUserInput!): NewUserPayload!
  resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
}

type Message {
  id: ID!
  text: String!
  createdBy: ID!
  createdAt: DateTime!
  tags: [String!]
}

type NewMessageInput {
  text: String!
  tags: [String!]
}

type NewMessagePayload {
  message: Message
}

type NewUserInput {
  username: String!
  password: String!
}

type ResetPasswordInput {
  username: String!
  password: String!
}

type NewUserPayload {
  user: User
}

type ResetPasswordPayload {
  user: User
}

type User {
  id: ID!
  username: String!
  messages: [Message!]
}

type MessageAnalytics {
  id: ID!
  messageId: ID!
  count: Int!
  type: CounterType!
}

enum CounterType {
  VIEWS
  LIKES
  REPLIES
}
```

### Renaming and Removing Types

Though this is nice we would like to go even further. We would like now to enhance our `Message` type like the following:

```graphql
type Message {
  id: ID!
  text: String!
  createdBy: User
  createdById: ID!
  createdAt: DateTime!
  tags: [String!]
  views: Int!
  likes: Int!
  replies: Int!
}
```

Moreover, we would like to remove the `analytics` field from our query type since we have integrated the analytics data into our `Message` type. Moreover, since with the root field gone we have no way to access `MessageAnalytics` and `CounterType` lets also get rid of these types.

The stitching builder has powerfull refactoring functions for your schemas that can even be extended by writing custom rewriters. In order to remove a field or a type we can tell the stitching builder to ignore them.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"))
  .AddExtensionsFromFile("./graphql/Extensions.graphql")
  .IgnoreField("analytics", "Query", "analytics")
  .IgnoreType("analytics", "MessageAnalytics")
  .IgnoreType("analytics", "CounterType")
  .AddSchemaConfiguration(c =>
  {
    c.RegisterExtendedScalarTypes();
  })
```

> There are also methods for renaming types and fields where the stitching engine will take care that the schema is consitently rewritten so that all the type references will refer to the corrent type/field name.

With that we have remove the types from our stitched schema. No, let us move on to extend our message type.

```graphql
extend type Message {
  createdBy: User!
    @delegate(schema: "users", path: "user(id: $fields:createdById)")
  views: Int! @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
  likes: Int! @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
  replies: Int!
    @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
}
```

Also we need to rename the field `createdBy` to `createdById`.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"))
  .AddExtensionsFromFile("./graphql/Extensions.graphql")
  .IgnoreField("analytics", "Query", "analytics")
  .IgnoreType("analytics", "MessageAnalytics")
  .IgnoreType("analytics", "CounterType")
  .RenameField("messages", "Message", "createdBy", "createdById")
  .AddSchemaConfiguration(c =>
  {
    c.RegisterExtendedScalarTypes();
  })
```

> It is important to now that the schema rewriters are executed before the schemas are merged and the extensions integrated.

Our new schema now looks like the following:

```graphql
type Query {
  me: User!
  messages(userId: ID!): [Message!]
  message(messageId: ID!): Message
  user(userId: ID!): User!
  users: [User!]
}

type Mutation {
  newMessage(input: NewMessageInput!): NewMessagePayload!
  newUser(input: NewUserInput!): NewUserPayload!
  resetPassword(input: ResetPasswordInput!): ResetPasswordPayload!
}

type Message {
  id: ID!
  text: String!
  createdBy: User
  createdById: ID!
  createdAt: DateTime!
  tags: [String!]
  views: Int!
  likes: Int!
  replies: Int!
}

type NewMessageInput {
  text: String!
  tags: [String!]
}

type NewMessagePayload {
  message: Message
}

type NewUserInput {
  username: String!
  password: String!
}

type ResetPasswordInput {
  username: String!
  password: String!
}

type NewUserPayload {
  user: User
}

type ResetPasswordPayload {
  user: User
}

type User {
  id: ID!
  username: String!
  messages: [Message!]
}
```

### Query Rewriter

As you can see it is quite easy to stitch multiple schemas together and enhance the locally. But how can we go further and hook into the query rewriter of the stitching engine.

Let us for instance try to get rid of the `createdById` field of message. We actually need this field in order to fetch the `User` from the remote schema. In order to achieve that we could remove this field but request it as a hidden field whenever a `Message` object is resolved.

We could then write a little field middleware that copies us the data into our scoped conetxt data so that we are consequently able to use the data in our `delegate` directive.

The first thing we need to do is to create a new class that inherits from `QueryDelegationRewriterBase`.

The base class exposes two virtual methods `OnRewriteField` and `OnRewriteSelectionSet`.

A selection set describes a selection of fields, fragments on a certain type. So, in order to fetch a hidden field every time a ceratain type is requested we would want to overwrite `OnRewriteSelectionSet`.

```csharp
private class AddCreatedByIdQueryRewriter
    : QueryDelegationRewriterBase
{
    public override SelectionSetNode OnRewriteSelectionSet(
        NameString targetSchemaName,
        IOutputType outputType,
        IOutputField outputField,
        SelectionSetNode selectionSet)
    {
        if(outputType.NamedType() is ObjectType objectType
          && objectType.Name.Equals("Message"))
        {
            return selectionSet.AddSelection(
                new FieldNode
                (
                    null,
                    new NameNode("createdBy"),
                    new NameNode("createdById"),
                    Array.Empty<DirectiveNode>(),
                    Array.Empty<ArgumentNode>(),
                    null
                ));
        }

        return selectionSet;
    }
}
```

The syntax nodes have a lot of those little rewrite helpers like `AddSelection`. These helper methods basically branch of the syntax tree and return the new version.

Query delegation rewriter are registered with the dependency injection and not with our stitching builder.

```csharp
services.AddQueryDelegationRewriter<AddCreatedByIdQueryRewriter>();
```

With that setup the engine will always fetch the requested field for us when a `Message` object is requested.

So, now let us move on to write a little middleware that copies this data into our scoped resolver context data map. The data in this map will only be available to the resolvers in the subtree if the message type.

A field middleware has to be declared via the stitching builder.

```csharp
services.AddStitchedSchema(builder => builder
  .AddSchemaFromHttp("messages")
  .AddSchemaFromHttp("users")
  .AddSchemaFromHttp("analytics"))
  .AddExtensionsFromFile("./graphql/Extensions.graphql")
  .IgnoreField("analytics", "Query", "analytics")
  .IgnoreType("analytics", "MessageAnalytics")
  .IgnoreType("analytics", "CounterType")
  .IgnoreField("messages", "Message", "createdBy")
  .AddSchemaConfiguration(c =>
  {
    c.RegisterExtendedScalarTypes();

    c.Use(next => async context =>
    {
        await next.Invoke(context);

        if(context.Field.Type.NamedType() is ObjectType objectType
          && objectType.Name.Equals("Message")
          && context.Result is IDictionary<string, object> data
          && data.TryGetValue("createdById", out object value))
        {
            context.ScopedContextData =
                context.ScopedContextData.SetItem("createdById", value);
        }
    })
  })
```

> We could also declare a field middleware as class. More about what you can do with a field middleware can be read [here](middleware.md).

With all of this in place we could now rewrite our `Message` type extension:

```graphql
extend type Message {
  createdBy: User!
    @delegate(schema: "users", path: "user(id: $scopedContextData:createdById)")
  views: Int! @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
  likes: Int! @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
  replies: Int!
    @delegate(schema: "analytics", path: "analytics(id: $fields:id)")
}
```

### Validating a Stitched Schema

### Customizing Stitching Builder

## Batching

## Root Types

We are currently supporting stitching `Query` and `Mutation`. With Version 9 we will introduce stitching the `Subscription` type.
