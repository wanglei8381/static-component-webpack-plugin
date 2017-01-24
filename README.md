#static-component-webpack-plugin
webpack静态组件插件

<code>
    var Plugin = require('static-component-webpack-plugin')

    //webpack配置
    module.exports = {
    module: {
            loaders: [
                {test: /\.css(\?cpt=\w+)?$/, loader: "style!loader")},
                {test: /\.js$(\?cpt=\w+)?$/, loader: "babel")},
                {test: /\.html(\?cpt=\w+)?$/, loader: "html"}
            ]
    },
    plugins: [
            new Plugin({
                filename: 'home.html',//输出文件
                template: 'index.html'//模版文件
            })
        ]
    }

    //引入文件
    import './head.html?cpt=head'
    import './foot.html?cpt=foot'

    //在模版文件中
    <html lang="en">
    <body>
    <%=head%>
    <%=foot%>
    </body>
    </html>

</code>