import Hero from "@/components/sections/Hero";
import TechnologyStrip from "@/components/sections/TechnologyStrip";
import ServicesPreview from "@/components/sections/ServicesOverview";
import AboutPreview from "@/components/sections/AboutPreview";
import FeaturedSolutions from "@/components/sections/FeaturedSolutions";
import WhyChooseUs from "@/components/sections/WhyChooseUs";
import Statistics from "@/components/sections/Statistics";
import ProjectsPreview from "@/components/sections/ProjectsPreview";

import HowWeWork from "@/components/sections/HowWeWork";

function Home() {
  return (
    <main>
      {/* 01 - Hero */}
      <Hero />

      {/* 02 - Technology */}
      <TechnologyStrip />

      {/* 03 - Services */}
      <ServicesPreview />

      {/* 04 - About */}
      <AboutPreview />

      {/* 05 - Featured Solutions */}
      <FeaturedSolutions />

      {/* 06 - Why Choose Us */}
      <WhyChooseUs />

      {/* 07 - Statistics */}
      <Statistics />

      {/* 08 - Projects */}
      <ProjectsPreview />
      
<HowWeWork />
      
      
    </main>
  );
}

export default Home;