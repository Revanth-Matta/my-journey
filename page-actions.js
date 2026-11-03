document.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 6, speed: 400, glare: true, "max-glare": 0.1,
        });
    }
    switchDomain('healthcare');
});

const domainData = {
    healthcare: `
        <div class="animate-fade">
            <h2 style="font-size: 17px; margin-bottom: 18px; font-weight: 600;">Everyday Projects & Operational Highlights</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="info-block">
                    <h3><i data-lucide="activity"></i> Core Responsibilities</h3>
                    <ul style="padding-left:0; list-style:none;">
                        <li>• Finding and pulling complex medical record files</li>
                        <li>• Checking client eligibility and insurance scopes</li>
                        <li>• Strict handling of secure, private patient info</li>
                        <li>• Checking file errors and helping teammates</li>
                    </ul>
                </div>
                <div class="info-block">
                    <h3><i data-lucide="layers"></i> Systems & Everyday Tools</h3>
                    <ul style="padding-left:0; list-style:none;">
                        <li>• Detailed Microsoft Excel sheets & data grids</li>
                        <li>• Step-by-step company guidelines & checklists</li>
                        <li>• Internal data tools for health verification</li>
                        <li>• Custom tracker logs for checking group errors</li>
                    </ul>
                </div>
            </div>
        </div>
    `,
    quality: `
        <div class="animate-fade">
            <h2 style="font-size: 17px; margin-bottom: 18px; font-weight: 600;">Workplace Successes & Core Impact</h2>
            <div class="info-block">
                <h3><i data-lucide="award"></i> Official Awards & Recognition</h3>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px;">
                    Repeatedly recognised by managers and clients for keeping file errors extremely low and finding structural answers to process blindspots.
                </p>
                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 13px;">
                    <div>• <strong>Two-Time Bravo Award Winner</strong> (Tech Mahindra Group)</div>
                    <div>• <strong>Client Appreciation Award</strong> (High-Accuracy Operations Focus)</div>
                </div>
            </div>
            <div class="info-block">
                <h3><i data-lucide="git-commit"></i> Workflow Safety Approach</h3>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                    Focused on making daily operations simpler and preventing mistakes, applying formal checklist rules to catch small discrepancies before files go live.
                </p>
            </div>
        </div>
    `,
    history: `
        <div class="animate-fade">
            <h2 style="font-size: 17px; margin-bottom: 18px; font-weight: 600;">Simple Career Journey Timeline</h2>
            <div style="position: relative; border-left: 2px solid var(--border-color); padding-left: 20px; margin-left: 10px;">
                <div style="margin-bottom: 24px; position: relative;">
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; background: var(--accent-cyan); border-radius: 50%; box-shadow: 0 0 6px var(--accent-cyan);"></span>
                    <strong style="font-size: 14px;">Senior Associate Analyst — Tech Mahindra</strong>
                    <div style="font-size: 11px; color: var(--text-meta); margin: 2px 0 6px 0;">Mar 2023 – Jun 2026 | Hyderabad</div>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Supervised file audit checks, verified patient document criteria, and shared simplified quality checklists to make processing faster for teammates.</p>
                </div>
                <div style="margin-bottom: 24px; position: relative;">
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; background: var(--text-meta); border-radius: 50%;"></span>
                    <strong style="font-size: 14px;">Claims Associate — Artech Infosystems</strong>
                    <div style="font-size: 11px; color: var(--text-meta); margin: 2px 0 6px 0;">Jul 2021 – Feb 2022 | Hyderabad</div>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Processed high-volume account profiles and cross-checked member eligibility grids to assure zero data drift.</p>
                </div>
                <div style="position: relative;">
                    <span style="position: absolute; left: -26px; top: 4px; width: 10px; height: 10px; background: var(--text-meta); border-radius: 50%;"></span>
                    <strong style="font-size: 14px;">Process Consultant — Hinduja Global Solutions</strong>
                    <div style="font-size: 11px; color: var(--text-meta); margin: 2px 0 6px 0;">Sep 2018 – Apr 2020 | Hyderabad</div>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.5;">Sorted corporate invoice papers and converted bulk business bills into verified digital records with Star Performer status.</p>
                </div>
            </div>
        </div>
    `,
    education: `
        <div class="animate-fade">
            <h2 style="font-size: 17px; margin-bottom: 18px; font-weight: 600;">Personal School History</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div class="info-block">
                    <h3><i data-lucide="book-open"></i> College Degree</h3>
                    <strong style="font-size: 13px;">Bachelor of Commerce (B.Com)</strong>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">IIMC — Osmania University</div>
                    <div style="font-size: 11px; color: var(--text-meta); margin-top: 2px;">Graduated: 2018 | Hyderabad</div>
                </div>
                <div class="info-block">
                    <h3><i data-lucide="sliders"></i> Core Learning Areas</h3>
                    <p style="font-size: 12px; color: var(--text-secondary); line-height: 1.7;">
                        Built early, fundamental skills in office data methods, system analytics, record cross-checking, and tracking workplace organisation.
                    </p>
                </div>
            </div>
        </div>
    `
};

function switchDomain(domainKey) {
    const workspace = document.getElementById("runtime-workspace");
    const buttons = document.querySelectorAll(".tab-btn");
    if (!workspace) return;
    workspace.style.opacity = '0';
    setTimeout(() => {
        workspace.innerHTML = domainData[domainKey] || '';
        workspace.style.opacity = '1';
        if (typeof lucide !== 'undefined') { lucide.createIcons(); }
    }, 150);
    buttons.forEach(btn => {
        if(btn.getAttribute("onclick") && btn.getAttribute("onclick").includes(domainKey)) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

