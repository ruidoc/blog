介绍小册的主要内容（比如，可以用三段话来讲清楚这件事）。

- 为什么要讲这本小册
- 分几个内容模块？可以从用户可以获取的核心知识点来介绍，还可以将课程特色与内容结合扩展介绍
- 给出学习目标，期待这门课给用户交付什么技能或效果，帮助用户解决什么问题

首先聊一下，为什么前端应该有监控系统？

当一个前端项目部署到线上，经常会碰到以下情况：

- 按钮点击没反应
- 某个页面白屏
- 偶然性的表单提交失败
- 接口调用报错
- 其他未知异常

这些问题在排查时都有一个共同的难点：难以复现。

比如按钮点击没反应，开发人员测试没问题，但是用户点击确实有问题。这种情况就很难判断是前端问题还是接口问题，或者是其他问题，因此定位问题非常困难，解决效率也就会非常低。

除了如何定位问题，更重要的还是如何发现问题。可能某些场景下发生的异常，如果用户不反馈，我们甚至都不知道会有这个异常。

但是前端如果有监控，当我们在监听到异常时，就可以获取到当前时刻的相关信息。比如由谁触发，哪个页面，哪个按钮，提交数据是什么，错误信息是什么，获取到这些信息后调用接口保存在数据库，并上报通知系统，此时开发人员就可以第一时间知道有异常触发，再通过错误信息定位问题，解决效率就会成倍提升。

除了上面说的，如何利用监控复现和定位问题，前端监控还可以生成运营数据。

比如前端在每次路由切换时，获取到当前页面信息和用户信息，以及停留时间等，把这些信息存起来，然后做成统计，就可以很容易的拿到应用的 PV，UV，以及某个页面的访问频率，停留时间等等，这些信息可以帮助运营同学更好的了解线上的运营状况。

了解了前端监控的必要性，再来看前端监控要落地会有什么困难。

首先，采集的异常数据也好，行为数据也好，都需要存储，存储方案有两种：

1. 第三方监控平台，调用 API 即可
2. 自研监控平台，自己实现采集，存储，分析等等

异常与行为数据，一般是与用户以及应用等隐私信息相关，这些信息比较敏感。存在免费的第三方平台不可靠，收费的又成本高，而且无法自由灵活的利用数据，因此我们选择自研。

自然