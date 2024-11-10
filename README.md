# KanbanBoard

## Description

The **KanbanBoard** application is a web-based candidate search tool designed to help employers find potential hires by browsing through GitHub profiles. This application connects to the GitHub API, allowing users to review candidate profiles, save promising candidates, and revisit saved profiles later.

### Motivation

The goal of this project was to streamline the candidate search process, providing an easy-to-use tool for employers to quickly browse, evaluate, and save profiles of developers on GitHub. By utilizing GitHub as a data source, the application offers a real-time, accurate overview of candidates based on their public profile information.

### What Problem Does It Solve?

CandidateSearch simplifies the hiring process for employers who want to hire developers by:
- Displaying GitHub profile information in an organized and accessible manner.
- Allowing users to save profiles of potential candidates for later review.
- Ensuring saved profiles persist between sessions.

### What Did You Learn?

This project provided hands-on experience with:
- Integrating third-party APIs (GitHub API) and managing asynchronous data fetching.
- Working with TypeScript for type-safe development in React.
- Implementing routing, conditional rendering, and local storage for data persistence.
- Deploying a complete application to a hosting service (Render).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [License](#license)
- [Features](#features)
- [Screenshots](#screenshots)
- [Code Snippets](#code-snippets)
- [Links](#links)

## Installation

Follow these steps to set up the development environment:

1. Install dependencies:
   ```bash
   npm install

2. Clone the repository:
   ```bash
   git clone git@github.com:Moosorkh/CandidateSearch.git
   cd CandidateSearch

3. Set up your environment variables:
  - Create a .env file in the root directory.
  - Add your GitHub token to the .env file as VITE_GITHUB_TOKEN=your_token_here.

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application should now be running on http://localhost:5173.

## Usage
### Candidate Search Page

1. Browse Candidates: When the application loads, it displays the first candidate's profile information, including name, username, location, avatar, email, GitHub profile link, and company.

2. Save Candidates: Click the "+" button to save the candidate to the list of potential hires, and automatically load the next candidate's profile.
3. Skip Candidates: Click the "-" button to skip a candidate without saving, loading the next candidate in the sequence.
4. No More Candidates: When there are no more candidates to review, a message will indicate that all candidates have been viewed.

### Saved Candidates Page
1. View Saved Candidates: Access the list of saved candidates, with each profile displaying name, username, location, avatar, email, GitHub profile link, and company.
2. Persistent Data: Saved candidates will remain available even after reloading the page, as they are stored in local storage.
3. Delete Saved Candidates: Remove a candidate from the saved list by clicking the “Remove” button next to their profile.

## Screenshots
### Candidate Search Page
![Candidate Search Page](public/01-candidate_search_homepage.png)

### Saved Candidates Page
![Saved Candidates Page](public/02-candidate_search_potential_candidates.png)

## Code Snippets

### CandidateSearch
```tsx
import { useState, useEffect } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import { Candidate } from "../interfaces/Candidate.interface";
import { saveCandidate } from "../utils/storage";

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [candidatesList, setCandidatesList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      // Fetch basic candidates list (without details)
      const basicCandidates = await searchGithub();

      // Extract usernames and store them in the state
      const usernames = basicCandidates.map((user: any) => user.login);
      console.log("Usernames:", usernames);
      setCandidatesList(usernames);

      // Fetch details for the first username
      if (usernames.length > 0) {
        fetchCandidateDetails(usernames[0]);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  };

  const fetchCandidateDetails = async (username: string) => {
    try {
      const userData = await searchGithubUser(username);
      console.log("Fetched user data:", userData);
      setCandidate(userData || null);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      setCandidate(null);
    }
  };

  const fetchNextCandidate = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < candidatesList.length) {
      setCurrentIndex(nextIndex);
      fetchCandidateDetails(candidatesList[nextIndex]);
    } else {
      setCandidate(null); // No more candidates available
    }
  };

  const handleSaveCandidate = () => {
    if (candidate) {
      saveCandidate(candidate);
      fetchNextCandidate();
    }
  };

  const handleSkipCandidate = () => {
    fetchNextCandidate();
  };

  return (
    <div>
      <h1>Potential Candidates</h1>
      {candidate ? (
        <div className="candidate-card">
          <img
            src={candidate.avatar_url}
            alt="avatar"
            className="candidate-avatar-large"
          />
          <h2 className="candidate-name">
            {candidate.name || candidate.login}
          </h2>
          <p>Location: {candidate.location || "Not provided"}</p>
          <p>Email: {candidate.email || "Not provided"}</p>
          <p>Company: {candidate.company || "Not provided"}</p>
          <a
            href={candidate.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub Profile
          </a>
          <div className="candidate-actions">
            <button
              onClick={handleSaveCandidate}
              className="button button-save"
            >
              <span className="icon-plus">+</span>
            </button>
            <button
              onClick={handleSkipCandidate}
              className="button button-skip"
            >
              <span className="icon-minus">-</span>
            </button>
          </div>
        </div>
      ) : (
        <p className="no-candidates-message">No more candidates available.</p>
      )}
    </div>
  );
};

export default CandidateSearch;

```
### SavedCandidates
```tsx
import { useEffect, useState } from "react";
import { Candidate } from "../interfaces/Candidate.interface";
import { getSavedCandidates, removeCandidate } from "../utils/storage";

const SavedCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setCandidates(getSavedCandidates());
  }, []);

const handleRemoveCandidate = (username: string) => {
  removeCandidate(username);
  setCandidates(getSavedCandidates()); 
};

  return (
    <div>
      <h1>Potential Candidates</h1>
      {candidates.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td>
                  <img
                    src={candidate.avatar_url}
                    alt="avatar"
                    className="candidate-avatar"
                  />
                </td>
                <td>{candidate.name || candidate.login}</td>
                <td>{candidate.location || "N/A"}</td>
                <td>{candidate.email || "N/A"}</td>
                <td>{candidate.company || "N/A"}</td>
                <td>{candidate.bio || "N/A"}</td>
                <td>
                  <button
                    onClick={() => handleRemoveCandidate(candidate.login)}
                    className="button-remove"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No candidates have been accepted.</p>
      )}
    </div>
  );
};

export default SavedCandidates;

```

## Credits
- GitHub API: GitHub REST API for retrieving user data.
- Deployment: Application hosted on Render - CandidateSearch Deployment
- Project Repository: GitHub Repo

## License
This project is licensed under the MIT License. For more information, refer to the LICENSE file in the repository.

## Features
- Real-Time Candidate Search: Pulls live data from GitHub, offering an up-to-date view of candidates.
- Persistent Saved Candidates: Utilizes local storage to keep saved candidates across sessions.
- Responsive UI: Optimized for both desktop and mobile viewing.
- Interactive Navigation: User-friendly navigation for switching between candidate search and saved candidates.

## Links

- **GitHub Repository**: [CandidateSearch GitHub Repo](https://github.com/Moosorkh/CandidateSearch.git)
- **Live Application**: [CandidateSearch on Render](https://candidatesearch-zbja.onrender.com/)