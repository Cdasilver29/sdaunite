import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import ServiceMission from "./pages/ServiceMission";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CodeOfConduct from "./pages/CodeOfConduct";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import MyTickets from "./pages/MyTickets";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminAttendees from "./pages/admin/AdminAttendees";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRetreats from "./pages/admin/AdminRetreats";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminStreams from "./pages/admin/AdminStreams";
import AdminXperience from "./pages/admin/AdminXperience";
import Retreats from "./pages/Retreats";
import SinglesSpark from "./pages/SinglesSpark";
import FootballLeague from "./pages/FootballLeague";
import RetreatDetail from "./pages/RetreatDetail";
import Insider from "./pages/Insider";
import InsiderArticle from "./pages/InsiderArticle";
import Xperience from "./pages/Xperience";
import XperienceDetail from "./pages/XperienceDetail";
import Streams from "./pages/Streams";
import StreamDetail from "./pages/StreamDetail";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth pages — full-screen */}
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />

              {/* Legacy redirects */}
              <Route path="/login" element={<Navigate to="/auth/sign-in" replace />} />
              <Route path="/signup" element={<Navigate to="/auth/sign-up" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />

              <Route element={<AppLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<Events />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/service-mission" element={<ServiceMission />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/code-of-conduct" element={<CodeOfConduct />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Retreats */}
                <Route path="/retreats" element={<Retreats />} />
                <Route path="/retreats/:id" element={<RetreatDetail />} />

                {/* Blog / Insider */}
                <Route path="/insider" element={<Insider />} />
                <Route path="/insider/:slug" element={<InsiderArticle />} />

                {/* Xperience */}
                <Route path="/xperience" element={<Xperience />} />
                <Route path="/xperience/:id" element={<XperienceDetail />} />

                {/* Streams */}
                <Route path="/streams" element={<Streams />} />
                <Route path="/streams/:id" element={<StreamDetail />} />

                {/* Special Event Pages */}
                <Route path="/singles-spark" element={<SinglesSpark />} />
                <Route path="/football-league" element={<FootballLeague />} />

                <Route
                  path="/my-tickets"
                  element={<ProtectedRoute><MyTickets /></ProtectedRoute>}
                />
                <Route
                  path="/profile"
                  element={<ProtectedRoute><Profile /></ProtectedRoute>}
                />

                {/* Admin area */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="retreats" element={<AdminRetreats />} />
                  <Route path="blog" element={<AdminBlog />} />
                  <Route path="streams" element={<AdminStreams />} />
                  <Route path="xperience" element={<AdminXperience />} />
                  <Route path="attendees" element={<AdminAttendees />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="create-event" element={<CreateEvent />} />
                  <Route path="edit-event/:id" element={<EditEvent />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
