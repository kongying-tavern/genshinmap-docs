import { blog, password } from '@/apis/forum/gitee'
import fs from 'node:fs/promises'
import teamMemberList from '~/_data/teamMemberList.json'
import blogMemberList from '~/_data/blogMemberList.json'
import { URL } from 'node:url'

import type ForumAPI from '@/apis/forum/api'

const USERNAME = process.env.GITEE_USERNAME
const PASSWORD = process.env.GITEE_PASSWORD

export const refreshBlogData = async () => {
  if (!USERNAME || !PASSWORD)
    return console.error('Missing username or password')

  let page = 1
  let posts: ForumAPI.Topic[] = []

  const [error, auth] = await password.getToken(USERNAME, PASSWORD)

  if (error) console.error('Error getting token:', error)

  const requestData = async (page: number) => {
    const { data, totalPage } = await blog.getPosts(
      {
        pageSize: 50,
        current: page,
        sort: 'created',
        filter: null,
      },
      auth?.accessToken,
    )

    if (data) {
      posts = [...posts, ...data]
      page++
    } else {
      console.info('No blog data')
    }

    return totalPage
  }

  const isGrantedMember = (id: string | number) => {
    return (
      teamMemberList.some((val) => val === Number(id)) ||
      blogMemberList.some((val) => val === Number(id))
    )
  }

  const totalPage = await requestData(page)

  if (totalPage + 1 === page) return posts

  const pool = <Function[]>[requestData]

  await Promise.all(pool.flatMap((item) => Array(totalPage - 1).fill(item)))

  posts
    .filter((val) => isGrantedMember(val.user.id))
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )

  const outputFilePath = new URL('../src/_data/posts.json', import.meta.url)

  try {
    await fs.writeFile(outputFilePath, JSON.stringify(posts, null, 2), 'utf8')
    console.info(`Data successfully overwritten in ${outputFilePath.pathname}`)
  } catch (error) {
    console.error('Error saving data:', error)
  }

  return posts
}

refreshBlogData()
