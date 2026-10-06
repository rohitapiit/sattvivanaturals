import React from "react";

export default function KnowYourFacilityPage() {
  return (
    <div className="min-h-screen bg-white p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-10">
          Know Your Facility
        </h1>

        <div
          className="
          border-8
          border-[#C9A14A]
          rounded-3xl
          overflow-hidden
          shadow-2xl
          "
        >

<video
  className="w-full h-[80vh] object-cover"
  controls
  autoPlay
  muted
  loop
>
  <source
    src="https://res.cloudinary.com/dtzjwmksk/video/upload/q_auto,f_auto/VID_20260801_212136_1-2-2_omkae1.mp4"
    type="video/mp4"
  />
</video>

        </div>

      </div>

    </div>
  );
}