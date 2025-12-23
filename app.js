let supabase = null;

async function initializeSupabase() {
    try {
        const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
        const supabaseUrl = window.SUPABASE_CONFIG?.url || import.meta.env?.VITE_SUPABASE_URL;
        const supabaseKey = window.SUPABASE_CONFIG?.anonKey || import.meta.env?.VITE_SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
            supabase = createClient(supabaseUrl, supabaseKey);
            console.log('Supabase initialized successfully');
        } else {
            console.warn('Supabase environment variables not found');
        }
    } catch (error) {
        console.warn('Supabase not configured:', error);
    }
}

const levelNames = ['Beginning', 'Testing', 'Maturing', 'Leading'];
const levelClasses = ['beginning', 'testing', 'maturing', 'leading'];

const definitions = {
    vision: [
        'AI is not yet part of the EHS vision, and staff have little awareness or training. Adoption depends on individual curiosity rather than organizational direction.',
        'Leadership acknowledges AI’s role in EHS and begins communicating goals. Select teams receive basic training, but understanding and confidence vary widely.',
        'AI is part of the EHS strategy, supported by leadership and regular upskilling. EHS personnel understand where AI fits and use it reliably in their workflows.',
        'AI is embedded in the EHS vision with strong executive sponsorship and active workforce enablement. All teams have clear roles, training, and confidence in using AI to enhance safety and compliance outcomes.'
    ],
    solutions: [
        'AI tools are limited to simple pilots or basic features not yet tied to EHS workflows. Solutions provide minimal impact and require heavy manual oversight.',
        'AI is introduced into a few targeted EHS use cases (e.g., incident descriptions, data cleaning). Tools show value but are not yet scalable or fully integrated.',
        'AI capabilities support multiple EHS processes—incident triage, audits, CAPA, compliance monitoring—with reliable integration and growing automation. Solutions fit workflow needs and improve efficiency.',
        'Advanced AI solutions, including predictive tools and specialized agents, are fully embedded across EHS systems. Tools operate seamlessly and deliver measurable safety, risk, and compliance improvements.'
    ],
    accountability: [
        'There is no formal governance for AI use in EHS, and risks such as accuracy, bias, or data privacy are unmanaged. Users depend heavily on manual review.',
        'Basic governance practices emerge, including early guidelines and review steps for AI outputs. Oversight is improving but still inconsistent across teams.',
        'Clear governance structures ensure AI is explainable, compliant, and validated for EHS decisions. Audit logs, privacy controls, and human-in-the-loop checkpoints are consistently applied.',
        'Robust, enterprise-grade governance ensures AI is transparent, safe, and accountable across all EHS workflows. Oversight includes regular audits, performance monitoring, and clear ownership for AI risks.'
    ],
    organizational: [
        'EHS processes are mostly manual, with AI used only experimentally and outside core workflows. No procedural adjustments support AI use.',
        'AI is incorporated into select processes like incident intake or document summarization. Processes start to adapt, but manual steps still dominate.',
        'AI is embedded into routine EHS processes—incidents, inspections, CAPA, compliance—reducing manual work and improving accuracy. Cross-functional coordination supports scaling.',
        'AI is native to EHS operations, streamlining end-to-end processes and enabling proactive risk management. Continuous refinement and automation support high efficiency and strong outcomes.'
    ],
    integration: [
        'AI operates in isolated tools with little connection to EHS systems or measurable results. Data quality and integration barriers limit impact.',
        'AI begins connecting to EHS data sources and shows early benefits such as time savings or better documentation. Results are promising but not yet consistent.',
        'AI is well integrated with EHS platforms and data, producing reliable improvements in reporting, compliance, and risk insights. Performance and ROI are monitored and used to guide adoption.',
        'AI delivers strong, measurable outcomes across safety, compliance, and operational performance through deep integration with systems, sensors, and data flows. Results drive continuous improvement and strategic decision-making.'
    ]
};

const categoryScores = {
    vision: 1,
    solutions: 1,
    accountability: 1,
    organizational: 1,
    integration: 1
};

function initializeSliders() {
    console.log('Initializing sliders...');
    const sliders = document.querySelectorAll('.slider');
    console.log('Found', sliders.length, 'sliders');

    sliders.forEach(slider => {
        console.log('Setting up slider:', slider.dataset.category);
        updateSliderDisplay(slider);

        slider.addEventListener('input', function(e) {
            console.log('Slider input event:', this.dataset.category, 'Value:', this.value);
            updateSliderDisplay(this);
            calculateScores();
        });

        slider.addEventListener('change', function(e) {
            console.log('Slider change event:', this.dataset.category, 'Value:', this.value);
            updateSliderDisplay(this);
            calculateScores();
        });
    });

    calculateScores();
}

function updateSliderDisplay(slider) {
    const value = parseInt(slider.value);
    const category = slider.dataset.category;

    console.log('updateSliderDisplay - Category:', category, 'Value:', value);

    const sliderContainer = slider.closest('.slider-container');
    const levelBadge = sliderContainer ? sliderContainer.querySelector('.level-badge') : null;
    const definitionElement = document.getElementById(`${category}-definition`);

    console.log('Found badge:', !!levelBadge, 'Found definition:', !!definitionElement);

    if (levelBadge) {
        const levelName = levelNames[value - 1];
        const levelClass = levelClasses[value - 1];
        levelBadge.textContent = levelName;
        levelBadge.className = `level-badge ${levelClass}`;
        console.log('Updated badge to:', levelName, 'with class:', levelClass);
    } else {
        console.error('Level badge not found for category:', category);
    }

    if (definitionElement) {
        const definitionText = definitions[category][value - 1];
        const paragraphElement = definitionElement.querySelector('p');

        if (paragraphElement) {
            paragraphElement.textContent = definitionText;
            console.log('Updated definition to:', definitionText.substring(0, 50) + '...');
        } else {
            console.error('No <p> element found in definition');
        }
    } else {
        console.error('Definition element not found:', `${category}-definition`);
    }

    categoryScores[category] = value;
    console.log('Updated categoryScores:', categoryScores);
}

function calculateScores() {
    console.log('calculateScores - Current scores:', categoryScores);

    const categories = Object.keys(categoryScores);
    let totalScore = 0;

    categories.forEach(category => {
        const score = categoryScores[category];
        const levelClass = levelClasses[score - 1];

        const scoreElement = document.getElementById(`${category}-score`);
        const barElement = document.getElementById(`${category}-bar`);

        if (scoreElement) {
            scoreElement.textContent = `${score}/4`;
            scoreElement.className = `category-value ${levelClass}`;
            console.log('Updated score display:', category, `${score}/4`, 'Class:', levelClass);
        } else {
            console.warn('Score element not found:', `${category}-score`);
        }

        if (barElement) {
            const percentage = (score / 4) * 100;
            barElement.style.width = `${percentage}%`;
            barElement.className = `mini-bar-fill ${levelClass}`;
            console.log('Updated bar:', category, `${percentage}%`, 'Class:', levelClass);
        } else {
            console.warn('Bar element not found:', `${category}-bar`);
        }

        totalScore += score;
    });

    const overallAvg = totalScore / categories.length;
    console.log('Overall average:', overallAvg, 'Total score:', totalScore, 'Num categories:', categories.length);
    updateOverallScore(overallAvg);
}

function updateOverallScore(avg) {
    console.log('updateOverallScore called with avg:', avg);

    const overallScore = document.getElementById('overall-score');
    const overallBar = document.getElementById('overall-bar');
    const readinessBadge = document.getElementById('readiness-badge');

    console.log('Found elements - score:', !!overallScore, 'bar:', !!overallBar, 'badge:', !!readinessBadge);

    const level = Math.round(avg);
    const levelIndex = Math.max(0, Math.min(3, level - 1));
    const levelClass = levelClasses[levelIndex];
    const levelName = levelNames[levelIndex];

    console.log('Level calculations - level:', level, 'levelIndex:', levelIndex, 'class:', levelClass, 'name:', levelName);

    if (overallScore) {
        overallScore.textContent = avg.toFixed(2);
        overallScore.className = `score-number ${levelClass}`;
        console.log('Updated overall score to:', avg.toFixed(2), 'with class:', levelClass);
    } else {
        console.error('Overall score element not found!');
    }

    if (overallBar) {
        const percentage = (avg / 4) * 100;
        overallBar.style.width = `${percentage}%`;
        overallBar.className = `score-bar-fill ${levelClass}`;
        console.log('Updated overall bar to width:', `${percentage}%`, 'with class:', levelClass);
    } else {
        console.error('Overall bar element not found!');
    }

    if (readinessBadge) {
        readinessBadge.textContent = levelName;
        readinessBadge.className = `readiness-badge ${levelClass}`;
        console.log('Updated readiness badge to:', levelName, 'with class:', levelClass);
    } else {
        console.error('Readiness badge element not found!');
    }

    updateRecommendations(avg);
}

function updateRecommendations(avg) {
    const recommendations = {
        1: {
            title: 'Beginning: Build Your AI-Ready EHS Program',
            html: `<strong>Priority Actions:</strong>
                <ul>
                    <li>Assess EHS data quality and readiness - clean and organize incident reports, safety observations, and compliance records</li>
                    <li>Launch pilot programs for AI-assisted incident reporting, automated SDS indexing, and compliance document parsing</li>
                    <li>Establish foundational AI governance aligned with ISO, SOC 2, and industry standards</li>
                    <li>Build internal AI literacy through working groups and identify skill gaps in your EHS team</li>
                    <li>Start with "human-in-the-loop" AI copilots that augment professional judgment</li>
                    <li>Focus on quick wins that demonstrate measurable time savings and improved data quality</li>
                </ul>`
        },
        2: {
            title: 'Testing: Scale AI Across Key EHS Workflows',
            html: `<strong>Priority Actions:</strong>
                <ul>
                    <li>Expand successful AI pilots into production across incident management, CAPA tracking, and regulatory monitoring</li>
                    <li>Implement AI tools for predictive safety insights, computer vision for PPE compliance, and automated permit processing</li>
                    <li>Form cross-functional teams with EHS, IT, and operations to drive AI adoption and workflow integration</li>
                    <li>Establish robust governance with clear audit trails, explainability requirements, and human oversight protocols</li>
                    <li>Deploy GenAI for streamlining EHS reporting, deconstructing regulatory text, and trend analysis</li>
                    <li>Measure ROI through reduced incident response time, improved compliance rates, and efficiency gains</li>
                </ul>`
        },
        3: {
            title: 'Maturing: Embed AI as Core EHS Capability',
            html: `<strong>Priority Actions:</strong>
                <ul>
                    <li>Deploy domain-specific AI agents that automate triage, categorization, risk prediction, and corrective action workflows</li>
                    <li>Integrate real-time monitoring with IoT sensors, wearables, and environmental data for proactive hazard detection</li>
                    <li>Implement advanced predictive analytics integrating historical incidents, weather patterns, and operational data</li>
                    <li>Establish firm-wide SLAs for AI performance and create feedback loops with frontline safety professionals</li>
                    <li>Scale computer vision solutions across multiple sites for automated safety observation and ergonomic assessment</li>
                    <li>Link AI outcomes to executive KPIs - track SIF prevention, compliance adherence, and sustainability metrics</li>
                    <li>Benchmark your AI maturity externally and share learnings through industry forums</li>
                </ul>`
        },
        4: {
            title: 'Leading: Drive Autonomous EHS Innovation',
            html: `<strong>Priority Actions:</strong>
                <ul>
                    <li>Deploy autonomous agentic AI systems that independently execute safety workflows and escalate critical incidents</li>
                    <li>Implement closed-loop safety systems where AI monitors operations and automatically adjusts processes or initiates shutdowns</li>
                    <li>Leverage multi-agent AI architectures compatible with Model Context Protocol (MCP) for seamless integration</li>
                    <li>Publish transparency reports on AI ethics, bias mitigation, and sustainability impact</li>
                    <li>Engage third-party auditors to validate AI governance and establish thought leadership</li>
                    <li>Invest in continuous model improvement with self-learning systems adapting to regulatory changes and incident patterns</li>
                    <li>Optimize all core EHS functions - contractor risk assessment, chemical safety, supply chain sustainability tracking</li>
                </ul>`
        }
    };

    const level = Math.round(avg);
    const levelIndex = Math.max(0, Math.min(3, level - 1));
    const recommendation = recommendations[level];
    const levelClass = levelClasses[levelIndex];

    console.log('updateRecommendations - level:', level, 'levelIndex:', levelIndex, 'class:', levelClass);

    const titleElement = document.getElementById('recommendation-title');
    const textElement = document.getElementById('recommendation-text');
    const cardElement = document.getElementById('recommendation-card');

    console.log('Found elements - title:', !!titleElement, 'text:', !!textElement, 'card:', !!cardElement);

    if (titleElement && textElement && cardElement && recommendation) {
        titleElement.textContent = recommendation.title;
        textElement.innerHTML = recommendation.html;
        cardElement.className = `recommendation-card-sidebar ${levelClass}`;
        console.log('Updated recommendations to:', recommendation.title, 'with class:', levelClass);
    } else {
        if (!recommendation) console.error('No recommendation found for level:', level);
        if (!titleElement) console.error('recommendation-title element not found');
        if (!textElement) console.error('recommendation-text element not found');
        if (!cardElement) console.error('recommendation-card element not found');
    }
}


async function saveAssessment() {
    if (!supabase) {
        alert('Database not configured. Your assessment cannot be saved.');
        return;
    }

    const overallScore = parseFloat(document.getElementById('overall-score').textContent);

    try {
        const { data, error } = await supabase
            .from('assessments')
            .insert([{
                vision_score: categoryScores.vision,
                solutions_score: categoryScores.solutions,
                accountability_score: categoryScores.accountability,
                organizational_score: categoryScores.organizational,
                integration_score: categoryScores.integration,
                overall_score: overallScore
            }])
            .select();

        if (error) throw error;

        alert('Assessment saved successfully!');
        console.log('Saved assessment:', data);
    } catch (error) {
        console.error('Error saving assessment:', error);
        alert('Failed to save assessment. Please try again.');
    }
}

console.log('app.js loaded, waiting for DOM...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');

    initializeSliders();
    initializeSupabase();

    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
        submitBtn.addEventListener('click', saveAssessment);
    }
});
