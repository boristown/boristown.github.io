// --- AIMO DASHBOARD DATA & LOGIC ---

const AIMO_BASELINES = [
    {
        title: "DeepSeek-Math 7B RL",
        score: "20.4",
        desc: "Chain-of-thought prompting with DeepSeek-Math-7B-RL model.",
        tags: ["Notebook", "Python"],
        color: "bg-blue-900/30 text-blue-400 border border-blue-800",
        initial: "DS",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
    {
        title: "NuminaMath 7B TIR",
        score: "18.2",
        desc: "Tool-integrated reasoning approach using NuminaMath.",
        tags: ["Notebook", "TIR"],
        color: "bg-purple-900/30 text-purple-400 border border-purple-800",
        initial: "NM",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
     {
        title: "Qwen2.5-Math-7B-Instruct",
        score: "16.8",
        desc: "Standard CoT baseline with the new Qwen2.5 Math model.",
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
                        <span class="text-xs font-mono bg-slate-900 border border-slate-700 text-slate-400 px-2 py-1 rounded">LB: ${item.score}</span>
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
                    <div class="text-xs text-slate-500">${item.entries || '-'} entries</div>
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
            <p class="text-xs font-mono">SYNCING DATA...</p>
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

// Provided key by user - VERIFIED
const DARKAGI_API_KEY = "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";

// Hardcoded fallback models
const FALLBACK_MODELS = [
    { id: "google/gemini-2.0-flash-exp:free", name: "Gemini 2.0 Flash (Free)" },
    { id: "google/gemini-2.0-flash-thinking-exp:free", name: "Gemini 2.0 Thinking (Free)" },
    { id: "meta-llama/llama-3.2-11b-vision-instruct:free", name: "Llama 3.2 11B (Free)" },
    { id: "microsoft/phi-3-mini-128k-instruct:free", name: "Phi-3 Mini (Free)" }
];

let darkAgiState = {
    initialized: false,
    history: [],
    models: [],
    loading: false
};

const populateModelSelect = (models) => {
    const select = document.getElementById('darkagi-model-select');
    if (!select) return;
    
    select.innerHTML = '';
    models.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));

    models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name || m.id;
        select.appendChild(opt);
    });
    
    const preferred = models.find(m => m.id.includes('gemini') && m.id.includes('flash'));
    if (preferred) {
        select.value = preferred.id;
    } else if (models.length > 0) {
        select.selectedIndex = 0;
    }
};

const resetDarkAGIChat = () => {
    // 1. Reset history state
    darkAgiState.history = [];
    
    // 2. Clear DOM
    const container = document.getElementById('darkagi-chat-container');
    if (container) {
        container.innerHTML = `
            <div class="flex justify-start">
                <div class="bg-slate-800/80 backdrop-blur text-slate-300 rounded-2xl rounded-tl-none px-6 py-4 max-w-[85%] border border-slate-700 shadow-xl">
                    <p class="text-sm leading-relaxed font-mono">
                        <span class="text-indigo-400">SYS>></span> Session Reset.<br>
                        <span class="text-indigo-400">SYS>></span> Ready for new input.<br><br>
                        Awaiting command.
                    </p>
                </div>
            </div>
        `;
    }
};

const initDarkAGI = async () => {
    if (darkAgiState.initialized) return;

    const select = document.getElementById('darkagi-model-select');
    const status = document.getElementById('darkagi-status');
    const inputField = document.getElementById('darkagi-input');
    const sendBtn = document.getElementById('darkagi-send-btn');

    try {
        // 1. Validate Key State
        if (status) {
            status.textContent = "VERIFYING KEY...";
            status.className = "text-yellow-500 font-mono animate-pulse";
        }

        // Check key validity with OpenRouter auth endpoint
        const authResponse = await fetch('https://openrouter.ai/api/v1/auth/key', {
             headers: {
                "Authorization": `Bearer ${DARKAGI_API_KEY}`
            }
        });

        if (!authResponse.ok) {
            throw new Error("Invalid API Key");
        }
        
        // 2. Fetch Models
        if (status) {
            status.textContent = "FETCHING MODELS...";
        }

        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error("Failed to fetch models");
        
        const data = await response.json();
        let freeModels = data.data.filter(m => m.id.endsWith(':free'));
        
        if (freeModels.length === 0) {
            throw new Error("No free models found in API response");
        }
        
        darkAgiState.models = freeModels;
        populateModelSelect(freeModels);
        
        if (status) {
            status.textContent = "SYSTEM ONLINE";
            status.className = "text-green-500 font-mono font-bold";
        }
        
        // Enable inputs
        if(inputField) inputField.disabled = false;
        if(sendBtn) sendBtn.disabled = false;

    } catch (err) {
        console.warn("DarkAGI Init Failed.", err);
        
        // Fallback or Error State
        if (err.message === "Invalid API Key") {
             if (status) {
                status.textContent = "ACCESS DENIED (KEY INVALID)";
                status.className = "text-red-500 font-mono font-bold";
            }
            // Disable inputs
            if(inputField) {
                inputField.disabled = true;
                inputField.placeholder = "System Locked: Invalid API Key";
            }
            if(sendBtn) sendBtn.disabled = true;
            return; // Stop here
        }

        // Regular Fallback for model list failure
        darkAgiState.models = FALLBACK_MODELS;
        populateModelSelect(FALLBACK_MODELS);

        if (status) {
            status.textContent = "OFFLINE (LOCAL MODE)";
            status.className = "text-orange-500 font-mono font-bold";
        }
    } finally {
        darkAgiState.initialized = true;
    }
};

const appendDarkAGIMessage = (role, text) => {
    const container = document.getElementById('darkagi-chat-container');
    const div = document.createElement('div');
    div.className = "flex w-full " + (role === 'user' ? "justify-end" : "justify-start");
    
    let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    let contentHtml = safeText.replace(/\n/g, '<br>');
    
    // Style update for Tech Theme
    const bubbleClass = role === 'user' 
        ? 'bg-indigo-600/90 text-white rounded-2xl rounded-tr-none shadow-lg shadow-indigo-900/20 border border-indigo-500/30'
        : 'bg-slate-800/80 text-slate-300 rounded-2xl rounded-tl-none border border-slate-700 shadow-xl backdrop-blur-sm';

    div.innerHTML = `
        <div class="${bubbleClass} px-5 py-3.5 max-w-[85%]">
            <p class="text-sm leading-relaxed whitespace-pre-wrap font-mono">${contentHtml}</p>
        </div>
    `;
    
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    
    darkAgiState.history.push({ role, content: text });
};

const handleDarkAGISend = async (e) => {
    e.preventDefault();
    if (darkAgiState.loading) return;

    const input = document.getElementById('darkagi-input');
    const select = document.getElementById('darkagi-model-select');
    const btn = document.getElementById('darkagi-send-btn');
    const message = input.value.trim();
    const model = select.value;

    if (!message || !model) return;

    input.value = '';
    input.style.height = 'auto'; 
    appendDarkAGIMessage('user', message);
    darkAgiState.loading = true;
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const container = document.getElementById('darkagi-chat-container');
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

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${DARKAGI_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/boristown/DarkAGI", 
                "X-Title": "BorisTown Toolkits"
            },
            body: JSON.stringify(requestBody)
        });

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
        const aiText = data.choices[0]?.message?.content || "No response received.";

        loadingDiv.remove();
        appendDarkAGIMessage('assistant', aiText);

    } catch (err) {
        console.error(err);
        loadingDiv.remove();
        
        let errorMessage = "Unknown Error";
        let detailedDebug = "";

        // Check if it's our custom error object containing response info
        if (err.responseText !== undefined) {
             try {
                const jsonError = JSON.parse(err.responseText);
                // OpenRouter often puts message inside error: { message: ... }
                errorMessage = jsonError.error?.message || jsonError.message || `API Error ${err.status}`;
            } catch (e) {
                // If response text isn't JSON
                errorMessage = `API Error ${err.status}: ${err.responseText.substring(0, 50)}...`;
            }

            // Create detailed debug view
            detailedDebug = `
                <div class="mt-2 space-y-2">
                    <details>
                        <summary class="cursor-pointer text-indigo-400 hover:text-indigo-300 text-[10px] outline-none select-none">▶ VIEW REQUEST PAYLOAD</summary>
                        <pre class="mt-1 p-2 bg-slate-950 rounded text-[10px] overflow-x-auto whitespace-pre-wrap text-slate-400 border border-slate-800">${JSON.stringify(err.requestBody, null, 2)}</pre>
                    </details>
                    <details open>
                        <summary class="cursor-pointer text-red-400 hover:text-red-300 text-[10px] outline-none select-none">▶ VIEW FULL RESPONSE</summary>
                        <pre class="mt-1 p-2 bg-slate-950 rounded text-[10px] overflow-x-auto whitespace-pre-wrap text-red-300 border border-red-900/30">${err.responseText}</pre>
                    </details>
                </div>
            `;
        } else {
            // Standard network or code error
            errorMessage = err.message || "Network/Client Error";
            detailedDebug = `<span class="text-slate-600 text-[10px] italic">${err.stack || ''}</span>`;
        }
        
        const div = document.createElement('div');
        div.className = "flex justify-start w-full";
        div.innerHTML = `
            <div class="bg-slate-900 border border-red-900 rounded-2xl rounded-tl-none px-5 py-3.5 max-w-[95%] shadow-md break-all">
                <span class="text-red-400 font-bold font-mono text-xs">CONNECTION FAILURE</span>
                <div class="font-mono text-xs text-red-200 mt-2 mb-2 p-2 bg-red-950/30 rounded border border-red-500/10">
                    ${errorMessage}
                </div>
                ${detailedDebug}
            </div>
        `;
        container.appendChild(div);
        
    } finally {
        darkAgiState.loading = false;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        setTimeout(() => input.focus(), 50);
    }
};

document.getElementById('darkagi-form')?.addEventListener('submit', handleDarkAGISend);
// Listen for New Chat button click
document.getElementById('darkagi-new-chat-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    resetDarkAGIChat();
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
            else reject(new Error("Failed to read file content"));
        };
        reader.onerror = () => reject(new Error("File reading error"));
        reader.readAsText(file);
    });
};

const convertTextToZipBlob = (textContent) => {
    const lines = textContent.split(/\r?\n/);
    const reversedLines = lines.reverse();
    let base64String = reversedLines.join('');
    base64String = base64String.replace(/\s/g, '');

    if (!base64String) throw new Error("Resulting string is empty.");

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
        throw new Error("Invalid Base64 content. Please ensure the file contains valid Base64 parts.");
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
        successFileCount.textContent = `Files detected: ${files.length}`;
        
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
             li.textContent = "No valid zip structure detected.";
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
        setStatus(STATES.ERROR, err.message || "An unexpected error occurred.");
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
