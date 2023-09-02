async function fetchGitHubProfile() {
    const response = await fetch('https://api.github.com/users/Super8Four');
    const data = await response.json();
  
    const profileHTML = `
      <div class="Box">
        <img src="${data.avatar_url}" class="avatar" alt="...">
        <div class="Box-body">
          <h3 class="Box-title">${data.name || data.login}</h3>
          <p>${data.bio || 'No bio available'}</p>
          <a href="${data.html_url}" class="btn btn-primary">Go to GitHub Profile</a>
        </div>
      </div>
    `;
  
    document.getElementById('profile').innerHTML = profileHTML;
  }
  
  async function fetchGitHubRepos() {
    const response = await fetch('https://api.github.com/users/Super8Four/repos');
    const repos = await response.json();
  
    document.getElementById('repoCount').innerText = repos.length;
  
    let reposHTML = '';
    repos.forEach(repo => {
      reposHTML += `
        <div class="col-6 mb-4">
          <div class="Box">
            <div class="Box-body">
              <h4 class="Box-title">${repo.name}</h4>
              <p>${repo.description || 'No description available'}</p>
              <a href="${repo.html_url}" class="btn btn-secondary" target="_blank">View Repo</a>
            </div>
          </div>
        </div>
      `;
    });
  
    document.getElementById('repos').innerHTML = reposHTML;
  }
  
  async function fetchCommitActivity(repoName) {
    const response = await fetch(`https://api.github.com/repos/Super8Four/${repoName}/stats/participation`);
    const data = await response.json();
    return data.all.reduce((a, b) => a + b, 0);
  }
  
  async function renderCommitChart() {
    const response = await fetch('https://api.github.com/users/Super8Four/repos');
    const repos = await response.json();
  
    const labels = [];
    const data = [];
  
    for (const repo of repos) {
      labels.push(repo.name);
      const commits = await fetchCommitActivity(repo.name);
      data.push(commits);
    }
  
    const ctx = document.getElementById('commitChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Number of Commits',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
  fetchGitHubProfile();
  fetchGitHubRepos();
  renderCommitChart();
  