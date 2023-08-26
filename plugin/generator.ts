import { DescField, DescMessage, ScalarType } from "@bufbuild/protobuf";
import { Schema } from "@bufbuild/protoplugin";
import { protoCamelCase } from "./svelte-templates";


export function basicView(schema: Schema, message: DescMessage) {
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
            start += `${spacing}{#each ${messageName}.${currentFieldName} as ${currentFieldName}}\n` // add in key, add in button
            end = `${spacing}{/each}\n`
            end += `{/if}\n`
            spacing += `  `
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
            return `<p> ${currentName} : {${currentName}} </p>\n`
        case ScalarType.BOOL:
            return `<p> ${currentName} : {${currentName}}  </p>\n`
        case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64: ScalarType.FIXED32;
        case ScalarType.FIXED64: case ScalarType.SFIXED32: case ScalarType.SFIXED64: case ScalarType.DOUBLE: case ScalarType.FLOAT:
            return `<p> ${currentName} : {${currentName}} </p>\n`
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

export function basicEdit(schema: Schema, message: DescMessage) {
    let funcsToGen = [];
    let messagesToImport: string[] = []
    let messageName = protoCamelCase(message.name) // todo this could wig some stuff out.


    let res = ""
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
        let spacing = ``
        if (currentField.repeated) {
            spacing += `    `
            start = `{#if ${messageName}.${currentFieldName} != null}\n`
            start += `  {#each ${messageName}.${currentFieldName} as ${currentFieldName}, key}\n`
            end = `${spacing}<button on:click={() => remove${currentFieldName}Array(key)}> - </button>\n`

            end += `  {/each}\n`
            end += `{/if}\n`
            end += `<button on:click={push${currentFieldName}Array}> + </button>\n`

            funcsToGen.push({
                fieldName: currentFieldName,
                defaultType: defaultRepeatedValue(currentField) // todo have func names determined here
            })

        } else {
            currentFieldName = `${messageName}.${currentFieldName}`
        }
        res += "\n"

        if (currentField.enum != undefined) {
            body = spacing + editEnumView(currentField, currentFieldName)
        } else if (currentField.message != undefined) {
            body = spacing + editMessageView(currentField.message!, currentFieldName)
            messagesToImport.push(currentField.message.name)
        } else {
            body = spacing + editScalarView(currentField, currentFieldName)
        }
        res += start + body + end
    }

    res = res.trim()

    // build html then do imports after.
    let newFile = schema.generateFile(`lib/${messageName}/Write${messageName}.svelte`)

    let spacing = `  `
    // svelte component
    newFile.print("<script>")
    newFile.print(`${spacing}// @ts-nocheck`)
    for (let i in messagesToImport) { // todo have this be done for all views.
        let importMessage = messagesToImport[i]
        newFile.print(`${spacing}import Write${importMessage} from "$lib/${importMessage}/Write${importMessage}.svelte";`)
    }

    newFile.print(`${spacing}export let ${messageName} = {};`)
    newFile.print(`${spacing}if (${messageName} == undefined){ ${messageName} = {}}`)

    // will generate functions to add and remove from any arrays in the message. 
    for (let i in funcsToGen) { // todo have this be done for all views.
        let curr = funcsToGen[i]
        newFile.print(`${spacing}function push${curr.fieldName}Array() {if (${message.name}.${curr.fieldName} == undefined) {${message.name}.${curr.fieldName} = []};${message.name}.${curr.fieldName} = ${message.name}.${curr.fieldName}.concat(${curr.defaultType})}`)
        newFile.print(`${spacing}function remove${curr.fieldName}Array(index) {${message.name}.${curr.fieldName}.splice(index, 1); ${message.name}.${curr.fieldName} = ${message.name}.${curr.fieldName}}`)
    }
    newFile.print("</script>")
    newFile.print("")
    newFile.print(res)
    newFile.print("")
}

function generateRemoveElementFromArray() {

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

// todo make a pkg for this.
function defaultRepeatedValue(currentField: DescField) {
    if (currentField.message != null) {
        return "{}"
    }

    switch (currentField.scalar) {
        case ScalarType.STRING:
            return `""`
        case ScalarType.BOOL:
            return "false"
        case ScalarType.INT32 || ScalarType.INT64 || ScalarType.UINT32 || ScalarType.UINT64:
            return "0"
    }
}