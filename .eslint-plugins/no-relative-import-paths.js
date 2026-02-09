import path from 'path';

function isParentFolder(relativeFilePath, context, rootDir) {
    const cwd = context.getCwd ? context.getCwd() : context.cwd;
    const filename = context.getFilename
        ? context.getFilename()
        : context.filename;

    const absoluteRootPath = path.join(cwd, rootDir);
    const absoluteFilePath = path.join(
        path.dirname(filename),
        relativeFilePath,
    );

    return (
        relativeFilePath.startsWith('../') &&
        (rootDir === '' ||
            (absoluteFilePath.startsWith(absoluteRootPath) &&
                filename.startsWith(absoluteRootPath)))
    );
}

function isSameFolder(pathStr) {
    return pathStr.startsWith('./');
}

function getRelativePathDepth(pathStr) {
    let depth = 0;
    while (pathStr.startsWith('../')) {
        depth += 1;
        pathStr = pathStr.substring(3);
    }
    return depth;
}

function getAbsolutePath(relativePath, context, rootDir, prefix) {
    const cwd = context.getCwd ? context.getCwd() : context.cwd;
    const filename = context.getFilename
        ? context.getFilename()
        : context.filename;

    return [
        prefix,
        ...path
            .relative(
                path.join(cwd, rootDir),
                path.join(path.dirname(filename), relativePath),
            )
            .split(path.sep),
    ]
        .filter(String)
        .join('/');
}

const message = 'import statements should have an absolute path';

export default {
    rules: {
        'no-relative-import-paths': {
            meta: {
                type: 'layout',
                fixable: 'code',
                schema: {
                    type: 'array',
                    minItems: 0,
                    maxItems: 1,
                    items: [
                        {
                            type: 'object',
                            properties: {
                                allowSameFolder: { type: 'boolean' },
                                rootDir: { type: 'string' },
                                prefix: { type: 'string' },
                                allowedDepth: { type: 'number' },
                            },
                            additionalProperties: false,
                        },
                    ],
                },
            },
            create: function (context) {
                const { allowedDepth, allowSameFolder, rootDir, prefix } = {
                    allowedDepth: context.options[0]?.allowedDepth,
                    allowSameFolder:
                        context.options[0]?.allowSameFolder || false,
                    rootDir: context.options[0]?.rootDir || '',
                    prefix: context.options[0]?.prefix || '',
                };

                return {
                    ImportDeclaration: function (node) {
                        const pathStr = node.source.value;
                        if (isParentFolder(pathStr, context, rootDir)) {
                            if (
                                typeof allowedDepth === 'undefined' ||
                                getRelativePathDepth(pathStr) > allowedDepth
                            ) {
                                context.report({
                                    node,
                                    message: message,
                                    fix: function (fixer) {
                                        return fixer.replaceTextRange(
                                            [
                                                node.source.range[0] + 1,
                                                node.source.range[1] - 1,
                                            ],
                                            getAbsolutePath(
                                                pathStr,
                                                context,
                                                rootDir,
                                                prefix,
                                            ),
                                        );
                                    },
                                });
                            }
                        }

                        if (isSameFolder(pathStr) && !allowSameFolder) {
                            context.report({
                                node,
                                message: message,
                                fix: function (fixer) {
                                    return fixer.replaceTextRange(
                                        [
                                            node.source.range[0] + 1,
                                            node.source.range[1] - 1,
                                        ],
                                        getAbsolutePath(
                                            pathStr,
                                            context,
                                            rootDir,
                                            prefix,
                                        ),
                                    );
                                },
                            });
                        }
                    },
                };
            },
        },
    },
};
