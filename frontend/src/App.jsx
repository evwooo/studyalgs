import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import AlgorithmList from './pages/AlgorithmList'
import AlgorithmDetail from './pages/AlgorithmDetail'
import Progress from './pages/Progress'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/algorithms" element={<AlgorithmList />} />
          <Route path="/algorithms/:slug" element={<AlgorithmDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </AuthProvider>
  )
}

export default App
