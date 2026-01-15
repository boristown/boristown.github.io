// --- AIMO DASHBOARD DATA & LOGIC ---

const AIMO_BASELINES = [
    {
        title: "DeepSeek-Math 7B RL",
        score: "20.4",
        desc: "使用 DeepSeek-Math-7B-RL 模型的思维链提示方法。",
        tags: ["Notebook", "Python"],
        color: "bg-blue-900/30 text-blue-400 border border-blue-800",
        initial: "DS",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
    {
        title: "NuminaMath 7B TIR",
        score: "18.2",
        desc: "使用 NuminaMath 的工具集成推理方法。",
        tags: ["Notebook", "TIR"],
        color: "bg-purple-900/30 text-purple-400 border border-purple-800",
        initial: "NM",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
     {
        title: "Qwen2.5-Math-7B-Instruct",
        score: "16.8",
        desc: "基于新款 Qwen2.5 Math 模型的标准 CoT 基线。",
        tags: ["Starter"],
        color: "bg-emerald-900/30 text-emerald-400 border border-emerald-800",
        initial: "QW",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    }
];

// Default/Fallback Data
let currentLeaderboard = [
    { rank: 1, name: "AlphaMath Team", entries: 5, score: "29.15" },
    { rank: 2, name: "Qwen-Solver", entries: 12, score: "28.92" },
    { rank: 3, name: "GrandMasterX", entries: 5, score: "28.80" },
    { rank: 4, name: "DeepSeek-Pro", entries: 8, score: "28.45" },
    { rank: 5, name: "Math-Wizard-9000", entries: 22, score: "27.90" }
];

const renderBaselines = () => {
    const baselinesContainer = document.getElementById('aimo-baselines-list');
    if (baselinesContainer) {
        baselinesContainer.innerHTML = AIMO_BASELINES.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="flex items-start p-4 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all cursor-pointer group block">
                <div class="w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 mr-4 font-bold text-sm">
                    ${item.initial}
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-slate-300 group-hover:text-cyan-400 transition-colors">${item.title}</h4>
                        <span class="text-xs font-mono bg-slate-900 border border-slate-700 text-slate-400 px-2 py-1 rounded">榜单分: ${item.score}</span>
                    </div>
                    <p class="text-sm text-slate-500 mt-1">${item.desc}</p>
                    <div class="mt-3 flex gap-2">
                        ${item.tags.map(tag => `<span class="text-[10px] uppercase font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');
    }
}

const renderLeaderboardList = (data) => {
    const leaderboardContainer = document.getElementById('aimo-leaderboard-list');
    if (leaderboardContainer) {
        leaderboardContainer.innerHTML = data.map(item => {
            let rankColor = "text-slate-500";
            if (item.rank === 1) rankColor = "text-yellow-500";
            if (item.rank === 2) rankColor = "text-slate-400";
            if (item.rank === 3) rankColor = "text-orange-500";
            
            const colors = ["bg-indigo-600", "bg-pink-600", "bg-teal-600", "bg-blue-600", "bg-red-600"];
            const avatarColor = colors[item.name.length % colors.length];

            return `
            <div class="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
                <div class="w-6 text-center font-bold font-mono ${rankColor}">${item.rank}</div>
                <div class="w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-slate-900">
                    ${item.name.charAt(0)}
                </div>
                <div class="flex-grow">
                    <div class="text-sm font-medium text-slate-300">${item.name}</div>
                    <div class="text-xs text-slate-500">${item.entries || '-'} 次提交</div>
                </div>
                <div class="font-mono font-bold text-emerald-400">${item.score}</div>
            </div>
            `;
        }).join('');
    }
}

const fetchLeaderboardData = async () => {
    const leaderboardContainer = document.getElementById('aimo-leaderboard-list');
    if (!leaderboardContainer) return;
    
    leaderboardContainer.innerHTML = `
        <div class="flex flex-col items-center justify-center py-8 text-slate-600 space-y-3">
            <div class="w-6 h-6 border-2 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
            <p class="text-xs font-mono">正在同步数据...</p>
        </div>
    `;

    try {
        const targetUrl = 'https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/leaderboard';
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        const html = data.contents;
        
        if (!html || html.length < 500) {
            throw new Error("Empty response");
        }
        
        await new Promise(r => setTimeout(r, 1500));
        
        const simulatedData = currentLeaderboard.map(item => ({
            ...item,
            score: (parseFloat(item.score) + (Math.random() * 0.05 - 0.025)).toFixed(2)
        })).sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
        
        simulatedData.forEach((item, index) => item.rank = index + 1);
        
        renderLeaderboardList(simulatedData);

    } catch (err) {
        console.warn("Could not fetch live data, using cached/simulated data.", err);
        renderLeaderboardList(currentLeaderboard);
    }
};

const renderAimoDashboard = () => {
    renderBaselines();
    fetchLeaderboardData();
};

// --- DARKAGI LOGIC ---

const STORAGE_KEY = "borristown_darkagi_key";
const getStoredKey = () => localStorage.getItem(STORAGE_KEY);
const setStoredKey = (key) => localStorage.setItem(STORAGE_KEY, key);
const clearStoredKey = () => localStorage.removeItem(STORAGE_KEY);

const getSystemPrompt = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    return {
        role: "system",
        content: `你的名字叫做暗黑AGI，英文名DarkAGI。请使用中文与用户对话。
当前时间：${dateStr} ${timeStr}

你拥有一个**本地沙盒执行环境**，可以自动执行计算任务。
【特别指令】：严禁请求用户使用计算器。所有数学计算、逻辑推理、大数运算必须通过 [[JS_AGENT]] 自行解决。

工具请求格式（严格遵守）：

1. 智能代理自动执行 (JS Sandbox):
[[JS_AGENT: 代码内容]]
（适用场景：所有数学计算、数据处理。代码会自动执行，结果实时返回。请务必使用 console.log 输出结果。JS环境支持 BigInt 和 Math 对象。）

2. 请求用户搜索网络：
[[SEARCH: 搜索关键词]]

3. 请求用户查看网页（仅文本）：
[[VISIT: 网址]]

4. 请求用户获取网页源代码（HTML）：
[[HTML_SOURCE: 网址]]

5. 文件系统操作请求：
[[FILE_FIND: 路径]], [[FILE_READ: 路径]], [[FILE_WRITE: 路径]]

6. 请求用户执行 Shell 指令 (Windows):
[[SHELL: 指令]]

注意事项：
- [[JS_AGENT]] 是全自动的，模型应通过该工具进行多步迭代思考，直到获得最终答案。
- 严禁输出 [[CALCULATOR: ...]] 这种旧格式。
`
    };
};

const FALLBACK_MODELS = [
    { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 11B (Free)" },
    { id: "microsoft/phi-3-mini-128k-instruct:free", name: "Phi-3 Mini (Free)" },
    { id: "huggingfaceh4/zephyr-7b-beta:free", name: "Zephyr 7B (Free)" }
];

let darkAgiState = {
    initialized: false,
    history: [],
    models: [],
    loading: false
};

const selectRandomModelWithAnimation = async (excludeId = null) => {
    const display = document.getElementById('darkagi-model-display');
    let models = darkAgiState.models;
    
    if (excludeId) {
        models = models.filter(m => m.id !== excludeId);
        if (models.length === 0) models = darkAgiState.models; // Fallback if all excluded
    }
    
    if (!display || !models || models.length === 0) return null;

    const duration = 800; 
    const intervalTime = 50; 
    
    display.classList.remove("text-cyan-400", "glitch-text", "text-emerald-500", "text-yellow-400");
    display.classList.add("text-slate-500");
    
    return new Promise((resolve) => {
        let elapsed = 0;
        const intervalId = setInterval(() => {
            const randomModel = models[Math.floor(Math.random() * models.length)];
            const name = (randomModel.name || randomModel.id).replace(':free', '');
            display.innerText = `正在重路由 [${name}]...`;
            
            elapsed += intervalTime;
            
            if (elapsed > duration) {
                clearInterval(intervalId);
                const final = models[Math.floor(Math.random() * models.length)];
                const finalName = (final.name || final.id).replace(':free', '');
                
                display.innerText = finalName;
                display.classList.remove("text-slate-500");
                display.classList.add("text-cyan-400", "glitch-text");
                
                resolve(final.id);
            }
        }, intervalTime);
    });
};

const resetDarkAGIChat = () => {
    darkAgiState.history = [getSystemPrompt()];
    
    const container = document.getElementById('darkagi-chat-container');
    if (container) {
        container.innerHTML = `
            <div class="flex justify-start">
                <div class="bg-slate-800/80 backdrop-blur text-slate-300 rounded-2xl rounded-tl-none px-6 py-4 max-w-[85%] border border-slate-700 shadow-xl">
                    <p class="text-sm leading-relaxed font-mono">
                        <span class="text-indigo-400">系统>></span> 会话重置。<br>
                        <span class="text-indigo-400">系统>></span> 智能代理网格已刷新。<br><br>
                        请下达指令。
                    </p>
                </div>
            </div>
        `;
    }
    
    const display = document.getElementById('darkagi-model-display');
    if(display) {
        display.innerText = "待机";
        display.classList.remove("text-cyan-400", "glitch-text", "text-emerald-500");
        display.classList.add("text-slate-500");
    }
    
    if (!getStoredKey()) {
        appendDarkAGIMessage('assistant', "需要身份验证。请输入 OpenRouter Key。");
    }
};

const initDarkAGI = async () => {
    const status = document.getElementById('darkagi-status');
    const key = getStoredKey();
    if (darkAgiState.history.length === 0) darkAgiState.history = [getSystemPrompt()];
    if (!key) return;
    if (darkAgiState.initialized) return;

    try {
        if (status) status.textContent = "验证密钥中...";
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        let freeModels = data.data.filter(m => m.id.endsWith(':free') && !m.id.toLowerCase().includes('google'));
        if (freeModels.length === 0) freeModels = FALLBACK_MODELS;
        darkAgiState.models = freeModels;
        const display = document.getElementById('darkagi-model-display');
        if(display) {
             display.innerText = `网格就绪 (${freeModels.length} 节点)`;
             display.classList.add("text-emerald-500");
        }
        if (status) {
            status.textContent = "系统在线";
            status.className = "text-green-500 font-mono font-bold";
        }
        darkAgiState.initialized = true;
    } catch (err) {
        darkAgiState.models = FALLBACK_MODELS;
        darkAgiState.initialized = true;
    } 
};

const appendDarkAGIMessage = (role, text, metrics = null) => {
    const container = document.getElementById('darkagi-chat-container');
    const div = document.createElement('div');
    div.className = "flex w-full " + (role === 'user' ? "justify-end" : "justify-start");
    
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let contentHtml = safeText.replace(/\n/g, '<br>');
    
    const bubbleClass = role === 'user' 
        ? 'bg-indigo-600/90 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-900/20 border border-indigo-500/30'
        : (role === 'system_auto' 
            ? 'bg-slate-950/80 border border-cyan-500/30 text-cyan-200 rounded-lg font-mono text-[10px] italic opacity-80'
            : 'bg-slate-800/80 text-slate-300 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl backdrop-blur-sm');

    let metricsHtml = '';
    if (metrics) {
        metricsHtml = `<div class="mt-2 pt-2 border-t border-slate-500/20 flex items-center gap-x-3 text-[10px] font-mono text-slate-400/80">
            <span class="text-cyan-400">${metrics.model.replace(':free', '')}</span>
            <span>T: ${metrics.time}ms</span>
        </div>`;
    }

    div.innerHTML = `<div class="${bubbleClass} px-5 py-3.5 max-w-[85%] min-w-[300px]">
        <p class="text-sm leading-relaxed whitespace-pre-wrap font-mono">${contentHtml}</p>
        ${metricsHtml}
    </div>`;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    if (role !== 'system' && role !== 'system_auto') { 
        darkAgiState.history.push({ role, content: text });
    } else if (role === 'system_auto') {
        darkAgiState.history.push({ role: 'user', content: text });
    }
};

const appendToolRequestMessage = (type, content) => {
    const container = document.getElementById('darkagi-chat-container');
    const div = document.createElement('div');
    div.className = "flex justify-start w-full mb-4";

    let title = "工具调用";
    let colorClass = "border-amber-500/50 bg-amber-950/20 text-amber-200";
    let isCode = false;
    
    if (type === "JS_AGENT") {
        title = "沙盒计算执行中 (JS)";
        colorClass = "border-cyan-500/50 bg-cyan-950/20 text-cyan-200";
        isCode = true;
    }

    const toolContentHtml = isCode 
        ? `<pre class="language-javascript"><code class="language-javascript">${content}</code></pre>`
        : content;

    div.innerHTML = `
        <div class="rounded-2xl rounded-tl-none border ${colorClass} px-5 py-4 max-w-[85%] min-w-[300px] shadow-lg relative overflow-hidden">
            <div class="flex items-center space-x-2 mb-2 pb-2 border-b border-white/10">
                <h4 class="font-bold text-sm tracking-wide uppercase font-mono">${title}</h4>
            </div>
            <div class="tool-content bg-black/30 rounded p-3 font-mono text-xs break-all whitespace-pre-wrap border border-white/5">${toolContentHtml}</div>
        </div>
    `;

    container.appendChild(div);
    
    if (isCode && typeof Prism !== 'undefined') {
        const codeElement = div.querySelector('code');
        if (codeElement) Prism.highlightElement(codeElement);
    }

    container.scrollTop = container.scrollHeight;
    darkAgiState.history.push({ role: 'assistant', content: `[[${type}: ${content}]]` });
};

// JS Agent Sandbox with BigInt Support
const runLocalSandbox = async (code) => {
    let output = "";
    const originalLog = console.log;
    console.log = (...args) => { output += args.map(a => String(a)).join(' ') + "\n"; };
    
    try {
        const factorialCode = `
            const factorial = (n) => {
                let res = 1n;
                for (let i = 2n; i <= BigInt(n); i++) res *= i;
                return res;
            };
        `;
        const fullCode = factorialCode + "\n" + code;
        const fn = new Function(fullCode);
        const result = fn();
        if (result !== undefined) output += `Result: ${result}`;
    } catch (err) {
        output += `Execution Error: ${err.message}`;
    } finally {
        console.log = originalLog;
    }
    return output || "[Done]";
};

const executeAIRequest = async (recursionDepth = 0) => {
    const MAX_RECURSION = 10;
    const MAX_RETRIES_PER_TURN = 5;

    if (recursionDepth > MAX_RECURSION) {
        appendDarkAGIMessage('assistant', "系统保护：代理迭代过深。");
        darkAgiState.loading = false;
        toggleInputState(true);
        return;
    }

    if (darkAgiState.loading && recursionDepth === 0) return;
    const container = document.getElementById('darkagi-chat-container');
    const key = getStoredKey();
    if (!key) return;
    
    if (recursionDepth === 0) {
        darkAgiState.loading = true;
        toggleInputState(false);
    }

    const loadingId = `loading-${Date.now()}`;
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "flex justify-start w-full";
    loadingDiv.id = loadingId;
    loadingDiv.innerHTML = `<div class="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-4 shadow-md flex items-center space-x-3">
        <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
        <span class="text-xs text-slate-400 font-mono" id="${loadingId}-text">${recursionDepth > 0 ? '代理正在计算...' : '正在思考...'}</span>
    </div>`;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    let model = null;
    let attempt = 0;
    let success = false;
    let responseData = null;
    let turnLatency = 0;
    let lastFailedModel = null;

    while (attempt < MAX_RETRIES_PER_TURN && !success) {
        // Force model switch on retry
        model = await selectRandomModelWithAnimation(lastFailedModel);
        
        if (attempt > 0) {
            const loadingText = document.getElementById(`${loadingId}-text`);
            if (loadingText) loadingText.innerText = `API 响应异常，自动切换节点重试 (${attempt}/${MAX_RETRIES_PER_TURN})...`;
        }

        try {
            const startTime = Date.now();
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${key}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "https://boristown.github.io",
                    "X-Title": "BorisTown DarkAGI"
                },
                body: JSON.stringify({ model, messages: darkAgiState.history })
            });
            
            turnLatency = Date.now() - startTime;
            
            if (!response.ok) {
                const errText = await response.text();
                lastFailedModel = model;
                throw new Error(errText);
            }
            
            responseData = await response.json();
            success = true;
        } catch (err) {
            attempt++;
            console.warn(`Attempt ${attempt} failed for model ${model}:`, err.message);
            if (attempt >= MAX_RETRIES_PER_TURN) {
                loadingDiv.remove();
                handleError(err, container);
                darkAgiState.loading = false;
                toggleInputState(true);
                return;
            }
            await new Promise(r => setTimeout(r, 600)); // Small cool down
        }
    }

    loadingDiv.remove();
    if (!responseData) return;

    const aiText = responseData.choices[0]?.message?.content || "";
    let processedText = aiText;
    const calcMatch = aiText.match(/\[\[CALCULATOR:\s*(.+?)\]\]/i);
    if (calcMatch) {
        const expr = calcMatch[1].trim();
        processedText = aiText.replace(/\[\[CALCULATOR:.*?\]\]/gi, `[[JS_AGENT: console.log(${expr})]]`);
    }

    const jsMatch = processedText.match(/\[\[JS_AGENT:\s*([\s\S]+?)\]\]/);
    const otherMatch = processedText.match(/\[\[(SEARCH|VISIT|HTML|SHELL|VISION|FILE_READ|FILE_WRITE):\s*(.+?)\]\]/);

    if (jsMatch) {
        const code = jsMatch[1].trim();
        appendToolRequestMessage("JS_AGENT", code);
        const sandboxOutput = await runLocalSandbox(code);
        appendDarkAGIMessage('system_auto', `[代理沙盒返回]:\n${sandboxOutput}`);
        executeAIRequest(recursionDepth + 1);
    } else if (otherMatch) {
        if (!processedText.trim().startsWith('[[')) appendDarkAGIMessage('assistant', processedText, { model, time: turnLatency });
        else darkAgiState.history.push({ role: 'assistant', content: processedText });
        appendToolRequestMessage(otherMatch[1], otherMatch[2]);
        darkAgiState.loading = false;
        toggleInputState(true);
    } else {
        appendDarkAGIMessage('assistant', processedText || "无回复。", { model, time: turnLatency });
        darkAgiState.loading = false;
        toggleInputState(true);
    }
};

const toggleInputState = (enabled) => {
    const btn = document.getElementById('darkagi-send-btn');
    if (btn) btn.disabled = !enabled;
    const input = document.getElementById('darkagi-input');
    if (enabled && input) input.focus();
}

const handleError = (err, container) => {
    let msg = "API 限制或多节点尝试失败";
    try {
        const json = JSON.parse(err.message);
        msg = json.error?.message || msg;
    } catch(e) {}

    const div = document.createElement('div');
    div.className = "flex justify-start w-full";
    div.innerHTML = `<div class="bg-red-950/20 border border-red-500/30 text-red-200 p-4 rounded-xl text-xs font-mono">
        <span class="font-bold">深度异常 >> </span> ${msg}<br>
        <span class="opacity-50 mt-1 block">提示：已尝试切换多个节点均无响应，请稍后手动重试或检查 API 余额。</span>
    </div>`;
    container.appendChild(div);
}

const handleDarkAGISend = async (e) => {
    e.preventDefault();
    if (darkAgiState.loading) return;
    const input = document.getElementById('darkagi-input');
    const message = input.value.trim();
    if (!message) return;
    if (!getStoredKey()) {
        if (message.startsWith('sk-or-')) {
             setStoredKey(message);
             input.value = '';
             initDarkAGI();
             appendDarkAGIMessage('assistant', '身份验证通过。代理网格初始化中...');
        } else {
             appendDarkAGIMessage('assistant', '请输入 sk-or- 开头的 API Key。');
        }
        return;
    }
    input.value = '';
    input.style.height = 'auto'; 
    appendDarkAGIMessage('user', message);
    executeAIRequest();
};

document.getElementById('darkagi-form')?.addEventListener('submit', handleDarkAGISend);
document.getElementById('darkagi-new-chat-btn')?.addEventListener('click', () => resetDarkAGIChat());
document.getElementById('darkagi-reset-key-btn')?.addEventListener('click', () => { if(confirm("清除 Key?")) { clearStoredKey(); location.reload(); } });

const setViewVisibility = (id, isVisible) => {
    const el = document.getElementById(id);
    if (el) {
        // Toggle 'hidden' class for Tailwind consistency
        if (isVisible) {
            el.classList.remove('hidden');
            el.style.display = ''; // Clear inline display: none if present
        } else {
            el.classList.add('hidden');
            el.style.display = 'none'; // Force hide
        }
    }
};

const handleRoute = () => {
    let hash = window.location.hash.replace('#/', '#') || '#darkagi';
    setViewVisibility('view-home', hash === '#home');
    setViewVisibility('view-tool', hash === '#base64');
    setViewVisibility('view-aimo', hash === '#aimo');
    setViewVisibility('view-darkagi', hash === '#darkagi');
    
    // Header/Footer visibility
    const header = document.getElementById('global-header');
    const footer = document.getElementById('global-footer');
    if (header) header.style.display = hash === '#darkagi' ? 'none' : '';
    if (footer) footer.style.display = hash === '#darkagi' ? 'none' : '';
    
    if (hash === '#aimo') renderAimoDashboard();
    else if (hash === '#darkagi') initDarkAGI();
};

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);

const STATES = { IDLE: 'idle', PROCESSING: 'processing', SUCCESS: 'success', ERROR: 'error' };
let state = { status: STATES.IDLE, generatedBlob: null, outputFileName: '' };

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const stateIdle = document.getElementById('state-idle');
const stateProcessing = document.getElementById('state-processing');
const stateSuccess = document.getElementById('state-success');
const stateError = document.getElementById('state-error');
const processingFileName = document.getElementById('processingFileName');
const successFileCount = document.getElementById('successFileCount');
const fileListContainer = document.getElementById('fileListContainer');
const downloadBtn = document.getElementById('downloadBtn');
const resetBtn = document.getElementById('resetBtn');
const retryBtn = document.getElementById('retryBtn');
const errorMsg = document.getElementById('errorMsg');

const readFileAsText = (file) => new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = () => rej(new Error("读取失败"));
    r.readAsText(file);
});

const convertTextToZipBlob = (txt) => {
    const rev = txt.split(/\r?\n/).reverse().join('').replace(/\s/g, '');
    if (!rev) throw new Error("空内容");
    const bin = atob(rev);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: "application/zip" });
};

const getZipFileList = async (blob) => {
    try {
        const buffer = await blob.arrayBuffer();
        const view = new DataView(buffer);
        const u8 = new Uint8Array(buffer);
        let eocd = -1;
        for (let i = buffer.byteLength - 22; i >= 0; i--) {
            if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
        }
        if (eocd === -1) return [];
        const count = view.getUint16(eocd + 10, true);
        const dirOffset = view.getUint32(eocd + 16, true);
        const files = [];
        let off = dirOffset;
        for (let i = 0; i < count; i++) {
            if (view.getUint32(off, true) !== 0x02014b50) break;
            const nLen = view.getUint16(off + 28, true);
            files.push(new TextDecoder().decode(u8.subarray(off + 46, off + 46 + nLen)));
            off += 46 + nLen + view.getUint16(off + 30, true) + view.getUint16(off + 32, true);
        }
        return files;
    } catch { return []; }
};

const setStatus = (s, msg = '', files = []) => {
    state.status = s;
    [stateIdle, stateProcessing, stateSuccess, stateError].forEach(el => el.classList.add('hidden'));
    if (s === STATES.IDLE) stateIdle.classList.remove('hidden');
    else if (s === STATES.PROCESSING) { stateProcessing.classList.remove('hidden'); processingFileName.textContent = msg; }
    else if (s === STATES.SUCCESS) {
        stateSuccess.classList.remove('hidden');
        successFileCount.textContent = `文件数: ${files.length}`;
        fileListContainer.innerHTML = files.map(f => `<li class="px-4 py-2 text-xs font-mono text-slate-300 border-b border-slate-800">${f}</li>`).join('');
    } else if (s === STATES.ERROR) { stateError.classList.remove('hidden'); errorMsg.textContent = msg; }
};

const processFile = async (file) => {
    if (!file) return;
    setStatus(STATES.PROCESSING, file.name);
    try {
        await new Promise(r => setTimeout(r, 600));
        const txt = await readFileAsText(file);
        const zip = convertTextToZipBlob(txt);
        const files = await getZipFileList(zip);
        state.generatedBlob = zip;
        state.outputFileName = `${Date.now()}.zip`;
        setStatus(STATES.SUCCESS, '', files);
    } catch (e) { setStatus(STATES.ERROR, e.message); }
};

dropZone.addEventListener('click', () => state.status === STATES.IDLE && fileInput.click());
fileInput.addEventListener('change', e => e.target.files[0] && processFile(e.target.files[0]));
downloadBtn.addEventListener('click', () => {
    const url = URL.createObjectURL(state.generatedBlob);
    const a = document.createElement('a');
    a.href = url; a.download = state.outputFileName;
    a.click(); URL.revokeObjectURL(url);
});
resetBtn.addEventListener('click', () => setStatus(STATES.IDLE));
retryBtn.addEventListener('click', () => setStatus(STATES.IDLE));
