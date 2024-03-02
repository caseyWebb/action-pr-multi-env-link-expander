export const localhostRegex =
  /(?<=^|\s)(?:\[(.+?)(?<!Development)\]\(|)(https?:\/\/localhost(?::\d*)?)(\S*)?\)?/gi

const markdownLink = (label: string, url: string): string =>
  `[${label}](${url})`

const markdownLinkForEnvironment =
  (path = '') =>
  ([environment, host]: [string, string]): string =>
    markdownLink(environment, linkForEnvironment(path, [environment, host]))

const linkForEnvironment = (path = '', [_, host]: [string, string]): string =>
  `${host}${path}`

const transformMatch =
  (environments: { [key: string]: string }) =>
  (
    _: string,
    label: string | undefined,
    localhost: string,
    path: string | undefined
  ): string => {
    const [defaultEnvironment, ...restEnvironments] = Object.entries(
      environments
    ).concat([['Development', localhost]])

    // Handle special case without resorting to absolutely inane regex lookbehinds. If
    // this is a markdown link, then we need to remove the trailing parenthesis from the
    // path. We can't just remove the last character because the path could be a
    // querystring and ) is a valid URI character.
    if (label && path) {
      path = path.replace(/\)$/, '')
    }

    const defaultEnvLink = linkForEnvironment(path, defaultEnvironment)
    const otherEnvLinks = restEnvironments.map(markdownLinkForEnvironment(path))

    if (label) {
      const [defaultEnvName] = defaultEnvironment
      const defaultLabel = `${label} (${defaultEnvName})`
      return `${markdownLink(defaultLabel, defaultEnvLink)} (Open in ${otherEnvLinks.join(', ')})`
    } else {
      return `${defaultEnvLink} (Open in ${otherEnvLinks.join(', ')})`
    }
  }

export const transform = (
  environments: { [key: string]: string },
  body: string
): string => body.replace(localhostRegex, transformMatch(environments))
