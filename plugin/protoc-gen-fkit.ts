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


import { genAuthComponent, genFirebase, genLayoutPage, generateRoutes, parseAllcomponent, parseCreateComponent, parseEditTemplate, parseViewTemplate, protoCamelCase } from "./svelte-templates";



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

  const writeComponentPath = `lib/${messageName}/Write${messageName}.svelte`
  const writeComponent = schema.generateFile(writeComponentPath);
  writeComponent.print(parseEditTemplate(genHtmlForMessage(message), message))

  const viewComponentPath = `lib/${messageName}/View${messageName}.svelte`
  const viewComponent = schema.generateFile(viewComponentPath);
  viewComponent.print(`${parseViewTemplate(genHtmlViewForMessage(message), message)}`)

  const allComponentPath = `lib/${messageName}/All${messageName}.svelte`
  const allComponent = schema.generateFile(allComponentPath);
  allComponent.print(parseAllcomponent(messageName))

  const createComponentPath = `lib/${messageName}/Create${messageName}.svelte`
  const createComponent = schema.generateFile(createComponentPath);
  createComponent.print(parseCreateComponent(messageName))

  generateRoutes(schema, messageName)

  mkView(schema, gc(schema, message))

}

function genHtmlForMessage(message: DescMessage) {
  let messageName = message.name
  let res = `<h3> ${messageName}</h3>\n`

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
      return `<input bind:value={${currentName}} >\n`
    case ScalarType.BOOL:
      return `<input type=checkbox  bind:checked={${currentName}}>\n`
        ;
    case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64:
      // todo enforce int in UI here
      return `<input type=number bind:value={${currentName}} min=0 step="1" >\n`
    case ScalarType.FIXED32: case ScalarType.FIXED64: case ScalarType.SFIXED32: case ScalarType.SFIXED64: case ScalarType.DOUBLE: case ScalarType.FLOAT:
      return `<input type=number bind:value={${currentName}} min=0 >\n`
    default:
      return `<!-- ${currentField.scalar}  ${currentName} -->`
  }
}

function editEnumView(currentField: DescField, currentName: string) {
  let res = `<select bind:value={${currentName}}>\n`
  for (let i = 0; i < currentField.enum!.values.length; i++) {
    res += `<option value="${currentField.enum!.values[i].name}">${currentField.enum!.values[i].name}</option>\n`
  }
  res += `</select>\n`
  return res
}

function editMessageView(message: DescMessage, currentName: string) {
  return `<Write${message.name} bind:${message.name}={${currentName}} />\n`
}

function genHtmlViewForMessage(message: DescMessage) {
  let messageName = message.name
  let res = `<h3> ${messageName}</h3>\n`

  for (let i in message.fields) {
    let currentField = message.fields[i]
    let currentFieldName = currentField.jsonName
    if (currentFieldName == undefined) { // todo see if this is ever used.
      currentFieldName = currentField.name
    }
    currentFieldName = protoCamelCase(currentFieldName)

    let start = ""
    let body = ""
    let end = ""
    if (currentField.repeated) {
      start = `{#if ${messageName}.${currentFieldName} != null}\n{#each ${messageName}.${currentFieldName} as ${currentFieldName}}\n`
      end = `\n{/each}\n{/if}\n`
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
      return `<p> {${currentName}} </p>\n`
    case ScalarType.BOOL:
      return `<p> {${currentName}}  </p>\n`
    case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64:
      return `<p> {${currentName}} </p>\n`
    default:
      return ""
  }
}

function getEnumView(currentField: DescField, currentName: string) {
  return `<p> ${currentName} : {${currentName}} </p>\n`
}

function getMessageView(message: DescMessage, currentName: string) {
  return `<View${message.name} ${message.name}={${currentName}} />\n`
}

interface fieldInfo {
  parentMessage: string;
  type: ScalarType;
  repeated: boolean;
  fieldKind: string;
}

function gc(schema: Schema, message: DescMessage) {
  let mapFields = new Map<string, fieldInfo>();

  let messageName = protoCamelCase(message.name)
  for (let i = 0; i < message.fields.length; i++) {
    let currentField = message.fields[i]
    currentField.fieldKind

    let fi = {
      parentMessage: messageName,
      type: currentField.scalar!,
      repeated: currentField.repeated,
      fieldKind: currentField.fieldKind,
    }
    mapFields.set(protoCamelCase(currentField.name), fi)

  }

  return mapFields
}


function mkView(schema: Schema, mapFields: Map<string, fieldInfo>) {

  //mapFields.forEach()

  // todo figure out correct typescript config to use what is below.
  // Type 'Map<string, fieldInfo>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
  // requires some ts.config work.
  //for (let [key, value] of mapFields) {
  //  console.log(key, value);
  //}

  //for (let key of Array.from(mapFields.keys())) {
  // let curr = mapFields.get(key)
  // }

  let newFile = schema.generateFile("test.md")

  mapFields.forEach(function (value: fieldInfo, key: string, mapFields: Map<string, fieldInfo>) {

    let repeatable = value.repeated

    // todo figure out how to do multiple declarations on one line.
    let start = ""
    let body = ""
    let end = ""

    let spacing = ""
    if (value.repeated) {
      spacing = "\t"
      newFile.print(`{#each ${value.parentMessage}.${key} as ${key}, key}`)
      end = "{/each}"
    }

    //if (value.fieldKind == "enum") {
      newFile.print(`${spacing} ${key}  ${value.fieldKind} `)
    //}

    newFile.print(end)

  })


}



/*
  for message get

  map[fieldName] {
    baseMessage
    type ( scalar, message)
    repeated

  }
*/ 