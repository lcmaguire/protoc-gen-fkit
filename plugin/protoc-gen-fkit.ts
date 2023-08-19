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


import { genAuthComponent, genFirebase, genLayoutPage, generateRoutes, parseAllcomponent, parseCreateComponent, parseTemplate, protoCamelCase } from "./svelte-templates";



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

  const writeComponentPath = `lib/Write${messageName}.svelte`
  const writeComponent = schema.generateFile(writeComponentPath);
  writeComponent.print(`${parseTemplate(genHtmlForMessage(message), message)}`)

  const viewComponentPath = `lib/View${messageName}.svelte`
  const viewComponent = schema.generateFile(viewComponentPath);
  viewComponent.print(`${parseTemplate(genHtmlViewForMessage(message), message)}`)

  const allComponentPath = `lib/All${messageName}.svelte`
  const allComponent = schema.generateFile(allComponentPath);
  allComponent.print(parseAllcomponent(messageName))

  const createComponentPath = `lib/Create${messageName}.svelte`
  const createComponent = schema.generateFile(createComponentPath);
  createComponent.print(parseCreateComponent(messageName))

  generateRoutes(schema, messageName)

}

function genHtmlForMessage(message: DescMessage) {
  let res = `<h1> ${message.name}</h1>`

  // todo gather nested messages names to import.
  // message.nestedMessages (perhaps here or in generating view)

  // arrays

  let currentPath = "message" // todo have this be recursive to update for nested structures.
  for (let i in message.fields) {
    let currentField = message.fields[i]
    let currentName = currentField.jsonName
    if (currentName == undefined) {
      currentName = currentField.name
    }
    currentName = protoCamelCase(currentName)

    res += "\n"

    switch (currentField.scalar) {
      case ScalarType.STRING:
        res += `<input bind:value={${currentPath}.${currentName}} >\n`
        break;
      case ScalarType.BOOL:
        res += `<input type=checkbox  bind:checked={${currentPath}.${currentName}}>\n`
        break;
      case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
        // todo enforce int in UI here
        res += `<input type=number bind:value={${currentPath}.${currentName}} min=0>\n`
        break;
      case ScalarType.FIXED32 || ScalarType.FIXED64 || ScalarType.SFIXED32 || ScalarType.SFIXED64 || ScalarType.DOUBLE || ScalarType.FLOAT:
        res += `<input type=number bind:value={${currentPath}.${currentName}} min=0>\n`
        break;
      default:
        break;
    }

    if (currentField.enum != undefined) {
      res += `<select bind:value={${currentPath}.${currentName}}>\n`
      for (let i =0; i < currentField.enum.values.length; i++) {
        res += `<option value="${currentField.enum.values[i].name}">${currentField.enum.values[i].name}</option>\n`
      }
      res += `</select>`
    }
    if (currentField.message != undefined) {
      res += `<Write${currentField.message.name} bind:${currentPath}={${currentPath}.${currentName}} />`
    }
  }

  return res
}

/*
  Change this to insert into html template based upon desired component. 
*/
function genHtmlViewForMessage(message: DescMessage) {
  let res = `<h1> ${message.name}</h1>`

  let currentPath = "message" // todo have this be recursive to update for nested structures.
  for (let i in message.fields) {
    let currentField = message.fields[i]
    let currentName = currentField.jsonName
    if (currentName == undefined) {
      currentName = currentField.name
    }
    currentName = protoCamelCase(currentName)

    res += "\n"

    switch (currentField.scalar) {
      case ScalarType.STRING:
        res += `<p> {${currentPath}.${currentName}} </p>`
        break;
      case ScalarType.BOOL:
        res += `<p> {${currentPath}.${currentName}}  </p>`
        break;
      case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
        res += `<p> {${currentPath}.${currentName}} </p>`
        break;
      default:
        break;
    }

    if (currentField.enum != undefined) {
      res += `<p> {${currentPath}.${currentName}} </p>`
    }

    if (currentField.message != undefined) {
      res += `<View${currentField.message.name} ${currentPath}={${currentPath}.${currentName}} />`
    }
  }

  return res
}
