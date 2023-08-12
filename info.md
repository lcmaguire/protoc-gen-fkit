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