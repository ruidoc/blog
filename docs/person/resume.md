---
title: 简历
---

<center>
   <h1>杨成功-7年经验-前端架构师</h1>
</center>

## 个人信息

- 性 别：男 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;&nbsp;&nbsp; 年 龄：27
- 学 历：本科 &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; 工作经验：7 年
- 手 机：17600574204 &emsp;&emsp;&emsp;&emsp;&emsp;&nbsp; 邮 箱：ruidocgo@gmail.com

## 自我评价

7 年一线开发经验，其中 3 年团队管理经验，具有丰富的前端工程架构经验。目前负责自研前端监控、CICD、音视频等多个工程平台，帮团队搭建起对标中大厂的前端基建。同时积极参与社区，Taro 框架源码贡献者，掘金、SegmentFault 产出博客总阅读 50w+，获得 SegmentFault 2022 年度 Top Writer。

## 工作及教育经历

- 北格（北京）教育科技&emsp;&emsp;&emsp;2021.3~至今&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;前端架构师
- 北京八库科技&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2019.9~2021.2&emsp;&emsp;&emsp;&emsp;&emsp;前端工程师
- 内蒙古奥尔弘科技&emsp;&emsp;&emsp;&emsp;&emsp;2017.12~2019.8&emsp;&emsp;&emsp;&emsp; 前端负责人
- 北京中软科信&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;2016.12~2017.12&emsp;&emsp;&emsp;&emsp;前端工程师
- 中国石油大学（北京）&emsp;&emsp;&emsp;2019.9~2022.7&emsp;&emsp;&emsp;&emsp;&emsp;计算机科学与技术

## 专业技能

1. 擅长 React + Mobx + TypeScript + Vite 技术栈。
2. 擅长 Taro、React Native 跨端开发，多端一体下的资源共用。
3. 擅长基于 Node.js 的工程平台、效能工具建设。
4. 擅长基于 Gi 的代码规范和 CI/CD。
5. 熟练多端音视频（推拉流、WebRTC）开发。

## 项目经历

1. 自研前端监控平台

   - 技术栈：React + Node.js + MongoDB
   - 项目背景：多款线上项目难以监测和复现 Bug，运营需要收集产品使用数据。
   - 项目描述：该项目由信息采集端、数据接口端、可视化展示端共 3 大部分组成。采集 SDK 兼容多端、多框架，数据接口基于 Node.js + MongoDB 实现，Web 端用 Ant Design Charts 做可视化展示。
   - 项目难点：多端多框架多业务数据采集、数据上报设计、多维数据统计查询。

2. 自研 CICD 发布平台

   - 技术栈：GitHub Action + Docker + Docker Swarm + Node.js
   - 项目背景：项目部署靠手动打包上传，很不安全；线上出问题后无法快速回滚；项目没有版本管理。
   - 项目描述：该项目通过 GitHub Action 实现自动化流水线，将构建后的代码打包为 Docker 镜像并上传至私有镜像仓库，并基于 Docker Swarm 实现滚动升级/一键回滚。前端提供管理面板，支持查看服务、镜像列表，点击按钮实现服务重启、回滚、版本切换等功能。
   - 项目难点：从代码推送到镜像部署全程自动化，Docker 命令封装 API 接口，镜像版本管理。

3. Node.js BFF 中间层服务

   - 技术栈：Node.js + Axios + Socket.io
   - 项目背景：后端因为历史原因，接口返回结构和数据类型无法统一；部分微服务接口太过分散需要聚合。
   - 项目描述：早期该项目是在前端与真实接口之间搭建的中间层，用于统一处理接口数据；后期随着业务发展接入的功能越来越多，变成了承接非核心业务接口的综合服务。
   - 项目组成：
     - BFF 层：用于处理和聚合业务接口，鉴权认证等；
     - 监控平台接口：监控数据上报以及查询统计。
     - 发布平台接口：封装发布过程中用到的 Docker 命令。
     - 钉钉通知服务：对接钉钉开放平台实现（监控异常、发布完成、打卡提醒等）各类消息通知。
     - Socket.io 服务：用户在线状态统计、站内消息、WebRTC 信令服务器等。
   - 项目难点：用 Node.js 解决不同场景下遇到的业务问题。

4. 移动端三端一体（跨端）

   - 技术栈：React + Taro + React Native
   - 项目背景：移动端大约 5 个项目，包含 H5、小程序、APP 三种形态，技术栈不统一，资源无法复用，开发维护成本太高。
   - 项目描述：使用 React + Taro 统一移动端技术栈，统一项目结构和代码风格，实现了公共组件、公共函数、Mobx，Axios 等 40% 以上的代码三端共用，效率提升了一倍以上。
   - 项目难点：Taro 多端兼容处理，React Native 原生部分学习成本。

5. 音视频直播平台

   - 技术栈：React + Flv.js + WebRTC
   - 项目背景：公司的教学业务需要多端直播、屏幕共享、局域网视频通信等，要求低成本和低延迟。
   - 项目描述：涉及多端通信，主要包括两种实现：第一种是基于推拉流，在推流端（海康、App）向阿里云推流并用 Flv.js 播流；第二种是基于 WebRTC 的点对点直连。
   - 项目难点：WebRTC 整体流程搭建，React Native 屏幕共享，TURN 服务器、信令服务器搭建等。

## 社区信息

- 掘金主页：https://juejin.cn/user/1169536100339101
- SegmentFault 主页：https://segmentfault.com/u/ruidoc
- 个人博客：https://blog.ruims.top

<!-- ## 问答

为什么自研平台，而不是用第三方成熟的？

1. 这几个平台不是上层需求，是前端内部逐渐演化而来。
2. 老板需要将数据保存在自己的数据库。
3. 有自己特定的业务逻辑和业务场景。 -->
