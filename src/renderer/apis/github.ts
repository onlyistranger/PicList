import { Octokit } from '@octokit/rest'

interface IConfigMap {
  fileName: string
  hash: string
  config: PartialKeys<IGitHubConfig, 'path'>
}

export default class GithubApi {
  static #createOctokit (token: string) {
    return new Octokit({
      auth: token
    })
  }

  static #createKey (path: string | undefined, fileName: string): string {
    const formatedFileName = fileName.replace(/%2F/g, '/')
    return path && path !== '/'
      ? `${path.replace(/^\/+|\/+$/, '')}/${formatedFileName}`
      : formatedFileName
  }

  static async delete (configMap: IConfigMap): Promise<boolean> {
    const { fileName, hash, config: { repo, token, branch, path } } = configMap
    const [owner, repoName] = repo.split('/')
    const octokit = GithubApi.#createOctokit(token)
    const key = GithubApi.#createKey(path, fileName)
    try {
      const { status } = await octokit.rest.repos.deleteFile({
        owner,
        repo: repoName,
        path: key,
        message: `delete ${fileName} by PicList`,
        sha: hash,
        branch
      })
      return status === 200
    } catch (error) {
      console.error(error)
      return false
    }
  }
}
