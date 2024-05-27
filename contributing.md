# Contribution

First of all thank you for considering to contribute. Please look at the details below:

- [Create a New Branch](#create-a-new-branch)
- [New Roadmaps](#new-roadmaps)
- [Existing Roadmaps](#existing-roadmaps)
- [Adding Content](#adding-content)
- [Guidelines](#guidelines)

## Create A New Branch

To create a new branch against `develop` for your contribution please do the following:

```bash
git clone https://github.com/kamranahmedse/developer-roadmap.git # Clone Repo
cd developer-roadmap                                             # Change Directory
git switch develop && git pull                                   # Switch and pull
git checkout -b "a-sensible-branch-name"                         # Create your branch
```

## New Roadmaps

For new roadmaps, you can either:
- Submit a roadmap by providing [a textual roadmap similar to this roadmap](https://gist.github.com/kamranahmedse/98758d2c73799b3a6ce17385e4c548a5) in an [issue](https://github.com/kamranahmedse/developer-roadmap/issues).
- Create an interactive roadmap yourself using [our roadmap editor](https://draw.roadmap.sh/) & submit the link to that roadmap in an [issue](https://github.com/kamranahmedse/developer-roadmap/issues).

## Existing Roadmaps

For the existing roadmaps, please follow the details listed for the nature of contribution:

- **Fixing Typos** — Make your changes in the [roadmap JSON file](https://github.com/kamranahmedse/developer-roadmap/tree/master/src/data/roadmaps) and submit a [PR](https://github.com/kamranahmedse/developer-roadmap/pulls).
- **Adding or Removing Nodes** — Please open an [issue](https://github.com/kamranahmedse/developer-roadmap/issues) with your suggestion.

**Note:** Please note that our goal is <strong>not to have the biggest list of items</strong>. Our goal is to list items or skills most relevant today.

## Adding Content

Find [the content directory inside the relevant roadmap](https://github.com/kamranahmedse/developer-roadmap/tree/master/src/data/roadmaps). Please keep the following guidelines in mind when submitting content:

- Content must be in English.
- Maximum of 8 links per topic.
- Follow the below style guide for content.

### How To Structure Content

Please adhere to the following style when adding content to a topic:

```
# Topic Title

(Content)

Visit the following resources to learn more:

- [Description of link](Link)
```

## Guidelines

- <p><strong>Please open your pull request (PR) against the develop branch.</strong><br />

  To keep caching and deployments under control, please open your PR's against the `develop` branch, which will then be merged into `master` at the end of the day.

- <p><strong>Adding everything available out there is not the goal!</strong><br />

  The roadmaps represent the skillset most valuable today, i.e., if you were to enter any of the listed fields today, what would you learn? There might be things that are of-course being used today but prioritize the things that are most in demand today, e.g., agreed that lots of people are using angular.js today but you wouldn't want to learn that instead of React, Angular, or Vue. Use your critical thinking to filter out non-essential stuff. Give honest arguments for why the resource should be included.</p>

- <p><strong>Do not add things you have not evaluated personally!</strong><br />

  Use your critical thinking to filter out non-essential stuff. Give honest arguments for why the resource should be included. Have you read this book? Can you give a short article?</p>

- <p><strong>Create a Single PR for Content Additions</strong></p>

  If you are planning to contribute by adding content to the roadmaps, I recommend you to clone the repository, add content to the [content directory of the roadmap](./src/data/roadmaps/) and create a single PR to make it easier for me to review and merge the PR.

- <p><strong>Write meaningful commit messages</strong><br >

  Meaningful commit messages help speed up the review process as well as help other contributors in gaining a good overview of the repositories commit history without having to dive into every commit.
  
  (See the following guide on how to write good [commit messages](https://www.freecodecamp.org/news/how-to-write-better-git-commit-messages/)).

  </p>
- <p><strong>Look at the existing issues/pull requests before opening new ones</strong></p>

### Good vs Not So Good Contributions

<strong>Good</strong>

  - New Roadmaps.
  - Engaging, fresh content links.
  - Typos and grammatical fixes.
  - Content copy in topics that do not have any (or minimal copy exists).

<strong>Not So Good</strong>

  - Adding whitespace that doesn't add to the readability of the content.
  - Rewriting content in a way that doesn't add any value.
  - None English content.
  - PR's that don't follow our style guide, have no description and a default title.