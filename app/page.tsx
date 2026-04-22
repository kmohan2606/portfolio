export const dynamic = "force-static"

import { SideNav } from "@/components/side-nav";
import { Notification } from "@/components/notification";
import { GalaxyBackground } from "@/components/space/galaxy-background";
import { StarField } from "@/components/space/star-field";
import { HeroSection } from "@/components/sections/hero-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black lowercase">
      {/* Space Background Effects */}
      <GalaxyBackground />
      <StarField />
      {/* Chrome */}
      <SideNav />
      <Notification />

      {/* Page Sections */}
      <HeroSection />
      <div className="h-8" />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
