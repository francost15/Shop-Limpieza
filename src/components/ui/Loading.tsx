import React from 'react'

export const Loading = () => {
  return (
    <div className="flex justify-center mt-48">
    <div className="flex flex-row gap-2">
      <div className="w-8 h-8 rounded-full bg-purple-700 animate-bounce [animation-delay:.7s]"></div>
      <div className="w-8 h-8 rounded-full bg-purple-700 animate-bounce [animation-delay:.3s]"></div>
      <div className="w-8 h-8 rounded-full bg-purple-700 animate-bounce [animation-delay:.7s]"></div>
    </div>
  </div>
  )
}
