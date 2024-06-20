# Practice using React to make a simple online image editor

## Overview

To complete the first function, I spent about 3 + 2 + 2 hours.

## Objective

The goal is to create a feature where, given a T-shirt background image, I can upload an image and freely edit it (e.g., drag, rotate, etc.).

## Steps Taken

### First Day
Research Options: I consulted GPT for options and chose Fabric.js, as it seemed the fastest and simplest tool for a quick implementation.
Initial Draft: GPT provided an initial draft. After spending 2 hours debugging with GPT and documenting errors, I couldn't resolve the issue. Fortunately, a friend called and interrupted my session. The main problem was that after loading the background, the newly loaded image couldn't be moved.
Project Search: I looked for similar projects but found very few demos with source code.
### Second Day - Part 1
New Project: I started a new project and successfully implemented the image drag-and-drop functionality.
Undo/Redo Features: I also implemented Ctrl+Z (undo) and Ctrl+Shift+Z (redo) functionalities, which were quite interesting.
### Second Day - Part 2
Issue with Background: After adding the background, the image drag-and-drop feature stopped working. I asked GPT for help, but again, couldn't get a solution.
Relevant Project: I found a related project with a background image here and noticed they used a package called fabricjs-react to load the background. I integrated this package into my code, but faced some issues. After further modifications with GPT's help, it worked. (Note: There was an issue with large images not resizing properly, making it seem like they weren't loading at all.)

## Pain Points

Every time GPT modifies the code, I have no idea where the changes are made.

## Takeaways

How to Use GPT to Write Code in Unfamiliar Fields:
- Solve Small Problems First: Break down the problem into smaller issues and ensure GPT understands them. Add features incrementally after resolving small issues.
- Find Similar Demos: Look for examples, do some research, understand and add them into your code, then provide them to GPT.
- Avoid Over-reliance on GPT for Debugging: Treat the coding process as a learning experience rather than relying solely on GPT for debugging.



<!-- 
To finish the first function, it spends me about 3 + 2 + 2 hours. 

我想实现的功能是，给一个T恤的背景图，我可以上传一个图片，然后对上传图片进行自由编辑（拖拽旋转等）。

接下来是我的步骤：
first day
1. 问GPT有什么选项，选择了fabric，觉得它是速度最快最简单的工具，能让我快速有一个版本。
2. GPT写好了初稿，然后就用结果+error记录，与GPT对话2h后无果，幸运的是朋友这时候打电话过来，终止了我沉迷于GPT debug。此时主要卡在加载了background之后，无法移动新加载的图片。
3. 找了一些相关的project，发现带源码的demo很少。

second day-1
1. 重新开了一个新的project，只实现了图片拖拽功能，正常实现。
2. 还实现了ctrl+z回退，ctrl+shift+z恢复的功能，蛮有意思的。

second day-2
以为曙光快要来临
1. 加上背景之后，图片拖拽功能失效。（问GPT，GPT像昨日一样死活无法得到结果）
2. 找到一个带背景的相关projec[here](https://codesandbox.io/p/sandbox/fabric-js-example-8ntuqt?file=%2Fsrc%2FApp.js%3A245%2C51-245%2C58)，看到对方使用了一个[fabricjs-react](https://www.npmjs.com/package/fabricjs-react?activeTab=readme)的包来加载背景，感觉有点东西。然后把它加到我自己的code之后，还是有点问题，后来让GPT又帮忙改了改就好了。（有个插曲是图片过大，没调整size，于是虽然加载出来了，但看着还是和没加载出来一样）



痛点：
1. 每次GPT给我改完Code之后，我完全不知道它的改动点在哪里。


Takeaway：
如何用GPT去写自己完全不熟悉的领域的代码：
1. 先各自解决单独的小问题，确保它能够理解。解决小问题后再往上加feature
2. 找类似的demo，找到example扔给他
3. 不要沉溺于chatGPT debug，写代码的过程当做一个学习的过程。

 -->
