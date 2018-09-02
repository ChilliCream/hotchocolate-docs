---
id: general-schema-options
title: Schema Options
---

## Schema Options

The schema options allow to alter the overall execution behaviour. The options can be set during schema creation.

```csharp
var schema = Schema.Create(c =>
{
    c.Options.ExecutionTimeout = TimeSpan.FromSeconds(30);
    c.Options.DeveloperMode = true;
});
```

We have built in some options that limit the execution engine in order do protect overall performance of your GraphQL Server.

- MaxExecutionDepth (Default = 8)

  The maximum allowed execution depth of a query.

- ExecutionTimeout (Default = 5 seconds)

  The maximum allowed execution time a query is allowed.

Moreover, we have a developer-mode that is meant for debugging. Per default the execution engine will filter all exceceptions and add a generic error message to the error list. So, setting `DeveloperMode` to `true` will add more exception details to the query result.

Also for debugging purposes is the `StrictValidation` option that allows for incomplete schemas. This way you are able to debug your server even when the schema is not complete yet.

## Schema Option Members

| Member        | Type | Description |
| ------------- | ----------- | ----------- |
| QueryTypeName | string | The name of the query type. |
| MutationTypeName | string | The name of the mutation type. |
| SubscriptionTypeName | string | The name of the subscription type. |
| MaxExecutionDepth | int | The maximum allowed execution depth of a query. |
| ExecutionTimeout | System.TimeSpan | The maximum allowed execution time a query is allowed. |
| StrictValidation | bool | Defines  |
| DeveloperMode | bool | The source stack contains all previous resolver results of the current execution path |
