---
id: version-0.7.0-validation-rule
title: Validation Rules
original_id: validation-rule
---

Validation rules can be used to validate queries before they are passed to the execution engine and by this save execution time.
Validation results are cached with the query so that validation rules are only run once per query. In query validation rules you can access the query and the schema but the argument values and the variable values are not yet coerced. If you need access to those a field middleware might be better suited.

## IQueryValidator

The rule interface itself is simple, basically the validation middleware will call validate and pass in the schema and the parsed query.

```csharp
public interface IQueryValidator
{
    QueryValidationResult Validate(ISchema schema, DocumentNode query);
}
```

## QuerySyntaxWalker

If your validation is just a simple lookup than you could just try to do that against the `DocumentNode` for everything where you would have to traverse the query graph or where you want to access only certain kinds of syntax nodes we recomend using the `QuerySyntaxWalker<T>`.

**Important: In your validation rules only validate your own errors and ignore other errors.**

Let us say we want to ensure a certain rule for every field selection in a query than we could write the following `QuerySyntaxWalker<T>`.

```csharp
internal sealed class MaxDepthVisitor
    : QuerySyntaxWalker<object>
{
    protected override void VisitField(
        FieldNode field,
        object context)
    {
        // field validation code

        base.VisitField(field, context
    }
}
```

The type parameter defines the visitor context type. The context type can be used to pass a visitation context between the visit methods.

## Add Validation Rules

Validation rules can be added via the `QueryExecutionBuilder` like the following:

```csharp
QueryExecutionBuilder
    .New()
    .AddValidationRule<MyCustomRule>()
    .UseDefaultPipeline()
    .Build(schema);
```

_Since, the validation rule are instantiated like a query middleware you can only access services defined by the `QueryExecutionBuilder`._