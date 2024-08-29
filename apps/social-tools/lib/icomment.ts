export interface IComments {
  "attachment"?: {
    "media"?: {
      "image": {
        "height": number,
        "src": string,
        "width": number
      }
    },
    "target": {
      "id": string,
      "url": string
    },
    "type": "photo" | "video",
    "url": string
  },
  "id": string
}