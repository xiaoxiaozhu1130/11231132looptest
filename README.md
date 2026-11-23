# 日常计算器

原生 HTML、CSS 与 JavaScript 静态单页，无运行依赖、后端、数据库或构建步骤。

在本目录启动预览（需 Python 3）：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器访问 http://127.0.0.1:8000 。发布时只需提供 `index.html`、`styles.css` 和 `src/`，不要发布仓库元数据或测试文件。ES modules 需通过 HTTP 服务访问。

Node.js 22 或更新受支持 LTS 可运行测试，无需 npm install：

```sh
npm test
```

按输入顺序计算：`2 + 3 × 4 = 20`。支持鼠标、触摸和键盘数字、`.`、`+ - * /`、Enter/`=`、Backspace、Escape；按钮聚焦时 Enter/空格激活当前按钮。支持 320px 及以上视口。

每个操作数最多 12 位数字；结果最多 12 位有效数字，后续运算使用显示结果。采用 JavaScript Number，不适用于财务或任意精度计算。缺少右值时等号、正负号与退格不执行；结果不能退格编辑。连续等号不重复运算。错误后数字、小数点或 AC 可恢复。无持久化，刷新重置，计算不发送网络请求。

自动测试覆盖数值及状态规则；实际浏览器与辅助技术验证范围见工作区根目录 `implementation.md`。
