const CPT_TAG_REG = /\.html\?cpt=(\w+)/;

const _ = require('lodash'),
    $path = require('path'),
    fs = require('fs');

class Plugin {
    constructor(options) {
        this.options = options;
        this.components = {};
        if (options.template && options.filename) {
            let template = $path.resolve(options.template);
            this.options.template = template;
            //判段文件是否存在
            if (!fs.existsSync(template)) {
                throw new Error('template文件不存在');
            }
        } else {
            throw new Error('template或filename选项缺失');
        }
    }

    apply(compiler) {

        //创建 Compilation
        compiler.plugin("compilation", (compilation, params) => {
            compilation.plugin('after-optimize-modules', (modules) => {

                modules.forEach((module) => {
                    this.pickComponentsTemplate(module)
                });

            });


        });

        //准备生成文件
        compiler.plugin("emit", (compilation, callback) => {

            const _this = this;

            let source = '';

            compilation.fileDependencies.push(this.options.template);

            compilation.assets[this.options.filename] = {
                source: function () {
                    source = fs.readFileSync(_this.options.template).toString();
                    source = _.template(source)(_this.components);
                    return source;
                },
                size: function () {
                    return source.length;
                }
            };
            callback();
        });

    }

    pickComponentsTemplate(module) {
        let res = CPT_TAG_REG.exec(module.rawRequest);
        if (res) {
            let _source = module._source;
            let _value = _source._value;
            if(_value) {
                _source._value = '';
                this.components[res[1]] = this.getTemplate(_value);
            }
        }
    }

    getTemplate(value) {
        var module = {
            exports: {}
        }
        new Function('module', value)(module);

        return module.exports;
    }
}

module.exports = Plugin;