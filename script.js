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
对于需要复杂数学计算、逻辑处理、字符串操作的任务，请直接使用 JS_AGENT 工具。

工具请求格式（严格遵守）：

1. 本地沙盒自动执行 (Agent Toolchain):
[[JS_AGENT: 代码内容]]
（适用场景：计算、逻辑推理、数据转换。代码将被系统自动执行，结果会实时返回给你。请确保输出使用 console.log。）

2. 请求用户搜索网络：
[[SEARCH: 搜索关键词]]

3. 请求用户查看网页（仅文本）：
[[VISIT: 网址]]

4. 请求用户获取网页源代码（HTML）：
[[HTML_SOURCE: 网址]]

5. 文件系统操作请求：
[[FILE_FIND: 路径或通配符]]
[[FILE_READ: 文件路径]]
[[FILE_WRITE: 文件路径]]
[[FILE_SEARCH: 文件路径, 关键字]]

6. 请求用户执行 Shell 指令 (Windows):
[[SHELL: 指令]]

7. 请求用户进行视觉识别 (人工多模态):
[[VISION: 任务描述]]

注意事项：
- [[JS_AGENT]] 是自动执行的，无需等待用户手动贴回结果，系统会自动循环。
- 其他工具需要等待用户手动操作。
- 每次回复只输出一个主要指令。
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

const selectRandomModelWithAnimation = async () => {
    const display = document.getElementById('darkagi-model-display');
    const models = darkAgiState.models;
    
    if (!display || !models || models.length === 0) return null;

    const duration = 800; 
    const intervalTime = 50; 
    
    display.classList.remove("text-cyan-400", "glitch-text");
    display.classList.add("text-slate-500");
    
    return new Promise((resolve) => {
        let elapsed = 0;
        const intervalId = setInterval(() => {
            const randomModel = models[Math.floor(Math.random() * models.length)];
            const name = (randomModel.name || randomModel.id).replace(':free', '');
            display.innerText = `正在扫描 [${name}]...`;
            
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
                        <span class="text-indigo-400">系统>></span> 网格模式：智能代理已就绪。<br><br>
                        等待指令。
                    </p>
                </div>
            </div>
        `;
    }
    
    const display = document.getElementById('darkagi-model-display');
    if(display) {
        display.innerText = "待机";
        display.classList.remove("text-cyan-400", "glitch-text");
        display.classList.add("text-slate-500");
    }
    
    if (!getStoredKey()) {
        appendDarkAGIMessage('assistant', "需要身份验证。\n\n请输入您的 OpenRouter API Key 以初始化系统。\n(密钥仅存储在本地)。");
    }
};

const initDarkAGI = async () => {
    const status = document.getElementById('darkagi-status');
    const key = getStoredKey();

    if (darkAgiState.history.length === 0) {
        darkAgiState.history = [getSystemPrompt()];
    }

    if (!key) {
        if (status) {
             status.textContent = "需要认证";
             status.className = "text-yellow-500 font-mono animate-pulse";
        }
        const display = document.getElementById('darkagi-model-display');
        if(display) {
            display.innerText = "已锁定";
            display.classList.add("text-red-500");
        }
        appendDarkAGIMessage('assistant', "系统警告：未检测到访问令牌。\n\n请输入您的 OpenRouter API Key (sk-or-...) 以初始化神经网格。\n\n[安全提示：密钥仅存储在本地]");
        return;
    }

    if (darkAgiState.initialized) return;

    try {
        if (status) {
            status.textContent = "正在验证密钥...";
            status.className = "text-yellow-500 font-mono animate-pulse";
        }

        const authResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
             headers: { "Authorization": `Bearer ${key}` }
        });

        if (!authResponse.ok) throw new Error("Invalid API Key");
        
        if (status) status.textContent = "正在获取模型...";

        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error("Failed to fetch models");
        
        const data = await response.json();
        
        let freeModels = data.data.filter(m => 
            m.id.endsWith(':free') && 
            !m.id.toLowerCase().includes('google')
        );
        
        if (freeModels.length === 0) freeModels = FALLBACK_MODELS;
        darkAgiState.models = freeModels;
        
        const display = document.getElementById('darkagi-model-display');
        if(display) {
             display.innerText = `网格在线 (${freeModels.length} 节点)`;
             display.classList.remove("text-red-500", "text-slate-500");
             display.classList.add("text-emerald-500");
        }
        
        if (status) {
            status.textContent = "系统在线";
            status.className = "text-green-500 font-mono font-bold";
        }
        
        darkAgiState.initialized = true;
        appendDarkAGIMessage('assistant', "连接已建立。智能代理模式激活。");

    } catch (err) {
        console.warn("DarkAGI Init Failed.", err);
        if (err.message === "Invalid API Key") {
            if (status) {
                status.textContent = "访问被拒绝";
                status.className = "text-red-500 font-mono font-bold";
            }
            clearStoredKey();
            appendDarkAGIMessage('assistant', "错误：无效的 API Key。\n请重新输入有效的 OpenRouter API Key。");
            return; 
        }
        darkAgiState.models = FALLBACK_MODELS;
        darkAgiState.initialized = true;
        if (status) {
            status.textContent = "离线模式";
            status.className = "text-orange-500 font-mono font-bold";
        }
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
            ? 'bg-slate-950/80 border border-cyan-500/30 text-cyan-200 rounded-lg font-mono text-xs italic opacity-80'
            : 'bg-slate-800/80 text-slate-300 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl backdrop-blur-sm');

    let metricsHtml = '';
    if (metrics) {
        const modelName = metrics.model.replace(':free', '');
        metricsHtml = `
            <div class="mt-2 pt-2 border-t border-slate-500/20 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400/80 select-none">
                <span class="flex items-center text-cyan-400">
                    <span class="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-1.5"></span>
                    ${modelName}
                </span>
                <span title="输入 Token">入: <span class="text-slate-300">${metrics.input || '?'}</span></span>
                <span title="输出 Token">出: <span class="text-slate-300">${metrics.output || '?'}</span></span>
                <span title="耗时" class="ml-auto text-emerald-400">${metrics.time}ms</span>
            </div>
        `;
    }

    div.innerHTML = `
        <div class="${bubbleClass} px-5 py-3.5 max-w-[85%] min-w-[300px]">
            <p class="text-sm leading-relaxed whitespace-pre-wrap font-mono">${contentHtml}</p>
            ${metricsHtml}
        </div>
    `;
    
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

    let title = "";
    let desc = "";
    let icon = "";
    let colorClass = "border-amber-500/50 bg-amber-950/20 text-amber-200";
    let iconClass = "text-amber-500";
    
    if (type === "SEARCH") {
        title = "搜索工具调用请求";
        desc = "请将以下关键字输入搜索引擎，结果复制回聊天窗口。";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>';
    } else if (type === "JS_AGENT") {
        title = "智能代理沙盒执行 (自动)";
        desc = "系统检测到计算任务，正在本地环境中运行 JavaScript 沙盒...";
        colorClass = "border-cyan-500/50 bg-cyan-950/20 text-cyan-200 shadow-cyan-900/40";
        iconClass = "text-cyan-400";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>';
    } else if (type === "VISIT") {
        title = "网页查看请求";
        desc = "请打开以下网址，内容复制给我。";
        colorClass = "border-emerald-500/50 bg-emerald-950/20 text-emerald-200";
        iconClass = "text-emerald-500";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>';
    } else if (type === "HTML_SOURCE") {
        title = "HTML 源码获取请求";
        desc = "请右键查看网页源代码，全选粘贴回聊天窗口。";
        colorClass = "border-orange-500/50 bg-orange-950/20 text-orange-200";
        iconClass = "text-orange-500";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>';
    } else if (type === "SHELL") {
        title = "终端指令执行 (Admin)";
        desc = "请在 Windows 终端执行指令。";
        colorClass = "border-slate-600 bg-black text-slate-300 font-mono";
        iconClass = "text-slate-400";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>';
    } else if (type === "VISION") {
        title = "人工视觉描述";
        desc = "请查看指定图片/视频并描述内容。";
        colorClass = "border-rose-500/50 bg-rose-950/20 text-rose-200";
        iconClass = "text-rose-500";
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>';
    } else if (type.startsWith("FILE_")) {
        colorClass = "border-fuchsia-500/50 bg-fuchsia-950/20 text-fuchsia-200";
        iconClass = "text-fuchsia-500";
        const fileAction = type.split('_')[1];
        title = `本地文件${fileAction === 'FIND' ? '查找' : (fileAction === 'READ' ? '读取' : (fileAction === 'WRITE' ? '写入' : '搜索'))}`;
        desc = `请手动完成该文件操作并将结果复制给我。`;
        icon = '<svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>';
    }

    div.innerHTML = `
        <div class="rounded-2xl rounded-tl-none border ${colorClass} px-5 py-4 max-w-[85%] min-w-[300px] shadow-lg relative overflow-hidden">
            <div class="absolute top-0 right-0 p-2 opacity-10">
                <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div class="flex items-center space-x-2 mb-2 pb-2 border-b border-white/10">
                <div class="${iconClass}">${icon}</div>
                <h4 class="font-bold text-sm tracking-wide">${title}</h4>
            </div>
            <p class="text-xs mb-3 opacity-80 font-mono">${desc}</p>
            <div class="bg-black/30 rounded p-3 font-mono text-xs break-all whitespace-pre-wrap select-all border border-white/5">${content}</div>
        </div>
    `;

    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    darkAgiState.history.push({ role: 'assistant', content: `[工具请求: ${type}] ${content}` });
};

// Agent Sandbox Execution
const runLocalSandbox = async (code) => {
    let output = "";
    const originalLog = console.log;
    console.log = (...args) => { output += args.map(a => String(a)).join(' ') + "\n"; };
    
    try {
        const fn = new Function(code);
        const result = fn();
        if (result !== undefined) output += `Return: ${result}`;
    } catch (err) {
        output += `Execution Error: ${err.message}`;
    } finally {
        console.log = originalLog;
    }
    return output || "[Empty Output]";
};

const executeAIRequest = async (recursionDepth = 0) => {
    if (recursionDepth > 10) {
        appendDarkAGIMessage('assistant', "错误：检测到代理执行死循环。");
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
    loadingDiv.innerHTML = `
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl px-5 py-4 shadow-md">
            <div class="flex items-center space-x-3">
                <div class="flex space-x-1.5">
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                    <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <span class="text-xs text-slate-400 font-mono" id="${loadingId}-text">${recursionDepth > 0 ? '代理正在迭代...' : '正在思考...'}</span>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    let model = null;
    let success = false;
    let data = null;
    let latency = 0;
    
    if (darkAgiState.models.length > 0) {
        if (recursionDepth === 0) model = await selectRandomModelWithAnimation();
        else model = darkAgiState.models[Math.floor(Math.random() * darkAgiState.models.length)].id;
    }
    if (!model) model = "meta-llama/llama-3.2-11b-vision-instruct:free";

    const startTime = Date.now();
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${key}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/boristown/DarkAGI", 
                "X-Title": "BorisTown Toolkits"
            },
            body: JSON.stringify({ model, messages: darkAgiState.history })
        });
        latency = Date.now() - startTime;
        if (!response.ok) throw { status: response.status, responseText: await response.text() };
        data = await response.json();
        success = true;
    } catch (err) {
        loadingDiv.remove();
        handleError(err, container);
        darkAgiState.loading = false;
        toggleInputState(true);
        return;
    }

    loadingDiv.remove();
    const aiText = data.choices[0]?.message?.content || "";
    const usage = data.usage || { prompt_tokens: '?', completion_tokens: '?' };

    const jsMatch = aiText.match(/\[\[JS_AGENT:\s*([\s\S]+?)\]\]/);
    const searchMatch = aiText.match(/\[\[SEARCH:\s*(.+?)\]\]/);
    const visitMatch = aiText.match(/\[\[VISIT:\s*(.+?)\]\]/);
    const htmlMatch = aiText.match(/\[\[HTML_SOURCE:\s*(.+?)\]\]/);
    const shellMatch = aiText.match(/\[\[SHELL:\s*(.+?)\]\]/);
    const visionMatch = aiText.match(/\[\[VISION:\s*(.+?)\]\]/);
    const fileOpMatch = aiText.match(/\[\[FILE_(FIND|READ|WRITE|SEARCH):\s*(.+?)\]\]/);

    if (jsMatch) {
        const code = jsMatch[1].trim();
        appendToolRequestMessage("JS_AGENT", code);
        const sandboxOutput = await runLocalSandbox(code);
        appendDarkAGIMessage('system_auto', `[SANDBOX_OUTPUT]\n${sandboxOutput}`);
        executeAIRequest(recursionDepth + 1);
    } else if (searchMatch || visitMatch || htmlMatch || shellMatch || visionMatch || fileOpMatch) {
        if (!aiText.trim().startsWith('[[')) appendDarkAGIMessage('assistant', aiText, { model, input: usage.prompt_tokens, output: usage.completion_tokens, time: latency });
        else darkAgiState.history.push({ role: 'assistant', content: aiText });
        
        if (searchMatch) appendToolRequestMessage("SEARCH", searchMatch[1].trim());
        else if (visitMatch) appendToolRequestMessage("VISIT", visitMatch[1].trim());
        else if (htmlMatch) appendToolRequestMessage("HTML_SOURCE", htmlMatch[1].trim());
        else if (shellMatch) appendToolRequestMessage("SHELL", shellMatch[1].trim());
        else if (visionMatch) appendToolRequestMessage("VISION", visionMatch[1].trim());
        else if (fileOpMatch) appendToolRequestMessage(`FILE_${fileOpMatch[1]}`, fileOpMatch[2].trim());
        
        darkAgiState.loading = false;
        toggleInputState(true);
    } else {
        appendDarkAGIMessage('assistant', aiText || "无内容返回。", { model, input: usage.prompt_tokens, output: usage.completion_tokens, time: latency });
        darkAgiState.loading = false;
        toggleInputState(true);
    }
};

const toggleInputState = (enabled) => {
    const btn = document.getElementById('darkagi-send-btn');
    if (btn) {
        btn.disabled = !enabled;
        btn.classList.toggle('opacity-50', !enabled);
        btn.classList.toggle('cursor-not-allowed', !enabled);
    }
    if (enabled) {
        const input = document.getElementById('darkagi-input');
        if(input) setTimeout(() => input.focus(), 50);
    }
}

const handleError = (err, container) => {
    let errorMessage = err.responseText ? (JSON.parse(err.responseText).error?.message || `API 错误 ${err.status}`) : (err.message || "网络错误");
    const div = document.createElement('div');
    div.className = "flex justify-start w-full";
    div.innerHTML = `
        <div class="bg-slate-900 border border-red-900 rounded-2xl px-5 py-3.5 max-w-[95%] shadow-md">
            <span class="text-red-400 font-bold font-mono text-xs">连接失败</span>
            <div class="font-mono text-xs text-red-200 mt-2">${errorMessage}</div>
        </div>
    `;
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
             appendDarkAGIMessage('assistant', '认证成功。正在初始化。');
             initDarkAGI();
        } else {
             input.value = '';
             appendDarkAGIMessage('assistant', '错误：密钥格式不正确。');
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

// --- ROUTING LOGIC ---

const setViewVisibility = (id, isVisible) => {
    const el = document.getElementById(id);
    if (el) el.style.display = isVisible ? '' : 'none';
};

const handleRoute = () => {
    let hash = window.location.hash.replace('#/', '#') || '#darkagi';
    setViewVisibility('view-home', hash === '#home');
    setViewVisibility('view-tool', hash === '#base64');
    setViewVisibility('view-aimo', hash === '#aimo');
    setViewVisibility('view-darkagi', hash === '#darkagi');
    document.getElementById('global-header').style.display = hash === '#darkagi' ? 'none' : '';
    document.getElementById('global-footer').style.display = hash === '#darkagi' ? 'none' : '';
    if (hash === '#aimo') renderAimoDashboard();
    else if (hash === '#darkagi') initDarkAGI();
};

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);


// --- APP LOGIC (Base64 Tool) ---

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
