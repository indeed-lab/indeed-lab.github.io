# Indeed Lab — published website

Public deployment files for **[Indeed Lab](https://indeed-lab.github.io/)**.

This repository contains the files served to visitors in `dist/` and the GitHub Pages deployment workflow. Website development and its full Git history are maintained in a private repository. HTML, CSS, JavaScript, images, fonts, and their licenses remain public as part of the website.

Updates to `main` automatically deploy `dist/` through GitHub Actions. Do not edit release files here; publish them from the private source checkout so the two stay in sync.

The embedded bot is maintained at [indeed-lab/indeed-bot](https://github.com/indeed-lab/indeed-bot). Its public source revision and artifact checksums are recorded in [`dist/bot/provenance.json`](dist/bot/provenance.json).

---

这里是 Indeed Lab 官网的公开发布仓库，仅保留 `dist/` 中的网站发布文件和 GitHub Pages 工作流。开发源码与完整提交历史维护在独立的私有仓库中。发布到网页的 HTML、CSS、JavaScript 和素材仍可公开访问。

向本仓库的 `main` 分支推送发布文件后，GitHub Actions 会自动上线。请通过私有源码仓库的发布命令更新这里，避免两边内容不同步。
