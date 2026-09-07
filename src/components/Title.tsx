import React from "react";

interface TitleProps {
  text: string;
}

export default function Title({ text }: TitleProps) {
  return (
    <h2 className="text-2xl font-bold text-gray-800 my-4 text-center">
      {text}
    </h2>
  );
}
