import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import TopicsPage from './pages/TopicsPage';
import LinearRegression from './pages/visualizations/LinearRegression';
import GradientDescent from './pages/visualizations/GradientDescent';
import GradientDescent3D from './pages/visualizations/GradientDescent3D';
import BinarySearchTree from './pages/visualizations/BinarySearchTree';
import SortingAlgorithms from './pages/visualizations/SortingAlgorithms';
import DFS from './pages/visualizations/DFS';
import BFS from './pages/visualizations/BFS';

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/topics" element={<TopicsPage />} />
          <Route path="/visualizations/linear-regression" element={<LinearRegression />} />
          <Route path="/visualizations/gradient-descent" element={<GradientDescent />} />
          <Route path="/visualizations/gradient-descent-3d" element={<GradientDescent3D />} />
          <Route path="/visualizations/binary-search-tree" element={<BinarySearchTree />} />
          <Route path="/visualizations/sorting-algorithms" element={<SortingAlgorithms />} />
          <Route path="/visualizations/dfs" element={<DFS />} />
          <Route path="/visualizations/bfs" element={<BFS />} />
          <Route path="/about" element={<div className="p-20 text-center">About Page (Coming Soon)</div>} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
