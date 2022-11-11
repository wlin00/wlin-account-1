/* eslint-disable */
import path from 'path'
import fs from 'fs'
import store from 'svgstore' // 用于制作 SVG Sprites
import { optimize } from 'svgo' // 用于优化 SVG 文件

export const svgstore = (options = {}) => {
  const inputFolder = options.inputFolder || 'src/assets/icons'; // 插件默认处理的入口文件，存放svg图片的位置
  return {
    name: 'svgstore',
    resolveId(id) {
      if (id === '@svgstore') { // 绕过vscode校验，本意是在main.ts中impot 'svg_bundle.js'
        return 'svg_bundle.js'
      }
    },
    load(id) {
      if (id === 'svg_bundle.js') {
        const sprites = store(options);
        const iconsDir = path.resolve(inputFolder);
        for (const file of fs.readdirSync(iconsDir)) {
          const filepath = path.join(iconsDir, file); // 拿到某个svg的路径
          const svgid = path.parse(file).name
          let code = fs.readFileSync(filepath, { encoding: 'utf-8' });
          sprites.add(svgid, code) // 添加所有当前文件夹下的svg到svgstore
        }
        // 批处理svgstore，并优化svg，重新生成svg元素插入到body
        const { data: code } = optimize(sprites.toString({ inline: options.inline }), {
          plugins: [
            'cleanupAttrs', 'removeDoctype', 'removeComments', 'removeTitle', 'removeDesc', 
            'removeEmptyAttrs',
            { name: "removeAttrs", params: { attrs: "(data-name|data-xxx)" } }
          ]
        })
        return `const div = document.createElement('div')
          div.innerHTML = \`${code}\`
          const svg = div.getElementsByTagName('svg')[0]
          if (svg) {
            svg.style.position = 'absolute'
            svg.style.width = 0
            svg.style.height = 0
            svg.style.overflow = 'hidden'
            svg.setAttribute("aria-hidden", "true")
          }
          // listen dom ready event
          document.addEventListener('DOMContentLoaded', () => {
            if (document.body.firstChild) {
              document.body.insertBefore(div, document.body.firstChild)
            } else {
              document.body.appendChild(div)
            }
          })`
      }
    }
  }
}