some helpful info for using this plugin / to keep nasty comments outside of code.

```

    FieldDescriptor useful info.

    name - fieldname
    scalar - combine with switch of ScalarType to determine what type of input view should be.
    enum - determine if enum
    repeated - determine if repeated
    oneof - determine if oneof
    optional - determine if optional
 

```

useful stuff to import 

```
// [object Object]
// ./fook_pb.js
// es_symbol
// Fook
// import("./fook_pb.js").Fook

from 

  viewComponent.print("// " + imp) // useful
  viewComponent.print("// " + imp.from)
  viewComponent.print("// " + imp.kind)
  viewComponent.print("// " + imp.name) // useful
  viewComponent.print("// " + imp.id) // useful

```


Svelte info

- https://kit.svelte.dev/docs/load
- load via +page.js in routes
- should write to lib/...

me notes

- ts / type safety

Task list 

- try type cast input (done) (undone)
- code to List, Create, Delete and Set
- Page to handle routing + data fetching


Decide 
- Components ? or routes? ( maybe components + routes)

Decision
- Components for View
- Routes for action(s)
- Use JS for now

https://github.com/sveltejs/realworld


# use

- point to /src dir

things to learn

- way to have the actions within the components be customizatble ( iface or pass in a func)
- id generation / new struct
- lower or uper case for .Svelte
- format generated code


ideas

- list component / array component
- env vars / load config based upon env
- ui improvement
- auth integration (perhaps func approach)
- 



Tasks

- gen components for showing / binding data
- path is `{{message}}/uuid`
- writeFunc, deleteFunc, e.t.c are passed into routes/views
- camelCase snakeCased names (Done) 


refined tasks

- routes ( page.svelte + page.js)
- firebase stuff
- delete button component / edit button component



nice ideas

- html has tag/class of proto path + purpose
- hidden fields ( e.g. dont show user uuid)