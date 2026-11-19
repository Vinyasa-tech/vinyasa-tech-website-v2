
import CareersHero from "@/components/careers/CareersHero";
import WhyJoinUs from "@/components/careers/WhyJoinUs";
import CurrentOpenings from "@/components/careers/CurrentOpenings";
import HiringProcess from "@/components/careers/HiringProcess";
import WhatYoullBuild from "@/components/careers/WhatYoullBuild";

const Careers = () => {
  return (
    <>
      <CareersHero />

      <WhyJoinUs />

      {/* Jobs are fetched from the backend database */}
      <CurrentOpenings />

      <HiringProcess />

      <WhatYoullBuild />
    </>
  );
};

export default Careers;
