
import { createEcmaScriptPlugin, runNodeJs } from "@bufbuild/protoplugin";
import {
  literalString,
  makeJsDoc,
  localName,
  findCustomMessageOption,
} from "@bufbuild/protoplugin/ecmascript";
import { DescMessage, DescMethod, DescService, MethodKind, ScalarType } from "@bufbuild/protobuf";
import type { Schema } from "@bufbuild/protoplugin/ecmascript";

const protocGengooEs = createEcmaScriptPlugin({
    name: "protoc-gen-goo-es",
    version: `v0.2.1`,
    parseOption,
    generateTs,
});

  function parseOption(key: string, value: string | undefined){
  
  }

  function generateTs(schema: Schema) {}
  