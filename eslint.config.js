const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const simpleImportSort = require("eslint-plugin-simple-import-sort");

module.exports = tseslint.config(
    {
        ignores: ["src/app/app.component.ts"],
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.stylistic,
            ...angular.configs.tsRecommended,
            {
                plugins: {
                    "simple-import-sort": simpleImportSort,
                },
                rules: {
                    "simple-import-sort/imports": [
                        "error",
                        {
                            groups: [["^\\u0000"], ["^@?(?!pixelart)\\w"], ["^@pixelart?\\w"], ["^\\w"], ["^[^.]"], ["^\\."]],
                        },
                    ],
                    "simple-import-sort/exports": "error",
                },
            },
        ],
        processor: angular.processInlineTemplates,
        rules: {
            "@angular-eslint/directive-selector": [
                "error",
                {
                    type: "attribute",
                    prefix: "pixelart",
                    style: "camelCase",
                },
            ],
            "@angular-eslint/component-selector": [
                "error",
                {
                    type: "element",
                    prefix: "pixelart",
                    style: "kebab-case",
                },
            ],
            "@typescript-eslint/naming-convention": [
                "error",
                {
                    selector: "default",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                    filter: {
                        regex: "^(ts-jest|\\^.*)$",
                        match: false,
                    },
                },
                {
                    selector: "default",
                    format: ["camelCase"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "variable",
                    format: ["camelCase", "UPPER_CASE"],
                    leadingUnderscore: "allow",
                    trailingUnderscore: "allow",
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
                {
                    selector: "enumMember",
                    format: ["PascalCase"],
                },
                {
                    selector: "property",
                    format: null,
                    filter: {
                        regex: "^(host)$",
                        match: false,
                    },
                },
            ],
            complexity: "error",
            "max-len": [
                "error",
                {
                    code: 140,
                },
            ],
            "no-new-wrappers": "error",
            "no-throw-literal": "error",
            "@typescript-eslint/consistent-type-definitions": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "no-invalid-this": "off",
            "@typescript-eslint/no-invalid-this": ["warn"],
            "@angular-eslint/no-host-metadata-property": "off",
        },
    },
    {
        files: ["**/*.html"],
        extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
        rules: {},
    },
);
