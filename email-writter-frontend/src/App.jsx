import { useEffect, useState } from 'react'
import axios from 'axios';
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, Menu, MenuItem, Select, TextField, Typography } from '@mui/material';
import './App.css'

function App() {
  const [emailContent, setEmailContent] = useState('')
  const [tone, setTone] = useState('')
  const [reply, setReply] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copy,setCopy]=useState('Copy')

  useEffect(()=>{
    setCopy('Copy')
  },[reply])

  const handleSubmit= async ()=>{
    setLoading(true)
    setError('')
    try{
      const resp=await axios.post("http://localhost:8080/api/email/generate",{
        emailContent,
        tone
      })
      setReply(typeof resp.data=='string'? resp.data:JSON.stringify(resp.data))
    }catch{
      setError('Failed to generate. Please try again')
    }finally{
      setLoading(false)
    }
  }
  return (
    <Container maxWidth="md" sx={{py:4}}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      <Box sx={{mx:3}}>
        <TextField
        fullWidth
        multiline
        rows={6}
        variant='outlined'
        label="Original Email"
        value={emailContent || ''}
        onChange={(e)=>setEmailContent(e.target.value)}/>

        <FormControl fullWidth sx={{mt:2,mb:2}}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
          value={tone || ''}
          label={"Tone (Optional)"}
          onChange={(e)=>setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Professional">Professional</MenuItem>
            <MenuItem value="Casual">Casual</MenuItem>
            <MenuItem value="Friendly">Friendly</MenuItem>
            <MenuItem value="Sarcastic">Sarcastic</MenuItem>
          </Select>
        </FormControl>

        <Button
        variant='contained'
        onClick={handleSubmit}
        disabled={!emailContent || loading}
        fullWidth
        >
          {loading? <CircularProgress size={24}/>:"Generate Email"}
        </Button>
      </Box>

      {error && (
        <Typography color='error' sx={{mb:3}}>
        {error}
      </Typography>
      )}

      {reply && (
        <Box sx={{mt:3}}>
          <Typography
          variant='h6'
          gutterBottom
          >
            Generated Reply
          </Typography>
          <TextField
          fullWidth
          multiline
          rows={6}
          variant='outlined'
          value={reply ||''}
          />

          <Button
          variant='outlined'
          sx={{mt:2}}
          onClick={() => {
  navigator.clipboard.writeText(reply);
  setCopy('Copied');
}}
          >
            {copy}
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default App

