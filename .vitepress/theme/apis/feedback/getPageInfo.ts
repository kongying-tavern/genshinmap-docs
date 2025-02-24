import { fetcher } from '.'

export interface PageInfoResponse {
  code: number
  message?: string
  data: {
    good: number
    bad: number
    pageview: number
    lastupdate: number
    id: string
    record_id: string
  }
}

export const getPageInfo = async (page): Promise<PageInfoResponse> => {
  // @ts-ignore
  if (import.meta.env.SSR) return null
  return fetcher
    .get('docs/pageinfo', {
      searchParams: {
        path: String(page.value.filePath).replace('.md', ''),
      },
    })
    .json()
}
