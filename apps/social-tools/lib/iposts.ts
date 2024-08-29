export interface IFacebookPosts {
  data: Array<{
    "created_time": string,
    "message": string,
    "id": string
  }>,
  "paging"?: {
    "cursors": {
        "before": string,
        "after": string
    },
    "next": string,
    previous: string
  },
  error: string
}