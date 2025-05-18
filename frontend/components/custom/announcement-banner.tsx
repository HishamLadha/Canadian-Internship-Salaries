"use client"
import { Info, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface Announcement {
  id: number;
  message: string;
  type: "info" | "warning" | "update";
  action?: {
    label: string;
    href: string;
  };
}

const announcements: Announcement[] = [
  {
    id: 1,
    message: "More Universities are being added!",
    type: "info",
    // action: {
    //   label: "Share Your Experience",
    //   href: "/submit"
    // }
  },
  {
    id: 2,
    message: "Now available: search and filter by location 🌎",
    type: "update"
  }
];

export function AnnouncementBanner() {
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex(prev => 
        prev < announcements.length - 1 ? prev + 1 : 0
      );
    }, 5000); // Change notification every 5 seconds

    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  const handleNext = () => {
    if (currentAnnouncementIndex < announcements.length - 1) {
      setCurrentAnnouncementIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentAnnouncementIndex > 0) {
      setCurrentAnnouncementIndex(prev => prev - 1);
    }
  };

  return (
    <div className="bg-muted px-4 py-3 relative">
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        {currentAnnouncement.type === "info" && <Info className="h-4 w-4" />}
        {currentAnnouncement.type === "update" && <Check className="h-4 w-4" />}
        
        <span>{currentAnnouncement.message}</span>

        {/* Add the call-to-action button
        {currentAnnouncement.action && (
          <Button
            variant="link"
            className="px-2 py-1 h-auto font-medium underline-offset-4"
            asChild
          >
            <a href={currentAnnouncement.action.href}>
              {currentAnnouncement.action.label}
            </a>
          </Button>
        )}
         */}
        {/* Navigation dots */}
        <div className="flex gap-1 mx-2">
          {announcements.map((_, index) => (
            <button
              key={index}
              className={`h-1.5 w-1.5 rounded-full transition-all ${
                index === currentAnnouncementIndex 
                  ? "bg-foreground" 
                  : "bg-muted-foreground/30"
              }`}
              onClick={() => setCurrentAnnouncementIndex(index)}
            />
          ))}
        </div>

        {/* <button
          onClick={() => setIsVisible(false)}
          className="absolute right-4 top-3 hover:opacity-70"
        >
          <X className="h-4 w-4" />
        </button> */}
      </div>
    </div>
  );
}