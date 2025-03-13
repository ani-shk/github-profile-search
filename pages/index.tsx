import React from 'react';
import styles from '../styles/Home.module.css';

const Home: React.FC = () => {
  const [username, setUsername] = React.useState('');
  const [profile, setProfile] = React.useState<any>(null);
  const [repos, setRepos] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for GitHub profile:', username);
    setIsLoading(true);
    setError(null);
    setProfile(null); // Clear current profile data
    setRepos([]);
    
    // Fetch user profile
    fetch(`https://api.github.com/users/${username}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`User not found`);
        }
        return response.json();
      })
      .then(data => {
        console.log('GitHub profile data:', data);
        setProfile(data);
        
        // Fetch repositories after profile is fetched
        return fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=4`);
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories`);
        }
        return response.json();
      })
      .then(reposData => {
        console.log('GitHub repos data:', reposData);
        setRepos(reposData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching GitHub data:', error);
        setError(error.message);
        setIsLoading(false);
      });
  };
  
  return (
    <div className={`${styles.home} ${darkMode ? styles.darkMode : ''}`}>
      <header className={styles.header}>
        <span>Dark Mode</span>
        <label className={styles.toggleSwitch}>
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={toggleDarkMode}
          />
          <span className={styles.slider}></span>
        </label>
      </header>
      
      <section className={styles.mainSection}>
        <h3 className={styles.title}>GitHub Profile Search</h3>
        <p className={styles.description}>
          Enter a GitHub username to search for profiles
        </p>
        
        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className={styles.searchInput}
            required
          />
          <button type="submit" className={styles.searchButton} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>
        
        {isLoading && <p>Loading...</p>}
        {error && <p className={styles.error}>Error: {error}</p>}
        
        {profile && !isLoading && (
          <div className={styles.profile}>
            <div className={styles.profileHeader}>
              <img 
                src={profile.avatar_url} 
                alt={`${profile.login}'s avatar`} 
                className={styles.avatar}
                width={100}
                height={100}
              />
              <div className={styles.profileInfo}>
                <h2>{profile.name || profile.login}</h2>
                {profile.bio && <p>{profile.bio}</p>}
              </div>
            </div>
            
            <ul className={styles.stats}>
              <li>Followers: {profile.followers}</li>
              <li>Following: {profile.following}</li>
              <li>Public repos: {profile.public_repos}</li>
              <li className={styles.profileBtn}>
                <a 
                  href={profile.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Profile
                </a>
              </li>
            </ul>
            
            {repos.length > 0 && (
              <div className={styles.reposSection}>
                <h3>Top Repositories</h3>
                <ul className={styles.reposList}>
                  {repos.map(repo => (
                    <li key={repo.id} className={styles.repoItem}>
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repo.name}
                      </a>
                      <p>{repo.description || 'No description'}</p>
                      <div className={styles.repoStats}>
                        <span>⭐ {repo.stargazers_count}</span>
                        <span>🍴 {repo.forks_count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;