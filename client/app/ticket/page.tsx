"use client";

import { generateQrode } from "@/api/bookings";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  useEffect(() => {
    setSessionKey(localStorage.getItem("session_key"));
  }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["generateQrode", sessionKey],
    queryFn: () => generateQrode(sessionKey || ""),
    enabled: !!sessionKey,
    refetchOnWindowFocus: false,
    refetchInterval: 5000, // 5 seconds polling
  });

  if (!sessionKey) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        No session key found.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading QR code...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <p className="text-sm text-gray-500">Session: {sessionKey}</p>
      <img
        src={data?.qr_code || ""}
        alt="QR Code"
        className="w-64 h-64 border border-gray-300 rounded-lg shadow-md"
      />
      <p className="text-sm text-gray-500">QR Code updates every 5 seconds</p>
    </div>
  );
}
