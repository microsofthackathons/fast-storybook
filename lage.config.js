module.exports = {
    pipeline: {
        build: {
            outputs: ["dist/**"],
            dependsOn: ["^build"],
        },
        "build:storybook": {
            outputs: ["storybook-static/**"],
            dependsOn: ["^build"],
        },
        clean: {
            cache: false,
            dependsOn: [],
        },
    },
};
