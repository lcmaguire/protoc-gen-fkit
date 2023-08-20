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


import { genAuthComponent, genFirebase, genLayoutPage, generateRoutes, parseAllcomponent, parseCreateComponent, parseEditTemplate, parseTemplate, protoCamelCase } from "./svelte-templates";



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
  //writeComponent.print(`${parseTemplate(genHtmlForMessage(message), message)}`)
  writeComponent.print(parseEditTemplate(genHtmlForMessage(message), message))

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
  let messageName = message.name
  let res = `<h3> ${messageName}</h3>`

  for (let i in message.fields) {
    let currentField = message.fields[i]
    let currentFieldName = currentField.jsonName
    if (currentFieldName == undefined) {
      currentFieldName = currentField.name
    }
    currentFieldName = protoCamelCase(currentFieldName)

    res += "\n"

    let start = ""
    let body = ""
    let end = ""
    if (currentField.repeated) {
      start = `{#if ${messageName}.${currentFieldName} != null}\n{#each ${messageName}.${currentFieldName} as ${currentFieldName}, key}\n`
      end = `<button on:click={() => remove${currentFieldName}Array(key)}> - </button>\n{/each}\n{/if}\n<button on:click={push${currentFieldName}Array}> + </button>\n`
    } else {
      currentFieldName = `${messageName}.${currentFieldName}`
    }
    res += "\n"

    if (currentField.enum != undefined) {
      body = editEnumView(currentField, currentFieldName)
    } else if (currentField.message != undefined) {
      body = editMessageView(currentField.message!, currentFieldName)
    } else {
      body = editScalarView(currentField, currentFieldName)
    }
    res += start + body + end
  }

  return res
}

function editScalarView(currentField: DescField, currentName: string) {
  switch (currentField.scalar) {
    case ScalarType.STRING:
      return  `<input bind:value={${currentName}} >\n`
    case ScalarType.BOOL:
      return`<input type=checkbox  bind:checked={${currentName}}>\n`
      ;
    case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
      // todo enforce int in UI here
      return `<input type=number bind:value={${currentName}} min=0>\n`
    case ScalarType.FIXED32 || ScalarType.FIXED64 || ScalarType.SFIXED32 || ScalarType.SFIXED64 || ScalarType.DOUBLE || ScalarType.FLOAT:
      return `<input type=number bind:value={${currentName}} min=0>\n`
    default:
      return ""
  }
}

function editEnumView(currentField: DescField, currentName: string){
  let res = `<select bind:value={${currentName}}>\n`
  for (let i = 0; i < currentField.enum!.values.length; i++) {
    res += `<option value="${currentField.enum!.values[i].name}">${currentField.enum!.values[i].name}</option>\n`
  }
  res += `</select>`
  return res
}

function editMessageView(message: DescMessage, currentName: string) {
  return `<Write${message.name} bind:${message.name}={${currentName}} />`
}

/*
  Change this to insert into html template based upon desired component. 
*/
function genHtmlViewForMessage(message: DescMessage) {
  let messageName = message.name
  let res = `<h3> ${messageName}</h3>`

  for (let i in message.fields) {
    let currentField = message.fields[i]
    let currentFieldName = currentField.jsonName
    if (currentFieldName == undefined) {
      currentFieldName = currentField.name
    }
    currentFieldName = protoCamelCase(currentFieldName)

    let start = ""
    let body = ""
    let end = ""
    if (currentField.repeated) {
      start = `{#if ${messageName}.${currentFieldName} != null}\n{#each ${messageName}.${currentFieldName} as ${currentFieldName}}`
      end = `\n{/each}\n{/if}`
    } else {
      currentFieldName = `${messageName}.${currentFieldName}`
    }
    res += "\n"

    if (currentField.enum != undefined) {
      body = getEnumView(currentField, currentFieldName)
    } else if (currentField.message != undefined) {
      body = getMessageView(currentField.message!, currentFieldName)
    } else {
      body = getScalarView(currentField, currentFieldName)
    }

    res += start + body + end
  }

  return res.trim()
}

function getScalarView(currentField: DescField, currentName: string) {
  switch (currentField.scalar) {
    case ScalarType.STRING:
      return `<p> {${currentName}} </p>`
    case ScalarType.BOOL:
      return `<p> {${currentName}}  </p>`
    case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
      return `<p> {${currentName}} </p>`
    default:
      return ""
  }
}

function getEnumView(currentField: DescField, currentName: string) {
  return `<p> {${currentName}} </p>`
}

function getMessageView(message: DescMessage, currentName: string) {
  return `<View${message.name} ${message.name}={${currentName}} />`
}
