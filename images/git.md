1. **Make a GitHub Repo:**

   - Go to https://github.com, log in, and click **New**.
   - Name your repo and click **Create repository**.

2. **Fork the Repo:**

   - Find the repo you want to fork.
   - Click the **Fork** button at the top right of the repo page.
   - Now you have your own copy of the repo!

3. **Clone the Repo:**

   - On your repo page, click the **Code** button (green).
   - Copy the link that appears.
   - Open your terminal and type:
     ```
     git clone <paste-the-link>
     ```
   - Press Enter, and the repo will be downloaded to your system!

4. **Create a New Branch:**

   - In your terminal, go to your repo folder:
     ```
     cd <repo-folder>
     ```
   - Then, create a new branch by typing:
     ```
     git checkout -b <branch-name>
     ```
   - You’re now on your new branch!

5. **Create a File with Your GitHub Username:**

   - In your terminal, create a new file:
     ```
     echo "Hello from <YourGitHubUsername>" > <YourGitHubUsername>.txt
     ```
   - This will create a file with your username and the text inside it.

6. **Commit Your Changes:**

   - First, add the file to the staging area:
     ```
     git add <YourGitHubUsername>.txt
     ```
   - Then, commit your changes with a message:
     ```
     git commit -m "Added my GitHub username file"
     ```

7. **Create a Pull Request:**

   - Push your new branch to GitHub:
     ```
     git push origin <branch-name>
     ```
   - Go to your repository on GitHub. You’ll see an option to **Compare & pull request**. Click it.
   - Add a title and description for your pull request, then click **Create pull request**.

   import React from 'react';
   import ReactMarkdown from 'react-markdown';

const markdownContent = `
\n1. **Make a GitHub Repo:**\n
   \n- Go to https://github.com, log in, and click **New**.\n
   \n- Name your repo and click **Create repository**.\n
\n2. **Fork the Repo:**\n
   \n- Find the repo you want to fork.\n
   \n- Click the **Fork** button at the top right of the repo page.\n
   \n- Now you have your own copy of the repo!\n
\n3. **Clone the Repo:**\n
   \n- On your repo page, click the **Code** button (green).\n
   \n- Copy the link that appears.\n
   \n- Open your terminal and type:\n  
     \n\`\`\`\n
git clone <paste-the-link>\n
\`\`\`\n
\n- Press Enter, and the repo will be downloaded to your system!\n
\n4. **Create a New Branch:**\n
\n- In your terminal, go to your repo folder:\n
\n\`\`\`\n
cd <repo-folder>\n
\`\`\`\n
\n- Then, create a new branch by typing:\n
\n\`\`\`\n
git checkout -b <branch-name>\n
\`\`\`\n
\n- You’re now on your new branch!\n
\n5. **Create a File with Your GitHub Username:**\n
\n- In your terminal, create a new file:\n
\n\`\`\`\n
echo "Hello from <YourGitHubUsername>" > <YourGitHubUsername>.txt\n
\`\`\`\n
\n- This will create a file with your username and the text inside it.\n
\n6. **Commit Your Changes:**\n
\n- First, add the file to the staging area:\n
\n\`\`\`\n
git add <YourGitHubUsername>.txt\n
\`\`\`\n
\n- Then, commit your changes with a message:\n
\n\`\`\`\n
git commit -m "Added my GitHub username file"\n
\`\`\`\n
\n7. **Create a Pull Request:**\n
\n- Push your new branch to GitHub:\n
\n\`\`\`\n
git push origin <branch-name>\n
\`\`\`\n
\n- Go to your repository on GitHub. You’ll see an option to **Compare & pull request**. Click it.\
