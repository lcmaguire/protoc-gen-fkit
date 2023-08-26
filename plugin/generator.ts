import { DescField, DescMessage, ScalarType } from "@bufbuild/protobuf";
import { Schema } from "@bufbuild/protoplugin";
import { protoCamelCase } from "./svelte-templates";


export function basic(schema: Schema, message: DescMessage) {
    let funcsToImport: string[] = []
    let messagesToImport: string[] = []
    let messageName = protoCamelCase(message.name) // todo this could wig some stuff out.


    let res = ""
    for (let i in message.fields) {
        let currentField = message.fields[i]
        let currentFieldName = protoCamelCase(currentField.name)

        let start = ""
        let body = ""
        let end = ""

        let spacing = ``
        if (currentField.repeated) {
            // todo append imported func here
            spacing = `  `
            start = `{#if ${messageName}.${currentFieldName} != null}\n`
            start += `${spacing}{#each ${messageName}.${currentFieldName} as ${currentFieldName}}\n`
            end = `${spacing}{/each}\n`
            end += `{/if}\n`
            spacing +=`  `
        } else {
            currentFieldName = `${messageName}.${currentFieldName}`
        }
        res += "\n"

        if (currentField.enum != undefined) {
            body = spacing + getEnumView(currentField, currentFieldName)
        } else if (currentField.message != undefined) {
            messagesToImport.push(protoCamelCase(currentField.message!.name))
            body = spacing + getMessageView(currentField.message!, currentFieldName)
        } else {
            body = spacing + getScalarView(currentField, currentFieldName)
        }
        res += start + body + end
    }

    res = res.trim()

    // build html then do imports after.
    let newFile = schema.generateFile(`lib/${messageName}/View${messageName}.svelte`)

    let spacing = `  `
    // svelte component
    newFile.print("<script>")
    newFile.print(`${spacing}// @ts-nocheck`)
    for (let i in messagesToImport) { // todo have this be done for all views.
        let importMessage = messagesToImport[i]
        newFile.print(`${spacing}import View${importMessage} from "$lib/${importMessage}/View${importMessage}.svelte";`)
    }

    for (let i in funcsToImport) { // todo have this be done for all views.
        //let importMessage = messageInfo.messagesToImport[i]
        //newFile.print(`${spacing}import View${importMessage} from "$lib/${importMessage}/View${importMessage}.svelte";`)
    }

    newFile.print(`${spacing}export let ${messageName} = {};`)

    newFile.print("</script>")
    newFile.print("")
    newFile.print(res)
    newFile.print("")
}


function getScalarView(currentField: DescField, currentName: string) {
    switch (currentField.scalar) {
        case ScalarType.STRING:
            return `<p> {${currentName}} </p>\n`
        case ScalarType.BOOL:
            return `<p> {${currentName}}  </p>\n`
        case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64: ScalarType.FIXED32;
        case ScalarType.FIXED64: case ScalarType.SFIXED32: case ScalarType.SFIXED64: case ScalarType.DOUBLE: case ScalarType.FLOAT:
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
