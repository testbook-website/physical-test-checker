document.addEventListener("DOMContentLoaded", () => {
  // Google Sheets integration webhook (User can update this)
  const GOOGLE_SHEET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-R4NFFLqerYJW6MpGNEYhlztnGeAZb4A5FKOg8Mb7gPcV0m9umNV3UpykmAPc64bftg/exec"; // Updated URL from user

  // DOM Elements
  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");
  const userNameInput = document.getElementById("userName");
  const userMobileInput = document.getElementById("userMobile");
  const appMainContainer = document.getElementById("appMainContainer");
  const loggedInUserEl = document.getElementById("loggedInUser");
  const logoutBtn = document.getElementById("logoutBtn");

  const stateSelect = document.getElementById("stateSelect");
  const postSelect = document.getElementById("postSelect");
  const genderSelect = document.getElementById("genderSelect");
  const categorySelect = document.getElementById("categorySelect");

  const pmtInputsContainer = document.getElementById("pmtInputsContainer");
  const petInputsContainer = document.getElementById("petInputsContainer");

  const readinessScoreEl = document.getElementById("readinessScore");
  const readinessLabelEl = document.getElementById("readinessLabel");
  const overallRemarksEl = document.getElementById("overallRemarks");
  const pmtStatusBadge = document.getElementById("pmtStatusBadge");
  const petStatusBadge = document.getElementById("petStatusBadge");
  
  const circleProgress = document.querySelector(".circle-progress");
  const diagnosticsList = document.getElementById("diagnosticsList");
  const trainingPlanContent = document.getElementById("trainingPlanContent");
  const planTabs = document.getElementById("planTabs");
  const nutritionContainer = document.getElementById("nutritionContainer");

  // State Management
  let currentWeek = 1;
  let validationResults = {
    pmt: { passed: false, items: {} },
    pet: { passed: false, items: {} },
    score: 0
  };

  // Initialize Application & Sessions
  function initApp() {
    checkUserSession();

    // Populate State Dropdown
    stateSelect.innerHTML = "";
    Object.keys(STATE_STANDARDS).forEach(key => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = STATE_STANDARDS[key].name;
      stateSelect.appendChild(option);
    });

    stateSelect.value = "delhi"; // Default
    updatePosts();
    
    // Event Listeners for configuration changes
    stateSelect.addEventListener("change", () => {
      updatePosts();
      renderForm();
      syncDataToSheet(); // Auto-save parameters when changed
    });
    
    postSelect.addEventListener("change", () => { renderForm(); syncDataToSheet(); });
    genderSelect.addEventListener("change", () => { renderForm(); syncDataToSheet(); });
    categorySelect.addEventListener("change", () => { renderForm(); syncDataToSheet(); });

    // Tab Listeners for Training Plan
    planTabs.addEventListener("click", (e) => {
      if (e.target.classList.contains("tab-btn")) {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");
        currentWeek = parseInt(e.target.dataset.week);
        generateTrainingPlan();
      }
    });

    // Login Form Submission
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = userNameInput.value.trim();
      const mobile = userMobileInput.value.trim();

      if (name && mobile) {
        // Save to localStorage (session lock)
        localStorage.setItem("pet_tracker_user_name", name);
        localStorage.setItem("pet_tracker_user_mobile", mobile);

        // Update UI Session State
        loggedInUserEl.textContent = name;
        loginOverlay.classList.add("hidden");
        appMainContainer.classList.add("show");

        // Sync Data to Google Sheet
        syncDataToSheet();

        // Load the forms
        renderForm();
      }
    });

    // Profile Logout/Switching
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("pet_tracker_user_name");
      localStorage.removeItem("pet_tracker_user_mobile");
      
      appMainContainer.classList.remove("show");
      loginOverlay.classList.remove("hidden");
      
      userNameInput.value = "";
      userMobileInput.value = "";
    });

    renderForm();
  }

  // Session Checker
  function checkUserSession() {
    const savedName = localStorage.getItem("pet_tracker_user_name");
    const savedMobile = localStorage.getItem("pet_tracker_user_mobile");

    if (savedName && savedMobile) {
      loggedInUserEl.textContent = savedName;
      loginOverlay.classList.add("hidden");
      appMainContainer.classList.add("show");
    } else {
      loginOverlay.classList.remove("hidden");
      appMainContainer.classList.remove("show");
    }
  }

  // Sync session and selections to Google Sheet via Apps Script
  function syncDataToSheet() {
    const name = localStorage.getItem("pet_tracker_user_name");
    const mobile = localStorage.getItem("pet_tracker_user_mobile");

    if (!name || !mobile) return; // Not logged in yet
    if (!GOOGLE_SHEET_SCRIPT_URL || GOOGLE_SHEET_SCRIPT_URL.includes("YOUR_WEB_APP_URL_HERE")) {
      console.warn("Google Sheet Script URL is not set. Data logged locally in Session Storage.");
      return;
    }

    const state = stateSelect.value;
    const post = postSelect.value;
    const gender = genderSelect.value;
    const category = categorySelect.value;

    // Build the query parameter URL for GET sync
    const syncUrl = `${GOOGLE_SHEET_SCRIPT_URL}?name=${encodeURIComponent(name)}&mobile=${encodeURIComponent(mobile)}&state=${encodeURIComponent(STATE_STANDARDS[state]?.name || state)}&post=${encodeURIComponent(post)}&gender=${encodeURIComponent(gender)}&category=${encodeURIComponent(category)}`;

    // Perform fire-and-forget submission using no-cors mode to prevent CORS blocks
    fetch(syncUrl, { mode: 'no-cors' })
      .then(() => {
        console.log("Logged lead sync successful:", { name, mobile, state, post });
      })
      .catch(err => {
        console.error("Sheets webhook failed to dispatch:", err);
      });
  }

  // Populate posts based on selected State
  function updatePosts() {
    const stateKey = stateSelect.value;
    const stateData = STATE_STANDARDS[stateKey];
    postSelect.innerHTML = "";
    
    Object.keys(stateData.posts).forEach(postKey => {
      const option = document.createElement("option");
      option.value = postKey;
      option.textContent = stateData.posts[postKey].name;
      postSelect.appendChild(option);
    });
  }

  // Get active config path
  function getActiveConfig() {
    const state = stateSelect.value;
    const post = postSelect.value;
    const gender = genderSelect.value;
    return STATE_STANDARDS[state]?.posts[post]?.[gender] || null;
  }

  // Render PMT and PET form fields dynamically
  function renderForm() {
    const config = getActiveConfig();
    if (!config) return;

    // Reset container contents
    pmtInputsContainer.innerHTML = "";
    petInputsContainer.innerHTML = "";

    // 1. Render PMT Inputs
    Object.keys(config.pmt).forEach(key => {
      const field = config.pmt[key];
      const isReserved = categorySelect.value === "reserved";
      
      // Calculate requirement with reserved category discount if applicable
      let requiredVal = field.min;
      if (isReserved) {
        if (key === "height") requiredVal -= 2;
        if (key === "chest") requiredVal -= 2;
        if (key === "chestExpanded") requiredVal -= 2;
      }

      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group";
      inputGroup.id = `group-pmt-${key}`;
      inputGroup.innerHTML = `
        <div class="input-header">
          <label for="pmt-${key}">${field.label}</label>
          <span class="req-badge">Min: ${requiredVal} ${field.unit}</span>
        </div>
        <div class="input-wrapper">
          <input type="number" step="0.1" id="pmt-${key}" class="form-control pmt-input" placeholder="${requiredVal}" data-key="${key}" data-min="${requiredVal}">
          <span class="unit-label">${field.unit}</span>
        </div>
        <div class="validation-indicator" id="valid-pmt-${key}"></div>
      `;
      pmtInputsContainer.appendChild(inputGroup);
    });

    // 2. Render PET Inputs
    Object.keys(config.pet).forEach(key => {
      const field = config.pet[key];
      const inputGroup = document.createElement("div");
      inputGroup.className = "input-group";
      inputGroup.id = `group-pet-${key}`;

      let inputHTML = "";
      if (field.unit === "min:sec") {
        inputHTML = `
          <div class="double-input">
            <input type="number" min="0" max="59" id="pet-${key}-min" class="form-control pet-input-min" placeholder="00" data-key="${key}">
            <span>:</span>
            <input type="number" min="0" max="59" id="pet-${key}-sec" class="form-control pet-input-sec" placeholder="00" data-key="${key}">
          </div>
        `;
      } else {
        inputHTML = `
          <input type="number" step="0.01" id="pet-${key}" class="form-control pet-input" placeholder="${field.placeholder}" data-key="${key}">
        `;
      }

      inputGroup.innerHTML = `
        <div class="input-header">
          <label>${field.label}</label>
          <span class="req-badge">
            ${field.unit === "min:sec" ? "Max" : field.key === "run100m" ? "Max" : "Min"}: 
            ${field.unit === "min:sec" ? formatSecondsToMinutes(field.limitSeconds) : field.target} ${field.unit}
          </span>
        </div>
        <div class="input-wrapper">
          ${inputHTML}
          <span class="unit-label">${field.unit}</span>
        </div>
        <div class="validation-indicator" id="valid-pet-${key}"></div>
      `;
      petInputsContainer.appendChild(inputGroup);
    });

    // Add input event listeners to recalculate results automatically
    const allInputs = document.querySelectorAll(".pmt-input, .pet-input, .pet-input-min, .pet-input-sec");
    allInputs.forEach(input => {
      input.addEventListener("input", evaluateReadiness);
    });

    evaluateReadiness();
  }

  // Helper: Format seconds to MM:SS string
  function formatSecondsToMinutes(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // Calculate user performance and update UI elements
  function evaluateReadiness() {
    const config = getActiveConfig();
    if (!config) return;

    validationResults.pmt.items = {};
    validationResults.pet.items = {};

    let pmtPassedCount = 0;
    let pmtTotalCount = Object.keys(config.pmt).length;
    let pmtAllPass = true;

    // Evaluate PMT
    Object.keys(config.pmt).forEach(key => {
      const inputEl = document.getElementById(`pmt-${key}`);
      const val = parseFloat(inputEl?.value);
      const isReserved = categorySelect.value === "reserved";
      
      let requiredVal = config.pmt[key].min;
      if (isReserved) {
        if (key === "height" || key === "chest" || key === "chestExpanded") requiredVal -= 2;
      }

      const cardGroup = document.getElementById(`group-pmt-${key}`);
      const indicator = document.getElementById(`valid-pmt-${key}`);

      if (isNaN(val) || inputEl.value.trim() === "") {
        setFieldState(cardGroup, indicator, "pending");
        validationResults.pmt.items[key] = { status: "pending", val: null, required: requiredVal };
        pmtAllPass = false;
      } else if (val >= requiredVal) {
        setFieldState(cardGroup, indicator, "pass");
        validationResults.pmt.items[key] = { status: "pass", val: val, required: requiredVal };
        pmtPassedCount++;
      } else {
        setFieldState(cardGroup, indicator, "fail");
        validationResults.pmt.items[key] = { status: "fail", val: val, required: requiredVal };
        pmtAllPass = false;
      }
    });

    // Evaluate PET
    let petPassedCount = 0;
    let petTotalCount = Object.keys(config.pet).length;
    let petAllPass = true;
    let petScores = [];

    Object.keys(config.pet).forEach(key => {
      const field = config.pet[key];
      const cardGroup = document.getElementById(`group-pet-${key}`);
      const indicator = document.getElementById(`valid-pet-${key}`);

      let userVal = null;
      let isPending = false;

      if (field.unit === "min:sec") {
        const minEl = document.getElementById(`pet-${key}-min`);
        const secEl = document.getElementById(`pet-${key}-sec`);
        const mins = parseInt(minEl?.value);
        const secs = parseInt(secEl?.value);

        if (isNaN(mins) || isNaN(secs) || minEl.value.trim() === "" || secEl.value.trim() === "") {
          isPending = true;
        } else {
          userVal = (mins * 60) + secs;
        }
      } else {
        const inputEl = document.getElementById(`pet-${key}`);
        userVal = parseFloat(inputEl?.value);
        if (isNaN(userVal) || inputEl.value.trim() === "") {
          isPending = true;
        }
      }

      if (isPending) {
        setFieldState(cardGroup, indicator, "pending");
        validationResults.pet.items[key] = { status: "pending", val: null, required: field.limitSeconds || field.target, isTime: field.unit === "min:sec" || key === "run100m" };
        petAllPass = false;
      } else {
        const isTimeEvent = (field.unit === "min:sec" || key === "run100m");
        const limit = field.limitSeconds || field.target;
        
        let eventPassed = false;
        let eventScore = 0;

        if (isTimeEvent) {
          eventPassed = userVal <= limit;
          eventScore = eventPassed 
            ? Math.min(100, 70 + ((limit - userVal) / limit) * 100)
            : Math.max(0, 70 - ((userVal - limit) / limit) * 200);
        } else {
          eventPassed = userVal >= limit;
          eventScore = eventPassed
            ? Math.min(100, 70 + ((userVal - limit) / limit) * 100)
            : Math.max(0, (userVal / limit) * 70);
        }

        petScores.push(eventScore);

        if (eventPassed) {
          setFieldState(cardGroup, indicator, "pass");
          validationResults.pet.items[key] = { status: "pass", val: userVal, required: limit, score: eventScore, isTime: isTimeEvent };
          petPassedCount++;
        } else {
          setFieldState(cardGroup, indicator, "fail");
          validationResults.pet.items[key] = { status: "fail", val: userVal, required: limit, score: eventScore, isTime: isTimeEvent };
          petAllPass = false;
        }
      }
    });

    validationResults.pmt.passed = pmtAllPass && pmtPassedCount === pmtTotalCount;
    validationResults.pet.passed = petAllPass && petPassedCount === petTotalCount;

    // Calculate score
    let overallScore = 0;
    if (petScores.length > 0) {
      const totalScoreSum = petScores.reduce((a, b) => a + b, 0);
      overallScore = Math.round(totalScoreSum / petTotalCount);
    }
    
    // If PMT fails, cap the overall readiness score as ineligible
    if (pmtTotalCount > 0 && !validationResults.pmt.passed) {
      const missingPmt = Object.values(validationResults.pmt.items).some(item => item.status === "fail");
      if (missingPmt) {
        overallScore = Math.min(overallScore, 30);
      }
    }

    validationResults.score = overallScore;

    // Update Badges
    updateStatusBadges();

    // Update Progress SVG ring & Text
    updateScoreUI(overallScore);

    // Diagnostics Generation
    generateDiagnostics();

    // Training Plan Generation
    generateTrainingPlan();
  }

  // Set card visual state classes
  function setFieldState(groupEl, indicatorEl, state) {
    if (!groupEl || !indicatorEl) return;
    
    groupEl.classList.remove("state-pass", "state-fail");
    
    if (state === "pass") {
      groupEl.classList.add("state-pass");
      indicatorEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-success)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (state === "fail") {
      groupEl.classList.add("state-fail");
      indicatorEl.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-error)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    } else {
      indicatorEl.innerHTML = "";
    }
  }

  // Update status badges on the card
  function updateStatusBadges() {
    // PMT Badge
    const pmtItems = Object.values(validationResults.pmt.items);
    const hasPmtPending = pmtItems.some(i => i.status === "pending");
    const hasPmtFailed = pmtItems.some(i => i.status === "fail");

    pmtStatusBadge.className = "status-badge";
    if (hasPmtPending) {
      pmtStatusBadge.textContent = "PMT: Pending Input";
    } else if (hasPmtFailed) {
      pmtStatusBadge.textContent = "PMT: Disqualified";
      pmtStatusBadge.classList.add("badge-fail");
    } else {
      pmtStatusBadge.textContent = "PMT: Qualified";
      pmtStatusBadge.classList.add("badge-pass");
    }

    // PET Badge
    const petItems = Object.values(validationResults.pet.items);
    const hasPetPending = petItems.some(i => i.status === "pending");
    const hasPetFailed = petItems.some(i => i.status === "fail");

    petStatusBadge.className = "status-badge";
    if (hasPetPending) {
      petStatusBadge.textContent = "PET: Incomplete";
    } else if (hasPetFailed) {
      petStatusBadge.textContent = "PET: Requires Work";
      petStatusBadge.classList.add("badge-warning");
    } else {
      petStatusBadge.textContent = "PET: Fully Ready";
      petStatusBadge.classList.add("badge-pass");
    }
  }

  // Update radial progress circle & main remarks
  function updateScoreUI(score) {
    readinessScoreEl.textContent = `${score}%`;
    
    // Circle dash calculation (r=50 -> circumference = 2 * pi * r = 314)
    const strokeOffset = 314 - (score / 100) * 314;
    circleProgress.style.strokeDashoffset = strokeOffset;

    // Apply color to progress circle based on score
    if (score >= 80) {
      circleProgress.style.stroke = "var(--color-success)";
      readinessScoreEl.style.color = "var(--color-success)";
    } else if (score >= 50) {
      circleProgress.style.stroke = "var(--color-warning)";
      readinessScoreEl.style.color = "var(--color-warning)";
    } else {
      circleProgress.style.stroke = "var(--color-error)";
      readinessScoreEl.style.color = "var(--color-error)";
    }

    // Static indicator label is always "READINESS" to avoid "0% LACKING" confusion
    readinessLabelEl.textContent = "READINESS";

    // Dynamic remarks text
    const pmtFailed = Object.values(validationResults.pmt.items).some(i => i.status === "fail");
    const petFailed = Object.values(validationResults.pet.items).some(i => i.status === "fail");
    const pmtPending = Object.values(validationResults.pmt.items).some(i => i.status === "pending");
    const petPending = Object.values(validationResults.pet.items).some(i => i.status === "pending");

    if (pmtPending && petPending) {
      overallRemarksEl.textContent = "Input your actual measurements and trials to assess test readiness.";
    } else if (pmtFailed) {
      overallRemarksEl.textContent = "Alert: You do not meet the minimum Physical Standard measurements. Check your height or weight parameters.";
    } else if (petFailed) {
      overallRemarksEl.textContent = "You satisfy measurements, but need to improve physical efficiency timings. Check the customized training plan below.";
    } else if (validationResults.pmt.passed && validationResults.pet.passed) {
      overallRemarksEl.textContent = "Excellent! You currently meet or exceed all qualifying standards for this state's PET. Keep training to lock it in.";
    } else {
      overallRemarksEl.textContent = "Keep adding inputs to complete your readiness audit.";
    }
  }

  // Diagnostic panel builder
  function generateDiagnostics() {
    const config = getActiveConfig();
    diagnosticsList.innerHTML = "";
    
    let itemsHTML = "";
    let issuesFound = false;

    // Check PMT issues
    Object.keys(validationResults.pmt.items).forEach(key => {
      const item = validationResults.pmt.items[key];
      const field = config.pmt[key];

      if (item.status === "fail") {
        issuesFound = true;
        const diff = (item.required - item.val).toFixed(1);
        itemsHTML += `
          <div class="diag-item diag-fail">
            <div class="diag-status-dot"></div>
            <div class="diag-info">
              <div class="diag-title-row">
                <span class="diag-title">${field.label} Deficit</span>
                <span class="diag-gap-badge">-${diff} ${field.unit}</span>
              </div>
              <p class="diag-desc">Your measurement is ${item.val} ${field.unit}. The qualifying benchmark is ${item.required} ${field.unit}.</p>
              <p class="diag-tip">💡 Tip: For height, focus on spinal decompression and postural alignments. If weight is a blocker, check the nutrition card below for weight adjustments.</p>
            </div>
          </div>
        `;
      }
    });

    // Check PET issues
    Object.keys(validationResults.pet.items).forEach(key => {
      const item = validationResults.pet.items[key];
      const field = config.pet[key];

      if (item.status === "fail") {
        issuesFound = true;
        let diffText = "";
        let tip = "";

        if (item.isTime) {
          const diff = item.val - item.required;
          diffText = `+${diff.toFixed(1)}s`;
          tip = key === "run100m" 
            ? "💡 Tip: Focus on sprint mechanics, explosive block starts, and hamstring power (glute bridges, kettlebell swings)."
            : "💡 Tip: Increase aerobic capacity via tempo runs, fartlek workouts, and weekly interval training (e.g. 400m repeats).";
        } else {
          const diff = (item.required - item.val).toFixed(2);
          diffText = `-${diff} ${field.unit}`;
          
          if (key === "highJump" || key === "longJump") {
            tip = "💡 Tip: Improve explosive vertical force. Practice plyometrics (depth jumps, box jumps) and squat strength.";
          } else if (key === "pullUps") {
            tip = "💡 Tip: Train with eccentric (negative) pull-ups, active lat hangs, barbell rows, and core planks.";
          } else if (key === "shotPut") {
            tip = "💡 Tip: Optimize push mechanics. Train push-presses, medicine ball throws, and core rotational strength.";
          }
        }

        itemsHTML += `
          <div class="diag-item diag-fail">
            <div class="diag-status-dot"></div>
            <div class="diag-info">
              <div class="diag-title-row">
                <span class="diag-title">Lacking in ${field.label}</span>
                <span class="diag-gap-badge">${diffText}</span>
              </div>
              <p class="diag-desc">Your recorded trial is ${item.isTime ? formatSecondsToMinutes(item.val) : item.val} ${field.unit}. Qualifying is ${item.isTime ? formatSecondsToMinutes(item.required) : item.required} ${field.unit}.</p>
              <p class="diag-tip">${tip}</p>
            </div>
          </div>
        `;
      } else if (item.status === "pass") {
        let diffText = "";
        if (item.isTime) {
          diffText = `${(item.required - item.val).toFixed(1)}s faster`;
        } else {
          diffText = `+${(item.val - item.required).toFixed(2)} ${field.unit}`;
        }

        itemsHTML += `
          <div class="diag-item diag-pass">
            <div class="diag-status-dot"></div>
            <div class="diag-info">
              <div class="diag-title-row">
                <span class="diag-title">${field.label} Qualified</span>
                <span class="diag-gap-badge">${diffText}</span>
              </div>
              <p class="diag-desc">You exceeded the minimum baseline for this event.</p>
            </div>
          </div>
        `;
      }
    });

    if (!issuesFound) {
      diagnosticsList.innerHTML = `
        <div class="empty-state">
          <p>No deficits found. Input trial results to check benchmarks.</p>
        </div>
      `;
    } else {
      diagnosticsList.innerHTML = itemsHTML;
    }
  }

  // Training Plan Engine
  function generateTrainingPlan() {
    trainingPlanContent.innerHTML = "";
    nutritionContainer.innerHTML = "";

    const config = getActiveConfig();
    if (!config) return;

    // Detect deficiencies
    const lacksRunning = validationResults.pet.items.run?.status === "fail" || validationResults.pet.items.run100m?.status === "fail";
    const lacksJumping = validationResults.pet.items.highJump?.status === "fail" || validationResults.pet.items.longJump?.status === "fail";
    const lacksStrength = validationResults.pet.items.pullUps?.status === "fail" || validationResults.pet.items.shotPut?.status === "fail";
    const lacksWeight = validationResults.pmt.items.weight?.status === "fail";

    // Build day cards
    let calendarHTML = `<div class="calendar-grid">`;
    
    // Day structures for Week 1-4 based on deficits
    const dailyPlan = getWeeklyStructure(currentWeek, lacksRunning, lacksJumping, lacksStrength);

    dailyPlan.forEach((day, index) => {
      calendarHTML += `
        <div class="day-card">
          <span class="day-label">Day ${index + 1} - ${day.name}</span>
          <h4 class="workout-title">${day.title}</h4>
          <p class="workout-desc">${day.desc}</p>
          <span class="intensity-badge intensity-${day.intensity}">${day.intensity}</span>
        </div>
      `;
    });

    calendarHTML += `</div>`;
    trainingPlanContent.innerHTML = calendarHTML;

    // Generate Nutrition / Recovery Guidelines
    let nutritionHTML = `
      <div class="nutrition-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
      </div>
      <div class="nutrition-text">
        <h4>Nutrition & Weight Recovery Protocol</h4>
    `;

    if (lacksWeight) {
      const weightItem = validationResults.pmt.items.weight;
      if (weightItem.val < weightItem.required) {
        nutritionHTML += `<p><strong>Weight Gain Focus:</strong> Increase complex carbohydrate and clean protein intake (eggs, chicken, paneer, lentils). Focus on heavy resistance training rather than excessive steady-state cardio. Aim for a 300-500 calorie daily surplus.</p>`;
      } else {
        nutritionHTML += `<p><strong>Weight Management Focus:</strong> Focus on calorie control and hydration. Cut processed sugars, increase dietary fiber, and run in fasted states if possible. Maintaining a light calorie deficit will rapidly improve your running speeds and jumping heights.</p>`;
      }
    } else if (lacksRunning) {
      nutritionHTML += `<p><strong>Endurance Recovery:</strong> Prioritize glycogen replenishment within 45 minutes after running workouts with bananas, oats, or clean carb drinks. Ensure magnesium intake for muscle recovery and prevent cramps. Drink 3-4 liters of water daily.</p>`;
    } else if (lacksJumping || lacksStrength) {
      nutritionHTML += `<p><strong>Explosive Muscle Builder:</strong> Prioritize clean protein intake (1.5g per kg body weight) to rebuild muscle fibers strained during jumps and pull-up sessions. Take Creatine Monohydrate (optional, consult doctor) for explosive muscle output. Get 8 hours of sleep for muscle repair.</p>`;
    } else {
      nutritionHTML += `<p><strong>Optimal Prep Fuel:</strong> Balance macros: 55% complex carbs, 25% proteins, 20% healthy fats. Focus on hydration levels leading up to practice mock exams. Limit heavy training 48 hours before mock runs to let muscles recharge.</p>`;
    }

    nutritionHTML += `</div>`;
    nutritionContainer.innerHTML = nutritionHTML;
  }

  // Generates weekly schedules dynamically based on user needs
  function getWeeklyStructure(week, lacksRunning, lacksJumping, lacksStrength) {
    const multiplier = 1 + (week - 1) * 0.15; 
    const days = [
      { name: "Monday", title: "Aerobic Capacity", desc: "Slow endurance run at talking pace. Focus on lungs and breathing.", intensity: "med" },
      { name: "Tuesday", title: "Plyometrics & Power", desc: "Jumping exercises. Squats, box jumps, single leg bounds.", intensity: "high" },
      { name: "Wednesday", title: "Active Recovery", desc: "Light mobility drills, core stretches, and active walking.", intensity: "low" },
      { name: "Thursday", title: "Interval / Speed", desc: "Sprint intervals. Run fast, walk/rest, repeat.", intensity: "high" },
      { name: "Friday", title: "Upper Body & Core", desc: "Pushups, pull-ups, planks, and shoulder presses.", intensity: "med" },
      { name: "Saturday", title: "Qualifying Simulation", desc: "Mock physical check. Run and jump under timer rules.", intensity: "high" },
      { name: "Sunday", title: "Full Rest Day", desc: "Complete muscle recovery. Stretching and hydration only.", intensity: "rest" }
    ];

    if (lacksRunning) {
      days[0].title = "Endurance Threshold";
      days[0].desc = `Continuous steady-state run for ${Math.round(25 * multiplier)} minutes. Keep a constant tempo.`;
      days[0].intensity = "med";

      days[3].title = "Running Speed Intervals";
      days[3].desc = `Warm-up. Run ${Math.round(6 * multiplier)} sets of 400m sprints. Rest 90 seconds between sets.`;
      days[3].intensity = "high";
    }

    if (lacksJumping) {
      days[1].title = "Explosive Bounds";
      days[1].desc = `High Jump and Long Jump drills. Perform ${Math.round(4 * multiplier)} sets of 10 explosive box jumps, broad jumps, and single-leg hurdles.`;
      days[1].intensity = "high";
      days[2].desc += " Stretch hamstrings and hip flexors thoroughly to improve leg reach.";
    }

    if (lacksStrength) {
      days[4].title = "Pull & Push Strength";
      days[4].desc = `Pull-ups practice. Perform 4 sets of max dead hangs, negative pullups (control the descent), and pushups to failure.`;
      days[4].intensity = "high";
    }

    if (!lacksRunning && !lacksJumping && !lacksStrength) {
      days[0].title = "Tempo Cardio Maintenance";
      days[0].desc = "20 mins steady-state tempo run to maintain cardiovascular threshold.";
      days[0].intensity = "med";

      days[1].title = "Dynamic Leg Power";
      days[1].desc = "Moderate plyometrics. 3 sets of tuck jumps, squats, and broad jumps for tendon elasticity.";
      days[1].intensity = "med";

      days[3].title = "Speed Acceleration";
      days[3].desc = "6 sets of 60m dash from blocks. Focus on maximum explosive acceleration.";
      days[3].intensity = "high";

      days[4].title = "Strength Conditioning";
      days[4].desc = "General upper body maintenance. 3 sets of 8 pullups, dips, and core hollow holds.";
      days[4].intensity = "med";
    }

    return days;
  }

  // Fire up the app
  initApp();
});
