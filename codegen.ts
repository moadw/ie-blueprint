import "dotenv/config";

import type { CodegenConfig } from "@graphql-codegen/cli";

const schemaUrl =
  process.env.VITE_GRAPHQL_URL ?? "https://api-test.blueprint.kids/graphql";

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ["app/**/*.{ts,tsx}", "!app/gql/**"],
  ignoreNoDocuments: true,
  generates: {
    "app/gql/": {
      preset: "client",
      config: {
        useTypeImports: true,
        namingConvention: {
          typeNames: "keep",
          enumValues: "keep",
        },
      },
    },
  },
};

export default config;
