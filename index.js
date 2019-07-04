const fs = require('fs');
const _path = require('path');

class WebpackInnerWindowPlugin {
    constructor(options) {
        this.entry = options.entry;
    }

    injectCode(file) {
        const data = fs.readFileSync(file);
        const scriptSrc = fs.readFileSync(_path.resolve(__dirname, './addInnerWindowScript.txt'));
        console.log(scriptSrc);
        let content = data.toString();
        content = content.replace(/<\/body>/g, (raw) => {
            return `<script async type="text/javascript">${scriptSrc}</script> \n ${raw}`
        })
        fs.writeFileSync(file, content, function (err) {
            if (err) {
                console.log(err)
            }
        })
    }

    apply(compiler) {
        compiler.hooks.environment.tap('WebpackInnerWindowPlugin', () => {
            this.injectCode(this.entry)
        })
    }
}

module.exports = WebpackInnerWindowPlugin;