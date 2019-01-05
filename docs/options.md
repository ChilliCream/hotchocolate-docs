---
id: options
title: Options
---

_Hot Chocolate_ distingushes between schema and execution options. Schema options relate to the type system and execution options to the query engine.

## Schema Options

| Member               | Type   | Default        | Description                                                                 |
| -------------------- | ------ | -------------- | --------------------------------------------------------------------------- |
| QueryTypeName        | string | `Query`        | The name of the query type.                                                 |
| MutationTypeName     | string | `Mutation`     | The name of the mutation type.                                              |
| SubscriptionTypeName | string | `Subscription` | The name of the subscription type.                                          |
| StrictValidation     | bool   | `true`         | Defines if the schema is allowed to have errors like missing resolvers etc. |

The schema options allow to alter the overall execution behaviour. The options can be set during schema creation.

```csharp
var schema = Schema.Create(c =>
{
    c.Options.QueryTypeName = "Foo"
});
```

## Execution Options

Execution options are provided when a schema is made executable. The options range from allowing a maximum execution timeout to providing a maximum execution complexity.

We have built in some options that limit the execution engine in order do protect overall performance of your GraphQL Server.

## Members

| Member                  | Type     | Default                    | Description                                                         |
| ----------------------- | -------- | -------------------------- | ------------------------------------------------------------------- |
| EnableTracing           | bool     | `false`                    | Enables tracing for performance measurement of query requests. _\*_ |
| ExecutionTimeout        | TimeSpan | `TimeSpan.FromSeconds(30)` | The maximum allowed execution time of a query.                      |
| IncludeExceptionDetails | bool     | `Debugger.IsAttached`      | Includes exeption details into the GraphQL errors. _\*\*_           |
| MaxExecutionDepth       | int?     | `null`                     | The maximum allowed query depth of a query.                         |
| QueryCacheSize          | int      | `100`                      | The amount of queries that can be cached for faster execution.      |

_\* Performance tracing is based on Apollo Tracing. The specification can be found [here](https://github.com/apollographql/apollo-tracing)._

_\*\* The exception details that are included into GraphQL errors can also be modified by implementing an `IErrorFilter`. See more about that [here](error-filter.md)._
