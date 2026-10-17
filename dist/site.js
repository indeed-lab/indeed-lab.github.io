(() => {
  "use strict";

  const messages = {
    en: {
      skip: "Skip to content",
      home: "Indeed Lab — home",
      navigation: "Main navigation",
      "nav.approach": "Approach",
      "nav.projects": "Projects",
      "github.org": "Indeed Lab on GitHub",
      "github.repositories": "See all Indeed Lab repositories on GitHub",
      "github.visit": "Visit Indeed Lab on GitHub",
      backtotop: "Indeed Lab — back to top",
      "hero.eyebrow": "Mathematics, in practice",
      "hero.line1": "This lab will",
      "hero.line2": "shape the future.",
      "hero.line3": "Indeed!",
      "hero.description": "Exploring algorithms, optimization, and AI safety.",
      "hero.cta": "Explore our projects",
      "hero.caption": "An open corner. Room to explore.",
      "approach.title": "Always work on real problems.",
      "approach.description": "Real production problems guide our research. We work to bring mathematics and verified algorithms into practical use.",
      "projects.label": "Selected work",
      "projects.title": "Questions, taking shape.",
      "projects.intro": "Open projects. Different ways of working through an idea.",
      "project.topics": "Project topics",
      "project.reflexive.link": "Explore Project-Reflexive on GitHub",
      "project.reflexive.description": "Mathematics, made explicit. Lean formalizations sit alongside approachable visual explanations, bringing the structure of an argument into view.",
      "project.reflexive.tag1": "Formal mathematics",
      "project.reflexive.tag2": "Visual explanations",
      "project.equivalence.link": "Explore same-but-better on GitHub",
      "project.equivalence.description": "Equivalent results can take different routes. Small examples, Lean proofs, and benchmark experiments explore the performance trade-offs between implementations.",
      "project.equivalence.tag1": "Equivalent implementations",
      "project.equivalence.tag2": "Proofs & benchmarks",
      "project.indeed.link": "Explore indeed-bot on GitHub",
      "project.indeed.description": "A playful experiment in multilingual agreement. The wording varies; its reply pools come from a Lean-verified selector.",
      "project.indeed.tag1": "Multilingual agreement",
      "project.indeed.tag2": "Verified reply selection",
      "project.indeed.input": "An ambitious idea.",
      "project.indeed.reply": "Indeed.",
      "projects.note": "Explore the code. Follow the questions.",
      "projects.all": "All repositories",
      "footer.eyebrow": "The exploration continues",
      "footer.title": "See what we’re working on.",
      "footer.top": "Back to top",
      title: "Indeed Lab — Mathematics, in practice.",
      description: "Indeed Lab explores how mathematics can shape the future. Explore our approach and open projects in mathematical thinking, implementation, and experimentation.",
      socialDescription: "Indeed Lab explores how mathematics can shape the future.",
      switchLabel: "Switch to Chinese",
    },
    "zh-CN": {
      skip: "跳至正文",
      home: "Indeed Lab — 首页",
      navigation: "主导航",
      "nav.approach": "我们的方式",
      "nav.projects": "项目",
      "github.org": "在 GitHub 查看 Indeed Lab",
      "github.repositories": "在 GitHub 查看 Indeed Lab 的全部仓库",
      "github.visit": "前往 Indeed Lab 的 GitHub 主页",
      backtotop: "Indeed Lab — 返回顶部",
      "hero.eyebrow": "数学，走入实践",
      "hero.line1": "这家实验室",
      "hero.line2": "将要塑造未来。",
      "hero.line3": "确实！",
      "hero.description": "探索算法、优化与人工智能安全。",
      "hero.cta": "看看我们在做什么",
      "hero.caption": "留出一角，让探索继续。",
      "approach.title": "始终致力于解决实际问题。",
      "approach.description": "我们从真实的生产问题中获得灵感，推动数学方法与经过验证的算法在实际场景中落地。",
      "projects.label": "项目选集",
      "projects.title": "让问题，慢慢成形。",
      "projects.intro": "公开的项目，不同的探索方式。",
      "project.topics": "项目主题",
      "project.reflexive.link": "在 GitHub 探索 Project-Reflexive",
      "project.reflexive.description": "让数学的结构更清楚。通过 Lean 形式化与易于理解的图解，呈现论证如何一步步成立。",
      "project.reflexive.tag1": "数学形式化",
      "project.reflexive.tag2": "直观图解",
      "project.equivalence.link": "在 GitHub 探索 same-but-better",
      "project.equivalence.description": "相同的结果，可以有不同的实现路径。结合小例子、Lean 证明与基准实验，探索等价实现之间的性能取舍。",
      "project.equivalence.tag1": "等价实现",
      "project.equivalence.tag2": "证明与基准实验",
      "project.indeed.link": "在 GitHub 探索 indeed-bot",
      "project.indeed.description": "一个关于多语言赞同的幽默实验。措辞可以变化；回复池来自经 Lean 验证的选择器。",
      "project.indeed.tag1": "多语言赞同",
      "project.indeed.tag2": "回复选择验证",
      "project.indeed.input": "一个大胆的想法。",
      "project.indeed.reply": "确实。",
      "projects.note": "打开代码，沿着问题继续。",
      "projects.all": "全部仓库",
      "footer.eyebrow": "探索还在继续",
      "footer.title": "来看看，我们正在做什么。",
      "footer.top": "返回顶部",
      title: "Indeed Lab — 数学，走入实践。",
      description: "Indeed Lab 探索数学如何塑造未来。了解我们的探索方式，以及数学思考、实现与实验中的公开项目。",
      socialDescription: "Indeed Lab 探索数学如何塑造未来。",
      switchLabel: "切换为英文",
    },
  };

  const storageKey = "indeed-lab-language";
  const toggle = document.querySelector(".language-toggle");
  const toggleLabel = document.querySelector(".language-label");
  let currentLanguage = "en";

  function updateMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element) element.setAttribute("content", value);
  }

  function applyLanguage(language, persist = false) {
    const selected = Object.hasOwn(messages, language) ? language : "en";
    const copy = messages[selected];
    currentLanguage = selected;
    document.documentElement.lang = selected;
    document.title = copy.title;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = copy[element.dataset.i18n];
      if (typeof value === "string") element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      const value = copy[element.dataset.i18nAria];
      if (typeof value === "string") element.setAttribute("aria-label", value);
    });

    updateMeta('meta[name="description"]', copy.description);
    updateMeta('meta[property="og:title"]', copy.title);
    updateMeta('meta[property="og:description"]', copy.socialDescription);
    updateMeta('meta[property="og:image:alt"]', copy.title);
    updateMeta('meta[property="og:locale"]', selected === "en" ? "en_US" : "zh_CN");
    updateMeta('meta[property="og:locale:alternate"]', selected === "en" ? "zh_CN" : "en_US");
    updateMeta('meta[name="twitter:title"]', copy.title);
    updateMeta('meta[name="twitter:description"]', copy.socialDescription);
    updateMeta('meta[name="twitter:image:alt"]', copy.title);

    if (toggle && toggleLabel) {
      toggle.setAttribute("aria-label", copy.switchLabel);
      toggleLabel.textContent = selected === "en" ? "中文" : "EN";
      toggleLabel.lang = selected === "en" ? "zh-CN" : "en";
      toggle.hidden = false;
    }

    if (persist) {
      try { localStorage.setItem(storageKey, selected); } catch { /* Language switching also works when storage is unavailable. */ }
    }
    window.dispatchEvent(new CustomEvent("indeed:localechange", { detail: { language: selected } }));
  }

  let savedLanguage = "en";
  try { savedLanguage = localStorage.getItem(storageKey) || "en"; } catch { /* English is the default. */ }
  applyLanguage(savedLanguage);

  if (toggle) {
    toggle.addEventListener("click", () => {
      applyLanguage(currentLanguage === "en" ? "zh-CN" : "en", true);
    });
  }

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) applyLanguage(event.newValue || "en");
  });
})();
