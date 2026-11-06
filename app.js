// =========================================================================
// CLASSIC EDITORIAL LETTER CONTROLLER (FAST iOS EXPERIENCE)
// =========================================================================

let currentStep = 1;
const totalSteps = 5;

function recordAction(actionName, detail = "Gloria interacted with the note") {
    try {
        if (typeof window.dbSaveMessage === 'function') {
            window.dbSaveMessage(actionName, detail);
        }
    } catch (e) {
        // Silent fallback if offline
    }
}

function openNote() {
    const cover = document.getElementById('coverScreen');
    const letter = document.getElementById('letterScreen');
    const revealAllBtn = document.getElementById('revealAllBtn');

    if (cover) cover.style.display = 'none';
    if (letter) letter.style.display = 'block';
    if (revealAllBtn) revealAllBtn.style.display = 'inline-block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
    recordAction('Note Opened', 'Gloria opened the note');
}

function nextPassage() {
    if (currentStep < totalSteps) {
        currentStep++;
        const nextEl = document.querySelector(`.letter-passage[data-step="${currentStep}"]`);
        if (nextEl) {
            nextEl.classList.add('is-visible');
        }

        updateReadingProgress();

        if (currentStep === totalSteps) {
            completeLetterUnfold();
        } else {
            // Smoothly guide iOS viewport to the newly revealed passage
            setTimeout(() => {
                if (nextEl) {
                    nextEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 80);
        }
    }
}

function revealAllParagraphs() {
    const passages = document.querySelectorAll('.letter-passage');
    passages.forEach(el => el.classList.add('is-visible'));
    currentStep = totalSteps;
    updateReadingProgress();
    completeLetterUnfold();
}

function updateReadingProgress() {
    const progressBar = document.getElementById('readingProgressBar');
    const stepCounter = document.getElementById('stepCounter');
    const continueBtnText = document.getElementById('continueBtnText');

    if (progressBar) {
        progressBar.style.width = `${(currentStep / totalSteps) * 100}%`;
    }
    if (stepCounter) {
        stepCounter.innerText = `${currentStep} / ${totalSteps}`;
    }
    if (continueBtnText) {
        if (currentStep === 3) {
            continueBtnText.innerText = 'Keep reading';
        } else if (currentStep === 4) {
            continueBtnText.innerText = 'Read final part';
        } else {
            continueBtnText.innerText = 'Continue reading';
        }
    }
}

function completeLetterUnfold() {
    const stepControls = document.getElementById('stepControls');
    const responsePanel = document.getElementById('responsePanel');
    const revealAllBtn = document.getElementById('revealAllBtn');

    if (stepControls) stepControls.style.display = 'none';
    if (revealAllBtn) revealAllBtn.style.display = 'none';
    if (responsePanel) {
        responsePanel.classList.add('is-visible');
        setTimeout(() => {
            responsePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 120);
    }

    recordAction('Note Completed', 'Gloria reached the end of the note');
}

function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const nextTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', nextTheme);

    const label = document.getElementById('themeLabel');
    if (label) {
        label.innerText = nextTheme === 'dark' ? 'Ivory' : 'Obsidian';
    }
}

// Hidden 5-tap Engineer's Feed trigger on top-left "For Gloria"
let adminClicks = 0;
const adminTrigger = document.getElementById('secretAdminTrigger');
if (adminTrigger) {
    adminTrigger.addEventListener('click', () => {
        adminClicks++;
        if (adminClicks === 5) {
            const panel = document.getElementById('adminPanel');
            if (panel) panel.style.display = 'block';
            if (typeof window.loadAdminData === 'function') window.loadAdminData();
            adminClicks = 0;
        }
        setTimeout(() => { adminClicks = 0; }, 3000);
    });
}
