import Blog from '../_data/posts.json'
import { getForumLocaleLabelGetter } from '../composables/getForumLocaleGetter'

import type ForumAPI from '../../.vitepress/theme/apis/forum/api'

const localeLabelGetter = getForumLocaleLabelGetter()

export const usePostData = (locale: string) => {
  return {
    paths() {
      return Blog.filter(
        (post) =>
          post.tags &&
          post.tags.some(
            (label) =>
              label === localeLabelGetter.getLabel(locale.toUpperCase()),
          ),
      ).map((entry) => {
        return {
          params: {
            id: entry.id,
            state: entry.state as ForumAPI.TopicState,
            title: entry.title,
            tags: entry.tags,
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
            author: entry.user,
            link: entry.link,
            commentCount: entry.tags
              .map((val) => String(val))
              .includes('NO-COMMENT')
              ? -1
              : entry.commentCount,
          } satisfies ForumAPI.PostParams,
          content: entry.contentRaw,
        }
      })
    },
  }
}
