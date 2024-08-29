import { Badge, Button, Container, Input, Typography } from '@mui/material';
import styles from './index.module.css';
import { useCallback, useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { IComments } from '../lib/icomment';
import { IFacebookPosts } from '../lib/iposts';
import { saveAs } from 'file-saver'
interface IPageList {
  data: Array<{
    "id": string,
    "global_brand_page_name": string,
    "access_token": string
  }>,
  error?: {
    message: string
  }
  }

export function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */

  const [token, setToken] = useState('')
  const [isLoadingPage, setLoadingPage] = useState(false)
  const [isLoadingPost, setLoadingPost] = useState(false)

  const [pageList, setPageList] = useState<IPageList>({data: []})

  const [pageToken, setPageToken] = useState<string>('null')
  const [search, setSearch] = useState<string>('')

  const [ imgUrl, setimgUrl ] = useState('')
  const [isLoadingComment, setLoadingComment] = useState(false)
  const [comments, setComments] = useState<Array<IComments>>([])
  const [postList, setPostList] = useState<IFacebookPosts>({
    data: [],
    error: ''
  })


  const onSelectPage = useCallback(async () => {
    const response: IFacebookPosts = await fetch(`https://graph.facebook.com/v18.0/${pageList.data.find(p => p.access_token===pageToken)?.id}/posts?access_token=${pageToken}`, {method: 'GET'}).then(data => data.json())
    if (!response.error) {
      setPostList(response)
    } else {
      setPostList({
        data: [],
        error: response.error
      })
      alert(response.error)
    }
  }, [pageList, pageToken])

  useEffect(() => {
    if (!pageToken || !pageList || !pageList.data || !pageList.data.find(p => p.access_token===pageToken)?.id) return
    onSelectPage()
    setimgUrl('')
  }, [pageToken, onSelectPage, pageList])


  const downloadImage = (url: string) => {
    saveAs(url, 'image.jpg') // Put your image URL here.
  }

  const onNext = async () => {
    setPostList({
      data: [],
      error: ''
    })
    if (postList.paging) {
      const response: IFacebookPosts =  await fetch(postList.paging.next, { 
        method: "GET"
      }).then(data => data.json())
      if (!response.error) {
        setPostList(response)
      } else {
        setPostList({
          data: [],
          error: response.error
        })
        alert(response.error)
      }
    }
  }

  const getComment = async (id: string, token: string) => {
    setLoadingComment(true)
    setimgUrl('')
    setComments([])
    let comments: Array<IComments> = []
    let url: string | undefined = `https://graph.facebook.com/v18.0/${id}/comments?fields=attachment&limit=100&access_token=${token}`
    while (url) {
      const response: {data: Array<IComments>, error: string, paging: {next?: string} } = await fetch(url, { 
        method: "GET"
      }).then(response => response.json())
      if (!response.error) {
        url = response?.paging?.next || ''
        comments = [...comments, ...response.data.filter(d => d.attachment)]
        setComments(comments)
      } else {
        url = ''
      }
    }
    setLoadingComment(false)
  }


  const onSubmit = async () => {
    setLoadingPage(true)

    const data = {
      access_token: token,
      fields: 'id, global_brand_page_name, access_token',
      format: 'json',
      limit: '1000'
    } // eslint-disable-line @typescript-eslint/no-explicit-any
    const response: IPageList = await fetch('https://graph.facebook.com/v18.0/me/accounts?' + new URLSearchParams(data), { 
      method: "GET"
    }).then(response => response.json())
    setLoadingPage(false)
    if (!response.error) {
      setPageList(response)
    } else {
      setPageList(response)
      alert(response.error.message)
    }
  }

  const onSearch = async () => {
    setLoadingPost(true)

    const data: IFacebookPosts = {
      data: [],
      error: ''
    }
    let url = `https://graph.facebook.com/v18.0/${pageList.data.find(p => p.access_token===pageToken)?.id}/posts?access_token=${pageToken}`
    console.log(url)
    while (url) {
      const response: IFacebookPosts = await fetch(url).then(data => data.json())
      url = response?.paging?.next || ''
      if (!response.error) {
        data.data = [...data.data, 
          ...response.data.filter(d => (d.message && d.message.toUpperCase().includes(search.toUpperCase())))
        ]
      } else {
        url = ''
      }
      setPostList({...data})
    }
    setLoadingPost(false)
  }


  return (
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome Social Tool From Betaschool 👋
            </h1>
          </div>

          <div id="hero" className="rounded">
            <div className="text-container">
              <h2>
                <svg
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
                <span>You&apos;re up and running</span>
              </h2>
            </div>
            <div className="logo-container">
              <img width={100} src='/images/logo.png' alt='logo'/>
            </div>
          </div>

          <Container className={`shadow rounded ${styles.container}`}>
            <Typography variant='h5' >Token</Typography>
            <Input fullWidth value={token} onChange={(event) => {setToken(event.target.value)}}></Input><br/>
            <Button sx={{
              marginTop: '5px'
            }} 
            disabled={!token || isLoadingPage}
            variant='contained' color='primary' onClick={onSubmit}>Submit</Button>
          </Container>

          <Container className={`shadow rounded ${styles.container}`}>
            {
              isLoadingPage && <Box sx={{ display: 'flex' }}>
              <CircularProgress />
              </Box>
            }
            {
              !isLoadingPage && <>
              {
                pageList.error && <Badge color='error'>{pageList.error.message}</Badge>
              }
              {
                !pageList.error && <>
                  <Typography variant='h5' >Pages</Typography>
                  <FormControl>
                    <FormLabel id="demo-radio-buttons-group-label">Select a Page</FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      onChange={(vlue) => {
                        setPageToken(vlue.target.value)
                      }}
                    >
                      {
                        pageList.data.map(page => {
                          return <FormControlLabel key={page.id} value={page.access_token} control={<Radio />} label={page.global_brand_page_name} />
                        })
                      }
                    </RadioGroup>
                  </FormControl>
                </>
              }
              </>
            }
            
          </Container>

        {
          pageList.data && pageToken && <>
          <div id="commands" className="rounded shadow">
              <h2>Next steps</h2>
              
              <FormControl>
                      <FormLabel id="demo-radio-buttons-group-label">Tìm kiếm</FormLabel>
                      <Input fullWidth value={search} onChange={(event) => {setSearch(event.target.value)}}></Input>
                      <Button onClick={onSearch}>Tìm kiếm</Button>
              </FormControl>
              <br/>
              {
                isLoadingPost && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
                </Box>
              }
              {<>
                
                  <p>Posts: <br/>
                  {/* {postList.paging && postList.paging.previous && <button onClick={onPre}>Bài trứơc</button>} */}
                  {postList.paging && postList.paging.next && <button onClick={onNext}>Bài sau</button>}</p> 
                  {
                    postList.data.map(post => <>
                      <details>
                        <summary>
                          <Container className='shadow rounded'  onClick={()=>getComment(post.id, pageToken)}>
                            {post.message} - id: {post.id}
                          </Container>
                          
                          </summary>
                    
                        </details>
                    </>)
                  }
                </>
              }
              {
                isLoadingPost && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
                </Box>
              }
          </div>
          

          <div id="commands" className="rounded shadow">
            <h2>Next steps</h2>
            <p>Hình ảnh: {isLoadingComment && <>...Loading...</>}</p>
            {/* {postList.paging && postList.paging.previous && <button onClick={onPre}>Bài trứơc</button>} */}
            {
              comments.sort(((t, c) => ((t.attachment?.type|| '').localeCompare(c?.attachment?.type || '')))).filter(t => t.attachment?.type === 'photo').map(comment => <>
                <details onClick={()=>setimgUrl(comment.attachment?.media?.image.src || '')}>
                  <summary style={{
                    display: 'flex'
                  }}>
                    {/* <strong>{comment.attachment?.type}</strong><br/> */}
                      {comment.attachment?.url}
                      <button onClick={()=>downloadImage(comment.attachment?.media?.image.src || '')}>Download</button>
                      <br/>
                      
                  </summary>
                  {
                    comment.attachment?.media?.image.src === imgUrl &&
                    <img src={imgUrl} alt='img'/>
                  }
                  </details>
              </>)
            }
          </div>
  </>
}
          

          <p id="love">
            Carefully crafted with
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Index;
