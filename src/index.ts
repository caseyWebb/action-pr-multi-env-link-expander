import * as core from '@actions/core'
import * as github from '@actions/github'
import { Octokit } from '@octokit/rest'

import { transform } from './transform'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('GITHUB_TOKEN', { required: true })
    const octokit = new Octokit({ auth: token })
    const { payload } = github.context
    const environments = JSON.parse(core.getInput('ENVIRONMENTS'))

    if (!payload.pull_request) {
      console.log('No pull request found.')
      return
    }

    const { owner, repo } = github.context.repo
    const pull_number = payload.pull_request.number
    const pr = { owner, repo, pull_number }

    const {
      data: { body }
    } = await octokit.pulls.get(pr)

    if (!body) {
      console.log('No pull request description found.')
      return
    }

    await octokit.pulls.update({
      ...pr,
      body: transform(environments, body)
    })

    console.log('Pull request description updated.')
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

run()
