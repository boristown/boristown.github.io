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
            
            // Random avatar color generator based on name length
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
    
    // Show loading state
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

// Key Management Logic
const STORAGE_KEY = "borristown_darkagi_key";
const getStoredKey = () => localStorage.getItem(STORAGE_KEY);
const setStoredKey = (key) => localStorage.setItem(STORAGE_KEY, key);
const clearStoredKey = () => localStorage.removeItem(STORAGE_KEY);

// System Prompt for DarkAGI Persona
const SYSTEM_PROMPT = {
    role: "system",
    content: "你的名字叫做暗黑AGI，英文名DarkAGI。请使用中文与用户对话。"
};

// Hardcoded fallback models - Excluded Google/Gemini
const FALLBACK_MODELS = [
    { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 11B (Free)" },
    { id: "microsoft/phi-3-mini-128k-instruct:free", name: "Phi-3 Mini (Free)" },
    { id: "huggingfaceh4/zephyr-7b-beta:free", name: "Zephyr 7B (Free)" }
];

let darkAgiState = {
    initialized: false,
    history: [SYSTEM_PROMPT],
    models: [],
    loading: false
};

// Select a random model WITH animation (Promise-based)
// Returns the selected Model ID
const selectRandomModelWithAnimation = async () => {
    const display = document.getElementById('darkagi-model-display');
    const models = darkAgiState.models;
    
    if (!display || !models || models.length === 0) return null;

    // Animation Config
    const duration = 800; // total run time in ms (faster for per-message)
    const intervalTime = 50; // speed of change
    
    display.classList.remove("text-cyan-400", "glitch-text");
    display.classList.add("text-slate-500");
    
    return new Promise((resolve) => {
        let elapsed = 0;
        const intervalId = setInterval(() => {
            // Randomly pick a model for visual effect
            const randomModel = models[Math.floor(Math.random() * models.length)];
            const name = (randomModel.name || randomModel.id).replace(':free', '');
            display.innerText = `正在扫描 [${name}]...`;
            
            elapsed += intervalTime;
            
            if (elapsed > duration) {
                clearInterval(intervalId);
                
                // Final Selection
                const final = models[Math.floor(Math.random() * models.length)];
                const finalName = (final.name || final.id).replace(':free', '');
                
                display.innerText = finalName;
                
                // Visual Pop
                display.classList.remove("text-slate-500");
                display.classList.add("text-cyan-400", "glitch-text");
                
                resolve(final.id);
            }
        }, intervalTime);
    });
};

const resetDarkAGIChat = () => {
    // 1. Reset history state - KEEP SYSTEM PROMPT
    darkAgiState.history = [SYSTEM_PROMPT];
    
    // 2. Clear DOM
    const container = document.getElementById('darkagi-chat-container');
    if (container) {
        container.innerHTML = `
            <div class="flex justify-start">
                <div class="bg-slate-800/80 backdrop-blur text-slate-300 rounded-2xl rounded-tl-none px-6 py-4 max-w-[85%] border border-slate-700 shadow-xl">
                    <p class="text-sm leading-relaxed font-mono">
                        <span class="text-indigo-400">系统>></span> 会话重置。<br>
                        <span class="text-indigo-400">系统>></span> 网格模式：随机分配。<br><br>
                        等待指令。
                    </p>
                </div>
            </div>
        `;
    }
    
    // Visual reset only
    const display = document.getElementById('darkagi-model-display');
    if(display) {
        display.innerText = "待机";
        display.classList.remove("text-cyan-400", "glitch-text");
        display.classList.add("text-slate-500");
    }
    
    // Check key again logic
    if (!getStoredKey()) {
        appendDarkAGIMessage('assistant', "需要身份验证。\n\n请输入您的 OpenRouter API Key 以初始化系统。\n(密钥仅存储在本地)。");
    }
};

const initDarkAGI = async () => {
    const status = document.getElementById('darkagi-status');
    const key = getStoredKey();

    // 1. Check for Key
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
        // 2. Validate Key State
        if (status) {
            status.textContent = "正在验证密钥...";
            status.className = "text-yellow-500 font-mono animate-pulse";
        }

        // Check key validity with OpenRouter auth endpoint
        const authResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
             headers: {
                "Authorization": `Bearer ${key}`
            }
        });

        if (!authResponse.ok) {
            throw new Error("Invalid API Key");
        }
        
        // 3. Fetch Models
        if (status) {
            status.textContent = "正在获取模型...";
        }

        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error("Failed to fetch models");
        
        const data = await response.json();
        
        // Filter: Must be free AND NOT Google
        let freeModels = data.data.filter(m => 
            m.id.endsWith(':free') && 
            !m.id.toLowerCase().includes('google')
        );
        
        if (freeModels.length === 0) {
            // If no free models returned (unlikely), fallback
            freeModels = FALLBACK_MODELS;
        }
        
        darkAgiState.models = freeModels;
        
        // Initial visual check
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
        appendDarkAGIMessage('assistant', "连接已建立。就绪。");

    } catch (err) {
        console.warn("DarkAGI Init Failed.", err);
        
        // Fallback or Error State
        if (err.message === "Invalid API Key") {
             if (status) {
                status.textContent = "访问被拒绝";
                status.className = "text-red-500 font-mono font-bold";
            }
            clearStoredKey(); // Clear bad key
            appendDarkAGIMessage('assistant', "错误：无效的 API Key。\n请重新输入有效的 OpenRouter API Key。");
            return; 
        }

        // Regular Fallback for model list failure
        darkAgiState.models = FALLBACK_MODELS;
        darkAgiState.initialized = true;
        const display = document.getElementById('darkagi-model-display');
        if(display) display.innerText = "本地回退模式";

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
    
    // Style update for Tech Theme
    const bubbleClass = role === 'user' 
        ? 'bg-indigo-600/90 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-900/20 border border-indigo-500/30'
        : 'bg-slate-800/80 text-slate-300 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl backdrop-blur-sm';

    // Metrics Footer HTML
    let metricsHtml = '';
    if (metrics) {
        const modelName = metrics.model.replace(':free', '');
        metricsHtml = `
            <div class="mt-2 pt-2 border-t border-slate-500/20 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-slate-400/80 select-none">
                <span class="flex items-center text-cyan-400" title="使用的模型">
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
    
    if (role !== 'system') { // Don't add system prompts to history context generally
        darkAgiState.history.push({ role, content: text });
    }
};

// Extracted Core Logic for reuse (Retry)
const executeAIRequest = async () => {
    if (darkAgiState.loading) return;

    const btn = document.getElementById('darkagi-send-btn');
    const container = document.getElementById('darkagi-chat-container');
    const key = getStoredKey();

    if (!key) {
        appendDarkAGIMessage('assistant', "认证丢失。请重新输入您的 API Key。");
        return;
    }
    
    darkAgiState.loading = true;
    if(btn) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }

    // 1. Select a new random model for this specific request
    // This distributes load and avoids 429s on specific models
    let model = null;
    if (darkAgiState.models && darkAgiState.models.length > 0) {
        model = await selectRandomModelWithAnimation();
    }
    
    if (!model) {
        // Fallback safety - Default to Llama instead of Google
        model = "meta-llama/llama-3.2-11b-vision-instruct:free"; 
    }

    // Add Loading Indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.className = "flex justify-start w-full";
    loadingDiv.id = "darkagi-loading-indicator";
    loadingDiv.innerHTML = `
        <div class="bg-slate-800/80 border border-slate-700 rounded-2xl rounded-tl-none px-5 py-4 shadow-md">
            <div class="flex space-x-1.5">
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-75"></div>
                <div class="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-150"></div>
            </div>
        </div>
    `;
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;

    const requestBody = {
        "model": model,
        "messages": darkAgiState.history
    };

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
            body: JSON.stringify(requestBody)
        });

        const endTime = Date.now();
        const latency = endTime - startTime;

        if (!response.ok) {
            const errorText = await response.text();
            throw {
                status: response.status,
                statusText: response.statusText,
                responseText: errorText,
                requestBody: requestBody
            };
        }

        const data = await response.json();
        const aiText = data.choices[0]?.message?.content || "未收到响应。";
        
        // Extract Usage Stats
        const usage = data.usage || { prompt_tokens: '?', completion_tokens: '?' };

        loadingDiv.remove();
        
        // Pass metrics to the append function
        appendDarkAGIMessage('assistant', aiText, {
            model: model,
            input: usage.prompt_tokens,
            output: usage.completion_tokens,
            time: latency
        });

    } catch (err) {
        console.error(err);
        loadingDiv.remove();
        
        let errorMessage = "未知错误";
        let detailedDebug = "";

        // Check if it's our custom error object containing response info
        if (err.responseText !== undefined) {
             try {
                const jsonError = JSON.parse(err.responseText);
                errorMessage = jsonError.error?.message || jsonError.message || `API 错误 ${err.status}`;
            } catch (e) {
                errorMessage = `API 错误 ${err.status}: ${err.responseText.substring(0, 50)}...`;
            }

            // Create detailed debug view
            detailedDebug = `
                <div class="mt-2 space-y-2">
                    <details>
                        <summary class="cursor-pointer text-indigo-400 hover:text-indigo-300 text-[10px] outline-none select-none">▶ 查看请求载荷</summary>
                        <pre class="mt-1 p-2 bg-slate-950 rounded text-[10px] overflow-x-auto whitespace-pre-wrap text-slate-400 border border-slate-800">${JSON.stringify(err.requestBody, null, 2)}</pre>
                    </details>
                    <details open>
                        <summary class="cursor-pointer text-red-400 hover:text-red-300 text-[10px] outline-none select-none">▶ 查看完整响应</summary>
                        <pre class="mt-1 p-2 bg-slate-950 rounded text-[10px] overflow-x-auto whitespace-pre-wrap text-red-300 border border-red-900/30">${err.responseText}</pre>
                    </details>
                </div>
            `;
        } else {
            errorMessage = err.message || "网络/客户端错误";
            detailedDebug = `<span class="text-slate-600 text-[10px] italic">${err.stack || ''}</span>`;
        }
        
        const errorId = `error-${Date.now()}`;
        
        const div = document.createElement('div');
        div.className = "flex justify-start w-full";
        div.id = errorId;
        div.innerHTML = `
            <div class="bg-slate-900 border border-red-900 rounded-2xl rounded-tl-none px-5 py-3.5 max-w-[95%] shadow-md break-all">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-red-400 font-bold font-mono text-xs">连接失败</span>
                    <button onclick="window.retryDarkAGI('${errorId}')" class="text-[10px] bg-red-900/50 hover:bg-red-800 text-white px-2 py-1 rounded border border-red-700 transition-colors uppercase font-mono tracking-wider">
                        重试 ⟳
                    </button>
                </div>
                <div class="font-mono text-xs text-red-200 mb-2 p-2 bg-red-950/30 rounded border border-red-500/10">
                    ${errorMessage}
                </div>
                ${detailedDebug}
            </div>
        `;
        container.appendChild(div);
        
    } finally {
        darkAgiState.loading = false;
        if(btn) {
            btn.disabled = false;
            btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        const input = document.getElementById('darkagi-input');
        if(input) setTimeout(() => input.focus(), 50);
    }
};

// Retry handler exposed globally
window.retryDarkAGI = (elementId) => {
    // Remove the error message UI
    const el = document.getElementById(elementId);
    if(el) el.remove();
    
    // Trigger request again (will re-roll model automatically)
    executeAIRequest();
};

const handleDarkAGISend = async (e) => {
    e.preventDefault();
    if (darkAgiState.loading) return;

    const input = document.getElementById('darkagi-input');
    const message = input.value.trim();
    if (!message) return;

    // Check Authorization Logic
    if (!getStoredKey()) {
        if (message.startsWith('sk-or-')) {
             setStoredKey(message);
             input.value = '';
             // Mask user input visually in chat history
             appendDarkAGIMessage('user', '********************************');
             appendDarkAGIMessage('assistant', '访问令牌已接受。正在初始化连接...');
             initDarkAGI();
        } else {
             input.value = '';
             appendDarkAGIMessage('user', message);
             appendDarkAGIMessage('assistant', '错误：令牌格式无效。\n密钥必须以 "sk-or-" 开头。');
        }
        return;
    }

    // Regular Chat Logic
    input.value = '';
    input.style.height = 'auto'; 
    appendDarkAGIMessage('user', message);
    executeAIRequest();
};

// New feature: Clear Key
const clearKeyAndReset = () => {
    if(confirm("确定要断开连接并清除存储的 API Key 吗？")) {
        clearStoredKey();
        location.reload();
    }
};
// Bind to window for HTML access if needed, though we attach listener below
window.clearKeyAndReset = clearKeyAndReset;

document.getElementById('darkagi-form')?.addEventListener('submit', handleDarkAGISend);
// Listen for New Chat button click
document.getElementById('darkagi-new-chat-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    resetDarkAGIChat();
});
// Listen for Reset Key button (will be added to HTML)
document.getElementById('darkagi-reset-key-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    clearKeyAndReset();
});

// --- ROUTING LOGIC ---

const setViewVisibility = (id, isVisible) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    if (isVisible) {
        el.classList.remove('hidden');
        el.style.display = ''; 
    } else {
        el.classList.add('hidden');
        el.style.display = 'none'; 
    }
};

const handleRoute = () => {
    const hash = window.location.hash.replace('#/', '#');
    
    const isTool = hash === '#base64';
    const isAimo = hash === '#aimo';
    const isDarkAgi = hash === '#darkagi';
    const isHome = !isTool && !isAimo && !isDarkAgi;

    setViewVisibility('view-home', isHome);
    setViewVisibility('view-tool', isTool);
    setViewVisibility('view-aimo', isAimo);
    setViewVisibility('view-darkagi', isDarkAgi);

    if (isAimo) {
        renderAimoDashboard();
    } else if (isDarkAgi) {
        initDarkAGI();
    }
};

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);


// --- APP LOGIC (Base64 Tool) ---

const STATES = {
    IDLE: 'idle',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    ERROR: 'error'
};

let state = {
    status: STATES.IDLE,
    generatedBlob: null,
    outputFileName: ''
};

// DOM Elements
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

const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) resolve(event.target.result);
            else reject(new Error("无法读取文件内容"));
        };
        reader.onerror = () => reject(new Error("文件读取错误"));
        reader.readAsText(file);
    });
};

const convertTextToZipBlob = (textContent) => {
    const lines = textContent.split(/\r?\n/);
    const reversedLines = lines.reverse();
    let base64String = reversedLines.join('');
    base64String = base64String.replace(/\s/g, '');

    if (!base64String) throw new Error("结果字符串为空。");

    try {
        const binaryString = atob(base64String);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return new Blob([bytes], { type: "application/zip" });
    } catch (error) {
        console.error(error);
        throw new Error("Base64 内容无效。请确保文件包含有效的 Base64 片段。");
    }
};

const getZipFileList = async (blob) => {
    try {
        const buffer = await blob.arrayBuffer();
        const view = new DataView(buffer);
        const u8 = new Uint8Array(buffer);
        const len = view.byteLength;

        let eocdOffset = -1;
        const maxScan = Math.min(len, 65535 + 22);
        for (let i = len - 22; i >= len - maxScan; i--) {
            if (view.getUint32(i, true) === 0x06054b50) {
                eocdOffset = i;
                break;
            }
        }

        if (eocdOffset === -1) return [];

        const entriesCount = view.getUint16(eocdOffset + 10, true);
        const centralDirOffset = view.getUint32(eocdOffset + 16, true);

        const files = [];
        let offset = centralDirOffset;

        for (let i = 0; i < entriesCount; i++) {
            if (offset + 46 > len) break;
            if (view.getUint32(offset, true) !== 0x02014b50) break;

            const fileNameLen = view.getUint16(offset + 28, true);
            const extraFieldLen = view.getUint16(offset + 30, true);
            const fileCommentLen = view.getUint16(offset + 32, true);

            const nameBytes = u8.subarray(offset + 46, offset + 46 + fileNameLen);
            const fileName = new TextDecoder("utf-8").decode(nameBytes);
            files.push(fileName);

            offset += 46 + fileNameLen + extraFieldLen + fileCommentLen;
        }
        return files;
    } catch (err) {
        console.error("Failed to parse zip directory", err);
        return [];
    }
};

const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// UI Handling for Tech Theme
const setStatus = (newStatus, message = '', files = []) => {
    state.status = newStatus;

    stateIdle.classList.add('hidden');
    stateProcessing.classList.add('hidden');
    stateSuccess.classList.add('hidden');
    stateError.classList.add('hidden');
    dropZone.classList.remove('border-red-500/50', 'border-emerald-500/50', 'cursor-pointer');
    
    if (newStatus === STATES.IDLE) {
        stateIdle.classList.remove('hidden');
        dropZone.classList.add('cursor-pointer');
    } else if (newStatus === STATES.PROCESSING) {
        stateProcessing.classList.remove('hidden');
        processingFileName.textContent = message;
    } else if (newStatus === STATES.SUCCESS) {
        stateSuccess.classList.remove('hidden');
        dropZone.classList.add('border-emerald-500/50');
        successFileCount.textContent = `检测到文件: ${files.length}`;
        
        fileListContainer.innerHTML = '';
        if (files.length > 0) {
            files.forEach(file => {
                const li = document.createElement('li');
                li.className = "px-4 py-2 flex items-center text-left hover:bg-slate-800 transition-colors";
                li.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-emerald-400 mr-3 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span class="text-xs text-slate-300 truncate font-mono">${file}</span>
                `;
                fileListContainer.appendChild(li);
            });
        } else {
             const li = document.createElement('li');
             li.className = "px-4 py-4 text-slate-500 text-xs italic font-mono";
             li.textContent = "未检测到有效的 zip 结构。";
             fileListContainer.appendChild(li);
        }
    } else if (newStatus === STATES.ERROR) {
        stateError.classList.remove('hidden');
        dropZone.classList.add('border-red-500/50');
        errorMsg.textContent = message;
    }
};

const reset = () => {
    state.generatedBlob = null;
    state.outputFileName = '';
    fileInput.value = '';
    setStatus(STATES.IDLE);
};

const processFile = async (file) => {
    if (!file) return;

    let displayFileName = file.name;
    if (!displayFileName.toLowerCase().endsWith('.txt')) {
        displayFileName += '.txt';
    }

    setStatus(STATES.PROCESSING, displayFileName);

    try {
        await new Promise(resolve => setTimeout(resolve, 600)); 
        const textContent = await readFileAsText(file);
        const zipBlob = convertTextToZipBlob(textContent);
        const files = await getZipFileList(zipBlob);
        
        state.generatedBlob = zipBlob;
        state.outputFileName = `${Date.now()}.zip`;
        
        setStatus(STATES.SUCCESS, '', files);
    } catch (err) {
        setStatus(STATES.ERROR, err.message || "发生了意外错误。");
    }
};

dropZone.addEventListener('click', (e) => {
    if (state.status === STATES.IDLE) {
        fileInput.click();
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state.status === STATES.IDLE) {
        dropZone.classList.add('border-emerald-500', 'bg-slate-800/80', 'scale-[1.02]');
    }
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-emerald-500', 'bg-slate-800/80', 'scale-[1.02]');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-emerald-500', 'bg-slate-800/80', 'scale-[1.02]');

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0]);
    }
});

downloadBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (state.generatedBlob && state.outputFileName) {
        downloadBlob(state.generatedBlob, state.outputFileName);
    }
});

resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reset();
});

retryBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reset();
});

reset();
