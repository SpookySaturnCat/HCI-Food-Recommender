# Eat This Next App Development Guide

Welcome to the Eat This Next repository. This document outlines the required Git workflow, branch management policies, and code review procedures for all team members and collaborators.

---

## Implementation Status & Rules

| Guideline | Status | Description |
| :--- | :--- | :--- |
| **Main Branch Lock** | Enforced | Never commit directly to main. All code enters main via Pull Request. |
| **Branch Naming** | Enforced | All work must occur on a branch named after the collaborator. |
| **Sync Frequency** | Enforced | Fetch and pull updates from main often to avoid drift. |
| **Code Review** | Enforced | Page Seraphina on every Pull Request before merging to main. |

---

## Team Workflow Guidelines

### Branch Management
- **Never Commit to Main:** The main branch is strictly reserved for stable, production ready code. Direct commits to main are disabled.
- **Personal Feature Branches:** Create and work exclusively on a branch named after yourself (for example, `john-doe` or `seraphina`).
- **Frequent Synchronization:** Fetch data and pull updates from the origin main branch regularly to ensure your local work stays up to date.

### Code Review Process
1. Push your branch updates to GitHub.
2. Open a Pull Request (PR) to merge your branch into `main`.
3. Page **Seraphina** for a code review on your PR.
4. Once approved, the PR can be merged into `main`.

---

## GitHub Desktop Instructions

### 1. Clone the Repository
1. Open GitHub Desktop.
2. Select **File > Clone Repository...**
3. Choose **Eat This Next** from your repository list or enter the repository URL.
4. Click **Clone**.

### 2. Switch to Your Personal Branch
1. Click the **Current Branch** drop down at the top of GitHub Desktop.
2. Select your pre-created personal branch named after you (for example, `your-name`).
3. If not visible locally, select it under **Remote Branches** to check it out.

### 3. Fetch and Pull Updates Regularly
1. Click **Fetch origin** at the top right corner to check for updates from the team.
2. If updates are available on main, select **Branch > Merge into current branch...**
3. Select `main` to bring the latest changes into your branch.

### 4. Commit and Push Changes
1. Select the files you want to include in the left sidebar.
2. Type a clear commit message at the bottom left.
3. Click **Commit to your-name**.
4. Click **Push origin** in the top bar to upload your local commits to GitHub.

### 5. Create Pull Request and Page Reviewer
1. Click **Create Pull Request** in GitHub Desktop (this opens GitHub in your web browser).
2. Ensure the base branch is set to `main` and the compare branch is set to `your-name`.
3. Submit the Pull Request.
4. Leave a comment or ping **Seraphina** to request a code review.

---

## Git Command Line Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/your-org/eat-this-next.git](https://github.com/your-org/eat-this-next.git)
cd eat-this-next
