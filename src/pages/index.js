import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';

// These are mock functions to prevent errors
const core = {
  getInput: () => 'mock-token',
  setFailed: console.error
};
const github = {
  getOctokit: () => ({
    rest: {
      issues: {
        create: async () => ({ data: { html_url: 'https://github.com/mock-issue' } }),
        createComment: async () => {}
      }
    }
  }),
  context: {
    payload: { pull_request: { title: 'Mock PR', body: 'Mock body', number: 1 } },
    repo: { owner: 'mock-owner', repo: 'mock-repo' }
  }
};

async function run() {
  try {
    // get GitHub token
    const token = core.getInput("repo-token", { required: true });
    const octokit = github.getOctokit(token);
    const { context } = github;

    // get the current pr
    const pr = context.payload.pull_request;
    console.log(pr.title);
    
    // create an issue for pr
    console.log("Creating issue for PR");
    const issue = await octokit.rest.issues.create({
      owner: context.repo.owner,
      repo: context.repo.repo,
      title: pr.title,
      body: pr.body,
    });
    // add comment to PR
    console.log("Adding comment to PR");
    await octokit.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: pr.number,
      body: `Issue created: ${issue.data.html_url}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

export default function Home() {
  const [dogImage, setDogImage] = useState('');

  useEffect(() => {
    run();
    fetch('https://dog.ceo/api/breeds/image/random')
      .then(res => res.json())
      .then(data => setDogImage(data.message));
  }, []);

  return (
    <div>
      <h1>Welcome to my Next.js app!</h1>
      {dogImage && <img src={dogImage} alt="Random dog" style={{maxWidth: '500px'}} />}
    </div>
  );
}