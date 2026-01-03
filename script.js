// --- AIMO DASHBOARD DATA & LOGIC ---

const AIMO_BASELINES = [
    {
        title: "DeepSeek-Math 7B RL",
        score: "20.4",
        desc: "Chain-of-thought prompting with DeepSeek-Math-7B-RL model.",
        tags: ["Notebook", "Python"],
        color: "bg-blue-100 text-blue-600",
        initial: "DS",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
    {
        title: "NuminaMath 7B TIR",
        score: "18.2",
        desc: "Tool-integrated reasoning approach using NuminaMath.",
        tags: ["Notebook", "TIR"],
        color: "bg-purple-100 text-purple-600",
        initial: "NM",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    },
     {
        title: "Qwen2.5-Math-7B-Instruct",
        score: "16.8",
        desc: "Standard CoT baseline with the new Qwen2.5 Math model.",
        tags: ["Starter"],
        color: "bg-emerald-100 text-emerald-600",
        initial: "QW",
        url: "https://www.kaggle.com/competitions/ai-mathematical-olympiad-progress-prize-3/code"
    }
];

const AIMO_LEADERBOARD = [
    { rank: 1, name: "AlphaMath Team", entries: 5, score: "29.15" },
    { rank: 2, name: "Qwen-Solver", entries: 12, score: "28.92" },
    { rank: 3, name: "GrandMasterX", entries: 5, score: "28.80" },
    { rank: 4, name: "DeepSeek-Pro", entries: 8, score: "28.45" },
    { rank: 5, name: "Math-Wizard-9000", entries: 22, score: "27.90" }
];

const renderAimoDashboard = () => {
    const baselinesContainer = document.getElementById('aimo-baselines-list');
    const leaderboardContainer = document.getElementById('aimo-leaderboard-list');

    // Render Baselines
    if (baselinesContainer && baselinesContainer.children.length === 0) {
        baselinesContainer.innerHTML = AIMO_BASELINES.map(item => `
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="flex items-start p-4 border border-slate-100 rounded-lg hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group block">
                <div class="w-10 h-10 rounded-full ${item.color} flex items-center justify-center flex-shrink-0 mr-4 font-bold text-sm">
                    ${item.initial}
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-start">
                        <h4 class="font-bold text-slate-800 group-hover:text-kaggle-600 transition-colors">${item.title}</h4>
                        <span class="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">LB: ${item.score}</span>
                    </div>
                    <p class="text-sm text-slate-500 mt-1">${item.desc}</p>
                    <div class="mt-3 flex gap-2">
                        ${item.tags.map(tag => `<span class="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">${tag}</span>`).join('')}
                    </div>
                </div>
            </a>
        `).join('');
    }

    // Render Leaderboard
    if (leaderboardContainer && leaderboardContainer.children.length === 0) {
        leaderboardContainer.innerHTML = AIMO_LEADERBOARD.map(item => {
            let rankColor = "text-slate-400";
            if (item.rank === 1) rankColor = "text-yellow-400";
            if (item.rank === 2) rankColor = "text-slate-300";
            if (item.rank === 3) rankColor = "text-orange-400";
            
            // Random avatar color generator based on name length
            const colors = ["bg-indigo-500", "bg-pink-500", "bg-teal-500", "bg-blue-500", "bg-red-500"];
            const avatarColor = colors[item.name.length % colors.length];

            return `
            <div class="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                <div class="w-6 text-center font-bold ${rankColor}">${item.rank}</div>
                <div class="w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    ${item.name.charAt(0)}
                </div>
                <div class="flex-grow">
                    <div class="text-sm font-medium text-white">${item.name}</div>
                    <div class="text-xs text-slate-400">${item.entries} entries</div>
                </div>
                <div class="font-mono font-bold text-green-400">${item.score}</div>
            </div>
            `;
        }).join('');
    }
};

// --- ROUTING LOGIC ---
const viewHome = document.getElementById('view-home');
const viewTool = document.getElementById('view-tool');
const viewAimo = document.getElementById('view-aimo');

const handleRoute = () => {
    // Normalize hash: #/aimo -> #aimo, #aimo -> #aimo
    const hash = window.location.hash.replace('#/', '#');
    
    // Reset all views
    viewHome.classList.add('hidden');
    viewTool.classList.add('hidden');
    viewAimo.classList.add('hidden');

    // Simple Router
    if (hash === '#base64') {
        viewTool.classList.remove('hidden');
    } else if (hash === '#aimo') {
        viewAimo.classList.remove('hidden');
        renderAimoDashboard();
    } else {
        // Default to Home
        viewHome.classList.remove('hidden');
    }
};

// Listen for hash changes
window.addEventListener('hashchange', handleRoute);
// Check initial load
window.addEventListener('load', handleRoute);


// --- APP LOGIC (Existing) ---

// Constants
const STATES = {
    IDLE: 'idle',
    PROCESSING: 'processing',
    SUCCESS: 'success',
    ERROR: 'error'
};

// State
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

// Logic Functions
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

// UI Handling
const setStatus = (newStatus, message = '', files = []) => {
    state.status = newStatus;

    // Reset visibility
    stateIdle.classList.add('hidden');
    stateProcessing.classList.add('hidden');
    stateSuccess.classList.add('hidden');
    stateError.classList.add('hidden');
    dropZone.classList.remove('border-red-200', 'border-green-200', 'cursor-pointer');
    
    // Add interactions based on state
    if (newStatus === STATES.IDLE) {
        stateIdle.classList.remove('hidden');
        dropZone.classList.add('cursor-pointer');
    } else if (newStatus === STATES.PROCESSING) {
        stateProcessing.classList.remove('hidden');
        processingFileName.textContent = message;
    } else if (newStatus === STATES.SUCCESS) {
        stateSuccess.classList.remove('hidden');
        dropZone.classList.add('border-green-200');
        successFileCount.textContent = `Found ${files.length} file${files.length !== 1 ? 's' : ''} in the archive.`;
        
        // Render files
        fileListContainer.innerHTML = '';
        if (files.length > 0) {
            files.forEach(file => {
                const li = document.createElement('li');
                li.className = "px-4 py-3 flex items-center text-left hover:bg-slate-100 transition-colors";
                li.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-slate-400 mr-3 flex-shrink-0">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <span class="text-sm text-slate-700 truncate font-medium">${file}</span>
                `;
                fileListContainer.appendChild(li);
            });
        } else {
             const li = document.createElement('li');
             li.className = "px-4 py-4 text-slate-400 text-sm italic";
             li.textContent = "No files detected or unable to read directory.";
             fileListContainer.appendChild(li);
        }
    } else if (newStatus === STATES.ERROR) {
        stateError.classList.remove('hidden');
        dropZone.classList.add('border-red-200');
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
        await new Promise(resolve => setTimeout(resolve, 600)); // UI Delay
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

// Event Listeners
dropZone.addEventListener('click', (e) => {
    // Only trigger input if in Idle state and not clicking buttons
    if (state.status === STATES.IDLE) {
        fileInput.click();
    }
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (state.status === STATES.IDLE) {
        dropZone.classList.add('border-brand-500', 'bg-brand-50', 'scale-[1.02]');
    }
});

dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-brand-500', 'bg-brand-50', 'scale-[1.02]');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('border-brand-500', 'bg-brand-50', 'scale-[1.02]');

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

// Initial
reset();
