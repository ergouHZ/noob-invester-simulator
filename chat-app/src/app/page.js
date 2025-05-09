'use client'
import ChatContainer from "@/components/chat-container/ChatContainer";
import NewsList from "@/components/news-list/NewsList";
import Box from '@mui/material/Box';
import { useState } from "react";

export default function Home() {
  const [articleLabels, setArticleLabels] = useState(""); // 存储分析关键词（如果需要）

  //接收从newslist来的新闻聚类数据
  const handleAnalysis = (labels) => {
    setArticleLabels(labels);
  };

  return (
    <div>
      <Box display="flex"
        flexDirection="row"
      >
        <Box flex={1} bgcolor="transparent"
          sx={{
            maxHeight: "98vh",
            minHeight: '98vh',
            border:'2px solid var(--foreground)',
            padding:'6px',
            margin:'10px',
            borderRadius:'2%',
          }}
        >

          <NewsList onUpdateLabels={handleAnalysis}/>
        </Box>
        <Box flex={1} 
        sx={{
          border:'3px solid var(--foreground)',
          margin:'10px',
          borderRadius:'2%'
        }}
        >

          <ChatContainer articleLabels={articleLabels}/>
        </Box>
      </Box>
    </div>
  );
}
