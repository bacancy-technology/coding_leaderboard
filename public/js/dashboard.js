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
                        ${question.attributes.title}
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
                        ${attempt.attributes.questionsId.title}
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
      data.data.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>
                    <img src="${user.attributes.usersId.picture || 'default-user-icon.png'}" alt="" class="user-icon" onerror="this.onerror=null;this.src='default-user-icon.png';">
                    ${user.attributes.usersId.name}
                </td>
                <td>${user.attributes.usersId.email}</td>
                <td>${user.attributes.score}</td>
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
