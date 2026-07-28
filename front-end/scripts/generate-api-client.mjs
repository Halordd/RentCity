import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const frontendRoot = resolve(scriptDir, "..");
const repoRoot = resolve(frontendRoot, "..");
const openApiPath = resolve(repoRoot, "docs", "api", "openapi.json");
const outputPath = resolve(frontendRoot, "src", "api", "generated.ts");
const checkOnly = process.argv.includes("--check");
const openApi = JSON.parse(readFileSync(openApiPath, "utf8"));

const httpMethods = ["get", "post", "put", "patch", "delete"];
const reservedTypeNames = new Set([
  "Array",
  "Boolean",
  "Date",
  "Function",
  "Number",
  "Object",
  "Promise",
  "Record",
  "String",
  "unknown"
]);

const schemas = openApi.components?.schemas || {};
const schemaNameMap = new Map();

for (const name of Object.keys(schemas)) {
  schemaNameMap.set(name, safeTypeName(name));
}

function safeTypeName(name) {
  const cleaned = name.replace(/[^A-Za-z0-9_$]/g, "");
  const withStart = /^[A-Za-z_$]/.test(cleaned) ? cleaned : `Api${cleaned}`;
  return reservedTypeNames.has(withStart) ? `Api${withStart}Schema` : withStart;
}

function refName(ref) {
  return ref.split("/").pop();
}

function refType(ref) {
  return schemaNameMap.get(refName(ref)) || safeTypeName(refName(ref));
}

function quote(value) {
  return JSON.stringify(value);
}

function propertyKey(name) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) ? name : quote(name);
}

function literalUnion(values) {
  return values.map((value) => quote(value)).join(" | ");
}

function schemaToType(schema) {
  if (!schema) return "unknown";
  if (schema.$ref) return refType(schema.$ref);
  if (schema.enum) return literalUnion(schema.enum);
  if (schema.oneOf?.length) return schema.oneOf.map(schemaToType).join(" | ");
  if (schema.anyOf?.length) return schema.anyOf.map(schemaToType).join(" | ");
  if (schema.allOf?.length) return schema.allOf.map(schemaToType).join(" & ");

  const nullable = schema.nullable ? " | null" : "";
  const type = Array.isArray(schema.type) ? schema.type.find((item) => item !== "null") : schema.type;

  if (type === "string") return `string${nullable}`;
  if (type === "integer" || type === "number") return `number${nullable}`;
  if (type === "boolean") return `boolean${nullable}`;
  if (type === "array") return `Array<${schemaToType(schema.items)}>${nullable}`;
  if (type === "object" || schema.properties) {
    const properties = schema.properties || {};
    const required = new Set(schema.required || []);

    if (Object.keys(properties).length > 0) {
      const lines = Object.entries(properties).map(([name, value]) => {
        const optional = required.has(name) ? "" : "?";
        return `${propertyKey(name)}${optional}: ${schemaToType(value)};`;
      });
      return `{\n${indent(lines.join("\n"), 2)}\n}${nullable}`;
    }

    if (schema.additionalProperties && schema.additionalProperties !== true) {
      return `Record<string, ${schemaToType(schema.additionalProperties)}>${nullable}`;
    }

    return `Record<string, unknown>${nullable}`;
  }

  return `unknown${nullable}`;
}

function indent(value, spaces) {
  return value
    .split("\n")
    .map((line) => `${" ".repeat(spaces)}${line}`)
    .join("\n");
}

function generateSchemaTypes() {
  return Object.entries(schemas).map(([name, schema]) => {
    const typeName = schemaNameMap.get(name);
    const properties = schema.properties || {};
    const required = new Set(schema.required || []);

    if (schema.$ref || schema.enum || schema.oneOf || schema.anyOf || schema.allOf || Object.keys(properties).length === 0) {
      return `export type ${typeName} = ${schemaToType(schema)};`;
    }

    const lines = Object.entries(properties).map(([property, value]) => {
      const optional = required.has(property) ? "" : "?";
      return `  ${propertyKey(property)}${optional}: ${schemaToType(value)};`;
    });
    return `export interface ${typeName} {\n${lines.join("\n")}\n}`;
  });
}

function requestBodyType(operation) {
  const body = operation.requestBody;
  if (!body) return "undefined";

  const content = body.content || {};
  const media = content["application/json"] || Object.values(content)[0];
  const type = schemaToType(media?.schema);
  return body.required === false ? `${type} | undefined` : type;
}

function paramsType(operation, location) {
  const parameters = (operation.parameters || []).filter((item) => item.in === location);
  if (!parameters.length) return "EmptyObject";

  const lines = parameters.map((parameter) => {
    const optional = parameter.required ? "" : "?";
    return `${propertyKey(parameter.name)}${optional}: ${schemaToType(parameter.schema)};`;
  });
  return `{\n${indent(lines.join("\n"), 4)}\n  }`;
}

function operationHasAuth(operation) {
  return Array.isArray(operation.security) && operation.security.some((entry) => Object.keys(entry).includes("bearer"));
}

function collectOperations() {
  const operations = [];
  for (const [path, pathItem] of Object.entries(openApi.paths || {})) {
    for (const method of httpMethods) {
      const operation = pathItem[method];
      if (!operation) continue;

      const upperMethod = method.toUpperCase();
      operations.push({
        key: `${upperMethod} ${path}`,
        method: upperMethod,
        path,
        requestBody: requestBodyType(operation),
        pathParams: paramsType(operation, "path"),
        query: paramsType(operation, "query"),
        auth: operationHasAuth(operation)
      });
    }
  }
  return operations;
}

function generateOperationTypes(operations) {
  const members = operations.map((operation) => {
    return [
      `  ${quote(operation.key)}: {`,
      `    method: ${quote(operation.method)};`,
      `    path: ${quote(operation.path)};`,
      `    requestBody: ${operation.requestBody};`,
      `    pathParams: ${operation.pathParams};`,
      `    query: ${operation.query};`,
      `    response: unknown;`,
      `    auth: ${operation.auth};`,
      "  };"
    ].join("\n");
  });
  return `export interface ApiOperations {\n${members.join("\n")}\n}`;
}

function generateOperationMetadata(operations) {
  const entries = operations.map((operation) => {
    return `  ${quote(operation.key)}: { method: ${quote(operation.method)}, path: ${quote(operation.path)}, auth: ${operation.auth} }`;
  });
  return `export const apiOperations = {\n${entries.join(",\n")}\n} as const satisfies Record<ApiOperationKey, { method: ApiMethod; path: string; auth: boolean }>;`;
}

function generate() {
  const operations = collectOperations();
  const methodUnion = [...new Set(operations.map((operation) => operation.method))]
    .map((method) => quote(method))
    .join(" | ");

  return [
    "/* This file is auto-generated by front-end/scripts/generate-api-client.mjs. Do not edit manually. */",
    "",
    "export type JsonPrimitive = string | number | boolean | null;",
    "export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };",
    "export type EmptyObject = Record<never, never>;",
    "",
    ...generateSchemaTypes(),
    "",
    `export type ApiMethod = ${methodUnion};`,
    "",
    generateOperationTypes(operations),
    "",
    "export type ApiOperationKey = keyof ApiOperations;",
    "export type ApiOperationKeyByMethod<M extends ApiMethod> = {",
    "  [K in ApiOperationKey]: ApiOperations[K][\"method\"] extends M ? K : never;",
    "}[ApiOperationKey];",
    "export type ApiRequestBody<K extends ApiOperationKey> = ApiOperations[K][\"requestBody\"];",
    "export type ApiPathParams<K extends ApiOperationKey> = ApiOperations[K][\"pathParams\"];",
    "export type ApiQuery<K extends ApiOperationKey> = ApiOperations[K][\"query\"];",
    "export type ApiResponse<K extends ApiOperationKey> = ApiOperations[K][\"response\"];",
    "",
    generateOperationMetadata(operations),
    ""
  ].join("\n");
}

const nextOutput = generate();

if (checkOnly) {
  const currentOutput = readFileSync(outputPath, "utf8");
  if (currentOutput !== nextOutput) {
    console.error("Generated API client is out of date. Run: npm --prefix front-end run api:generate");
    process.exit(1);
  }
  console.log("Generated API client is up to date.");
} else {
  writeFileSync(outputPath, nextOutput);
  console.log(`Generated API client: ${outputPath}`);
}
