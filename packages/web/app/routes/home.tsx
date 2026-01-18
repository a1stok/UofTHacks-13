import Toolbar from "~/components/toolbar";
import { SlideProvider, useSlides } from "~/components/slide-context";
import { slides } from "~/components/slides";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MyPage" },
    { name: "description", content: "Welcome to My Page" },
  ];
}

function SlideContent() {
  const { currentSlide } = useSlides();
  const CurrentSlideComponent = slides[currentSlide];
  
  return <CurrentSlideComponent />;
}

export default function Home() {
  return (
    <SlideProvider>
      <main className="flex flex-col items-center justify-center max-h-screen max-w-screen min-h-screen min-w-screen">
        <SlideContent />
        <Toolbar />
      </main>
    </SlideProvider>
  );
}
