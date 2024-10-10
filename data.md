- Go to https://github.com, log in, and click New.
- Name your repo and click **Create repository**.

---

- On https://github.com search for **gdg-iiitk/game** repository.
- Create a new _fork_ of this repo as **git-game**.

---

- Open your forked repo and copy the url
- Open a terminal and run the following command

- ` git clone {paste-the-url}`

---

- In your terminal, go to your repo folder:

`cd git-game`

- Create a new branch

`git checkout -b {git_game_yourGitHubUsername} `

---

- In your terminal, create a new file:

  `echo 'Hello from {YourGitHubUsername}' > {yourGitHubUsername_anyThing}.txt`

- The above command will create a file with your username and the text inside it.

---

- First, add the file to the staging area:

  `git add .`

- Second, commit your changes with a message:

  `git commit -m '{write a commit message here, (avoid cuss words)}'`

---

- Open the forked repo again, click on **Pull requests**.
- Create a new _pull request_
- {yourGithubUsername}/main <-- {git_game_yourGitHubUsername}
