const loaderUtils = require("loader-utils");
module.exports = function(source, sourceMap) {
    // 在此按照你的需求处理source
    // return source.replace("word", ",I am Shancai");
    // this.callback(
    //     // 当无法转换原内容时，给 Webpack 返回一个 Error
    //     err: Error | null,
    //     // 原内容转换后的内容
    //     content: string | Buffer,
    //     // 用于把转换后的内容得出原内容的 Source Map，方便调试
    //     sourceMap ? : SourceMap,
    //     // 如果本次转换为原内容生成了 AST 语法树，可以把这个 AST 返回,以方便之后需要 AST 的 Loader 复用该 AST，以避免重复生成 AST，提升性能
    //     abstractSyntaxTree ? : AST
    // );

    // 开始缓存
    this.cacheable && this.cacheable();
    // 获取写入配置信息(获取用户给当前loader传入的options)
    const options = loaderUtils.getOptions(this);
    console.log("options-->", options);

    // 告诉webpack此次转换是异步的，loader会在callback中回调结果
    var callback = this.async();
    // someAsyncOperation 代表一些异步的方法
    // todo报错 未定义
    // someAsycnOperation(source, function(err, result, sourceMap, ast) {
    //     // 通过callback返回异步执行后的结果
    //     callback(err, result, sourceMap, ast);
    // });
    this.callback(null, source.replace("world", "i am shancai"), sourceMap);

    return source.replace("word", ", I am shancai");
};