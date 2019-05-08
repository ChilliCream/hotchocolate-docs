---
id: conventions
title: Conventions
---

When you build a schema with _Hot Chocolate_ we have a lot of conventions in place that let you infer the type structure and more from existing .net types. These conventions are provided through the `DefaultNamingConventions` class and the `DefaultTypeInspector` class.

`DefaultNamingConventions` handles how things are named or where to fetch descriptions for things.
`DefaultTypeInspector` on the other hand inspects the types and will infer the structure of the types.

If we wanted for example to introduce custom attributes instead of our GraphQL* attributes than we could inherit from those two classes and overwrite what we want to change. In order to provide the schema builder with our new conventions class all we had to do is to register our convention instances with our dependency injection provider.