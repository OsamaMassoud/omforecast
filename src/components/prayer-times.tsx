import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Clock, Sun, Moon, Sunrise, Sunset } from "lucide-react";

interface PrayerTimesProps {
  lat: number;
  lon: number;
}

// Fetch prayer times from Aladhan API
const fetchPrayerTimes = async (lat: number, lon: number) => {
  const response = await fetch(
    `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch prayer times");
  }
  const data = await response.json();
  return data.data.timings;
};

export function PrayerTimes({ lat, lon }: PrayerTimesProps) {
  const { data: timings, isLoading, isError } = useQuery({
    queryKey: ["prayerTimes", lat, lon],
    queryFn: () => fetchPrayerTimes(lat, lon),
    staleTime: 1000 * 60 * 60 * 6, // Cache data for 6 hours
  });

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading prayer times...
        </CardContent>
      </Card>
    );
  }

  if (isError || !timings) {
    return null;
  }

  // Prayers list with corresponding keys and icons
  const prayers = [
    { name: "Fajr", key: "Fajr", icon: Sunrise, color: "text-amber-500" },
    { name: "Sunrise", key: "Sunrise", icon: Sun, color: "text-orange-400" },
    { name: "Dhuhr", key: "Dhuhr", icon: Sun, color: "text-yellow-500" },
    { name: "Asr", key: "Asr", icon: Clock, color: "text-blue-500" },
    { name: "Maghrib", key: "Maghrib", icon: Sunset, color: "text-orange-600" },
    { name: "Isha", key: "Isha", icon: Moon, color: "text-indigo-500" },
  ];

  return (
  
  <Card className="w-full h-full flex flex-col justify-between">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-base font-semibold">
        <Clock className="h-5 w-5 text-primary" />
        Prayer Times
      </CardTitle>
    </CardHeader>

  
    <CardContent className="flex-1 flex flex-col justify-center">
      <div className="grid grid-cols-6 gap-3 h-full items-stretch">
        {prayers.map((prayer) => {
          const Icon = prayer.icon;
          const time = timings[prayer.key as keyof typeof timings];

          return (
            <div
              key={prayer.key}
              className="flex flex-col items-center justify-center py-4 px-2 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-center"
            >
              <Icon className={`h-5 w-5 mb-2 ${prayer.color} shrink-0`} />
              <span className="text-xs text-muted-foreground font-medium truncate w-full">
                {prayer.name}
              </span>
              <span className="text-xs sm:text-sm font-bold mt-1">
                {time}
              </span>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

  
}