module.exports = {
  extends: ["eslint-config-tuya-panel"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-module-boundary-types": [
      "warn",
      {
        allowArgumentsExplicitlyTypedAsAny: true,
      },
    ],
    "import/no-unresolved": ["error", { ignore: ["^@/"] }],
    "react/require-default-props": "off",
    "import/no-named-as-default": "off",
    "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
    "no-continue": "off",
    "react/no-array-index-key": "warn",
    "react/no-unused-prop-types": "warn",
    camelcase: [
      "error",
      {
        allow: ["^utm_", "product_id", "order_id"],
        properties: "never",
      },
    ],
  },
};
