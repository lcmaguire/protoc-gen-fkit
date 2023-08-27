import { DescField, DescMessage, ScalarType } from "@bufbuild/protobuf";
import { Schema } from "@bufbuild/protoplugin";
import { protoCamelCase } from "./svelte-templates";

export const genMessage = "<!-- this file was generated by <todo put plugin name> do not edit-->"




export function generateViewForType(schema: Schema, message: DescMessage, viewType: string) {
    let funcsToGen = [];
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
            if (checkWriteType(viewType)) {
                spacing += `    `
                start = `<label for="${currentFieldName}"> ${currentFieldName} </label><br>`
                start += `{#if ${messageName}.${currentFieldName} != null}\n`
                start += `  {#each ${messageName}.${currentFieldName} as ${currentFieldName}, key}\n`
                end = `${spacing}<button on:click={() => remove${currentFieldName}Array(key)}> Remove from ${currentFieldName}</button><br>\n`

                end += `  {/each}\n`
                end += `{/if}\n`
                end += `<button on:click={push${currentFieldName}Array}> Add to ${currentFieldName}</button>\n`

                funcsToGen.push(generateArrayFunctions(currentFieldName, messageName, defaultRepeatedValue(currentField)))
            } else {
                spacing = `  `
                start = `{#if ${messageName}.${currentFieldName} != null}\n`
                start += `${spacing}{#each ${messageName}.${currentFieldName} as ${currentFieldName}}\n` // add in key, add in button
                end = `${spacing}{/each}\n`
                end += `{/if}\n`
                spacing += `  `
            }
        } else {
            currentFieldName = `${messageName}.${currentFieldName}`
        }

        if (currentField.enum != undefined) {
            if (checkWriteType(viewType)) {
                body += `<label for="${currentFieldName}"> ${currentFieldName} </label>\n`
                body += spacing + editEnumView(currentField, currentFieldName)
            } else {
                body += spacing + getEnumView(currentField, currentFieldName)
            }

        } else if (currentField.message != undefined) {
            messagesToImport.push(protoCamelCase(currentField.message!.name))
            if (checkWriteType(viewType)) {
                body = spacing + editMessageView(currentField.message!, currentFieldName)
            } else {
                body = spacing + getMessageView(currentField.message!, currentFieldName)
            }
        } else {
            if (checkWriteType(viewType)) {
                if (!currentField.repeated) {
                    body += `<label for="${currentFieldName}"> ${currentFieldName} </label>\n`
                    body += spacing + editScalarView(currentField, currentFieldName) + "<br>"
                } else {
                    body += spacing + editScalarView(currentField, currentFieldName)
                }
            } else {
                body = spacing + getScalarView(currentField, currentFieldName)
            }
        }
        res += start + body + end
    }

    res = res.trim()

    // build html then do imports after.
    let newFile = schema.generateFile(`lib/${messageName}/${viewType}${messageName}.svelte`)
    newFile.print(genMessage)
    let spacing = `  `
    // svelte component
    newFile.print("<script>")
    newFile.print(`${spacing}// @ts-nocheck`)
    for (let i in messagesToImport) { // todo have this be done for all views.
        let importMessage = messagesToImport[i]
        newFile.print(`${spacing}import ${viewType}${importMessage} from "$lib/${importMessage}/${viewType}${importMessage}.svelte";`)
    }

    newFile.print(`${spacing}export let ${messageName} = {};`)
    if (checkWriteType(viewType)) {
        newFile.print(`${spacing}if (${messageName} == undefined){ ${messageName} = {}}`)
    }

    for (let i in funcsToGen) {
        for (let func in funcsToGen[i]) {
            newFile.print(`${spacing}${funcsToGen[i][func]}`)
        }
    }

    newFile.print("</script>")
    newFile.print("")
    newFile.print(`<div class="${messageName}">`)
    newFile.print(res)
    newFile.print("</div>")
    newFile.print("")
}

function generateArrayFunctions(fieldName: string, messageName: string, defaultType: string) {
    let a = `function push${fieldName}Array() {if (${messageName}.${fieldName} == undefined) {${messageName}.${fieldName} = []};${messageName}.${fieldName} = ${messageName}.${fieldName}.concat(${defaultType})}`
    let b = `function remove${fieldName}Array(index) {${messageName}.${fieldName}.splice(index, 1); ${messageName}.${fieldName} = ${messageName}.${fieldName}}`
    return [a, b]
}

// todo have this be handled by a type.
function checkWriteType(viewType: string) {
    return viewType == "Edit"
}

function getScalarView(currentField: DescField, currentName: string) {
    switch (currentField.scalar) {
        case ScalarType.STRING:
            return `<p class="${currentName}"> ${currentName} : {${currentName}} </p>\n`
        case ScalarType.BOOL:
            return `<p class="${currentName}"> ${currentName} : {${currentName}}  </p>\n`
        case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64: ScalarType.FIXED32;
        case ScalarType.FIXED64: case ScalarType.SFIXED32: case ScalarType.SFIXED64: case ScalarType.DOUBLE: case ScalarType.FLOAT:
            return `<p class="${currentName}"> ${currentName} : {${currentName}} </p>\n`
        default:
            return ""
    }
}

function getEnumView(currentField: DescField, currentName: string) {
    return `<p class="${currentName}"> ${currentName} : {${currentName}} </p>\n`
}

function getMessageView(message: DescMessage, currentName: string) {
    return `<View${message.name} ${message.name}={${currentName}} />\n`
}

function editScalarView(currentField: DescField, currentName: string) {
    switch (currentField.scalar) {
        case ScalarType.STRING:
            return `<input class="${currentName}" bind:value={${currentName}} >\n`
        case ScalarType.BOOL:
            return `<input class="${currentName}" type=checkbox  bind:checked={${currentName}}>\n`
                ;
        case ScalarType.INT32: case ScalarType.INT64: case ScalarType.UINT32: case ScalarType.UINT64:
            // todo enforce int in UI here
            return `<input class="${currentName}" type=number bind:value={${currentName}} min=0 step="1" >\n`
        case ScalarType.FIXED32: case ScalarType.FIXED64: case ScalarType.SFIXED32: case ScalarType.SFIXED64: case ScalarType.DOUBLE: case ScalarType.FLOAT:
            return `<input class="${currentName}" type=number bind:value={${currentName}} min=0 >\n`
        default:
            return `<!-- ${currentField.scalar}  ${currentName} -->`
    }
}

function editEnumView(currentField: DescField, currentName: string) {
    let res = `<select bind:value={${currentName}}>\n`
    for (let i = 0; i < currentField.enum!.values.length; i++) {
        res += `<option value="${currentField.enum!.values[i].name}">${currentField.enum!.values[i].name}</option>\n`
    }
    res += `</select><br>\n`
    return res
}

function editMessageView(message: DescMessage, currentName: string) {
    return `<Edit${message.name} bind:${message.name}={${currentName}} />\n`
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
    return ""
}

// type -> { html element class}