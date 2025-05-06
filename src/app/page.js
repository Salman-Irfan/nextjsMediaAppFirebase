import HeroSection from "@/components/views/homeViews/HeroSection";
import CreatorFeatures from "@/components/views/homeViews/CreatorFeatures";
import React from "react";
import ConsumerFeatures from "@/components/views/homeViews/ConsumerFeatures";
import CloudIntegrationDetails from "@/components/views/homeViews/CloudIntegrationDetails";
import ScalabilityAndStorage from "@/components/views/homeViews/ScalabilityAndStorage";
import AuthenticationAndRoles from "@/components/views/homeViews/AuthenticationAndRoles";
import MediaConversionInfo from "@/components/views/homeViews/MediaConversionInfo";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CreatorFeatures />
      <ConsumerFeatures />
      <CloudIntegrationDetails />
      <ScalabilityAndStorage />
      <AuthenticationAndRoles />
      <MediaConversionInfo />
    </>
  );
};

export default HomePage;
