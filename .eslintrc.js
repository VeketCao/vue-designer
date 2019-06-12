module.exports = {
    root:true,
    parser: 'babel-eslint',
    "env": {
        "browser": true,
        "node":true,
        "commonjs": true,
        "es6": true,//至此es6语法检查
    },
    extends: 'standard',
    plugins: [
        'html',
        "standard",
        "promise"
    ],
    'rules': {
        "no-debugger": 2, //不允许出现debugger语句
    },
    "globals":{//声明在代码中自定义的全局变量
        "document":true,
        "navigator":true,
        "window":true,
        "_":true,//检查lodash的语法，否则会产生 '_'is no-undef
        "$":true,////添加支持jquery语法检查，不然会出现 '$'is no-undef,这也可以在env中添加“jquery:true”解决
        "__PROD__":true,
        "Vue":true,
    }
}