---
id: extending-types
title: Extending Types
---

_Hot Chocolate_ is built with extensibility in mind and allows you to customize exiting type base classes and the descriptors.

## Introduction

Types in _Hot Chocolate_ are 


## Extending Descriptors

Each descriptor now provides a new method called Extend. Extend returns an extension descriptor that allows us to integrate some logic with the type initialization pipeline.

Types are created in three phases:

Create Instance The initializer creates the type instance and the type definition. The type definition contains all information to create and initialize a type. After this step the type instance exists and is associated with a native .net type. The native .net type can be object but can also be something more specific. In this phase the type will also report all of its dependencies to the schema builder.

Complete Name After all types are created the names of the types will be completed.

Complete Type In the last step the types will be completed, this means that for instance the fields are assigned, or the directives are retrieved and associated with a type etc. After this the type is completed and becomes immutable.

The extension descriptor provides extension points to these three phases:

OnBeforeCreate OnBeforeCreate will allow you to customize the type definition. It is important to know that this step is not allowed to be dependent on another type object. Also, at this point you will not have access to the type completion context.

OnBeforeNaming OnBeforeNaming allows to provide logic to generate the name of a type. You can declare two kinds of dependencies in this step, either the dependency has to be named first or the dependency is allowed to be in any state.

OnBeforeCompletion OnBeforeCompletion allows to provide further logic that modifies the type definition. For instance, we could be dependent on another type in order to generate fields based on the fields of that other type. You can declare two kinds of dependencies in this step, either the dependency has to be completed first or the dependency is allowed to be in any state.