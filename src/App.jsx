import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import WelcomeGate from "./components/WelcomeGate";
import { getIdentity } from "./lib/identity";
import Home from "./modules/academic-profile/Home";
import StudyCompanion from "./modules/study-companion/StudyCompanion";
import StudyPlanner from "./modules/study-planner/StudyPlanner";
import ProgressDashboard from "./modules/progress-dashboard/ProgressDashboard";
import CourseDetail from "./modules/course-detail/CourseDetail";
import TopicDetail from "./modules/topic-detail/TopicDetail";

export default function App() {
  const [identity, setLocalIdentity] = useState(getIdentity());

  if (!identity) {
    return <WelcomeGate onDone={(name) => setLocalIdentity({ name })} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/course/:code" element={<CourseDetail />} />
          <Route
  path="/course/:code/topic/:topicId"
  element={<TopicDetail />}
/>
          <Route path="/study" element={<StudyCompanion />} />
          <Route path="/planner" element={<StudyPlanner />} />
          <Route path="/progress" element={<ProgressDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}