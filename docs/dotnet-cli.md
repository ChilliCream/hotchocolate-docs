---
id: dotnet-cli
title: dotnet CLI
---

Because we love the new Microsoft dotnet CLI we created a Hot Chocolate server template that lets you setup a new Graph QL server in seconds.

Here is how to install the Hot Chocolate template into your dotnet CLI:

```bash
dotnet new -i HotChocolate.Template
```

This will pull down the Hot Chocolate server template from nuget.org and integrate it into your dotnet CLI.

_Since the .net SDKs are installed side by side the above command will only install the template into the current SDK. If you upgrade your SDK version you will need to rerun this command to install the template into your new SDK._

Moreover, if you want to update your template to a newer version first uninstall the current template version.

```bash
dotnet new -u HotChocolate.Template
dotnet new -i HotChocolate.Template
```

In order to create a new GraphQL server that already contains the hello world example just run the following command:

```bash
dotnet new graphql -n MyProjectName
```