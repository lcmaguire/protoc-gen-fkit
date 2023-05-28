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

function generateCode(schema: Schema, message: DescMessage){
    // generate message for name.
    const f = schema.generateFile(`${message.name}.ts`);

    // for all fields in message, iterate over it.


    // Generate Views for all.
    // Generate List, Get, Create, Delete and Update firestore code.
    f.print("// tuki.")
}

// TODO tidy this up. to generate a map[string]obj{} then based upon that info generate appropriate views.
function htmlFromMessage(input: string, currentPath: string, mess : DescMessage) {
    for (let i = 0; i < mess.fields.length; i++) {
      const currentField = mess.fields[i] // would probably need to recurse this in the event it is a message + do some nice stuff for alternate views.
      let name = currentField.jsonName
      if (name == undefined) {
        name = currentField.name
      }
      // name = snakeCaseToCamelCase(name)
      //currentField.kind
      // todo conditional html template based upon type of field
      // func for return input type based upon field type.
      let out = `
      <label for="fname">${name}:</label> <br>
      `
      if (currentField.scalar == ScalarType.BOOL ){
        // if bool do x
        out += `<input type=checkbox  bind:checked={${currentPath}.${name}}>`
      }
      if (currentField.scalar == ScalarType.STRING ){
        out += `<input bind:value={${currentPath}.${name}} >`
      }
      // for now just do 1 for all numeric types
      if (currentField.scalar == ScalarType.INT32 || currentField.scalar == ScalarType.INT64 ){
        out += `<input type=number bind:value={${currentPath}.${name}} >` // may have to use value https://svelte.dev/tutorial/numeric-inputs
      }
  
      if (currentField.scalar == ScalarType.UINT32 || currentField.scalar == ScalarType.UINT64 ){
        out += `<input type=number bind:value={{${currentPath}.${name}} min=0>` // may have to use value https://svelte.dev/tutorial/numeric-inputs
      }
  
      // handle nested messages NOTE: will need to init to empty obj for nested structs. // eg let req = { nest: {}}
      if (currentField.message != undefined){
        // if nested msg should be within another one of these.
        currentPath = `${currentPath}.${name}`
        out += htmlFromMessage(out, currentPath, currentField.message)
      }
  
      // problem will be with nested fields not containing Req. as bind val ( i guess field name passed in could help with this.)
      input += out + "<br>"
      
      // https://svelte.dev/tutorial/text-inputs consider
    }
    return input
  }