#!/usr/bin/env -S npx tsx

// #!/usr/bin/env -S npx tsx is required in addition to chmod 755 on your plugin to get it working locally.

import { createEcmaScriptPlugin, runNodeJs } from "@bufbuild/protoplugin";
import {
  literalString,
  makeJsDoc,
  localName,
  findCustomMessageOption,
} from "@bufbuild/protoplugin/ecmascript";
import { DescField, DescMessage, DescMethod, DescService, FieldDescriptorProto, MethodKind, ScalarType } from "@bufbuild/protobuf";
import type { Schema } from "@bufbuild/protoplugin/ecmascript";


import { genAuthComponent, genFirebase, genLayoutPage, generateRoutes, genAllComponent, genWriteComponent } from "./svelte-templates";
import { generateViewForType } from "./generator"


const protocGen = createEcmaScriptPlugin({
  name: "protoc-gen-goo-es",
  version: `v0.2.1`,
  parseOption,
  generateTs,
});

runNodeJs(protocGen);

function parseOption(key: string, value: string | undefined) {

}

function generateTs(schema: Schema) {
  // find all messages within the proto.
  let i;
  for (i in schema.files) {
    for (let j in schema.files[i].messages) {
      generateCode(schema, schema.files[i].messages[j])
    }
  }

  genFirebase(schema)
  genAuthComponent(schema)
  genLayoutPage(schema)
}

function generateCode(schema: Schema, message: DescMessage) {
  // generate message for name.
  const messageName = message.name

  generateViewForType(schema, message, "View")
  generateViewForType(schema, message, "Edit")

  genAllComponent(schema, messageName)

  genWriteComponent(schema, messageName)
  generateRoutes(schema, messageName) // todo have this be only for messages that deserve routes.
}


