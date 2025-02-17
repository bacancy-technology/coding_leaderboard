/* eslint-disable */

document.head.insertAdjacentHTML('beforeend', `
<style>
.btn-outline-light {
    border: 1px solid rgba(255,255,255,0.5);
    padding: 0.5rem 1rem;
    margin-left: 1rem;
}
.btn-outline-light:hover {
    background: rgba(255,255,255,0.1);
}

.medal-1, .medal-2, .medal-3 {
    background: rgba(255, 255, 255, 0.1);
    font-weight: bold;
}

.medal-1 { background: rgba(255, 215, 0, 0.15); }
.medal-2 { background: rgba(192, 192, 192, 0.15); }
.medal-3 { background: rgba(205, 127, 50, 0.15); }

.medal-icon-1 { color: #FFD700; }
.medal-icon-2 { color: #C0C0C0; }
.medal-icon-3 { color: #CD7F32; }

.medal-1 .score-cell { color: #FFD700; }
.medal-2 .score-cell { color: #C0C0C0; }
.medal-3 .score-cell { color: #CD7F32; }

.fa-medal {
    margin-right: 10px;
    font-size: 1.2em;
    animation: shine 2s infinite;
}

@keyframes shine {
    0% { opacity: 1; }
    50% { opacity: 0.6; }
    100% { opacity: 1; }
}

/* New styles for consistent leaderboard */
.leaderboard-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.rank-indicator {
    min-width: 32px;
    text-align: center;
    font-weight: 500;
}

.user-cell {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
}

.medal-icon-1, .medal-icon-2, .medal-icon-3 {
    font-size: 1.4em;
    min-width: 24px;
}

.table td {
    padding: 1rem;
    vertical-align: middle;
}

.score-cell {
    font-weight: 600;
    font-size: 1.1em;
}

/* Update medal styles */
.medal-1, .medal-2, .medal-3 {
    transition: background-color 0.3s ease;
}

.medal-1:hover { background: rgba(255, 215, 0, 0.2); }
.medal-2:hover { background: rgba(192, 192, 192, 0.2); }
.medal-3:hover { background: rgba(205, 127, 50, 0.2); }

/* Update styles for bold titles and top 3 */
.question-title {
    font-weight: 600;
}

.medal-1, .medal-2, .medal-3 {
    font-weight: 700;
    font-size: 1.05em;
}

.medal-1 td, .medal-2 td, .medal-3 td {
    font-weight: 600;
}

.medal-1 .score-cell { 
    color: #FFD700; 
    font-size: 1.2em;
    font-weight: 800;
}
.medal-2 .score-cell { 
    color: #C0C0C0; 
    font-size: 1.15em;
    font-weight: 800;
}
.medal-3 .score-cell { 
    color: #CD7F32; 
    font-size: 1.1em;
    font-weight: 800;
}

.medal-1 .user-cell { font-size: 1.1em; }
.medal-2 .user-cell { font-size: 1.05em; }
.medal-3 .user-cell { font-size: 1.02em; }
</style>
`);

// Add this helper function at the top
async function handleApiResponse(response) {
  if (response.status === 401) {
    const data = await response.json();
    if (data.message === "Only @bacancy.com email addresses are allowed.") {
      // First redirect to logout
      window.location.href = '/logout';
      // Wait for a moment to ensure logout completes
      setTimeout(() => {
        window.location.href = '/error';
      }, 500);
    } else {
      window.location.href = '/';
    }
    throw new Error('Unauthorized');
  }
  return response.json();
}

async function fetchUserScore() {
  try {
    const response = await fetch('/api/v1/leaderboards/myscore');
    const data = await handleApiResponse(response);
    if (data.success && data.data.length > 0) {
      const userScoreElement = document.getElementById('user-score');
      const userNameElement = document.getElementById('user-name');
      const userData = data.data[0].attributes;

      userScoreElement.textContent = userData.score;
      userNameElement.textContent = userData.usersId.name;
    }
  } catch (error) {
    console.error('Error fetching user score:', error);
  }
}

async function fetchQuestions() {
  const title = document.getElementById('search-title').value;
  const platform = document.getElementById('filter-platform').value;
  const difficulty = document.getElementById('filter-difficulty').value;
  const status = document.getElementById('filter-status').value;

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (title) queryParams.append('title', title);
  if (platform) queryParams.append('platform', platform);
  if (difficulty) queryParams.append('difficulty', difficulty);
  if (status) queryParams.append('status', status);

  try {
    const response = await fetch(`/api/v1/questions?${queryParams.toString()}`);
    const data = await handleApiResponse(response);
    if (data.success) {
      const questionsTableBody = document.getElementById('questions-table-body');
      questionsTableBody.innerHTML = '';
      for (const question of data.data) {
        const attemptResponse = await fetch(`/api/v1/attempts/?questionsId=${question.id}`);
        const attemptData = await handleApiResponse(attemptResponse);
        const questionStatus = attemptData.success && attemptData.data.length > 0 ? attemptData.data[0].attributes.status : 'Not Started';
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>
                    <a href="${question.attributes.link}" target="_blank">
                        <span class="question-title">${question.attributes.title}</span>
                        <i class="fas fa-external-link-alt ms-1"></i>
                    </a>
                </td>
                <td>${question.attributes.platform}</td>
                <td>${question.attributes.difficulty}</td>
                <td>${question.attributes.points}</td>
                <td>${questionStatus}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="updateQuestionStatus('${question.id}', 'Doing')" ${questionStatus === 'Doing' || questionStatus === 'Done' ? 'disabled' : ''}>Doing</button>
                    <button class="btn btn-sm btn-success" onclick="updateQuestionStatus('${question.id}', 'Done')" ${questionStatus === 'Done' ? 'disabled' : ''}>Done</button>
                </td>
            `;
        questionsTableBody.appendChild(row);
      }
    }
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

async function viewUserDetails(userId) {
  try {
    const response = await fetch(`/api/v1/attempts?usersId=${userId}`);
    const data = await handleApiResponse(response);
    if (data.success) {
      const detailsTableBody = document.getElementById('details-table-body');
      detailsTableBody.innerHTML = '';
      data.data.forEach((attempt) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>
                    <a href="${attempt.attributes.questionsId.link}" target="_blank">
                        <span class="question-title">${attempt.attributes.questionsId.title}</span>
                        <i class="fas fa-external-link-alt ms-1"></i>
                    </a>
                </td>
                <td>${attempt.attributes.questionsId.platform}</td>
                <td>${attempt.attributes.questionsId.difficulty}</td>
                <td>${attempt.attributes.questionsId.points}</td>
                <td>${attempt.attributes.status}</td>
            `;
        detailsTableBody.appendChild(row);
      });

      // Get modal element and initialize if not already initialized
      const modalElement = document.getElementById('detailsModal');
      let detailsModal = bootstrap.Modal.getInstance(modalElement);
      if (!detailsModal) {
        detailsModal = new bootstrap.Modal(modalElement);
      }
      detailsModal.show();
    }
  } catch (error) {
    console.error('Error viewing user details:', error);
  }
}

async function fetchLeaderboard() {
  try {
    const response = await fetch('/api/v1/leaderboards');
    const data = await handleApiResponse(response);
    if (data.success) {
      const leaderboardTableBody = document.getElementById('leaderboard-table-body');
      leaderboardTableBody.innerHTML = '';
      data.data.forEach((user, index) => {
        const medalClass = index < 3 ? `medal-${index + 1}` : '';
        const rankDisplay = index < 3 
            ? `<i class="fas fa-medal medal-icon-${index + 1}"></i>`
            : `<span class="rank-indicator">#${index + 1}</span>`;
        
        const row = document.createElement('tr');
        row.className = medalClass;
        row.innerHTML = `
            <td>
                <div class="user-cell">
                    ${rankDisplay}
                    <img src="${user.attributes.usersId.picture || 'default-user-icon.png'}" 
                        alt="" 
                        class="user-icon" 
                        onerror="this.onerror=null;this.src='default-user-icon.png';">
                    ${user.attributes.usersId.name}
                </div>
            </td>
            <td>${user.attributes.usersId.email}</td>
            <td class="score-cell">${user.attributes.score}</td>
            <td><button class="btn btn-sm btn-info" onclick="viewUserDetails('${user.attributes.usersId._id}')">View Details</button></td>
        `;
        leaderboardTableBody.appendChild(row);
      });
    }
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

async function updateQuestionStatus(questionId, status) {
  try {
    const response = await fetch('/api/v1/attempts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionsId: questionId, status }),
    });
    await handleApiResponse(response);
    fetchQuestions();
    fetchUserScore();
    fetchLeaderboard();
  } catch (error) {
    console.error('Error updating question status:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const searchTitleInput = document.getElementById('search-title');
  const filterPlatformSelect = document.getElementById('filter-platform');
  const filterDifficultySelect = document.getElementById('filter-difficulty');
  const filterStatusSelect = document.getElementById('filter-status');

  function applyFilters() {
    // Apply filters to the questions table
    fetchQuestions();
  }

  searchTitleInput.addEventListener('input', applyFilters);
  filterPlatformSelect.addEventListener('change', applyFilters);
  filterDifficultySelect.addEventListener('change', applyFilters);
  filterStatusSelect.addEventListener('change', applyFilters);

  fetchUserScore();
  fetchQuestions();
  fetchLeaderboard();
});
