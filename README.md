# 南科大 GPA 计算器

## 使用平台要求

PC 端 chrome 浏览器，或其他支持命令行操作的浏览器。

## 使用说明

1. 复制如下初始化代码：

```javascript
var newscript = document.createElement('script');
newscript.setAttribute('type','text/javascript');
newscript.setAttribute('src','https://chenyuheng.github.io/SUSTech-GPA-Calculator/js/getInfo.js');
head = document.getElementsByTagName('head')[0].appendChild(newscript);
```

2. [点击此链接](http://ehall.sustech.edu.cn/xhxsfw/sys/xsjwxx/*default/index.do)进入 ehall 学业信息页面。如未登录，请先登录。
3. 按<code>F12</code>按键进入开发者模式，选择命令行（Console），在命令行位置粘贴刚刚复制的代码，按下回车执行代码。
4. 然后输入<code>run()</code>，按下回车运行，此时会弹出 GPA 计算器的页面。如果浏览器屏蔽了自动弹窗，请取消屏蔽。

![进入开发者模式后的操作示意图](img/操作示意图.png)

## 截图

![应用截图](img/screenshot.png)