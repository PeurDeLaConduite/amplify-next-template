const path = require("path");
require("ts-node").register({ transpileOnly: true });

module.exports = {
    rules: {
        "no-onclick-wrapper": require(
            path.resolve(__dirname, "..", "..", "eslint", "rules", "no-onclick-wrapper.ts")
        ).default,
    },
};
