export const useComments = () => {
  const comments = useState<Comment[]>('comments.list', () => [])
  const loading = useState<boolean>('comments.loading', () => false)

  const fetchComments = async (siteId: string) => {
    loading.value = true
    try {
      const { data } = await $fetch<{ success: boolean; data: Comment[] }>(`/api/comments?siteId=${siteId}`)
      comments.value = data
      return data
    } catch (error) {
      console.error('Failed to fetch comments:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  const createComment = async (commentData: CreateCommentInput) => {
    try {
      const { data } = await $fetch<{ success: boolean; data: Comment }>('/api/comments', {
        method: 'POST',
        body: commentData,
      })
      
      // 重新获取评论列表
      if (commentData.siteId) {
        await fetchComments(commentData.siteId)
      }
      
      return { success: true, data }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '评论失败' }
    }
  }

  const deleteComment = async (id: string, siteId: string) => {
    try {
      await $fetch(`/api/comments/${id}`, { method: 'DELETE' })
      
      // 重新获取评论列表
      await fetchComments(siteId)
      
      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.data?.message || '删除失败' }
    }
  }

  return {
    comments: readonly(comments),
    loading: readonly(loading),
    fetchComments,
    createComment,
    deleteComment,
  }
}

interface Comment {
  id: string
  siteId: string
  userId: string
  content: string
  parentId: string | null
  createdAt: string
  user?: {
    id: string
    username: string | null
    avatarUrl: string | null
  }
  replies?: Comment[]
}

interface CreateCommentInput {
  siteId: string
  content: string
  parentId?: string
}
