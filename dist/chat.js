const copy = {
  en: {
    source: "indeed-bot source on GitHub",
    clear: "Clear conversation",
    clearShort: "Clear",
    conversation: "Conversation",
    invitation: "Go on. Say what you think.",
    inputLabel: "Your message",
    placeholder: "A thought, a theory, a very good idea…",
    languageLabel: "Reply language",
    auto: "Auto-detect",
    send: "Send",
    sending: "Replying…",
    privacy: "Your messages stay in this tab.",
    keyboardHint: "Enter to send · Shift + Enter for a new line",
    loading: "Loading chat…",
    loadError: "Chat couldn’t load. Please try again.",
    replyError: "Couldn’t reply just now. Your message is still here — try again.",
    tooLong: "Please keep your message within 8,000 characters.",
    blank: "Write something first.",
    retry: "Try again",
    user: "You",
    bot: "indeed-bot",
    languages: { en: "English", zh: "Chinese", ja: "Japanese", ko: "Korean", es: "Spanish", fr: "French", de: "German", pt: "Portuguese", ru: "Russian", ar: "Arabic" },
  },
  "zh-CN": {
    source: "在 GitHub 查看 indeed-bot 源码",
    clear: "清空对话",
    clearShort: "清空",
    conversation: "对话记录",
    invitation: "来，说说你的想法。",
    inputLabel: "你的消息",
    placeholder: "一个想法、一套理论，或一个很好的主意……",
    languageLabel: "回复语言",
    auto: "自动识别",
    send: "发送",
    sending: "回复中……",
    privacy: "消息只留在当前页面。",
    keyboardHint: "Enter 发送 · Shift + Enter 换行",
    loading: "正在加载……",
    loadError: "暂时无法加载对话，请重试。",
    replyError: "暂时没能回复。你的消息还在，可以再试一次。",
    tooLong: "请将消息控制在 8,000 字符以内。",
    blank: "先写下一点想法吧。",
    retry: "重试",
    user: "你",
    bot: "indeed-bot",
    languages: { en: "英语", zh: "中文", ja: "日语", ko: "韩语", es: "西班牙语", fr: "法语", de: "德语", pt: "葡萄牙语", ru: "俄语", ar: "阿拉伯语" },
  },
};

const chat = document.querySelector(".indeed-chat");
const form = chat.querySelector(".chat-form");
const input = chat.querySelector(".chat-input");
const languageSelect = chat.querySelector("#chat-language");
const sendButton = chat.querySelector(".chat-send");
const sendLabel = sendButton.querySelector("span");
const clearButton = chat.querySelector(".chat-clear");
const retryButton = chat.querySelector(".chat-retry");
const status = chat.querySelector(".chat-status");
const statusRow = chat.querySelector(".chat-status-row");
const empty = chat.querySelector(".chat-empty");
const transcript = chat.querySelector(".chat-messages");
const announcement = chat.querySelector(".chat-announcement");
const counter = chat.querySelector(".chat-count");
const maxInputLength = 8000;
const maxMessages = 24;

let uiLanguage = document.documentElement.lang === "zh-CN" ? "zh-CN" : "en";
let engine = null;
let engineState = "loading";
let loadAttempt = 0;
let sending = false;
let composing = false;
let compositionJustEnded = false;
let operation = 0;
let statusKey = "loading";
const messages = [];
let supportedLanguages = {
  en: "English", zh: "中文", ja: "日本語", ko: "한국어", es: "Español",
  fr: "Français", de: "Deutsch", pt: "Português", ru: "Русский", ar: "العربية",
};

function strings() { return copy[uiLanguage]; }

function languageName(code) {
  return strings().languages[code] || supportedLanguages[code] || code;
}

function updateOptions() {
  const selected = languageSelect.value || "auto";
  const options = [new Option(strings().auto, "auto")];
  for (const [code, nativeName] of Object.entries(supportedLanguages)) {
    const localized = languageName(code);
    options.push(new Option(localized === nativeName ? localized : `${localized} · ${nativeName}`, code));
  }
  languageSelect.replaceChildren(...options);
  languageSelect.value = selected === "auto" || Object.hasOwn(supportedLanguages, selected) ? selected : "auto";
}

function updateStatus(key = statusKey) {
  statusKey = key;
  status.textContent = key ? strings()[key] : "";
  statusRow.hidden = !key;
  status.dataset.state = key.endsWith("Error") || key === "tooLong" || key === "blank" ? "error" : "normal";
  retryButton.hidden = engineState !== "error";
}

function updateControls() {
  input.readOnly = sending;
  languageSelect.disabled = sending;
  sendButton.disabled = sending || engineState !== "ready" || !input.value.trim();
  clearButton.disabled = sending || messages.length === 0;
  sendLabel.textContent = strings()[sending ? "sending" : "send"];
  form.setAttribute("aria-busy", String(sending));
  counter.hidden = input.value.length < 7200;
  counter.textContent = `${input.value.length.toLocaleString(uiLanguage)} / 8,000`;
}

function applyLocale(language) {
  uiLanguage = language === "zh-CN" ? "zh-CN" : "en";
  const text = strings();
  chat.querySelectorAll("[data-chat-i18n]").forEach((element) => {
    const value = text[element.dataset.chatI18n];
    if (typeof value === "string") element.textContent = value;
  });
  chat.querySelectorAll("[data-chat-aria]").forEach((element) => {
    const value = text[element.dataset.chatAria];
    if (typeof value === "string") element.setAttribute("aria-label", value);
  });
  input.placeholder = text.placeholder;
  for (const entry of messages) {
    entry.roleElement.textContent = text[entry.role];
    entry.roleElement.lang = uiLanguage;
    if (entry.languageElement) {
      entry.languageElement.textContent = languageName(entry.language);
      entry.languageElement.lang = uiLanguage;
    }
  }
  updateOptions();
  updateStatus();
  updateControls();
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
}

function appendMessage(role, text, language) {
  const item = document.createElement("li");
  item.className = `chat-message chat-message--${role}`;
  const meta = document.createElement("div");
  meta.className = "chat-message-meta";
  const roleElement = document.createElement("span");
  roleElement.textContent = strings()[role];
  roleElement.lang = uiLanguage;
  meta.append(roleElement);
  let languageElement = null;
  if (role === "bot") {
    languageElement = document.createElement("span");
    languageElement.className = "chat-message-language";
    languageElement.textContent = languageName(language);
    languageElement.lang = uiLanguage;
    meta.append(languageElement);
  }
  const body = document.createElement("p");
  body.textContent = text;
  body.dir = "auto";
  body.lang = language || "und";
  item.append(meta, body);
  transcript.append(item);
  messages.push({ role, text, language, element: item, roleElement, languageElement });
  while (messages.length > maxMessages) messages.shift().element.remove();
  empty.hidden = true;
  transcript.hidden = false;
}

async function loadEngine() {
  engineState = "loading";
  retryButton.disabled = true;
  updateStatus("loading");
  updateControls();
  try {
    const url = new URL("./bot/engine.js?v=fba4f45d8411", import.meta.url);
    if (loadAttempt > 0) url.searchParams.set("retry", String(loadAttempt));
    loadAttempt += 1;
    const loaded = await import(url.href);
    if (typeof loaded.reply !== "function" || !loaded.supportedLanguages || typeof loaded.supportedLanguages !== "object") {
      throw new Error("Invalid chat engine interface");
    }
    engine = loaded;
    supportedLanguages = loaded.supportedLanguages;
    engineState = "ready";
    updateOptions();
    updateStatus("");
  } catch {
    engine = null;
    engineState = "error";
    updateStatus("loadError");
  } finally {
    retryButton.disabled = false;
    updateControls();
  }
}

async function submitMessage(event) {
  event.preventDefault();
  if (sending || engineState !== "ready" || composing) return;
  const original = input.value;
  const text = original.trim();
  if (!text) { updateStatus("blank"); input.focus(); return; }
  if (original.length > maxInputLength) { updateStatus("tooLong"); input.focus(); return; }
  const requestedLanguage = languageSelect.value;
  const currentOperation = ++operation;
  sending = true;
  updateStatus("sending");
  updateControls();
  try {
    const result = await engine.reply(text, { language: requestedLanguage });
    if (currentOperation !== operation) return;
    if (!result || typeof result.text !== "string" || !result.text.trim() || !Object.hasOwn(supportedLanguages, result.language)) {
      throw new Error("Invalid reply");
    }
    const inputLanguage = requestedLanguage === "auto" ? result.language : "und";
    appendMessage("user", text, inputLanguage);
    appendMessage("bot", result.text, result.language);
    input.removeAttribute("aria-invalid");
    input.value = "";
    resizeInput();
    transcript.scrollTop = transcript.scrollHeight;
    const spokenReply = document.createElement("span");
    spokenReply.lang = result.language;
    spokenReply.dir = "auto";
    spokenReply.textContent = result.text;
    announcement.replaceChildren(spokenReply);
    updateStatus("");
  } catch {
    if (currentOperation === operation) {
      updateStatus("replyError");
      input.setAttribute("aria-invalid", "true");
    }
  } finally {
    if (currentOperation === operation) {
      sending = false;
      updateControls();
      input.focus({ preventScroll: true });
    }
  }
}

form.addEventListener("submit", submitMessage);
input.addEventListener("input", () => {
  input.removeAttribute("aria-invalid");
  if (engineState === "ready" && !sending) updateStatus("");
  resizeInput();
  updateControls();
});
input.addEventListener("compositionstart", () => { composing = true; compositionJustEnded = false; });
input.addEventListener("compositionend", () => {
  composing = false;
  compositionJustEnded = true;
  setTimeout(() => { compositionJustEnded = false; }, 0);
});
input.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.shiftKey) return;
  if (event.isComposing || composing || compositionJustEnded || event.keyCode === 229) return;
  event.preventDefault();
  if (!sending && engineState === "ready") form.requestSubmit();
});
clearButton.addEventListener("click", () => {
  if (sending) return;
  operation += 1;
  messages.length = 0;
  transcript.replaceChildren();
  transcript.hidden = true;
  empty.hidden = false;
  announcement.replaceChildren();
  input.value = "";
  resizeInput();
  input.removeAttribute("aria-invalid");
  updateStatus(engineState === "ready" ? "" : statusKey);
  updateControls();
  input.focus({ preventScroll: true });
});
retryButton.addEventListener("click", loadEngine);
window.addEventListener("indeed:localechange", (event) => applyLocale(event.detail?.language));

form.hidden = false;
input.disabled = false;
applyLocale(uiLanguage);
loadEngine();
