#!/usr/bin/env -S npx tsx

// #!/usr/bin/env -S npx tsx is required in addition to chmod 755 on your plugin to get it working locally.

import { createEcmaScriptPlugin, runNodeJs } from "@bufbuild/protoplugin";
import {
  literalString,
  makeJsDoc,
  localName,
  findCustomMessageOption,
} from "@bufbuild/protoplugin/ecmascript";
import { DescMessage, DescMethod, DescService, MethodKind, ScalarType } from "@bufbuild/protobuf";
import type { Schema } from "@bufbuild/protoplugin/ecmascript";


import  { parseTemplate } from "./svelte-templates";



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
}

function generateCode(schema: Schema, message: DescMessage) {
  // generate message for name.
  const f = schema.generateFile(`${message.name}.Svelte`);

  // for all fields in message, iterate over it.

  let html = "\n"

  html += genHtmlForMessage(message)


  parseTemplate(html)

  f.print(`${ parseTemplate(html)}`)
}

function genHtmlForMessage(message: DescMessage) {
  let res = `<h1> ${message.name}</h1>`

  let currentPath = "message" // todo have this be recursive to update for nested structures.
  for (let i in message.fields) {
    let currentField = message.fields[i]
    //let currentName = currentField.name
    let currentName = currentField.jsonName
    if (currentName == undefined) {
      currentName = currentField.name
    }

    res += "\n"

    switch (currentField.scalar) {
      case ScalarType.STRING:
        res += `<input bind:value={${currentPath}.${currentName}} >`
        break;
      case ScalarType.BOOL:
        res += `<input type=checkbox  bind:checked={${currentPath}.${currentName}}>`
        break;
      case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
        res += `<input type=number bind:value={${currentPath}.${currentName}} min=0>`
        break;
      default:
        break;
    }
  }

  return res
}

function genHtmlViewForMessage(message: DescMessage) {
  let res = `<h1> ${message.name}</h1>`

  let currentPath = "message" // todo have this be recursive to update for nested structures.
  for (let i in message.fields) {
    let currentField = message.fields[i]
    //let currentName = currentField.name
    let currentName = currentField.jsonName
    if (currentName == undefined) {
      currentName = currentField.name
    }

    res += "\n"

    switch (currentField.scalar) {
      case ScalarType.STRING:
        res += `<input bind:value={${currentPath}.${currentName}} >`
        break;
      case ScalarType.BOOL:
        res += `<input type=checkbox  bind:checked={${currentPath}.${currentName}}>`
        break;
      case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
        res += `<input type=number bind:value={${currentPath}.${currentName}} min=0>`
        break;
      default:
        break;
    }
  }

  return res
}

/*
  - generate map[name]type ( nested)
  - then have html templates to parse in based upon type of view
*/